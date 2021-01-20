import React, { Component } from "react";
import  { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class AuthGuardService extends Component{

    services;
    methods = [""];
    state = {
        renderState:""
    }

    static get propTypes() {
        return {
            services: PropTypes.any
        };
    }

    componentDidMount() {
        this.services = this.props.services;
        this.services.ws.subscribe({
            channel: 'auth',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });
    }

    onMessage(params) {
        try {
            if(params && params['method'] && this[params['method']]){
                this[params['method']](params.data);
            }
        } catch (err) {
            console.log(err);
        }
        console.log('got message in auth service', params);
    }

    redirect(data){
        if(data && data.location){
            this.setState({
                renderState: <Redirect to={data.location}  />
            })
        }
    }

    render(){
        return this.state.renderState;
    }

}

export default AuthGuardService;