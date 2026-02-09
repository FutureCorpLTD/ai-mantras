import { ref, watch, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'

/**
 * Liquid Glass effect — generates a convex lens displacement map and
 * applies it via SVG feDisplacementMap + backdrop-filter.
 *
 * How it works:
 * 1. A <canvas> renders a displacement map where:
 *    - Red channel = horizontal pixel shift (128 = no shift)
 *    - Green channel = vertical pixel shift (128 = no shift)
 * 2. The canvas is converted to a data URL
 * 3. An SVG <feImage> loads the data URL as the displacement source
 * 4. backdrop-filter: url(#filterId) applies the distortion to content behind the element
 *
 * This produces REAL refraction — the background actually bends like through curved glass.
 * Only works in Chromium browsers. Safari/Firefox get blur+saturation fallback.
 */

export interface GlassSettings {
  refraction: number   // 0–100: displacement intensity
  depth: number        // 0–100: how far the curved edge extends inward
  dispersion: number   // 0–100: chromatic aberration intensity
  frost: number        // 0–100: blur amount
}

const DEFAULT_GLASS: GlassSettings = {
  refraction: 60,
  depth: 25,
  dispersion: 40,
  frost: 20,
}

export function useLiquidGlass(
  elementRef: Ref<HTMLElement | null>,
  settings: Ref<GlassSettings>,
  filterId: string,
) {
  const displacementUrl = ref('')
  const svgMarkup = ref('')

  /**
   * Generate a convex lens displacement map.
   * Uses Snell's law-inspired surface normals to compute refraction vectors.
   */
  function generateDisplacementMap(width: number, height: number, refraction: number, depth: number): string {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    const cx = width / 2
    const cy = height / 2
    // Edge depth as fraction of the smaller dimension
    const edgeDepth = (depth / 100) * Math.min(width, height) * 0.5
    // Refraction scale
    const refrScale = (refraction / 100) * 1.5  // IOR-like factor

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4

        // Normalized position from center (-1 to 1) accounting for pill shape
        const nx = (x - cx) / cx
        const ny = (y - cy) / cy

        // Distance from edge (0 at edge, 1 at center)
        // Use superellipse for pill shape (high exponent = rounded rect)
        const ex = Math.pow(Math.abs(nx), 4)
        const ey = Math.pow(Math.abs(ny), 4)
        const edgeDist = 1 - Math.pow(ex + ey, 0.25)

        if (edgeDist <= 0) {
          // Outside the glass — no displacement
          data[i] = 128     // R: no horizontal shift
          data[i + 1] = 128 // G: no vertical shift
          data[i + 2] = 128 // B
          data[i + 3] = 255 // A
          continue
        }

        // Surface height: convex lens profile
        // Depth controls how thick the rim region is
        const rimWidth = edgeDepth / Math.min(cx, cy)
        let height_factor: number

        if (edgeDist < rimWidth) {
          // In the rim region — steep curve
          const t = edgeDist / rimWidth
          height_factor = Math.sqrt(1 - Math.pow(1 - t, 2)) // circular arc profile
        } else {
          // Inner region — gentle dome
          height_factor = 1
        }

        // Surface normal approximation (gradient of height field)
        // The normal points "outward" from the glass surface
        const dhdx = -nx * height_factor * refrScale * (edgeDist < rimWidth ? 2 : 0.3)
        const dhdy = -ny * height_factor * refrScale * (edgeDist < rimWidth ? 2 : 0.3)

        // Encode displacement as color channels
        // 128 = no displacement, 0 = max negative, 255 = max positive
        // Clamp to valid range
        const r = Math.max(0, Math.min(255, Math.round(128 + dhdx * 127)))
        const g = Math.max(0, Math.min(255, Math.round(128 + dhdy * 127)))

        data[i] = r
        data[i + 1] = g
        data[i + 2] = 128  // Blue channel unused
        data[i + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL('image/png')
  }

  function update() {
    const el = elementRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const w = Math.round(rect.width)
    const h = Math.round(rect.height)
    if (w <= 0 || h <= 0) return

    const s = settings.value
    const url = generateDisplacementMap(w, h, s.refraction, s.depth)
    displacementUrl.value = url

    // Compute the backdrop-filter scale from refraction setting
    const displaceScale = (s.refraction / 100) * 60 // max 60px displacement
    const blurPx = (s.frost / 100) * 30 // max 30px blur

    // Build SVG filter wrapped in <svg> element
    svgMarkup.value = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute">
      <defs>
        <filter id="${filterId}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
          <feImage href="${url}" x="0" y="0" width="${w}" height="${h}" result="dmap" preserveAspectRatio="none" />
          <feDisplacementMap in="SourceGraphic" in2="dmap" scale="${displaceScale}" xChannelSelector="R" yChannelSelector="G" result="refracted" />
          <feGaussianBlur in="refracted" stdDeviation="${blurPx}" result="frosted" />
          <feColorMatrix in="frosted" type="saturate" values="2.2" result="saturated" />
          <feComponentTransfer in="saturated" result="brightened">
            <feFuncR type="linear" slope="1.1" intercept="0.02" />
            <feFuncG type="linear" slope="1.1" intercept="0.02" />
            <feFuncB type="linear" slope="1.1" intercept="0.02" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>`
  }

  // Computed CSS for the glass element
  const glassBackdropFilter = computed(() => {
    const s = settings.value
    const blurPx = (s.frost / 100) * 30

    // Chrome gets full SVG filter; Safari gets blur fallback
    return {
      // Applied to the refraction layer (Chrome)
      full: `url(#${filterId})`,
      // Fallback for Safari
      fallback: `blur(${blurPx}px) saturate(220%) brightness(1.1)`,
      // Frost blur for separate frost layer
      frost: `blur(${blurPx}px) saturate(220%) brightness(1.1) contrast(1.05)`,
    }
  })

  const dispersionStyle = computed(() => {
    const intensity = settings.value.dispersion / 100
    return {
      boxShadow: [
        `inset ${3 * intensity}px 0 ${6 * intensity}px rgba(255, 60, 60, ${0.15 * intensity})`,
        `inset ${-3 * intensity}px 0 ${6 * intensity}px rgba(60, 60, 255, ${0.15 * intensity})`,
        `inset 0 ${2 * intensity}px ${4 * intensity}px rgba(60, 200, 255, ${0.12 * intensity})`,
        `inset 0 ${-1.5 * intensity}px ${4 * intensity}px rgba(255, 160, 60, ${0.10 * intensity})`,
      ].join(', '),
    }
  })

  watch(settings, () => nextTick(update), { deep: true })

  onMounted(() => {
    nextTick(update)
    // Re-generate if element resizes
    if (elementRef.value) {
      new ResizeObserver(() => update()).observe(elementRef.value)
    }
  })

  return {
    svgMarkup,
    glassBackdropFilter,
    dispersionStyle,
    update,
  }
}
