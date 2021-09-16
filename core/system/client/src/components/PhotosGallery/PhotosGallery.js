import React, {useCallback, useState} from "react";
import Gallery from "react-photo-gallery";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import Photo from "./Photo";
import { arrayMoveImmutable } from "array-move";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import styles from "../../assets/jss/clear-crm/components/photosGallery"
import Button from "../CustomButtons/Button";


const SortablePhoto = SortableElement(item => <Photo {...item} />);
const SortableGallery = SortableContainer(({ items, renderImage }) => (
    <Gallery photos={items} renderImage={renderImage} />
));

const PhotosGallery = ({ items, onChange, classes }) => {

    const [selectAll, setSelectAll] = useState(false);
    const [selectMode, setSelectMode] = useState(false);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        onChange(arrayMoveImmutable(items, oldIndex, newIndex));
    };

    const updateSelection = (index) => {
        const newItems = [...items];
        newItems[index].selected = !newItems[index].selected;
        onChange(newItems);
    }

    const imageRenderer = useCallback(
        ({ index, left, top, key, photo }) => (
            selectMode ?
            <Photo
                selected={selectAll ? true : photo.selected}
                callback={updateSelection}
                key={key}
                margin={"2px"}
                index={index}
                photo={photo}
                left={left}
                top={top}
            /> :
                <SortablePhoto
                    key={key}
                    margin={"2px"}
                    index={index}
                    photo={photo}
                    left={left}
                    top={top}
                />
        ),
        [selectAll, selectMode, onChange]
    );

    const handleStateChange = (event) => {
        const isActive = event.target.value;
        if(event.target) {
            const newItems = items?.map(item => {
                if(item.selected) {
                    return {
                        ...item,
                        active: isActive
                    }
                }
                return item
            })
            onChange(newItems);
        }
    }

    const handleDeleteImages = (event) => {
        const newItems = items?.filter(item => !item.selected);
        onChange(newItems);
    }

    console.log("items", items);

    return(
        <div>
            <div className={classes.selectionHeader}>
                <Typography gutterBottom>
                    Select Mode
                    <Tooltip title="Active Product">
                        <Switch
                            checked={selectMode}
                            value={selectMode}
                            onChange={() => setSelectMode(!selectMode)}
                        />
                    </Tooltip>
                </Typography>
                {selectMode &&
                <div>
                    <FormControl classes={{
                        root: classes.changeStateOptions
                    }}>
                        <InputLabel>Change State</InputLabel>
                        <Select
                            labelId="Select State"
                            id="state"
                            onChange={handleStateChange}
                        >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>InActive</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={handleDeleteImages} color="danger">
                        Delete
                    </Button>
                </div>
                }
            </div>
            <SortableGallery items={items} renderImage={imageRenderer} onSortEnd={onSortEnd} axis={"xy"} />
        </div>
    )
}

export default withStyles(styles)(PhotosGallery);

PhotosGallery.propTypes = {
    items: PropTypes.array,
    onChange: PropTypes.func,
    classes: PropTypes.object
};

