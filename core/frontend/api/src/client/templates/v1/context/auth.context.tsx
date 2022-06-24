import * as React from "react";

interface IProps{
    userData: any,
    children?: React.ReactNode
}

interface IAuthContext {
    user: any,
    setUser: (u: any) => void
}

const AuthContext = React.createContext<IAuthContext>({
    user: null,
    setUser: () => {}
});

export const AuthProvider = ({ userData , children }: IProps) => {
    const  [user, setUser] = React.useState<any>(userData);

    React.useEffect(() =>{
        console.log("user has been updatedd!", user)
        console.log("user data", userData)
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = () => React.useContext(AuthContext);