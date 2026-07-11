'use client'

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface KBData {
  products: any[];
  aboutContent: any;
}

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-brand-text">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-brand-text/90">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        let cleanLine = line.trim();

        if (cleanLine.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-oswald uppercase tracking-wider font-bold text-brand-accent mt-3 mb-1 text-sm">
              {parseInline(cleanLine.substring(4))}
            </h4>
          );
        }
        if (cleanLine.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-oswald uppercase tracking-wider font-bold text-brand-accent mt-4 mb-2 text-base">
              {parseInline(cleanLine.substring(3))}
            </h3>
          );
        }
        if (cleanLine.startsWith('# ')) {
          return (
            <h2 key={idx} className="font-oswald uppercase tracking-wider font-bold text-brand-accent mt-5 mb-2 text-lg">
              {parseInline(cleanLine.substring(2))}
            </h2>
          );
        }

        if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
          return (
            <ul key={idx} className="list-disc list-inside ml-2 my-1">
              <li className="text-sm">{parseInline(cleanLine.substring(2))}</li>
            </ul>
          );
        }

        if (cleanLine === '') {
          return <div key={idx} className="h-2" />;
        }

        return (
          <p key={idx} className="text-sm leading-relaxed mb-1">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [localKB, setLocalKB] = useState<KBData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastQueryRef = useRef('');

  // Fetch the daily cached knowledge base on load
  useEffect(() => {
    fetch('/api/kb')
      .then(res => res.json())
      .then(data => setLocalKB(data))
      .catch(e => console.error("Error loading local knowledge base:", e));
  }, []);

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  };

  // Standard fallback logic using the local knowledge base data
  const handleFallbackResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    
    // Fallback for Product - triggers the grid component via [PRODUCTS_GRID] token
    if (query.includes('product') || query.includes('item') || query.includes('catalog') || query.includes('panel') || query.includes('box')) {
      return `Here is our product catalog:\n[PRODUCTS_GRID]`;
    }
    
    // Fallback for Contact Info
    if (query.includes('contact') || query.includes('address') || query.includes('phone') || query.includes('email') || query.includes('location') || query.includes('call') || query.includes('reach') || query.includes('map')) {
      return `Here are LOHANRAJO Metal Arts contact details:\n\n- **Primary Facility:** Plot No. 213, 214 & 215, 3rd Main Road, Burma Colony, Perungudi, OMR, Chennai - 600096, Tamil Nadu, India\n- **Phone:** +91 44 2496 2590, +91 44 2496 2591\n- **Email:** info@lohanrajo.com`;
    }
    
    // Fallback for About
    if (query.includes('about') || query.includes('company') || query.includes('founder') || query.includes('vision') || query.includes('history') || query.includes('establish') || query.includes('infrastructure')) {
      const about = localKB?.aboutContent;
      return `**LOHANRAJO Metal Arts**\n\n- **Established:** ${about?.establishedText || 'Established in 1992'}\n- **Founder/Management:** ${about?.founderNames || 'MR.L.L.BASKAR & L.L.SEKAR'}\n- **Vision:** ${about?.visionContent || 'To deliver precision-engineered sheet metal components with absolute quality.'}\n- **Infrastructure:** ${about?.infrastructureContent || 'Equipped with CNC Laser Cutting, CNC Turret Punching, CNC Bending, and complete welding/powder coating facilities.'}`;
    }
    
    return `I am currently having connection issues reaching the AI server. However, I can help you with details from our local knowledge base!\n\n- Ask me about **products** to see our catalog.\n- Ask me about **contact details** to see our address and phone numbers.\n- Ask me about the **company** to learn about LOHANRAJO.`;
  };

  // Re-enabled streaming mode via Vercel AI SDK useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.warn("AI stream failed. Activating local knowledge base fallback:", error);
      
      const queryText = lastQueryRef.current || input;
      const fallbackReply = handleFallbackResponse(queryText);

      // Instantly inject the local knowledge base answer instead of leaving the chat empty
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: fallbackReply
        }
      ]);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Render a visual grid of product cards with images, name, category, and description
  const renderProductGrid = () => {
    if (!localKB || !localKB.products || localKB.products.length === 0) {
      return (
        <div className="text-xs text-brand-muted/70 italic mt-2 select-none">
          Loading product catalog from knowledge base...
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-2 mt-3 max-w-full">
        {localKB.products.map((p) => {
          const mainImage = p.images && p.images[0] ? p.images[0] : null;
          return (
            <div key={p.id} className="bg-brand-white/5 border border-brand-border p-2 rounded-sm flex flex-col gap-1.5 shadow-sm">
              <Link 
                href={`/products/${p.id}`}
                className="relative w-full h-20 bg-brand-dark flex items-center justify-center overflow-hidden border border-brand-border rounded-sm hover:opacity-80 transition-opacity block cursor-pointer"
              >
                {mainImage ? (
                  <img src={mainImage} alt={p.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-brand-muted/20 text-[9px] uppercase font-oswald font-bold select-none">LOHANRAJO</div>
                )}
              </Link>
              <div className="overflow-hidden">
                <div className="text-[8px] uppercase tracking-widest text-brand-accent font-oswald font-semibold truncate">
                  {p.category?.name || 'Metal Component'}
                </div>
                <Link 
                  href={`/products/${p.id}`} 
                  className="font-oswald uppercase text-[11px] text-brand-text hover:text-brand-accent transition-colors truncate font-bold mt-0.5 leading-none block cursor-pointer"
                >
                  {p.name}
                </Link>
                <div className="text-[9px] text-brand-muted/70 leading-normal line-clamp-2 mt-1">
                  {stripHtml(p.description)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-brand-accent text-white rounded-full shadow-lg hover:shadow-brand-accent/20 hover:-translate-y-1 transition-all z-50 flex items-center justify-center"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[400px] h-[500px] max-h-[calc(100vh-120px)] bg-brand-panel border border-brand-border shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-accent/10 border-b border-brand-accent/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-oswald text-brand-text font-bold uppercase tracking-wider">Lohanrajo Assistant</h3>
                  <p className="text-xs text-brand-muted/60">Ask about products & contact</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-brand-muted/60 hover:text-brand-text transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages - added data-lenis-prevent to solve the scrolling issue inside scroll-jacked layouts */}
            <div 
              data-lenis-prevent 
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 mt-6">
                  <div className="text-center text-brand-muted/40 text-sm font-oswald uppercase tracking-widest">
                    How can I help you today?
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-[280px]">
                    <button
                      type="button"
                      onClick={() => {
                        lastQueryRef.current = 'Products';
                        append({ role: 'user', content: 'Products' });
                      }}
                      className="px-4 py-3 bg-brand-white/5 border border-brand-border text-brand-text hover:bg-brand-accent hover:text-white transition-all text-xs font-oswald uppercase tracking-wider text-left rounded-sm flex items-center justify-between cursor-pointer"
                    >
                      <span>📦 View Products</span>
                      <span className="text-[10px] opacity-60">→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        lastQueryRef.current = 'Contact Info';
                        append({ role: 'user', content: 'Contact Info' });
                      }}
                      className="px-4 py-3 bg-brand-white/5 border border-brand-border text-brand-text hover:bg-brand-accent hover:text-white transition-all text-xs font-oswald uppercase tracking-wider text-left rounded-sm flex items-center justify-between cursor-pointer"
                    >
                      <span>📞 Contact Info</span>
                      <span className="text-[10px] opacity-60">→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        lastQueryRef.current = 'About Company';
                        append({ role: 'user', content: 'About Company' });
                      }}
                      className="px-4 py-3 bg-brand-white/5 border border-brand-border text-brand-text hover:bg-brand-accent hover:text-white transition-all text-xs font-oswald uppercase tracking-wider text-left rounded-sm flex items-center justify-between cursor-pointer"
                    >
                      <span>🏢 About Company</span>
                      <span className="text-[10px] opacity-60">→</span>
                    </button>
                  </div>
                </div>
              )}
              {messages.map(m => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} className="text-brand-accent" />
                    </div>
                  )}
                  <div className={`p-3 max-w-[80%] ${m.role === 'user' ? 'bg-brand-accent text-white' : 'bg-brand-white/5 border border-brand-border text-brand-text'} text-sm leading-relaxed rounded-sm`}>
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <>
                        {renderMarkdown(m.content.replace('[PRODUCTS_GRID]', ''))}
                        {m.content.includes('[PRODUCTS_GRID]') && renderProductGrid()}
                      </>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-brand-text flex items-center justify-center shrink-0 mt-1">
                      <User size={14} className="text-brand-panel" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex gap-3 justify-start">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <Loader2 size={14} className="text-brand-accent animate-spin" />
                    </div>
                    <div className="p-3 bg-brand-white/5 border border-brand-border text-brand-muted/40 text-sm rounded-sm flex gap-1 items-center">
                       Thinking<span className="animate-pulse">...</span>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Default Followup Buttons - Rendered at the bottom when there is chat history */}
            {messages.length > 0 && !isLoading && (
              <div className="flex gap-2 justify-end px-4 py-2 border-t border-brand-border/60 bg-brand-panel/30">
                <button
                  type="button"
                  onClick={() => {
                    lastQueryRef.current = 'Products';
                    append({ role: 'user', content: 'Products' });
                  }}
                  className="px-2.5 py-1.5 bg-brand-white/5 border border-brand-border text-brand-text hover:bg-brand-accent hover:text-white transition-all text-[10px] font-oswald uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer select-none"
                >
                  <span>📦 Products</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    lastQueryRef.current = 'About Company';
                    append({ role: 'user', content: 'About Company' });
                  }}
                  className="px-2.5 py-1.5 bg-brand-white/5 border border-brand-border text-brand-text hover:bg-brand-accent hover:text-white transition-all text-[10px] font-oswald uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer select-none"
                >
                  <span>🏢 About</span>
                </button>
              </div>
            )}

            {/* Input */}
            <form 
              onSubmit={(e) => {
                lastQueryRef.current = input;
                handleSubmit(e);
              }} 
              className="p-4 border-t border-brand-border bg-brand-panel/50"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="w-full bg-brand-white/5 border border-brand-border px-4 py-3 pr-12 text-brand-text focus:outline-none focus:border-brand-accent transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 text-brand-accent hover:text-white hover:bg-brand-accent transition-colors rounded-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-accent"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
