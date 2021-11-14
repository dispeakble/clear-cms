import React from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import {Editor} from "@tinymce/tinymce-react";
import PropTypes from "prop-types";

class TextModule extends React.PureComponent {
    state = {
        fakeChange: false
    };

    moduleOptions = {
        textData: ""
    };

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        this.moduleOptions = Object.assign({} , this.props.moduleOptions);
        this.setState({
            fakeChange: !this.state.fakeChange
        })
    }

    handleInputChange(textData) {
        this.moduleOptions.textData = textData;
        this.props.onUpdate(this.moduleOptions);
    }


    render() {
        return (<Editor
            initialValue={this.moduleOptions.textData}
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
            onEditorChange={(event) => this.handleInputChange(event)}
        />);
    }
}

export default withStyles(styles)(TextModule);

TextModule.propTypes = {
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};
