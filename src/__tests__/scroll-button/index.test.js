import * as React from 'react'
import { mount } from 'enzyme'
// import { render } from '@testing-library/react'
import ScrollButton from '../../scroll-button'

describe('<ScrollButton />', () => {
  it('renders without crashing', () => {
    const scrollButton = mount(<ScrollButton />)
    expect(scrollButton).toBeTruthy()
  })
})
