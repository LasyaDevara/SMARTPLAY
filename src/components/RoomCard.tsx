import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import Avatar from './Avatar';

interface Player {
  id: string;
  nickname: string;
  avatarColor: string;
  avatarAccessory: string;
}

interface RoomCardProps {
  roomId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'completed';
  isHost: boolean;
  onJoin: () => void;
  onStart?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomId,
  players,
  status,
  isHost,
  onJoin,
  onStart
}) => {
  const maxPlayers = 4;
  
  const getStatusColor = () => {
    switch (status) {
      case 'waiting': return 'bg-accent-100 text-accent-800';
      case 'playing': return 'bg-primary-100 text-primary-800';
      case 'completed': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'waiting': return 'Waiting for Players';
      case 'playing': return 'Game in Progress';
      case 'completed': return 'Game Completed';
      default: return 'Unknown Status';
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Room: {roomId}</h3>
          <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Players ({players.length}/{maxPlayers})
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col items-center">
                <Avatar 
                  color={player.avatarColor as any}
                  accessory={player.avatarAccessory as any}
                  size="sm"
                />
                <span className="text-xs mt-1 max-w-[60px] truncate">
                  {player.nickname}
                  {isHost && player.id === players[0]?.id && ' (Host)'}
                </span>
              </div>
            ))}
            
            {Array.from({ length: maxPlayers - players.length }).map((_, i) => (
              <div key={`empty-${i}`} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-dashed border-gray-300" />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          {status === 'waiting' ? (
            <>
              <Button 
                variant="primary" 
                onClick={onJoin}
                fullWidth={!isHost}
              >
                {players.length > 0 && players[0].id === 'current-user' ? 'Resume' : 'Join Room'}
              </Button>
              
              {isHost && (
                <Button 
                  variant="accent" 
                  onClick={onStart}
                  disabled={players.length < 1}
                  className="ml-2"
                >
                  Start Game
                </Button>
              )}
            </>
          ) : (
            <Button 
              variant={status === 'playing' ? 'secondary' : 'success'} 
              onClick={onJoin}
              fullWidth
            >
              {status === 'playing' ? 'Join Game' : 'View Results'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;