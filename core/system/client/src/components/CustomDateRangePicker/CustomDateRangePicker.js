import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";

export default function CustomDateRangePicker(props) {
    const {
        labelText,
        labelProps,
        InputLabelProps,
        value,
        onChange,
        defaultRange = 3,
        fieldTexts = ["From", "To"],
    } = props;

    const addDaytoDate = (dateString, number = 0) => {
        const newDate = new Date(dateString);
        newDate.setDate(newDate.getDate() + number);
        return  new Date(newDate).toISOString().split("T")[0];
    }

    return (
        <React.Fragment>
            <div>
                <Typography {...labelProps}>{labelText}</Typography>
                <TextField
                    id="start"
                    label={fieldTexts[0] ? fieldTexts[0] : "From"}
                    type="date"
                    value={value[0]}
                    {...InputLabelProps}
                    onChange={(event) => {
                        const newValue = event.target.value;
                        onChange([newValue, addDaytoDate(newValue, defaultRange)])
                    }}
                />
                <TextField
                    id="end"
                    label={fieldTexts[1] ? fieldTexts[1] : "To"}
                    type="date"
                    value={value[1]}
                    {...InputLabelProps}
                    inputProps={{
                        min: value[0]
                    }}
                    onChange={(event) => {
                        onChange([value[0], event.target.value])
                    }}
                />
            </div>
        </React.Fragment>
    );
}

CustomDateRangePicker.propTypes = {
    labelText: PropTypes.string.isRequired,
    labelProps: PropTypes.object,
    fieldTexts: PropTypes.array,
    id: PropTypes.string,
    InputLabelProps: PropTypes.object,
    value: PropTypes.shape([
        PropTypes.string.isRequired,
        PropTypes.string.isRequired
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    defaultRange: PropTypes.number
};
