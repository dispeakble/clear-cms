import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import Snackbar from "components/Snackbar/Snackbar.js";
import ViewImages from "../templates/ViewImages/ViewImages";

class ImagesController extends Component {
    state = {
        errorNotification : [],
    };
    services = this.props.services;
    messageCallbacks = {};
    config = {
        prefix: 'images/'
    };
    control = {
        get: () => this.getData(),
    };


    async componentDidMount() {

        this.services.ws.subscribe({
            channel: 'product-images',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

    }

    async getData() {
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in images controller', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'product-images',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    updateErrorNotification (errMsg) {
        this.setState({
            errorNotification : [...this.state.errorNotification, errMsg]
        })
    }

    removeErrorNotification (errMsg) {
        const updatedErrorNotification = this.state.errorNotification.filter(msg => msg !== errMsg);
        this.setState({
            errorNotification: updatedErrorNotification,
        })
    }

    render() {
        return (
            <>
                {
                    this.state.errorNotification.map((msg, index) => {
                        return (
                            <Snackbar
                                key={index}
                                place='tc'
                                message={msg}
                                open
                                close
                                closeNotification={() => {this.removeErrorNotification(msg)}}
                                color='warning'
                            />

                        )
                    })
                }
                <ViewImages control={this.control} {...this.props} />
            </>
        );
    }

}

export default ImagesController;

ImagesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};