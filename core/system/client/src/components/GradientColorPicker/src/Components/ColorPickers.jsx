import React from 'react'
import { SketchPicker } from 'react-color'

const convertRgbToString = (rgb) => {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
}

const ColorPickers = ({ gradient, store }) =>
  gradient.colors.map((color, index) => (
    <div
      key={index}
      style={{ display: 'inline-block' }}
      pose={(store.uiHidden || store.uiHiddenLocked) ? 'hidden' : 'visible'}
    >
      <SketchPicker
        color={color}
        onChange={color => {
            gradient.changeColor(convertRgbToString(color.rgb), index)
        }}
        presetColors={[]}
      />
    </div>
  ))

export default ColorPickers
