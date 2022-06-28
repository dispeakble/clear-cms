import {ILoginCredentials} from "../types/types";
import axios from "axios"
import jwtDecode from "jwt-decode";

export default class UseAuth{
    private static useAxios(METHOD: any, endpoint: string, payload?:any, headers?: any){
        return axios({
            method: METHOD,
            url: endpoint,
            data: payload,
            params: METHOD === "GET" ? {...payload} : null,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            }
        }).then(
            (response) => {
                return response
            }
            // eslint-disable-next-line no-console
        ).catch((err) => console.error(err))
    }

    static async useLogin(creds: ILoginCredentials) {
        try{
            return this.useAxios("POST", "/api/auth/login", creds, {})
        } catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    static async useValidateHuman(token: string){
        try{
            return this.useAxios("GET", "/api/auth/recaptcha", {token: token}, {})
        } catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    static async useLogout(access_token: string, refresh_token: string) {
        try {
            const isExpired = (token: string) => {
                const decodedToken: { exp: any } = jwtDecode(token)
                const currentDate = new Date()

                return decodedToken?.exp * 1000 < currentDate.getTime();
            }
            let headers: any = {"Authorization": "Bearer " + access_token};
            let response: any;

            if (isExpired(access_token)) {
                response = await this.useRefreshToken(refresh_token)
                if (response && response?.status === 200 && response.data) {
                    headers = {"Authorization": "Bearer " + response.data.refresh_token}
                    return await this.useAxios("POST", "/api/auth/logout", {}, headers)
                }
                return null;
            }

            return await this.useAxios("POST", "/api/auth/logout", {}, headers)
        }
         catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    static async useRefreshToken(refresh_token: string) {
        try{
            const headers = {"Authorization": "Bearer " + refresh_token}
            const response: any = await this.useAxios("POST", "/api/auth/refresh", {}, headers)
            if(response?.status === 200){
                localStorage.setItem('tokens', JSON.stringify(response.data))
                return await this.useFetchProfile(response.data.access_token)
            }
            return null
        } catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    static async useFetchProfile(access_token: string){
        try{
            const headers = {"Authorization": "Bearer " + access_token}
            return await this.useAxios("GET", "/api/user/profile", {}, headers)
        } catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }
}