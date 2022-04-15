import * as React from "react";
import { createContext, useContext, useState } from "react";

export const AppContext = createContext<any>(null);

//Provider
type AppContextProviderProps = {
  children: any;
  settings: any
}
export const AppContextProvider = (props: AppContextProviderProps) => {
  const [settings, setSettings] = useState({});

  React.useEffect(() => {
    setSettings(props.settings)
  }, []);

  const values = React.useMemo(() => ({
      settings, setSettings
    }),
  [settings]);

  return <AppContext.Provider value={values}>{props.children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  if(!context){
    return null;
  }

  return context;
}

export default useAppContext;