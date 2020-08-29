import * as React from 'react'
import { getTotalMarginX } from '../touch-utils'
import { Warning } from '../constants'
import { Action, ActionEnum } from '../slider/hooks'

const internalRefKey = Symbol('dom-position')

const useScrollButton = () => {
  return React.useCallback(
    (
      action: Action,
      chainRef: React.MutableRefObject<any>,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      chainRef.current = {}

      /**
       * The scroll buttons are siblings of the slider element
       */
      const slider = e.currentTarget.previousElementSibling || e.currentTarget.nextElementSibling

      if (!slider) {
        return console.warn(Warning.NO_SLIDER)
      }

      /**
       * Get the first child of the slider element, likely a Card
       */
      const sliderChild = slider.firstChild as Element | null

      if (!sliderChild) {
        return console.warn(Warning.NO_SLIDER_CHILD)
      }

      const { width, x: sliderOffsetX } = slider.getBoundingClientRect()
      const { scrollWidth } = slider
      /**
       * Compute _x_ margin of slider first child representing all children
       */
      const sliderChildMargin = getTotalMarginX(window.getComputedStyle(sliderChild))
      /**
       * Total width: width + _x_ margin of slider child element
       */
      const sliderChildWidth = sliderChild.getBoundingClientRect().width + sliderChildMargin
      /**
       * Amount of completely visible children the viewport can accommodate
       */
      const visibleChildren = Math.floor(width / sliderChildWidth)
      /**
       * Amount of children beyond the viewport accommodation
       */
      const hiddenChildren = slider.childElementCount - visibleChildren
      /**
       * Dimension to scroll away from visible children
       */
      const fromVisibleChildren = sliderChildWidth * visibleChildren
      /**
       * Dimension to scroll towards hidden children
       */
      const toHiddenChildren = sliderChildWidth * hiddenChildren
      /**
       * Scroll away from visible children `if` total dimension of
       * hidden children  is greater than slider width `else` scroll
       * towards hidden children
       */
      const nextScrollStop = toHiddenChildren > width ? fromVisibleChildren : toHiddenChildren

      const getActionState = (position: number, width: number, scrollWidth: number) => {
        const canNext = position > width - scrollWidth
        const canPrev = position < 0
        return { canNext, canPrev }
      }

      Object.assign(chainRef.current, {
        [internalRefKey]:
          chainRef.current[internalRefKey] === undefined
            ? sliderOffsetX - (slider as HTMLElement).offsetLeft
            : chainRef.current[internalRefKey]
      })

      const domPosition = chainRef.current[internalRefKey] as number
      const { canNext, canPrev } = getActionState(domPosition, width, scrollWidth)

      if (canNext && action === ActionEnum.NEXT) {
        chainRef.current[internalRefKey] -= nextScrollStop
      } else if (canPrev && action === ActionEnum.PREV) {
        chainRef.current[internalRefKey] += nextScrollStop
      } else {
        return console.error(
          `Oops! This program remains undecisive at this juncture. Make sure to hide the affected button when it can no longer trigger the "${action}" action it was registered with`
        )
      }

      return {
        domPosition: chainRef.current[internalRefKey] as number,
        canNext,
        canPrev,
        slider
      }
    },
    []
  )
}

export { useScrollButton }
