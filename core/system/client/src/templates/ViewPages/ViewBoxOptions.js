import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Modal from "../../components/Modal/Modal";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import PropTypes from "prop-types";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ViewBoxGeneral from "templates/ViewPages/box/ViewBoxGeneral";
import ViewBoxAppearance from "./box/ViewBoxAppearance";
import ViewBoxAdvanced from "./box/ViewBoxAdvanced";

class ViewBoxOptions extends React.Component {

    state = {
        forceReset: false,
        contentType: "general",
        item: {}
    };

    item = Object.assign({}, this.props.item);

    componentDidMount() {

        const initState = {
            item: Object.assign({}, this.props.item)
        };

        try {
            const boxOptionsTab = localStorage.getItem("boxOptionsTab");
            if(boxOptionsTab && boxOptionsTab.length) {
                initState.contentType = boxOptionsTab;
            }

        } catch (err) {
            console.log(err);
        }

        this.setState({...initState});
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    toggleContentType(type) {
        this.setState({
            contentType: type
        })
    }

    handleTabChange(event, nextView) {
        if(nextView) {
            this.setState({
                contentType: nextView
            })
            localStorage.setItem("boxOptionsTab", nextView);
        }
    }
    onUpdate(item) {
        this.item = item;
    }

    render() {

        const classes = this.props.classes;

        const header = (
            <div className={classes.boxOptionsHeader}>
                <div>Box Options</div>
                <div>
                    <ToggleButtonGroup
                        onChange={this.handleTabChange.bind(this)}
                        value={this.state.contentType}
                        exclusive
                    >
                        <ToggleButton value="general" onClick={() => this.toggleContentType("general")}>
                            General
                        </ToggleButton>
                        <ToggleButton value="appearance" onClick={() => this.toggleContentType("appearance")}>
                            Appearance
                        </ToggleButton>
                        <ToggleButton value="advanced" onClick={() => this.toggleContentType("advanced")}>
                            Advanced
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
        );

        const content = {};

        const payload = {
            defaultTheme: this.props.defaultTheme,
            onUpdate: (data) => this.onUpdate(data),
            item: this.item,
            fontFamilies: this.props.fontFamilies
        };

        //this time it won't be lazy loaded
        content['general'] = <ViewBoxGeneral {...payload} />;
        content['appearance'] = <ViewBoxAppearance {...payload} />;
        content['advanced'] = <ViewBoxAdvanced {...payload} />;
        const modalProps = {
            id: "boxEditor",
            name: "boxModal",
            resize: true,
            title: header,
            content: content[this.state.contentType],
            showModal: this.props.showModal,
            defaultTheme: this.props.defaultTheme,
            confirmButton: {
                callback: async () => {
                    await this.setAsyncState({forceReset: !this.state.forceReset})
                    this.props.onSave(this.item);
                },
                label: "Save"
            },
            closeButton: {
                callback: (reason) => {
                    if(reason !== 'backdropClick') {
                        this.props.onClose()
                    }
                },
                label: "Discard"
            }
        }

        return (
            <div>
                <Modal { ...modalProps } />
            </div>
        )
    }

}

export default withStyles(styles)(ViewBoxOptions);


ViewBoxOptions.propTypes = {
    item: PropTypes.object,
    fontFamilies: PropTypes.array,
    classes: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    control: PropTypes.object,
    showModal: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    defaultTheme: PropTypes.object
};