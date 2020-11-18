import React, {Component} from "react";
import ViewAuth from "templates/ViewAuth/ViewAuth";
import * as shortId from "shortid";

class AuthController extends Component {

    services = {};
    messageCallbacks = {};
    config = {
        prefix: 'system/'
    };
    control={
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
            api:'auth',
            act:'ping',
            payload:'hi there'
        }).then((response) => {
            console.log(response);
        })

    }

    async login(params){
        const response = await this.sendMessage({
            module:'system',
            api:'auth',
            act:'doLogin',
            payload:params
        });

        if(response && response.length){
            //TODO set session
            //TODO set cookie with name, email, full name
            this.props.history.push('/');
            return response[0];
        }

        return false;

    }

    logout(params){
        console.log('will call logout api', params);
    }

    recover(params){
        console.log('will call recover api', params);
    }

    onMessage(params){
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in auth controller', params);
    }

    sendMessage(params){
        return new Promise((resolve_send, reject_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel:'auth',
                module:params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    render(){
        return <ViewAuth control={this.control} {...this.props} />;
    }

}

export default AuthController;