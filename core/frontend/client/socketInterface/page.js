import { useEffect, useState } from 'react';
import * as shortId from "shortid";
import { useSelector, useDispatch } from "react-redux";
import { updatePageData } from '../redux/action/page';
import _ from "lodash";

const PageSocketInterface = (props) => {
    const dispatch = useDispatch();
    const channel = "frontend";

    const messageCallbacks = {};

    const wsInstance = useSelector(
        (state) => state.websocket.wsInstance,
    );
    const wsConnected = useSelector(
        (state) => state.websocket.websocketConnected,
    );

    useEffect(() => {
        if (wsConnected) {
            wsSubscribe();
            loadPage();
        }

        // return () => {
        //     dispatch(updatePageData({
        //         pageLink: '',
        //         items: [],
        //         pageConfig: {},
        //         pageId: null
        //     }))
        // }

    }, [wsInstance, wsConnected])

    const wsSubscribe = () => {

        wsInstance.subscribe({
            channel: channel,
            callbacks: {
                message: (response) => onMessage(response)
            }
        });

    }

    const get = async (params) => {
        return new Promise(async resolve => {
            debugger
            try {
                const data = {
                    module: 'frontend',
                    api: 'pages',
                    act: 'get',
                    payload: {
                        where: {

                        }
                    }
                }

                if (params.pagelink) {
                    data.payload.where.pagelink = params.pagelink
                } else {
                    data.payload.where.is_default = 1
                }
                const response = await sendMessage(data);

                const editPage = _.cloneDeep(response);
                response.editPage = editPage
                const page = resolve(response)
                
            } catch (err) {
                resolve(null);
            }
        });
    }


    const onMessage = (params) => {
        debugger
        if (messageCallbacks) {
            try {
                // messageCallbacks[params.id](params.data);
            } catch (err) {
                console.log(err);
            }
        }

        console.log('got message in viewPages.tsx', params);
        dispatch(updatePageData({
            pageLink: props.slug,
            items: params.data?.items,
            pageConfig: params.data?.pageConfig,
            pageId: params.data?.id
        }))
    }

    const sendMessage = (params) => {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            messageCallbacks[uniqueId] = resolve_send;
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



    const loadPage = async () => {
        const pageLink = props.slug;
        debugger
        const page = await get({
            pagelink: pageLink
        })



    }

    return props.children();
}

export default PageSocketInterface;