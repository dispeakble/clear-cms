import React from 'react'
import DegreeInput from './DegreeInput'
import PropTypes from "prop-types";

const ButtonControls = ({store, gradient}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span className="top-menu">
                <h4>Gradient type</h4>
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
            <span className="top-menu" style={{textAlign: "center"}}>
                <h4>Gradient direction</h4>
                <DegreeInput store={store} gradientColors={gradient.colors}/>
            </span>
            <span className="top-menu" style={{textAlign: "right"}}>
                <h4>Gradient color control</h4>
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
