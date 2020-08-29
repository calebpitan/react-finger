import * as React from 'react'
import { mount } from 'enzyme'
// import { render } from '@testing-library/react'
import Slider from '../../slider'

describe('<Slider />', () => {
  it('renders without crashing', () => {
    const slider = mount(<Slider />)
    expect(slider).toBeTruthy()
  })
})
