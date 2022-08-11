import React from "react";
import PropTypes from "prop-types";
import ViewAdminProfile from "../templates/ViewAdminProfile/ViewAdminProfile";
import Snackbar from "components/Snackbar/Snackbar.js";
import {useAuthentication} from "../context/auth.context";
import jwtDecode from "jwt-decode";
import UseAuth from "../auth/auth";
import * as md5 from "md5"

const AdminProfileController = (props) => {
    const context = useAuthentication();
    const [errorNotification, setErrorNotification] = React.useState([])
    const control = {
        get: () => getData(),
        set: (params) => setData(params),
    };


    async function getData() {
        return context.user
    }

    async function checkTokens() {
        try{
            const getTokens = localStorage.getItem('tokens')
            const tokens = JSON.parse(getTokens)

            const isExpired = (token) => {
                const decodedToken = jwtDecode(token)
                const currentDate = new Date()

                return decodedToken?.exp * 1000 < currentDate.getTime();
            }

            let response;

            if(tokens) {
                if (isExpired(tokens['access_token'])) {
                    response = await UseAuth.useRefreshToken(tokens['refresh_token'])
                    if(response && response?.status === 200){
                        return JSON.parse(localStorage.getItem('tokens'))['access_token']
                    }
                }
            }

            return tokens['access_token']
        } catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    function refreshPage() {
        window.location.reload(false);
    }

    async function compareOldPassword(token, password) {
        try{
            return await UseAuth.useCheckPassword(token, password)
        } catch(err){
            console.error(err)
        }
    }


    async function setData(values) {
        try {
            const token = await checkTokens()
            if (token) {
                if(values.password) {
                    values.password = md5.default(values.password)
                    const res = await compareOldPassword(token, values.password)
                    if(!res.data.isMatch){
                        updateErrorNotification("Current password mismatch, please try again with your current password!")
                        return;
                    }
                }
                await UseAuth.updateUser(token, values)
                return refreshPage()
            }

            updateErrorNotification('Your session has expired. You will be redirected to login page.')
            setTimeout(async() => {
                context.setIsAuthenticated(false)
                localStorage.removeItem('tokens')
                await props.history.push('/view-auth')
            }, 3000)
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    function updateErrorNotification (errMsg) {
        setErrorNotification(prev => [...prev, errMsg])
    }

    function removeErrorNotification (errMsg) {
        setErrorNotification(prev => prev.filter(msg => msg !== errMsg))
    }
    return (
        <>
            {
                errorNotification.map((msg, index) => {
                    return (
                        <Snackbar
                            key={index}
                            place='tc'
                            message={msg}
                            open
                            close
                            closeNotification={() => {removeErrorNotification(msg)}}
                            color='warning'
                        />

                    )
                })
            }
            {
                !context.isLoading &&
                    <ViewAdminProfile control={control} {...props} />
            }
        </>
    );

}

export default AdminProfileController;

AdminProfileController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};