import React, { useState} from "react";
import PropTypes from "prop-types";

import App from "./src/App"

import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/components/colorPicker.js";
import Modal from "../Modal/Modal";

const useStyles = makeStyles(styles);

export default function GradientColorPicker(props) {
    const classes = useStyles();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const { color, onChange } = props;
    const [ selectedColor, setSelectedColor ] = useState(color);

    return (
        <>
            <Modal
                id="gradientColorPicker"
                modalSize="large"
                title="Compose a gradient"
                showModal={popoverVisible}
                resize={true}
                saveDimensions={true}
                closeButton={{
                    label: "Close",
                    callback: () => {
                        setPopoverVisible(false)
                    }
                }}
                confirmButton={{
                    label: "Save",
                    callback: () => {
                        onChange(selectedColor);
                        setPopoverVisible(false)
                    }
                }}
                content={(
                    <App selectColor={(color) => {
                        setSelectedColor(color);
                    }}  />
                )}
            >

            </Modal>
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
    onChange: PropTypes.func,
};
