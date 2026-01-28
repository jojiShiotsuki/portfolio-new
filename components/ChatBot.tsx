import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WORKER_URL = 'https://gemini-proxy.shiotsuji1.workers.dev';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm Joji's assistant. Ask me anything about his work or services." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Try emailing jojishiotsuki0@gmail.com instead!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    zIndex: 1000,
    fontFamily: "'Syne', sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#00F0FF',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0, 240, 255, 0.4)',
    transition: 'all 0.3s ease',
  };

  const chatWindowStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '80px',
    right: '0',
    width: '360px',
    maxWidth: 'calc(100vw - 48px)',
    height: '500px',
    maxHeight: 'calc(100vh - 120px)',
    background: '#0a0a0a',
    border: '1px solid rgba(245, 240, 232, 0.1)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px 20px',
    background: '#141414',
    borderBottom: '1px solid rgba(245, 240, 232, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const messageStyle = (isUser: boolean): React.CSSProperties => ({
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    background: isUser ? '#00F0FF' : '#1a1a1a',
    color: isUser ? '#0a0a0a' : '#f5f0e8',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    fontSize: '14px',
    lineHeight: 1.5,
  });

  const inputContainerStyle: React.CSSProperties = {
    padding: '16px',
    borderTop: '1px solid rgba(245, 240, 232, 0.1)',
    display: 'flex',
    gap: '12px',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: '#141414',
    border: '1px solid rgba(245, 240, 232, 0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f5f0e8',
    fontSize: '14px',
    outline: 'none',
    fontFamily: "'Syne', sans-serif",
  };

  const sendButtonStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    background: '#00F0FF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: isLoading ? 0.5 : 1,
  };

  return (
    <div style={containerStyle} className="chatbot-container">
      {isOpen && (
        <div style={chatWindowStyle}>
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bot size={20} color="#00F0FF" />
              <div>
                <div style={{ fontWeight: 700, color: '#f5f0e8', fontSize: '14px' }}>Chat with Joji's AI</div>
                <div style={{ fontSize: '11px', color: 'rgba(245, 240, 232, 0.5)' }}>Ask me anything</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} color="rgba(245, 240, 232, 0.5)" />
            </button>
          </div>

          <div style={messagesContainerStyle}>
            {messages.map((msg, i) => (
              <div key={i} style={messageStyle(msg.role === 'user')}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={messageStyle(false)}>
                <span style={{ opacity: 0.7 }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={inputContainerStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={inputStyle}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              style={sendButtonStyle}
              disabled={isLoading}
            >
              <Send size={18} color="#0a0a0a" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? <X size={24} color="#0a0a0a" /> : <MessageCircle size={24} color="#0a0a0a" />}
      </button>

      <style>{`
        @media (max-width: 768px) {
          .chatbot-container {
            bottom: 24px !important;
            right: 16px !important;
          }
          .chatbot-container > div:first-child {
            width: calc(100vw - 32px) !important;
            height: 60vh !important;
            max-height: 400px !important;
            bottom: 70px !important;
            right: -8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
