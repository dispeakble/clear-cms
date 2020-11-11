import React, {Component} from "react";
import ViewAuth from "templates/ViewAuth/ViewAuth";

class AuthController extends Component {

    services = {};

    async componentDidMount() {

        this.services = this.props.services;

        this.services.ws.subscribe({
            channel: 'auth',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

        this.services.ws.emit({
            channel:'auth',
            data:'ping'
        });

    }

    onMessage(params){
        console.log('got message in auth controller', params);
    }

    render(){
        return <ViewAuth {...this.props} />;
    }

}

export default AuthController;