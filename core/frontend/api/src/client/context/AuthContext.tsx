import * as React from "react";

export type AuthContextType = {
    user: any,
    setUser: (u: any) => void
}

const AuthContext = React.createContext<AuthContextType>({
    user: "",
    setUser: () => {}
});

export const AuthProvider = ({ data , children }: any) => {
    const [user, setUser] = React.useState(data);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = () => React.useContext(AuthContext);