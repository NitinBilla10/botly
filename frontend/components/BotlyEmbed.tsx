import React from 'react';

interface BotlyEmbedProps {
  chatbotId: number;
  width?: string | number;
  height?: string | number;
  baseUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BotlyEmbed - A React component for embedding Botly chatbots
 * 
 * @param chatbotId - The ID of the chatbot to embed
 * @param width - Width of the iframe (default: "400px")
 * @param height - Height of the iframe (default: "600px")
 * @param baseUrl - Base URL of your Botly instance (default: "http://localhost:3000")
 * @param className - CSS class name for the iframe
 * @param style - Inline styles for the iframe
 */
export const BotlyEmbed: React.FC<BotlyEmbedProps> = ({
  chatbotId,
  width = "400px",
  height = "600px",
  baseUrl = "http://localhost:3000",
  className = "",
  style = {}
}) => {
  const defaultStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    ...style
  };

  return (
    <iframe
      src={`${baseUrl}/embed/${chatbotId}`}
      width={width}
      height={height}
      className={className}
      style={defaultStyle}
      title={`Botly Chatbot ${chatbotId}`}
      allow="microphone; camera"
    />
  );
};

export default BotlyEmbed; 