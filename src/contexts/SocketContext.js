import React, {createContext, useContext, useEffect, useState} from 'react';
import {initializeSocket, disconnectSocket} from '../services/messageService';
import {AuthContext} from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const {authState} = useContext(AuthContext);

  useEffect(() => {
    if (authState && authState.token) {
      // Initialize socket connection when user is authenticated
      const socketInstance = initializeSocket(authState.token);

      // Set up event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', error => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(socketInstance);

      // Clean up on unmount
      return () => {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Disconnect socket when user logs out
      if (socket) {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [authState]);

  return (
    <SocketContext.Provider value={{socket, isConnected}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
