import * as React from "react";

interface IProps{
    userData: any,
    children?: React.ReactNode
}

interface IAuthContext {
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
}

const AuthContext = React.createContext<IAuthContext>({
    user: null,
    setUser: () => {}
});

export const AuthProvider = ({ userData , children }: IProps) => {
    const  [user, setUser] = React.useState<any>(userData);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = () => React.useContext(AuthContext);