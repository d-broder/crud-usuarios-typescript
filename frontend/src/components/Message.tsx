import React from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error';
}

const Message: React.FC<Props> = ({ message, type = 'success' }) => (
  <div className={`message ${type}`}>{message}</div>
);

export default Message;
