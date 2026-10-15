import { gsap } from "@/lib/gsap";

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
    this.listener = fn;
    return () => {
      if (this.listener === fn) this.listener = null;
    }
  }

  render() {
    this.listener?.();
  }
}

export const animateSingleInputDesktop = (node: NodeAnim) => {
  const tl = gsap.timeline();

  tl.set(node, { position: 0 }, 0);
  tl.to(node, { position: Math.random() * 0.1 + 0.4, duration: 1, ease: 'expo.out' }, 0);
  tl.set(node, { visible: true }, 0);
  tl.set(node, { labelVisible: true }, 0.2);
  tl.to(node, { position: 1, duration: 1.2, ease: 'power3.in' }, 1.2);
  tl.set(node, { labelVisible: false }, 1.6);
  tl.set(node, { visible: false }, 1.9);

  return tl;
}


export const animateSingleOutputDesktop = (node: NodeAnim) => {
  const tl = gsap.timeline();

  tl.set(node, { position: 0 }, 0);
  tl.to(node, { position: Math.random() * 0.1 + 0.4, duration: 1, ease: 'expo.out' }, 0);
  tl.set(node, { visible: true }, 0);
  tl.set(node, { labelVisible: true }, 0.2);
  tl.to(node, { position: 1, duration: 1.2, ease: 'power3.in' }, 1.2);
  tl.set(node, { labelVisible: false }, 1.6);
  tl.set(node, { visible: false }, 1.9);

  return tl;
}
