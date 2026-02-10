import type { Ref } from 'vue'

/**
 * Intercepts two-finger pinch gestures on an element to change a numeric value
 * (e.g. grid columns). Spread fingers → decrease value (zoom in), pinch → increase (zoom out).
 */
export function usePinchZoom(
  target: Ref<HTMLElement | null>,
  value: Ref<number>,
  options: { min: number; max: number; onUpdate: (v: number) => void }
) {
  let initialDistance = 0
  let startValue = 0
  let isPinching = false

  function getDistance(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      isPinching = true
      initialDistance = getDistance(e.touches[0], e.touches[1])
      startValue = value.value
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (!isPinching || e.touches.length !== 2) return
    e.preventDefault()

    const currentDistance = getDistance(e.touches[0], e.touches[1])
    const scale = currentDistance / initialDistance

    // Spread (scale > 1) → fewer columns (zoom in)
    // Pinch (scale < 1) → more columns (zoom out)
    // Use logarithmic scale for natural feel, ~50% change = ±1 column
    const delta = Math.round(Math.log2(1 / scale) * 2)
    const newValue = Math.min(options.max, Math.max(options.min, startValue + delta))

    if (newValue !== value.value) {
      options.onUpdate(newValue)
    }
  }

  function onTouchEnd() {
    isPinching = false
  }

  onMounted(() => {
    const el = target.value
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    const el = target.value
    if (!el) return
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
  })
}
