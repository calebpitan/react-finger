import * as React from 'react'
import { useSlider, TouchPhaseEnum, SliderTransformerProps, SliderOptions } from './hooks'
import { doAfterPaint } from '../touch-utils'

const TRANSITION = `transform linear var(--trans-time)`

const transform = ({
  phase,
  target,
  domPosition,
  intermediatePosition,
  rect
}: SliderTransformerProps) => {
  if (phase === TouchPhaseEnum.TOUCH_START) {
    target.style.transition = `none`
    document.body.style.overflow = 'hidden'

    return
  } else if (phase === TouchPhaseEnum.TOUCH_MOVE) {
    if (rect?.high) {
      return doAfterPaint(() => (document.body.style.overflow = `initial`))
    }

    target.style.transform = `translate(${intermediatePosition}px)`
    return
  }

  document.body.style.overflow = `initial`
  Object.assign(target.style, {
    transform: `translate(${domPosition}px)`,
    transition: TRANSITION
  })
}

// TODO: Add a transform property of type SliderTransformer
interface SliderProps
  extends SliderOptions,
    React.PropsWithChildren<React.DOMAttributes<HTMLDivElement>> {}

const InternalSlider = (
  { children, threshold, thresholdSpeed, elasticity, ...rest }: SliderProps,

  ref:
    | string
    | ((instance: HTMLDivElement | null) => void)
    | React.RefObject<HTMLDivElement>
    | null
    | undefined
) => {
  const touchSlider = useSlider({
    threshold,
    thresholdSpeed,
    elasticity
  })

  // TODO: Pass transform from props to this call if undefined pass it the default transform
  const { handleStart, handleMove, handleEnd } = touchSlider(transform)

  return (
    <div
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      {...rest}
      ref={ref}
    >
      {children}
    </div>
  )
}

const Slider: (props: SliderProps) => JSX.Element = React.forwardRef(InternalSlider) as (
  props: SliderProps
) => JSX.Element

export default Slider
