export class Rectangle {
  constructor(private x0: number, private y0: number, private x1: number, private y1: number) {}

  get width() {
    return Math.abs(this.x1 - this.x0)
  }

  get height() {
    return Math.abs(this.y1 - this.y0)
  }

  get perimeter() {
    return 2 * (this.width + this.height)
  }

  get area() {
    return this.width * this.height
  }

  get wide() {
    return this.width > this.height
  }

  get high() {
    return !this.wide
  }
}

export function doAfterPaint(work: () => void) {
  queueMicrotask(work)
}

export const getTotalMarginX = (cssStyleDeclaration: CSSStyleDeclaration) => {
  const { marginLeft, marginRight } = cssStyleDeclaration
  return parseFloat(marginLeft) + parseFloat(marginRight)
}
