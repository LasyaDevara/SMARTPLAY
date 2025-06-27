import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from './UserContext';

// Mock socket connection for study rooms
const createMockSocket = () => {
  let listeners: Record<string, Function[]> = {};
  let roomData: any = null;
  
  return {
    emit: (event: string, data: any) => {
      console.log(`[MOCK SOCKET] Emitting ${event}`, data);
      
      // Simulate server response
      setTimeout(() => {
        if (event === 'create-room') {
          const roomId = data.roomId || uuidv4().substring(0, 6).toUpperCase();
          roomData = {
            id: roomId,
            host: data.user,
            players: [data.user],
            status: 'chatting',
            type: 'study',
            maxPlayers: 6, // Allow more friends in study rooms
          };
          
          if (listeners['room-created']) {
            listeners['room-created'].forEach(callback => callback({ roomId, room: roomData }));
          }
        }
        
        if (event === 'join-room') {
          if (!roomData) {
            roomData = {
              id: data.roomId,
              host: null,
              players: [data.user],
              status: 'chatting',
              type: 'study',
              maxPlayers: 6,
            };
          } else {
            // Check if room is full
            if (roomData.players.length >= 6) {
              if (listeners['room-full']) {
                listeners['room-full'].forEach(callback => callback({ 
                  error: 'Study room is full. Maximum 6 friends allowed.' 
                }));
              }
              return;
            }
            
            // Check if player is already in the room
            const playerExists = roomData.players.some((p: any) => p.id === data.user.id);
            if (!playerExists) {
              roomData.players.push(data.user);
            }
          }
          
          if (listeners['room-joined']) {
            listeners['room-joined'].forEach(callback => callback({ room: roomData }));
          }
          
          if (listeners['player-joined']) {
            listeners['player-joined'].forEach(callback => callback({ 
              player: data.user, 
              room: roomData 
            }));
          }
        }
        
        if (event === 'send-message') {
          if (listeners['new-message']) {
            listeners['new-message'].forEach(callback => 
              callback({ 
                sender: data.user, 
                message: data.message,
                type: data.type || 'text',
                timestamp: Date.now(),
                recipientId: data.recipientId,
                isPrivate: !!data.recipientId,
              })
            );
          }
        }
        
        if (event === 'leave-room') {
          if (roomData) {
            roomData.players = roomData.players.filter((p: any) => p.id !== data.user.id);
            
            // If host leaves, assign new host
            if (roomData.host && roomData.host.id === data.user.id && roomData.players.length > 0) {
              roomData.host = roomData.players[0];
            }
            
            // If no players left, clear room data
            if (roomData.players.length === 0) {
              roomData = null;
            }
            
            if (listeners['player-left']) {
              listeners['player-left'].forEach(callback => 
                callback({ 
                  player: data.user, 
                  room: roomData 
                })
              );
            }
          }
        }
      }, 300); // simulate network delay
    },
    on: (event: string, callback: Function) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },
    off: (event: string, callback: Function) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    },
    disconnect: () => {
      listeners = {};
      console.log('[MOCK SOCKET] Disconnected');
    },
  };
};

// Types
interface Room {
  id: string;
  host: any;
  players: any[];
  status: 'chatting';
  type: 'study';
  maxPlayers: number;
}

interface Message {
  sender: any;
  message: string;
  type: string;
  timestamp: number;
  recipientId?: string;
  isPrivate?: boolean;
}

