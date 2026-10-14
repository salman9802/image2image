
/*
 * It's a plain mutable object that GSAP tweens directly. When something
 * changes, the owning <SvgNode> is told to redraw itself via `render()`,
 * so React never re-renders on animation frames.
 */
export class NodeAnim {
  position = 0 // 0-1 progress along the path
  visible = false
  labelVisible = false

  private listener: (() => void) | null = null

  /** Called by <SvgNode> on mount. Returns an unsubscribe function. */
  subscribe(fn: () => void) {
    this.listener = fn
    return () => {
      if (this.listener === fn) this.listener = null
    }
  }

  render() {
    this.listener?.()
  }
}
