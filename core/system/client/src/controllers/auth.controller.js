import React from "react";
import ViewAuth from "templates/ViewAuth/ViewAuth";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import UseAuth from "../auth/auth"
import {useAuthentication} from "../context/auth.context";
import * as md5 from "md5"

const AuthController = (props) => {
    let services = {};
    let messageCallbacks = {};
    let config = {
        prefix: 'system/'
    };

    const control = {
        login: (params) => login(params),
        logout: (params) => logout(params),
        recover: (params) => recover(params),
        reset: (params) => reset(params)
    };

    React.useEffect(() => {
        services = props.services;

        services.ws.subscribe({
            channel: 'auth',
            callbacks: {
                message: (response) => onMessage(response)
            }
        });

        sendMessage({
            module: 'system',
            api: 'resetEmail',
            act: 'ping',
            payload: 'ping'
        }).then((response) => {
            console.log(response);
        });
    }, [])

    const context = useAuthentication()

    async function login(params) {
        try{
            const res = await UseAuth.useLogin({
                ...params,
                password: md5.default(params.password)
            })
            if(res && res?.status === 200){
                await setProfile(res.data)
                return{
                    email: params.email
                };
            }
            return null
        } catch(err){
            console.error(err)
        }
    }

    async function setProfile(tokens){
        localStorage.setItem('tokens', JSON.stringify(tokens))
        await props.history.push('/')
        context.setIsAuthenticated(true)
    }

    async function logout() {
        const tokens = localStorage.getItem('tokens')
        if(tokens && tokens.access_token && tokens.refresh_token){
            await UseAuth.useLogout(tokens.access_token, tokens.refresh_token)
        }
        await props.history.push('/view-auth')
        context.setIsAuthenticated(false)
        localStorage.removeItem('tokens')
    }

    function recover(params) {

        return new Promise((resolve) => {
            sendPost({
                module: 'system',
                api: 'resetEmail',
                act: 'generateRecoverEmail',
                payload: params
            }).then(async (response) => {
                if (response && response.success) {
                    const wsConnected = await props.services.ws.start();
                    if (wsConnected) {
                        props.history.push('/view-auth/recovered');
                        window.location.reload(false);
                    }
                    return resolve(response);
                }
                resolve(false);
            });
        });

    }

    function reset(params) {
       return new Promise((resolve) => {
           sendPost({
               module: 'system',
               api: 'resetEmail',
               act :'doChangePassword',
               payload: params
           }).then(async (response) => {
               if(response && response?.status === 200) {
                   await setProfile(response)
                   const wsConnected = await props.services.ws.start();
                   if (wsConnected) {
                       props.history.push('/');
                   }
                   return resolve({
                       email: params.email
                   });
               }
               resolve(false)
           })
       })
    }

    function onMessage(params) {
        try {
            messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
    }

    function sendMessage(params) {
        return new Promise((resolve_send, reject_send) => {
            const uniqueId = shortId.generate();
            messageCallbacks[uniqueId] = resolve_send;
            services.ws.emit({
                id: uniqueId,
                channel: 'auth',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    function sendPost(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    return (
        <>
            {
                !context.isLoading &&
                <ViewAuth control={control} {...props} />
            }
        </>
    )
}

export default AuthController;

AuthController.defaultProp = {
    color: "rgba(0,0,0,.87)",
};

AuthController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};