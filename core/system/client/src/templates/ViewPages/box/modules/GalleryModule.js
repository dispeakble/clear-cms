import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";

import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";

import {Accordion, AccordionDetails, AccordionSummary, FormControlLabel, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Slider from "@material-ui/core/Slider";
import MaterialTable from "material-table";
import {Check, Clear, DeleteForever, Edit} from "@material-ui/icons";
import TumbnailComponent from "components/PhotosGallery/Thumbnail";

class GalleryModule extends Component {
    state = {
        galleryTitle: "Default Gallery Title",
        galleryType: 0,

        //existing array
        files: [],

        /* START Carousel Add-ons */
        infiniteSliding: true,
        fullscreenButton: false,
        zoom: true,
        autoPlay: true,
        playButton: false,
        bullets: false,
        thumbnails: false,
        navigation: false,
        index: false,
        tbnSliding: true,
        slideInterval: 2000,
        slideDuration: 450,
        /* END Carousel Add-ons */

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        /* * * * * * * never add to onUpdate from here down! * * * * * * */
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        galleryTypes: [{label: "Carousel"}],

        //table
        galleryImagesRef: React.createRef()
    };

    tableOptions = {
        title: "Gallery images",
        tableRef: this.state.galleryImagesRef,
        columns: [
            {
                title: "Preview", field: "thumbnail", width: 50, sorting: false, render: (rowData) => {

                    const rd = {...rowData};

                    if (!rd.file) {
                        rd.name = `/files/pages/page-${this.props.pageId}/box-${this.props.boxId}/module/${rd.name}`;
                    }

                    return <TumbnailComponent key={`g-${Math.random()}`} rowData={rd}/>
                }
            },
            {title: "Title", field: "title"},
            {title: "Description", field: "description", sorting: false},
            {title: "Link", field: "link", sorting: false},
            {title: "Position", field: "position", type: 'numeric', width: 150, defaultSort: 'asc'}
        ],
        options: {
            selection: true,
            actionsColumnIndex: -1,
            actionsCellStyle: {
                width: "auto",
            },
        },
        actions: [{
            icon: 'add',
            tooltip: 'Add Images',
            position: "toolbar",
            onClick: () => {
                this.imageUploader.click();
            }
        }],
        icons: {
            Check: () => (
                <Check color="primary"/>
            ),
            Clear: () => (
                <Clear color="error"/>
            ),
            Edit: () => (
                <Edit color="primary"/>
            ),
            Delete: () => (
                <DeleteForever color="error"/>
            ),
        },
        editable: {
            onRowAdd: null,
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        delete newData.tableData;
                        newData.file = oldData.file;
                        const index = oldData.tableData.id;

                        if (newData.position !== oldData.position) {
                            this.handleUpdate({files: this.updateOrder(newData, index)});
                        } else {
                            const dataUpdate = [...this.state.files];
                            dataUpdate[index] = newData;
                            this.handleUpdate({files: this.reorderFiles(dataUpdate)});
                        }

                        resolve();
                    }, 300);

                }),
            onRowDelete: (oldData) =>
                new Promise((resolve) => {
                    const dataDelete = [...this.state.files];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    this.handleUpdate({files: this.reorderFiles(dataDelete)});
                    setTimeout(() => {
                        resolve();
                    }, 0)
                }),
        }
    };

    imageUploader = null;

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        let moduleOptions = this.props.moduleOptions;
        if (moduleOptions && Object.keys(moduleOptions).length) {
            this.setState(moduleOptions);
        }
    }

    getImagesRows() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.state.files);
            }, 0);
        });
    }

    handleInputChange = (event) => {
        switch (event.target.id) {
            case "galleryTitle":
                this.setState({galleryTitle: event.target.value + ""});
                break;
            case "slideInterval":
                this.setState({slideInterval: Number(event.target.value)});
                break;
            case "slideDuration":
                this.setState({slideDuration: Number(event.target.value)});
                break;
            default:
                break;
        }
    };

    getGalleryIndex(name) {
        return Number(
            this.state.galleryTypes.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleGalleryType = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        await this.setAsyncState({
            galleryType: this.getGalleryIndex(newValue.label),
        });
    };

    handleSlideInterval = (event, newValue) => {
        const slideInterval = newValue;
        this.handleUpdate({slideInterval});
    }

    handleSlideDuration = (event, newValue) => {
        const slideDuration = newValue;
        this.handleUpdate({slideDuration});
    }

    ValueLabelComponent(props) {
        const { children, open, value } = props;

        return (
            <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }

    ValueLabelSeconds(value) {
        return (
            <div style={{whiteSpace: 'nowrap'}}>{`${value / 1000} seconds`}</div>
        );
    }

    handleImageUpload(event) {
        const newFiles = Array.from(event.target.files).map((file, index) => {

            return {
                file: file,
                name: '',
                sel: 0,
                title: file.name,
                description: file.name,
                link: "",
                position: 0,
            }
        });

        const allFiles = this.reorderFiles(this.state.files.concat(newFiles));

        this.handleUpdate({
            files: allFiles
        });
    }

    updateOrder(data, index) {
        const files = [...this.state.files];

        data.position = data.position > files.length ? files.length : data.position;
        data.position = data.position < 1 ? 1 : data.position;

        let newFiles = [];

        files.map((el, i) => {

            if (data.position > files[index].position) {
                if (index !== i) {
                    newFiles.push(el);
                }
            }

            if (i === data.position - 1) {
                newFiles.push(Object.assign({}, data));
            }

            if (data.position < files[index].position) {
                if (index !== i) {
                    newFiles.push(el);
                }
            }

            return el;

        });

        return this.reorderFiles(newFiles)

    }

    reorderFiles(files) {

        if (files.length) {
            files = files.map((el, index) => {
                let ext = "";

                let name = "";

                if (el.file) {
                    ext = el.file.name.split('.').pop();
                    name = `${index + 1}.${ext}`;
                } else {
                    name = el.name;
                }

                return {
                    file: el.file,
                    title: el.title,
                    description: el.description,
                    link: el.link,
                    name: name,
                    original: el.file ? `${index + 1}.${ext}` : el.original,
                    sel: index + 1,
                    position: index + 1
                }
            })
        }

        return files;

    }

    handleUpdate(params) {
        this.props.onUpdate(Object.assign({}, {
            files: this.state.files,
            galleryTitle: this.state.galleryTitle,
            galleryType: this.state.galleryType,
            infiniteSliding: this.state.infiniteSliding,
            fullscreenButton: this.state.fullscreenButton,
            zoom: this.state.zoom,
            autoPlay: this.state.autoPlay,
            playButton: this.state.playButton,
            bullets: this.state.bullets,
            thumbnails: this.state.thumbnails,
            navigation: this.state.navigation,
            index: this.state.index,
            tbnSliding: this.state.tbnSliding,
            slideInterval: this.state.slideInterval,
            slideDuration: this.state.slideDuration,
        }, params));

        this.setState(params);
    }

    render() {
        //const classes = this.props.classes;


        //1. upload using normal multiple uploader
        //2. preview both URL and base64 strings
        //3. sorting dragging
        //4. no pagination
        //5. no sorting in headers
        //6. no draggable headers
        //7. edit and upload specific image

        return (
            <div>
                <div style={{
                    display: 'grid',
                    columnGap: '10px',
                    gridTemplateColumns: 'repeat(2, 1fr [col-start])'
                }}>
                    <CustomInput
                        labelText="Gallery Title"
                        id="galleryTitle"
                        required="required"
                        formControlProps={{
                            fullWidth: true,
                            onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                            value: this.state.galleryTitle,
                            type: "text",
                        }}
                    />
                    <Autocomplete
                        id="moduleDropdown"
                        onChange={this.handleGalleryType}
                        className={this.props.classes.option}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        defaultValue={this.state.galleryTypes[this.state.galleryType]}
                        options={this.state.galleryTypes}
                        renderInput={(params) => (
                            <TextField
                                className={this.props.classes.textfield}
                                {...params}
                                label="Gallery Type"
                                variant="outlined"
                            />
                        )}
                    />
                </div>
                {this.state.galleryType === 0 ? (
                    <div style={{marginBottom: '24px'}}>
                        <Accordion classes={{root: this.props.classes.accordion}}>
                            <AccordionSummary
                                classes={{
                                    root: this.props.classes.accordionSummaryRoot,
                                    expanded: this.props.classes.accordionSummaryExpanded,
                                    content: this.props.classes.accordionSummaryContent,
                                }}
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1c-content"
                            >
                                <Typography className={this.props.classes.typography}>
                                    Advanced gallery settings
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{
                                    display: 'grid',
                                    columnGap: '24px',
                                    gridTemplateColumns: 'repeat(2, 1fr [col-start])'
                                }}>
                                    <div>
                                        <Typography>Seconds between slides</Typography>
                                        <Slider
                                            defaultValue={this.state.slideInterval}
                                            onChangeCommitted={this.handleSlideInterval.bind(this)}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            ValueLabelComponent={this.ValueLabelComponent.bind(this)}
                                            valueLabelFormat={this.ValueLabelSeconds.bind(this)}
                                            min={100}
                                            max={10000}
                                            step={100}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Seconds to animate one slide</Typography>
                                        <Slider
                                            defaultValue={this.state.slideDuration}
                                            onChangeCommitted={this.handleSlideDuration.bind(this)}
                                            aria-labelledby="discrete-slider"
                                            ValueLabelComponent={this.ValueLabelComponent.bind(this)}
                                            valueLabelFormat={this.ValueLabelSeconds.bind(this)}
                                            valueLabelDisplay="auto"
                                            min={100}
                                            max={10000}
                                            step={100}
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    columnGap: '10px',
                                    gridTemplateColumns: 'repeat(2, 1fr [col-start])'
                                }}>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Allow Infinite Sliding">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.infiniteSliding}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                infiniteSliding: !this.state.infiniteSliding
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Infinite Sliding"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip
                                                title="Continue sliding images even if the mouse cursor is over the thumbnails">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.tbnSliding}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                tbnSliding: !this.state.tbnSliding
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Uninterrupted sliding"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    columnGap: '10px',
                                    gridTemplateColumns: 'repeat(2, 1fr [col-start])'
                                }}>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="The gallery will slide the photos automatically">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.autoPlay}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                autoPlay: !this.state.autoPlay
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Auto Play"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show Play Button">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.playButton}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                playButton: !this.state.playButton
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Play Button"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show Fullscreen Button">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.fullscreenButton}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                fullscreenButton: !this.state.fullscreenButton
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Fullscreen Button"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show a bigger preview">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.zoom}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                zoom: !this.state.zoom
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Zoom"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show Bullets">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.bullets}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                bullets: !this.state.bullets
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Bullets"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show Thumbnails">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.thumbnails}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                thumbnails: !this.state.thumbnails
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Thumbnails"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show Navigation">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.navigation}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                navigation: !this.state.navigation
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Navigation"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Show Index">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.index}
                                                        onChange={() => {
                                                            this.handleUpdate({
                                                                index: !this.state.index
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                    label="Index"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                ) : (
                    ""
                )}

                <MaterialTable
                    {...this.tableOptions}
                    data={this.state.files}
                />

                <input id="imageUploader"
                       type="file"
                       multiple={true}
                       ref={(ref) => this.imageUploader = ref}
                       style={{display: 'none'}}
                       onChange={this.handleImageUpload.bind(this)}
                />
            </div>
        );
    }
}

export default withStyles(styles)(GalleryModule);

GalleryModule.propTypes = {
    classes: PropTypes.object,
    boxId: PropTypes.number,
    pageId: PropTypes.number,
    moduleOptions: PropTypes.object,
    defaultTheme: PropTypes.object,
    onUpdate: PropTypes.func,
    pageOptions: PropTypes.object
};