'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface BotlyWidgetProps {
  chatbotId: number;
  baseUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * BotlyWidget - A floating chat widget for embedding Botly chatbots
 * 
 * @param chatbotId - The ID of the chatbot to embed
 * @param baseUrl - Base URL of your Botly instance (default: "http://localhost:3000")
 * @param position - Position of the widget (default: "bottom-right")
 * @param primaryColor - Primary color for the widget (default: "#2563eb")
 * @param size - Size of the widget (default: "medium")
 */
export const BotlyWidget: React.FC<BotlyWidgetProps> = ({
  chatbotId,
  baseUrl = "http://localhost:3000",
  position = "bottom-right",
  primaryColor = "#2563eb",
  size = "medium"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeConfig = {
    small: { width: 300, height: 400, buttonSize: 50 },
    medium: { width: 400, height: 500, buttonSize: 60 },
    large: { width: 500, height: 600, buttonSize: 70 }
  };

  const config = sizeConfig[size];

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    switch (position) {
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      default:
        return { ...base, bottom: '20px', right: '20px' };
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={getPositionStyles()}>
      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: config.width,
            height: config.height,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            marginBottom: '10px',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <iframe
            src={`${baseUrl}/embed/${chatbotId}`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title={`Botly Chatbot ${chatbotId}`}
            allow="microphone; camera"
          />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        style={{
          width: config.buttonSize,
          height: config.buttonSize,
          borderRadius: '50%',
          backgroundColor: primaryColor,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isOpen ? 'rotate(180deg) scale(1)' : 'rotate(0deg) scale(1)';
        }}
      >
        {isOpen ? (
          <X color="white" size={config.buttonSize * 0.4} />
        ) : (
          <MessageCircle color="white" size={config.buttonSize * 0.4} />
        )}
      </button>

      {/* CSS Animation */}
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
      `}</style>
    </div>
  );
};

export default BotlyWidget; 