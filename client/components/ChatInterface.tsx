'use client';

import { Send, Bot, User, Minus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
  import { ShoppingCart } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  products?: any[];
  timestamp: Date;
}

interface ChatInterfaceProps {
  onMinimize?: () => void;
  onClose?: () => void;
  onAddToCart: (product: any) => void;
}

export default function ChatInterface({ onMinimize, onClose, onAddToCart }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! 👋 I am your GrabMart AI assistant. What are you looking for today? You can ask me about products, and I\'ll help you find exactly what you need.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.reply || 'I couldn\'t find what you&apos;re looking for. Please try again.',
        products: data.products || [],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/30 shadow-2xl overflow-hidden flex flex-col h-full max-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Shopping Assistant</h3>
            <p className="text-sm text-white/80">Ask me anything about our products</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Minimize chat"
            >
              <Minus size={18} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-background to-muted/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary" />
              </div>
            )}

            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>

              {/* Products Display */}
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.products.map((product, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded border overflow-hidden ${
                        message.type === 'user'
                          ? 'bg-white/20 border-white/30'
                          : 'bg-white border-border'
                      }`}
                    >
                      {/* Product Image */}
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <p className={`text-xs font-semibold ${message.type === 'user' ? 'text-white' : 'text-foreground'}`}>
                        {product.name}
                      </p>
                      <p className={`text-xs ${message.type === 'user' ? 'text-white/80' : 'text-muted-foreground'}`}>
                        ₹{product.price}
                      </p>
                      <button
            onClick={() => onAddToCart(product)}
            disabled={isAdding}
            className="p-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={20} />
            )}
          </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="max-w-xs px-4 py-3 rounded-lg bg-muted text-foreground rounded-bl-none flex gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-border px-6 py-4 bg-white flex gap-3">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-muted/50 placeholder:text-muted-foreground/50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
