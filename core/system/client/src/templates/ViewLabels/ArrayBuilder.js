import React, {useState} from "react";
import {Chip, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";

const ArrayBuilder = ({value, onChange}) => {
    const [itemList, setItemList] = useState(value);

    const addItem = (value) => {
        if(value !== '') {
            const newList = [...itemList, value];
            setItemList(newList);
            onChange(newList);
        }
    }

    return <Autocomplete
        multiple
        options={itemList}
        freeSolo
        value={itemList}
        onChange={(e,value) => {
            setItemList(value);
            onChange(value);
        }}
        renderTags={(value, getTagProps) =>{
                return value.map((option, index) => (
                    <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
        }
        renderInput={(params) => (
            <TextField {...params}  variant="filled" label="array" placeholder="Enter" onKeyDown={(e) => {
                if(e.key === "Enter") {
                    e.stopPropagation();
                    addItem(e.target.value);
                    e.target.value = "";
                }
            }} />
        )}
    />
}

export default ArrayBuilder;

ArrayBuilder.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func
}