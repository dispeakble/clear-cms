import React from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import PropTypes from "prop-types";
import CustomInput from "components/CustomInput/CustomInput.js";
import {Editor} from "@tinymce/tinymce-react";
import {DropzoneDialog} from "material-ui-dropzone";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import Button from "../../../../components/CustomButtons/Button";


class CardModule extends React.PureComponent {
    state = {

        cardTitle:'',
        cardLink:'',
        cardBackgroundLink:'',
        cardBinary:'',
        showFileUploader:false,
        files:[],
        number: 1,
        expireDate:'',
        expireTime:''



    };
    moduleOptions = {
        textData: ""
    };


     componentDidMount() {
        if (this.props.moduleOptions) {
            this.moduleOptions = Object.assign({}, this.props.moduleOptions);
            let {moduleOptions} = this.props;
            this.setState({
                cardTitle: moduleOptions.cardTitle,
                cardLink: moduleOptions.cardLink,
                textData: moduleOptions.textData,
                cardBackgroundLink : moduleOptions.cardBackgroundLink,
                cardBinary: moduleOptions.cardBinary,
                showFileUploader: moduleOptions.showFileUploader,
                files: moduleOptions.files,
                number: moduleOptions.number,
                expireDate: moduleOptions.expireDate,
                expireTime: moduleOptions.expireTime,
            });
        }
    }

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
    async handleFile(event) {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            this.handleUpdate({
                cardBackgroundLink: strings[0],
                cardBinary: event[0],
                showFileUploader: false


            })

        }

        let files = [];
        if (this.state.cardBinary) {
            files.push({
                sel: 'card',
                name: `card.${this.fileExtension(this.state.cardBinary.name)}`,
                file: this.state.cardBinary
            });
        }
        this.handleUpdate({
            files
        })




    }



    closeFileUploader() {
        this.setState({
            showFileUploader: false
        });
    }


    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "cardTitle":
                this.handleUpdate({
                    cardTitle: event.target.value
                })

                break;
            case "cardLink":
                this.handleUpdate({
                    cardLink: event.target.value
                })

                break;
            default:
                break;
        }


    };


    handleUpdate(params) {
        const payload = Object.assign({}, {
            cardTitle: this.state.cardTitle,
            cardLink: this.state.cardLink,
            textData: this.moduleOptions.textData,
            cardBackgroundLink: this.state.cardBackgroundLink,
            cardBinary: this.state.cardBinary,
            showFileUploader: this.state.showFileUploader,
            files: this.state.files,
            number: this.state.number,
            expireDate: this.state.expireDate,
            expireTime: this.state.expireTime,

        }, params);

        this.props.onUpdate(payload);

        this.setState(params);
        console.log(this.state)
    }

    render() {
        return (
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <CustomInput
                    labelText="Title"
                    id="cardTitle"
                    required="required"
                    formControlProps={{
                        fullWidth: true,
                        onChange: this.handleInputChange.bind(this),
                    }}
                    inputProps={{
                        value: this.state.cardTitle,
                        type: "text",
                    }}
                />
                <Editor
                    initialValue={this.state.textData}
                    init={{
                        height: 500,
                        //menubar: false,
                        /*plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],*/
                        plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',

                        menubar: 'file edit view insert format tools table tc help',
                        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                        /*toolbar:
                            "undo redo"
                            + " | formatselect"
                            + " | bold italic forecolor backcolor"
                            + " | alignleft aligncenter alignright alignjustify"
                            +" | bullist numlist outdent indent"
                            + " | removeformat",*/
                        init_instance_callback: function (editor) {
                            var annoyingMessage = document.querySelector(
                                ".tox-notifications-container"
                            );
                            if (annoyingMessage && annoyingMessage.style) {
                                annoyingMessage.style.display = "none";
                            }
                        },
                    }}
                    onEditorChange={(event) => {
                        this.moduleOptions.textData = event;
                        this.handleUpdate({
                            event
                        })
                    }}
                />

                <CustomInput
                    labelText="Link"
                    id="cardLink"
                    required="required"
                    formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                    }}
                    inputProps={{
                        value: this.state.cardLink,
                        type: "text",
                    }}
                />
                <Button onClick={() => {
                    this.setState({
                        showFileUploader: true
                    });
                }} color="primary"> Upload Background Image</Button>

                <DropzoneDialog
                    open={this.state.showFileUploader}
                    onSave={this.handleFile.bind(this)}
                    onClose={this.closeFileUploader.bind(this)}
                    filesLimit={1}
                    acceptedFiles={['image/*']}
                    maxFileSize={Math.pow(1024, 3)}
                />

                <div>
                    <Typography>Number </Typography>
                    <TextField
                        labelText="Number "
                        id="numnber"
                        onChange={(e) =>
                            this.handleUpdate({
                                number: e.target.value
                            })
                        }
                        InputProps={{
                            inputProps: {
                                value: this.state.number,
                                type: "number",
                                min: 5,
                                max: 20,
                            }
                        }}
                    />
                </div>

                <h6> Expiration Date & Time </h6>
                <input 
                    type="date" 
                    id="expiration_Date" 
                    name="expiration_Date"
                    value={this.state.expireDate}
                    onChange={(e)=>{
                        this.handleUpdate({
                            expireDate:e.target.value
                        })
                        
                        
                    }}
                />

                <input 
                    type="time" 
                    id="expiration_time" 
                    name="expiration_time"
                    value={this.state.expireTime}
                    onChange={(e)=>{
                        this.handleUpdate({
                            expireTime:e.target.value
                        })

                    }}
                />









            </div>
        )

    }
}

export default withStyles(styles)(CardModule);

CardModule.propTypes = {
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};
