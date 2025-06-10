# Botly Chatbot Integration Examples

This document shows how to integrate Botly chatbots into your React applications.

## Installation & Setup

1. Ensure your Botly backend is running on `http://localhost:8000`
2. Ensure your Botly frontend is running on `http://localhost:3000`
3. Copy the components from the Botly project to your React app

## Components Available

### 1. BotlyEmbed - Direct Iframe Component

A simple React component that embeds the chatbot as an iframe.

```tsx
import { BotlyEmbed } from './components/BotlyEmbed';

function MyPage() {
  return (
    <div>
      <h1>Welcome to my website</h1>
      <p>Chat with our AI assistant:</p>
      
      <BotlyEmbed 
        chatbotId={1}
        width="100%"
        height="500px"
        baseUrl="http://localhost:3000"
      />
    </div>
  );
}
```

### 2. BotlyWidget - Floating Chat Widget

A floating chat bubble that users can click to open the chatbot.

```tsx
import { BotlyWidget } from './components/BotlyWidget';

function App() {
  return (
    <div>
      {/* Your main content */}
      <h1>My Website</h1>
      <p>Website content here...</p>
      
      {/* Floating chat widget */}
      <BotlyWidget 
        chatbotId={1}
        position="bottom-right"
        primaryColor="#3b82f6"
        size="medium"
        baseUrl="http://localhost:3000"
      />
    </div>
  );
}
```

### 3. Direct HTML Iframe (Non-React)

For non-React websites, use the HTML iframe directly:

```html
<iframe 
  src="http://localhost:3000/embed/1" 
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
</iframe>
```

## Component Props

### BotlyEmbed Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chatbotId` | number | required | ID of the chatbot to embed |
| `width` | string/number | "400px" | Width of the iframe |
| `height` | string/number | "600px" | Height of the iframe |
| `baseUrl` | string | "http://localhost:3000" | Base URL of Botly instance |
| `className` | string | "" | CSS class for styling |
| `style` | React.CSSProperties | {} | Inline styles |

### BotlyWidget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chatbotId` | number | required | ID of the chatbot to embed |
| `baseUrl` | string | "http://localhost:3000" | Base URL of Botly instance |
| `position` | 'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' | "bottom-right" | Position of the widget |
| `primaryColor` | string | "#2563eb" | Primary color for the widget |
| `size` | 'small' \| 'medium' \| 'large' | "medium" | Size of the widget |

## Integration Examples

### E-commerce Website

```tsx
import { BotlyWidget } from './components/BotlyWidget';

function EcommerceApp() {
  return (
    <div>
      {/* Product pages, cart, etc. */}
      <ProductCatalog />
      <ShoppingCart />
      
      {/* Customer support chatbot */}
      <BotlyWidget 
        chatbotId={2} // Customer support bot
        position="bottom-right"
        primaryColor="#16a34a"
        size="large"
      />
    </div>
  );
}
```

### Documentation Site

```tsx
import { BotlyEmbed } from './components/BotlyEmbed';

function DocumentationPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1>API Documentation</h1>
        <Documentation />
      </div>
      
      <div className="lg:col-span-1">
        <h2>Need Help?</h2>
        <BotlyEmbed 
          chatbotId={3} // Documentation assistant
          width="100%"
          height="400px"
          className="border rounded-lg"
        />
      </div>
    </div>
  );
}
```

### Landing Page with Inline Chat

```tsx
import { BotlyEmbed } from './components/BotlyEmbed';

function LandingPage() {
  return (
    <div>
      <header>
        <h1>Welcome to Our Service</h1>
        <p>Get started with our AI assistant</p>
      </header>
      
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Try Our AI Assistant
            </h2>
            <BotlyEmbed 
              chatbotId={1}
              width="100%"
              height="500px"
              style={{
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
```

## Styling and Customization

### Custom CSS for BotlyEmbed

```css
.custom-chatbot-iframe {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-chatbot-iframe:hover {
  border-color: #3b82f6;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

```tsx
<BotlyEmbed 
  chatbotId={1}
  className="custom-chatbot-iframe"
  width="100%"
  height="600px"
/>
```

### Responsive Design

```tsx
function ResponsiveChatbot() {
  return (
    <div className="w-full max-w-md mx-auto lg:max-w-lg">
      <BotlyEmbed 
        chatbotId={1}
        width="100%"
        height="500px"
        style={{
          minHeight: '400px',
          maxHeight: '600px'
        }}
      />
    </div>
  );
}
```

## Production Deployment

When deploying to production, update the `baseUrl` prop:

```tsx
const BOTLY_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-botly-domain.com'
  : 'http://localhost:3000';

<BotlyWidget 
  chatbotId={1}
  baseUrl={BOTLY_BASE_URL}
/>
```

## Security Considerations

1. **CORS**: Ensure your Botly backend allows requests from your website's domain
2. **API Keys**: Never expose OpenAI API keys in client-side code
3. **Rate Limiting**: Implement rate limiting on your backend
4. **Content Security Policy**: Add iframe permissions for your domain

## Troubleshooting

### Common Issues

1. **Iframe not loading**: Check CORS settings and network requests
2. **API errors**: Verify backend is running and accessible
3. **Styling issues**: Check CSS conflicts and z-index values
4. **Mobile responsiveness**: Test widget positioning on mobile devices 