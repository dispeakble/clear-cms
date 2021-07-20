import React, {Component} from "react";
import ViewAuth from "templates/ViewAuth/ViewAuth";
import * as shortId from "shortid";
import PropTypes from "prop-types";

class AuthController extends Component {
    services = {};
    messageCallbacks = {};
    config = {
        prefix: 'system/'
    };
    control = {
        login: (params) => this.login(params),
        logout: (params) => this.logout(params),
        recover: (params) => this.recover(params)
    };

    async componentDidMount() {

        this.services = this.props.services;

        this.services.ws.subscribe({
            channel: 'auth',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

        this.sendMessage({
            module: 'system',
            api: 'auth',
            act: 'ping',
            payload: 'hi there'
        }).then((response) => {
            console.log(response);
        })

    }

    login(params) {
        return new Promise((resolve) => {
            this.sendPost({
                module: 'system',
                api: 'auth',
                act: 'doLogin',
                payload: params
            }).then(response => {
                if (response && response.email && response.email === params.email) {
                    localStorage.setItem('admin', JSON.stringify({fullname: response.fullname, fname: response.fname, lname: response.lname, email: response.email}));
                    this.props.services.ws.start();
                    this.props.history.push('/');
                    return resolve(response);
                }

                resolve(false);
            });
        });
    }

    logout() {
        this.services.ws.client.emit('D', null);
        return this.sendPost({
                module: 'system',
                api: 'auth',
                act: 'doLogout'
            }
        )
    }

    recover(params) {
        console.log('will call recover api', params);
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
    }

    sendMessage(params) {
        return new Promise((resolve_send, reject_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'auth',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    sendPost(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();

            fetch('/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: uniqueId,
                    module: params.module,
                    api: params.api,
                    act: params.act,
                    payload: params.payload
                })
            })
                .then(response => response.body)
                .then(body => {
                    const reader = body.getReader();

                    return new ReadableStream({
                        start(controller) {
                            return pump();

                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    // When no more data needs to be consumed, close the stream
                                    if (done) {
                                        controller.close();
                                        return;
                                    }

                                    // Enqueue the next data chunk into our target stream
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })
                })
                .then(stream => new Response(stream))
                .then(response => response.json())
                .then((json) => {
                resolve_send(json);
            });
        });
    }

    render() {
        return <ViewAuth control={this.control} {...this.props} />;
    }

}

export default AuthController;

AuthController.defaultProp = {
    color: "rgba(0,0,0,.87)",
};

AuthController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};