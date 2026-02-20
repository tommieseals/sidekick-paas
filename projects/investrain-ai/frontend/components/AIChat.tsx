'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface AIChatProps {
  suggestedQuestions: string[];
  portfolioValue: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AIChat({ suggestedQuestions, portfolioValue }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    fetch(`${API_URL}/api/chat/history`)
      .then((res) => res.json())
      .then((history) => {
        if (history.length > 0) {
          setMessages(history.map((m: any) => ({
            role: m.role,
            content: m.content,
            timestamp: m.createdAt,
          })));
        }
      })
      .catch(console.error);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text.trim() }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not process that question.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your question. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${API_URL}/api/chat/clear`, { method: 'POST' });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="bg-finance-card rounded-2xl p-6 card-glow border border-finance-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-finance-purple/20 rounded-xl">
            <Bot className="w-6 h-6 text-finance-purple" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Financial Analyst</h3>
            <p className="text-gray-500 text-sm">Ask anything about your portfolio</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="p-2 text-gray-500 hover:text-finance-red hover:bg-finance-dark/50 rounded-lg transition"
            title="Clear chat history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 text-sm bg-finance-dark/50 hover:bg-finance-blue/20 border border-finance-border hover:border-finance-blue/50 rounded-full transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-[300px] overflow-y-auto mb-4 space-y-4 pr-2">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-finance-purple/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-finance-purple" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-finance-blue text-white'
                    : 'bg-finance-dark/50 border border-finance-border'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-finance-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-finance-blue" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-finance-purple/20 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-finance-purple" />
            </div>
            <div className="bg-finance-dark/50 border border-finance-border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-finance-purple" />
                <span className="text-sm text-gray-400">Analyzing portfolio...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your portfolio..."
          className="flex-1 bg-finance-dark border border-finance-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-finance-blue transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-3 bg-finance-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