interface GameContextType {
  socket: any;
  currentRoom: Room | null;
  messages: Message[];
  isConnected: boolean;
  isHost: boolean;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string, type?: string, recipientId?: string) => void;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<any>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize socket connection
  useEffect(() => {
    const newSocket = createMockSocket();
    setSocket(newSocket);
    setIsConnected(true);
    
    return () => {
      newSocket.disconnect();
      setIsConnected(false);
    };
  }, []);
  
  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    const onRoomCreated = (data: any) => {
      setCurrentRoom(data.room);
      setMessages([]); // Clear messages for new room
    };
    
    const onRoomJoined = (data: any) => {
      setCurrentRoom(data.room);
      setMessages([]); // Clear messages for new room
    };
    
    const onRoomFull = (data: any) => {
      alert(data.error);
    };
    
    const onPlayerJoined = (data: any) => {
      setCurrentRoom(data.room);
      // Add welcome message
      setMessages(prev => [...prev, {
        sender: { id: 'system', nickname: 'Study Bot', avatarColor: 'blue', avatarAccessory: 'none' },
        message: `📚 ${data.player.nickname} joined the study room! Welcome to our learning space!`,
        type: 'system',
        timestamp: Date.now()
      }]);
    };
    
    const onPlayerLeft = (data: any) => {
      setCurrentRoom(data.room);
      // Add goodbye message
      setMessages(prev => [...prev, {
        sender: { id: 'system', nickname: 'Study Bot', avatarColor: 'blue', avatarAccessory: 'none' },
        message: `👋 ${data.player.nickname} left the study room. Keep up the great work everyone!`,
        type: 'system',
        timestamp: Date.now()
      }]);
    };
    
    const onNewMessage = (data: any) => {
      // Only add to group messages if it's not a private message
      if (!data.isPrivate) {
        setMessages(prev => [...prev, data]);
      }
    };
    
    socket.on('room-created', onRoomCreated);
    socket.on('room-joined', onRoomJoined);
    socket.on('room-full', onRoomFull);
    socket.on('player-joined', onPlayerJoined);
    socket.on('player-left', onPlayerLeft);
    socket.on('new-message', onNewMessage);
    
    return () => {
      socket.off('room-created', onRoomCreated);
      socket.off('room-joined', onRoomJoined);
      socket.off('room-full', onRoomFull);
      socket.off('player-joined', onPlayerJoined);
      socket.off('player-left', onPlayerLeft);
      socket.off('new-message', onNewMessage);
    };
  }, [socket, currentRoom]);
  
  // Check if current user is the host
  const isHost = user && currentRoom?.host?.id === user.id;
  
  // Create a new study room
  const createRoom = () => {
    if (!socket) return;
    
    const userData = user ? {
      id: user.id,
      nickname: user.nickname,
      avatarColor: user.avatarColor,
      avatarAccessory: user.avatarAccessory
    } : {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      nickname: 'Guest Student',
      avatarColor: 'blue',
      avatarAccessory: 'none'
    };
    
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.emit('create-room', { roomId, user: userData });
  };
  
  // Join an existing study room
  const joinRoom = (roomId: string) => {
    if (!socket) return;
    
    const userData = user ? {
      id: user.id,
      nickname: user.nickname,
      avatarColor: user.avatarColor,
      avatarAccessory: user.avatarAccessory
    } : {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      nickname: 'Guest Student',
      avatarColor: 'blue',
      avatarAccessory: 'none'
    };
    
    socket.emit('join-room', { roomId, user: userData });
  };
  
  // Leave the current room
  const leaveRoom = () => {
    if (!socket || !currentRoom) return;
    
    const userData = user ? {
      id: user.id,
      nickname: user.nickname,
      avatarColor: user.avatarColor,
      avatarAccessory: user.avatarAccessory
    } : {
      id: 'guest',
      nickname: 'Guest Student',
      avatarColor: 'blue',
      avatarAccessory: 'none'
    };
    
    socket.emit('leave-room', { roomId: currentRoom.id, user: userData });
    setCurrentRoom(null);
    setMessages([]);
  };
  
  // Send a message (group or private)
  const sendMessage = (message: string, type: string = 'text', recipientId?: string) => {
    if (!socket || !currentRoom) return;
    
    const userData = user ? {
      id: user.id,
      nickname: user.nickname,
      avatarColor: user.avatarColor,
      avatarAccessory: user.avatarAccessory
    } : {
      id: 'guest',
      nickname: 'Guest Student',
      avatarColor: 'blue',
      avatarAccessory: 'none'
    };
    
    socket.emit('send-message', { 
      roomId: currentRoom.id, 
      user: userData, 
      message, 
      type,
      recipientId 
    });
  };
  
  return (
    <GameContext.Provider
      value={{
        socket,
        currentRoom,
        messages,
        isConnected,
        isHost,
        createRoom,
        joinRoom,
        leaveRoom,
        sendMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};