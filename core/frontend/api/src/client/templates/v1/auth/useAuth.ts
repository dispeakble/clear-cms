import {ILoginCredentials, IRegisterData} from "../types/types";
import useWsContext from "../../../context/SocketContext";

class useAuth {

    static login = async (credentials: ILoginCredentials) => {
        console.log("login function", credentials)
        const {ws} = useWsContext();
        const response = await ws.sendMessage({
            api: "auth",
            act: "login",
            payload: {
                data: credentials
            }
        });
        if(response){
            return{
                data: {
                    user: {

                    },
                    token: ""
                }
            };
        }
        return{
            data: {
                error: "An error has been occurred, please try again."
            }
        };
    }

    static register = async (data: IRegisterData) => {
        return;
    }

    static logout = async () => {
        return;
    }
}

export default useAuth