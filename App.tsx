
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from './types';
import { sendMessageToGemini } from './services/geminiService';
import MessageBubble from './components/MessageBubble';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Welcome to Sradex Learning AI Assistant! How can I help you today? You can ask me about our founders, courses, or company background.',
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    setInputValue('');

    try {
      const history = state.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await sendMessageToGemini(userMessage.content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        sources: response.sources
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An error occurred. Please try again.'
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Sradex Learning</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              AI Assistant Online
            </p>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {state.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {state.isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <span className="text-sm text-slate-500">Sradex AI is searching and thinking...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            </div>
          )}
          
          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center justify-between">
              <span>{state.error}</span>
              <button 
                onClick={() => setState(p => ({ ...p, error: null }))}
                className="text-red-800 hover:text-red-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 md:p-6">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about Sradex Learning, our founders, or programs..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-slate-800"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || state.isLoading}
            className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-200 ${
              !inputValue.trim() || state.isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="max-w-4xl mx-auto text-center mt-2 text-[10px] text-slate-400">
          This AI uses Google Search to provide accurate information about Sradex Learning Private Limited.
        </p>
      </footer>
    </div>
  );
};

export default App;
