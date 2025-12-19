
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
            ${isUser 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
            }`}
        >
          {message.content}
        </div>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 justify-start">
            <span className="text-[10px] uppercase font-bold text-slate-400 w-full mb-1">Sources</span>
            {message.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-slate-100 hover:bg-slate-200 text-blue-600 px-2 py-1 rounded border border-slate-200 transition-colors duration-200 max-w-[200px] truncate"
              >
                {source.title}
              </a>
            ))}
          </div>
        )}
        
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
