import * as React from 'react'
import { Action, ActionEnum } from '../slider/hooks'
import { useScrollButton } from './hooks'

interface ScrollButtonProps
  extends React.PropsWithChildren<React.DOMAttributes<HTMLButtonElement>> {
  action: Action
  chainRef: React.MutableRefObject<null>
}

const InternalScrollButton = (
  { children, action, chainRef }: ScrollButtonProps,

  ref:
    | string
    | ((instance: HTMLButtonElement | null) => void)
    | React.RefObject<HTMLButtonElement>
    | null
    | undefined
) => {
  const scroller = useScrollButton()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const props = scroller(action, chainRef, e)

    if (!props) return

    const { domPosition, slider } = props

    Object.assign((slider as HTMLElement).style, {
      transform: `translateX(${domPosition}px)`,
      transition: `transform var(--trans-time)`
    })
  }

  const defaultChild = action === ActionEnum.NEXT ? '>>' : '<<'
  return (
    <button onClick={handleClick} ref={ref}>
      {children || defaultChild}
    </button>
  )
}

const ScrollButton: (props: ScrollButtonProps) => JSX.Element = React.forwardRef(
  InternalScrollButton
) as (props: ScrollButtonProps) => JSX.Element

export default ScrollButton
