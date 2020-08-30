import * as React from 'react'
import { Rectangle } from '../touch-utils'
import { Warning } from '../constants'

enum ActionEnum {
  NEXT = 'next',
  PREV = 'prev'
}

enum TouchPhaseEnum {
  TOUCH_START = 'TOUCH_START',
  TOUCH_MOVE = 'TOUCH_MOVE',
  TOUCH_END = 'TOUCH_END'
}

enum ScrollingEnum {
  MOMENTUM = 'momentum',
  INERTIA = 'inertia'
}

type Action = 'next' | 'prev'
type TouchPhase = 'TOUCH_END' | 'TOUCH_MOVE' | 'TOUCH_START'
type Scrolling = 'momentum' | 'inertia'

interface SliderOptions {
  threshold?: number
  elasticity?: number
  thresholdSpeed?: number
  /**
   * UnImplemented
   */
  scrolling?: Scrolling
}

interface TouchProps {
  touchStart?: React.Touch
  touchMove?: React.Touch
  touchEnd?: React.Touch
  position: number
  intermediatePosition: number
  finalPosition: number
  domPosition: number
  tNought: number | null
  tOne: number | null
}

type SliderTransformerProps = TouchProps & {
  target: HTMLElement
  action?: Action
  rect?: Rectangle
  phase: TouchPhase
}

type SliderTransformer = (props: SliderTransformerProps) => void

const THRESHOLD = 0.5
const ELASTICITY = 0.6
const THRESHOLD_SPEED = 0.7 // px per ms

const internalTransform = (transform: SliderTransformer) => {
  return (touchProps: SliderTransformerProps) => {
    if (transform) {
      return transform(touchProps)
    }
    console.warn(Warning.NO_TRANSFORM)
  }
}

const start: <T = HTMLElement>(
  e: React.TouchEvent<T>,
  ref: React.MutableRefObject<TouchProps>,
  transform: SliderTransformer
) => void = (e, ref, transform) => {
  const target = (e.currentTarget as unknown) as HTMLElement

  ref.current.touchStart = e.changedTouches[0]
  ref.current.position =
    target.getBoundingClientRect().x -
    ((target.offsetParent as HTMLElement).offsetLeft || target.offsetLeft)

  ref.current.tNought = Date.now()

  internalTransform(transform)(
    Object.assign({}, ref.current, { target, phase: TouchPhaseEnum.TOUCH_START })
  )
}

const move: <T = HTMLElement>(
  e: React.TouchEvent<T>,
  options: SliderOptions,
  ref: React.MutableRefObject<TouchProps>,
  transform: SliderTransformer
) => void = (e, options, ref, transform) => {
  const elasticity = options.elasticity || ELASTICITY
  const target = (e.currentTarget as unknown) as HTMLElement
  const touchMove = e.changedTouches[0]
  const position = touchMove.clientX - (ref.current.touchStart as React.Touch).clientX
  const calculatedPosition = ref.current.position + position * elasticity

  const rect = new Rectangle(
    ref.current.touchStart?.clientX as number,
    ref.current.touchStart?.clientY as number,
    touchMove.clientX,
    touchMove.clientY
  )

  Object.assign(ref.current, {
    touchMove,
    intermediatePosition: calculatedPosition
  })

  internalTransform(transform)(
    Object.assign({}, ref.current, { target, rect, phase: TouchPhaseEnum.TOUCH_MOVE })
  )
}

const end: <T = HTMLElement>(
  e: React.TouchEvent<T>,
  options: SliderOptions,
  ref: React.MutableRefObject<TouchProps>,
  transform: SliderTransformer
) => void = (e, options, ref, transform) => {
  const elasticity = options.elasticity || ELASTICITY
  const thresholdSpeed = options.thresholdSpeed || THRESHOLD_SPEED
  const threshold = options.threshold || THRESHOLD

  const target = (e.currentTarget as unknown) as HTMLElement
  const { width } = target.getBoundingClientRect()
  const { scrollWidth } = target

  const touchEnd = e.changedTouches[0]
  const touchStart = ref.current.touchStart as React.Touch

  const position = touchEnd.clientX - touchStart.clientX
  const calculatedPosition = ref.current.position + position * elasticity

  Object.assign(ref.current, {
    touchEnd,
    finalPosition: calculatedPosition
  })

  const action: Action = touchStart.clientX > touchEnd.clientX ? ActionEnum.NEXT : ActionEnum.PREV
  /**
   * **Period _(T)_:** Change in time _(t)_ in `ms`
   */
  const period = Date.now() - (ref.current.tNought as number)
  /**
   * **Displacement _(x)_:** Change in displacement
   * _(x1 - x0)_ in `px`
   */
  const displacement = touchEnd.clientX - touchStart.clientX
  /**
   * Velocity in pixels per second `px/ms`
   */
  const velocity = displacement / period

  if (
    action === ActionEnum.NEXT &&
    ref.current.domPosition > width - scrollWidth &&
    (Math.abs(displacement) >= width * threshold || Math.abs(velocity) >= thresholdSpeed)
  ) {
    ref.current.domPosition -= width

    internalTransform(transform)(
      Object.assign({}, ref.current, { target, action, phase: TouchPhaseEnum.TOUCH_END })
    )
  } else if (
    action === ActionEnum.PREV &&
    ref.current.domPosition < 0 &&
    (Math.abs(displacement) >= width * threshold || Math.abs(velocity) >= thresholdSpeed)
  ) {
    ref.current.domPosition += width

    internalTransform(transform)(
      Object.assign({}, ref.current, { target, action, phase: TouchPhaseEnum.TOUCH_END })
    )
  } else {
    internalTransform(transform)(
      Object.assign({}, ref.current, { target, phase: TouchPhaseEnum.TOUCH_END })
    )
  }
}

const useSlider = (options: SliderOptions) => {
  const touchProps: React.MutableRefObject<TouchProps> = React.useRef({
    position: 0,
    intermediatePosition: 0,
    finalPosition: 0,
    domPosition: 0,
    tNought: null,
    tOne: null
  })

  return React.useCallback(
    (transform: (props: SliderTransformerProps) => void) => {
      return {
        handleStart<T extends HTMLElement>(e: React.TouchEvent<T>) {
          start<T>(e, touchProps, transform)
        },

        handleMove<T extends HTMLElement>(e: React.TouchEvent<T>) {
          move<T>(e, options, touchProps, transform)
        },

        handleEnd<T extends HTMLElement>(e: React.TouchEvent<T>) {
          end<T>(e, options, touchProps, transform)
        }
      }
    },
    [options]
  )
}

export type { TouchPhase, Action }
export type { SliderOptions, SliderTransformerProps }

export { useSlider, TouchPhaseEnum, ActionEnum }
