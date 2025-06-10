'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Bot, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getChatbot, queryChatbot } from '@/lib/api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotData {
  id: number;
  name: string;
  status: string;
}

export default function ChatWidget() {
  const params = useParams();
  const chatbotId = parseInt(params.id as string);
  
  const [isOpen, setIsOpen] = useState(false);
  const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatbot();
  }, [chatbotId]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const loadChatbot = async () => {
    try {
      setIsInitializing(true);
      const chatbotData = await getChatbot(chatbotId);
      setChatbot(chatbotData);
    } catch (error) {
      console.error('Error loading chatbot:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    if (!isOpen && messages.length === 0 && chatbot) {
      // Add welcome message when opening for the first time
      setMessages([{
        id: '1',
        type: 'bot',
        content: `Hello! I'm ${chatbot.name}. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !chatbot) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryChatbot(1, chatbotId, userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error querying chatbot:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 2147483647,
        pointerEvents: 'auto'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <Loader2 color="white" size={24} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 2147483647, // Maximum z-index to ensure it's always on top
      fontFamily: 'system-ui, -apple-system, sans-serif',
      pointerEvents: 'auto' // Allow interaction only with the widget
    }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          marginBottom: '10px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  {chatbot?.name || 'Botly Assistant'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  ...(message.type === 'user' ? {
                    backgroundColor: '#3b82f6',
                    color: 'white'
                  } : {
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  })
                }}>
                  {message.type === 'bot' && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      marginBottom: '4px' 
                    }}>
                      <Bot size={14} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>
                        {chatbot?.name}
                      </span>
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    opacity: 0.7
                  }}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  maxWidth: '80%'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <Bot size={14} style={{ color: '#3b82f6' }} />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite'
                      }}></div>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite 0.2s'
                      }}></div>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite 0.4s'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={{
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '44px',
                  opacity: isLoading || !inputValue.trim() ? 0.5 : 1
                }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }}
      >
        {isOpen ? (
          <X color="white" size={24} />
        ) : (
          <>
            <MessageCircle color="white" size={24} />
            {/* Botly Logo/Badge */}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#3b82f6',
              border: '2px solid #3b82f6'
            }}>
              B
            </div>
          </>
        )}
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
} 