import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Loader2, Send, Zap } from 'lucide-react';

function CommandBar({ onExecute, onPreview, isProcessing }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced preview
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (input.trim()) {
        onPreview(input);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [input, onPreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;

    // Add to history
    setHistory(prev => [input, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    // Execute command
    onExecute(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    // History navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const examples = [
    'Create a high-priority bug for the login page',
    'Add a feature ticket for dark mode',
    'Move the API task to done',
    'Show all urgent bugs',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-cyber-black via-cyber-black/95 to-transparent"
    >
      <div className="max-w-4xl mx-auto">
        {/* Example Commands */}
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="text-xs px-2 py-1 rounded bg-cyber-dark/50 text-gray-500 hover:text-cyber-cyan hover:bg-cyber-dark border border-transparent hover:border-cyber-cyan/30 transition-all"
            >
              {example}
            </button>
          ))}
        </div>

        {/* Command Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2">
            {/* Terminal Icon */}
            <div className="text-cyber-cyan">
              <Terminal size={20} />
            </div>

            {/* Prompt */}
            <span className="text-cyber-pink font-mono text-sm">{'>'}</span>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command... 'Create a high-priority bug for login page'"
              className="command-input flex-1 px-4 py-3 rounded-lg font-mono text-sm text-white"
              disabled={isProcessing}
              autoComplete="off"
              spellCheck="false"
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="p-3 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 hover:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isProcessing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </motion.button>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan origin-left"
              transition={{ duration: 0.5 }}
            />
          )}
        </form>

        {/* Keyboard Hints */}
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600 font-mono">
          <span><kbd className="px-1 bg-cyber-dark rounded">Enter</kbd> Execute</span>
          <span><kbd className="px-1 bg-cyber-dark rounded">↑↓</kbd> History</span>
          <span><kbd className="px-1 bg-cyber-dark rounded">Esc</kbd> Clear</span>
        </div>
      </div>
    </motion.div>
  );
}

export default CommandBar;
