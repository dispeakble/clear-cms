import React, {useState} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/components/colorPicker.js";
import {SketchPicker} from "react-color";
import {FormControlLabel} from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function ColorPicker(props) {
    const classes = useStyles();
    const [popoverVisible, setPopoverVisible] = useState(props.isOpen || false);
    const { color, onChange, label } = props;
    const [ selectedColor, setSelectedColor ] = useState(color);

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
