import React, {useState} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/components/colorPicker.js";
import GradientPicker from "../GradientColorPicker/GradientColorPicker";

const useStyles = makeStyles(styles);

export default function GradientColorPicker(props) {
    const classes = useStyles();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const { color, onChange } = props;
    const [ selectedColor, setSelectedColor ] = useState(color);

    return (
        <>
            {popoverVisible ? (
                <span className={classes.popover}>
                    <span className={classes.cover} onClick={() => setPopoverVisible(false)} />
                    <GradientPicker
                        color={selectedColor}
                        selectColor={
                        (color) => {
                            setSelectedColor({
                                gradientColor: color
                            });
                            onChange(color)
                        }}/>
                </span>
            ) : null}
            <button
                className={classes.swatch}
                style={{background: selectedColor}}
                onClick={() => setPopoverVisible(true)}>
            </button>

        </>
    );
}

GradientColorPicker.defaultProps = {
    color: "#FFFFFF"
};

GradientColorPicker.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func
};
