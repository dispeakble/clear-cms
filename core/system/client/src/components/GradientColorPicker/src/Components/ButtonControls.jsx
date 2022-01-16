import React from 'react'
import DegreeInput from './DegreeInput'
import PropTypes from "prop-types";

const ButtonControls = ({store, gradient}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <span style={{width: '30%'}}>
                <button
                    onPointerUp={() => gradient.setMode('lch')}
                    className={gradient.mode === 'lch' ? 'activeButton' : ''}
                >
                    LCH
                </button>
                <button
                    onPointerUp={() => gradient.setMode('lab')}
                    className={gradient.mode === 'lab' ? 'activeButton' : ''}
                >
                    LAB
                </button>
            </span>
            <span>
                <DegreeInput store={store} gradientColors={gradient.colors}/>
            </span>
            <span style={{width: '30%'}}>
                <button onPointerUp={gradient.addColor}>Add Color</button>
                <button onPointerUp={gradient.removeColor}>Remove Color</button>
            </span>
        </div>
    )
}

export default ButtonControls

ButtonControls.propTypes = {
    store: PropTypes.object,
    gradient: PropTypes.object,
};
