# react-finger

A simple touch library for React apps. Includes components and hooks!

React-finger is a design agnostic, yet functionality-driven React hook and component library for making your web apps touch compatible and accessible. This library brings the same touch experience as you'd have with native apps, to web apps. With little or no configuration and the privilege of absolute customization, as you want it, you can have your components react to touch gestures in a smart and expected way.

Every component we provide is a **pure** functional component (no class). No side effects, no re-render or `useState` and `setFoo` calls. Most configuration options are reactive where necessary, i.e the components and hooks are updataed as your config options gets updated.

[![Build Status](https://travis-ci.org/calebpitan/react-finger.svg?branch=master)](https://travis-ci.org/calebpitan/react-finger)

<!-- [![NPM](https://img.shields.io/npm/v/react-finger.svg)](https://www.npmjs.com/package/react-finger) -->
<!-- [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) -->

## Install

Install using **npm**

```bash
npm install --save react-finger
```

Alternatively, using **yarn**

```bash
yarn add react-finger
```

## Usage

```tsx
import * as React from 'react'

import Slider from 'react-finger'

const Tab = (props) => {
  <div style={{overflow: `hidden`}}>
    <Slider className="tab flex">
      {props.children}
    </Slider>
  </div>
}

const ProfileTab = () => {
  <Tab>
    <TabPanel>
      <Tweets />
    </TaabPanel>
    <TabPanel>
      <TweetsAndReplies />
    </TabPanel>
  </Tab>
}
```

## License
Licenssed under the [MIT](https://github.com/calebpitan/react-finger/blob/master/license) © 2020 [Caleb Adepitan](https://github.com/calebpitan)
