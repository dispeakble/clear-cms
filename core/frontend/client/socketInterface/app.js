import  { useEffect, useState } from 'react';
import WsService from "../src/services/ws.service";
import * as shortId from "shortid";
import { useSelector, useDispatch } from "react-redux";
import { websocketSuccess } from '../redux/action/websocket';

const AppSocketInterface = (props) => {
    
    const channel = 'app';

    const dispatch = useDispatch();

    const [defaultPalette, setDefaultPalette] = useState({});

    const [wsInstance, setWsInstance] = useState(null);

    const wsConnected = useSelector(
        (state) => state.websocket.websocketConnected,
    );


    const messageCallbacks = {};

    useEffect(() => {
        const instance = new WsService();
        setWsInstance(instance)
    }, [])

    useEffect(() => {
        if (wsInstance) {
            wsInstance.start().then((connected) => {
                dispatch(websocketSuccess(wsInstance));
            });
        }

    }, [wsInstance])

    useEffect(() => {
        if (wsInstance) {
            wsSubscribe();
            getTheme();
        }


    }, [wsConnected])

    const wsSubscribe = () => {
        if (wsConnected) {
            wsInstance.subscribe({
                channel: channel,
                callbacks: {
                    message: (response) => onMessage(response)
                }
            });

        }
    }

    const onMessage = (params) => {
        if (messageCallbacks) {
            try {
                messageCallbacks[params.id](params.data);
            } catch (err) {
                console.log(err);
            }
        }

        console.log('got message in socketInterface/app.js', params);
    }

    const sendMessage = async (params) => {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            messageCallbacks[uniqueId] = resolve_send
            wsInstance.emit({
                id: uniqueId,
                channel: channel,
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    const getTheme = async () => {
        const response = await sendMessage({
            module: 'frontend',
            api: 'publicThemes',
            act: 'getOne',
            payload: {
                where: {
                    isdefault: 1
                }
            }
        })
        if (response && response.data && response.data.length) {
            setDefaultPalette(JSON.parse(response.data))
            localStorage.setItem('publicThemes', response.data)
        }
    }
    return (
        props.children()
    )
}

export default AppSocketInterface;