import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import { generate } from 'shortid';

export const WsContext = createContext<any>(null);

//Provider
type WsContextProviderProps = {
  children: any;
  settings: any;
};

//const ioInstance = io('/api/ws', {transports: ["websocket", "polling"], upgrade: true});

const isBrowser = typeof window !== 'undefined';

export const WsContextProvider = ({ children }: WsContextProviderProps) => {
  const socket = useMemo(() => {
    if (isBrowser) {
      const ioSocket = io('/api/ws', {
        transports: ['websocket', 'polling'],
        upgrade: true,
      });
      ioSocket.on('connection', () => {
        console.info('WS Connected');
      });
      return ioSocket;
    }
    return null;
  }, [isBrowser, io]);

  const [callbacks, setCallbacks] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!socket) return;

    socket.on('M', (data: any) => {
      onMessage(data);
    });

    return () => {
      socket.emit('D');
      socket.disconnect();
    };
  }, [socket]);

  const onMessage = (params: any) => {
    try {
      if (callbacks && callbacks.hasOwnProperty(String(params.id))) {
        callbacks[params.id](params.data);
      }
    } catch {
      callbacks[params.id](null);
    }
    delete callbacks[params.id];
    setCallbacks(callbacks);
  };

  const sendMessage = (data: any) => {
    return new Promise((resolve) => {
      const id = generate();
      callbacks[id] = resolve;
      setCallbacks(callbacks);
      const payload = {
        id: id,
        data: data,
      };
      if (socket) {
        socket.emit('M', payload);
      }
    });
  };

  const value = {
    ws: {
      socket,
      sendMessage,
    },
  };

  return <WsContext.Provider value={value}>{children}</WsContext.Provider>;
};

export const useWsContext = () => {
  const context = useContext(WsContext);

  if (!context) {
    return null;
  }

  return context;
};

export default useWsContext;
