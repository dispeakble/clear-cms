import React from 'react'
import { observer } from 'mobx-react'
import { CircleSlider } from 'react-circle-slider';
import PropTypes from "prop-types";

const DegreeInput = ({store, gradientColors}) => {

    const colors = Array.from(gradientColors);

  return (
      <CircleSlider
          size={60}
          knobRadius={6}
          circleWidth={2}
          progressWidth={2}
          shadow={false}
          gradientColorFrom={colors[0]}
          gradientColorTo={colors[colors.length - 1]}
          min={0}
          max={360}
          value={store.selectedGradient.degrees} onChange={(value) => {
            store.selectedGradient.changeDegrees(value);
          }} />
  )
}

export default observer(DegreeInput)

DegreeInput.propTypes = {
    store: PropTypes.object,
    selectedGradient: PropTypes.any
};
