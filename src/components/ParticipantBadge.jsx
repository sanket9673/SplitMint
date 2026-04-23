import React from 'react';

const ParticipantBadge = ({ participant, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  if(!participant) return null;

  const initials = participant.name.substring(0, 2).toUpperCase();

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-medium text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: participant.color }}
      title={participant.name}
    >
      {initials}
    </div>
  );
};

export default ParticipantBadge;
