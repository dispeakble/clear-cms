import React, {useState} from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/components/colorPicker.js";
import {SketchPicker} from "react-color";
import {FormControlLabel} from "@material-ui/core";

const useStyles = makeStyles(styles);

const ColorPicker = (props) => {
    const classes = useStyles();
    const { color, isOpen, onChange, label } = props;
    let [popoverVisible, setPopoverVisible] = useState(isOpen || false);
    let [selectedColor, setSelectedColor] = useState(color || "#FFFFFF");

    const colorPickerButton = <button
        ref={(btnRef) => {
            props.customRef && props.customRef(btnRef)
        }}
        className={classes.swatch}
        style={{backgroundColor: selectedColor, marginRight: label ? "30px" : 0, marginLeft: label ? "10px" : 0}}
        onClick={() => setPopoverVisible(true)}>
    </button>;

    return (
        <>
            {popoverVisible ? (
                <span className={classes.popover}>
                    <span className={classes.cover} onClick={() => setPopoverVisible(false)} />
                    <SketchPicker color={selectedColor} onChange={(color) => {
                        setSelectedColor(color.hex);
                        onChange(color.hex)
                    }}
                    />
                </span>
            ) : null}
            {label && label.length ? <FormControlLabel
                control={colorPickerButton}
                label={label}/> : colorPickerButton}
        </>
    );
}

export default ColorPicker;

ColorPicker.defaultProps = {
    color: "#FFFFFF"
};

ColorPicker.propTypes = {
    label: PropTypes.string | undefined,
    color: PropTypes.string,
    isOpen: PropTypes.bool,
    onChange: PropTypes.func,
    customRef: PropTypes.func
};
