import { ref, watch, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'

// Calculates the maximum font-size that fits text within a FIXED-SIZE container.
// The container is a reference-sized canvas (e.g. 1000px wide).
// CSS transform: scale() handles visual scaling to actual display size.
// This means text layout is calculated ONCE and never changes on resize.
// NEVER breaks words. No hyphenation.
//
// CRITICAL: Waits for the target font to be loaded before measuring.
// Without this, the binary search measures against a fallback font,
// then the real font loads and the text overshoots the poster frame.

export function useAutoSize(
  containerRef: Ref<HTMLElement | null>,
  text: Ref<string>,
  fontFamily: Ref<string>,
  fontWeight: Ref<string>,
  letterSpacing: Ref<number>,
  lineHeight: Ref<number>,
  posterPadding: Ref<number>,
) {
  const fontSize = ref(16)

  async function calculate() {
    const el = containerRef.value
    if (!el || !text.value) return

    // Wait for the specific font to load before measuring.
    // This prevents measuring against a fallback font and overshooting.
    try {
      await document.fonts.load(`${fontWeight.value} 48px ${fontFamily.value}`)
    } catch {
      // Font may not exist or already loaded — continue anyway
    }

    const style = getComputedStyle(el)
    const contentW = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
    const contentH = el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)

    if (contentW <= 0 || contentH <= 0) return

    // Create offscreen measurer matching the content area exactly
    const measurer = document.createElement('div')
    measurer.style.position = 'absolute'
    measurer.style.visibility = 'hidden'
    measurer.style.left = '-9999px'
    measurer.style.top = '-9999px'
    measurer.style.width = `${contentW}px`
    measurer.style.fontFamily = fontFamily.value
    measurer.style.fontWeight = fontWeight.value
    measurer.style.letterSpacing = `${letterSpacing.value}em`
    measurer.style.lineHeight = `${lineHeight.value}`
    // CRITICAL: never break words, no hyphens
    measurer.style.wordBreak = 'normal'
    measurer.style.overflowWrap = 'normal'
    measurer.style.hyphens = 'none'
    measurer.style.whiteSpace = 'normal'
    measurer.style.padding = '0'
    measurer.style.margin = '0'
    measurer.style.boxSizing = 'content-box'
    measurer.style.textAlign = 'center'
    measurer.textContent = text.value
    document.body.appendChild(measurer)

    // Binary search for max font size
    let lo = 4
    let hi = 800
    let best = lo

    for (let i = 0; i < 25; i++) {
      const mid = Math.floor((lo + hi) / 2)
      measurer.style.fontSize = `${mid}px`

      const fits = measurer.scrollHeight <= contentH && measurer.scrollWidth <= contentW

      if (fits) {
        best = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }

    document.body.removeChild(measurer)

    // Small safety margin for subpixel rounding
    fontSize.value = Math.max(4, Math.floor(best * 0.95))
  }

  // Recalculate when text, font, or padding changes
  watch([text, fontFamily, fontWeight, letterSpacing, lineHeight, posterPadding], () => {
    nextTick(calculate)
  })

  // Calculate once on mount — the container is a fixed size, no ResizeObserver needed
  onMounted(() => nextTick(calculate))

  return { fontSize }
}
