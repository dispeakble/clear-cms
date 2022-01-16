import React from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import Typography from "@material-ui/core/Typography";

import Switch from "@material-ui/core/Switch";

import {FormControlLabel, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import ColorPicker from "../../../components/ColorPicker/ColorPicker";
import GradientColorPicker from "../../../components/GradientColorPicker/GradientColorPicker";
import Button from "../../../components/CustomButtons/Button";
import imageHelper from "../../../helpers/image.helper";

class ViewBoxAppearance extends React.PureComponent {

    state = {
        hasFontSize: false,
        hasFontFamily: false,
        hasTextColor: false,
        hasBackgroundColor: false,
        hasBackgroundGradient: false,
        hasBackgroundImage: false,
        hasBackgroundRepeat: false,
        hasBackgroundStretch: false,

        backgroundImage: "",
        backgroundImageFile: "",

        backgroundColor: "",
        backgroundGradient: "",
        fontUnit: "px",
        textColor: "",
        fontSize: 11,//TODO CHANGE TO AUTOCOMPLETE FROM SLIDER
        fontFamily: "Roboto",
        backgroundImageString: "",

        backgroundRepeat: false,
        backgroundStretch: false,

        modalPositions: [
            {label: "Top", value: "top"},
            {label: "Center", value: "center"},
            {label: "Bottom", value: "bottom"}
        ],
    };

    imageUploader = null;

    componentDidMount() {
        this.setState(this.props.box);
    }

    getFontFamilyItem(name) {
        return this.props.fontFamilies[
            this.props.fontFamilies.findIndex((font) => {
                return font.family === name;
            })
            ];
    }

    handleFontFamily = (event, newValue) => {
        this.onUpdate({
            fontFamily: newValue.family,
        });
    };

    handleFontSize = (event, newValue) => {
        if (typeof newValue === 'string') {
            this.onUpdate({
                fontSize: Number(newValue),
            });
        } else if (newValue && newValue.value) {
            this.onUpdate({
                fontSize: newValue.value,
            });
        }
    };

    handleBgImage = async (event) => {
        const fileClone = new File([event.target.files[0]], event.target.files[0].name);
        const imageBase64 = await imageHelper.toBase64(event.target.files[0]);
        this.onUpdate({
            backgroundImageString: imageBase64,
            backgroundImageFile: fileClone,
        });
    };

    onUpdate = (data) => {
        this.setState(data);
        this.props.onUpdate(data);
    };

    render() {
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <div style={{flex: 1}}>
                        <h4>Background Options</h4>

                        <Typography variant="caption" style={{display: 'block'}}>Solid color for the
                            box background</Typography>
                        <div style={{display: "flex", alignItems: "center"}}>
                            {this.state.hasBackgroundColor && <div>
                                <ColorPicker
                                    color={this.state.backgroundColor}
                                    onChange={(color) => {
                                        this.onUpdate({
                                            backgroundColor: color
                                        })
                                    }}
                                />
                            </div>}
                            <div>
                                <Typography>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={this.state.hasBackgroundColor}
                                            onChange={() => this.onUpdate({
                                                hasBackgroundGradient: false,
                                                hasBackgroundColor: !this.state.hasBackgroundColor
                                            })
                                            }
                                        />}
                                        label="Solid Color"/>
                                </Typography>
                            </div>
                        </div>

                        <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Gradient composition
                            for the box background</Typography>
                        <div style={{display: "flex", alignItems: "center"}}>
                            {this.state.hasBackgroundGradient &&
                                <div>
                                    <GradientColorPicker
                                        color={this.state.backgroundGradient}
                                        onChange={(color) => {
                                            this.onUpdate({
                                                backgroundGradient: color
                                            })
                                        }}/>
                                </div>}
                            <div>
                                <Typography>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={this.state.hasBackgroundGradient}
                                            onChange={() => this.onUpdate({
                                                hasBackgroundColor: false,
                                                hasBackgroundImage: false,
                                                hasBackgroundGradient: !this.state.hasBackgroundGradient,
                                            })
                                            }
                                        />}
                                        label="Gradient Composition"/>
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Custom image for
                                the box background</Typography>
                            <Typography gutterBottom>
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.hasBackgroundImage}
                                        onChange={() =>
                                            this.onUpdate({
                                                hasBackgroundGradient: false,
                                                hasBackgroundImage: !this.state.hasBackgroundImage
                                            })
                                        }
                                    />}
                                    label="Custom Image"/>
                            </Typography>
                        </div>

                        {this.state.hasBackgroundImage && (
                            <div>
                                <div>
                                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Repeat
                                        the image throughout the
                                        box</Typography>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.hasBackgroundRepeat}
                                                onChange={() =>
                                                    this.onUpdate({
                                                        hasBackgroundRepeat: !this.state.hasBackgroundRepeat
                                                    })
                                                }
                                            />}
                                            label="Repeat Image"/>
                                    </Typography>
                                </div>

                                <div>
                                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Stretch
                                        the image to fill the
                                        box</Typography>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.hasBackgroundStretch}
                                                onChange={() =>
                                                    this.onUpdate({
                                                        hasBackgroundStretch: !this.state
                                                            .hasBackgroundStretch,
                                                    })
                                                }
                                            />}
                                            label="Stretch Image"/>
                                    </Typography>
                                </div>
                                <div>
                                    <Button color={"primary"} onClick={() => {
                                        this.imageUploader.click();
                                    }}>Upload Background</Button>
                                    <input id="imageUploader"
                                           type="file"
                                           multiple={true}
                                           ref={(ref) => this.imageUploader = ref}
                                           style={{display: 'none'}}
                                           onChange={(event) => this.handleBgImage(event)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{flex: 1}}>
                        <h4>Text Options</h4>

                        <Typography variant="caption" style={{display: 'block'}}>Select a font family</Typography>
                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                            <FormControlLabel
                                control={<Switch
                                    checked={this.state.hasFontFamily}
                                    onChange={() => {
                                        this.onUpdate({
                                            hasFontFamily: !this.state.hasFontFamily
                                        });
                                    }}
                                />} label="Font Family"/>
                        </div>
                        {this.state.hasFontFamily &&
                            <div>
                                <Autocomplete
                                    id="fontFamilyDropdown"
                                    onChange={this.handleBoxFontFamily}
                                    className={this.props.classes.option}
                                    options={this.props.fontFamilies}
                                    autoHighlight
                                    getOptionLabel={(option) => option.family}
                                    value={this.getFontFamilyItem(
                                        this.state.fontFamily
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            className={this.props.classes.textfield}
                                            {...params}
                                            label="Font Family"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>
                        }

                        <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Select a text color</Typography>
                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                            {this.state.hasTextColor && <div>
                                <ColorPicker
                                    color={this.state.textColor}
                                    onChange={(color) => {
                                        this.onUpdate({
                                            textColor: color
                                        })
                                    }}
                                />
                            </div>}
                            <div>
                                <Typography>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={this.state.hasTextColor}
                                            onChange={() => this.onUpdate({
                                                hasTextColor: !this.state.hasTextColor
                                            })}
                                        />}
                                        label="Text Color"/>
                                </Typography>
                            </div>
                        </div>

                        <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Select a text size</Typography>
                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                            <FormControlLabel
                                control={<Switch
                                    checked={this.state.hasFontSize}
                                    onChange={() => {
                                        this.onUpdate({
                                            hasFontSize: !this.state.hasFontSize
                                        })
                                    }}
                                />} label="Font Size"/>
                        </div>
                        {this.state.hasFontSize && <Autocomplete
                            id="fontSizeDropdown"
                            onChange={this.handleFontSize}
                            className={this.props.classes.option}
                            options={this.props.fontSizes}
                            getOptionLabel={(option) => {
                                if (option && option.label) {
                                    return option.label;
                                } else {
                                    return String(option);
                                }
                            }}
                            freeSolo
                            autoHighlight
                            disableClearable
                            defaultValue={this.state.fontSize}
                            renderInput={(params) => (
                                <TextField
                                    className={this.props.classes.textfield}
                                    {...params}
                                    label="Text Size"
                                    variant="outlined"
                                />
                            )}
                        />}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ViewBoxAppearance);

ViewBoxAppearance.propTypes = {
    box: PropTypes.object,
    fontFamilies: PropTypes.array,
    fontSizes: PropTypes.array,
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
};
