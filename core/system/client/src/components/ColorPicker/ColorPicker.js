import React, {useState} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/components/colorPicker.js";
import {SketchPicker} from "react-color";

const useStyles = makeStyles(styles);

export default function ColorPicker(props) {
    const classes = useStyles();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const { color, onChange } = props;
    const [ selectedColor, setSelectedColor ] = useState(color);

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
            <button
                ref={(btnRef) => {
                    props.customRef && props.customRef(btnRef)
                }}
                className={classes.swatch}
                style={{backgroundColor: selectedColor}}
                onClick={() => setPopoverVisible(true)}>
            </button>

        </>
    );
}

ColorPicker.defaultProps = {
    color: "#FFFFFF"
};

ColorPicker.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
    customRef: PropTypes.func
};
