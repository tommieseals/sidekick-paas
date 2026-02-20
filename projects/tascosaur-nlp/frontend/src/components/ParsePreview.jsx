import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Cpu, Clock } from 'lucide-react';

function ParsePreview({ data }) {
  const { input, parsed, error, success, preview } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4"
    >
      <div className={`parse-preview rounded-lg p-4 ${
        error ? 'border-cyber-pink' : 
        success ? 'border-cyber-green' : 
        'border-cyber-cyan/30'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-cyber-cyan" />
            <span className="text-xs font-mono text-gray-400">
              {preview ? 'PARSE PREVIEW' : error ? 'PARSE ERROR' : 'COMMAND EXECUTED'}
            </span>
          </div>
          
          {parsed?.parseTimeMs && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{parsed.parseTimeMs}ms</span>
            </div>
          )}
          
          {!preview && (
            <div className={`flex items-center gap-1 ${success ? 'text-cyber-green' : 'text-cyber-pink'}`}>
              {success ? <Check size={14} /> : <X size={14} />}
              <span className="text-xs">{success ? 'SUCCESS' : 'FAILED'}</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mb-3">
          <span className="text-xs text-gray-500">INPUT:</span>
          <p className="text-sm text-cyber-yellow font-mono">"{input}"</p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-cyber-pink text-sm">
            Error: {error}
          </div>
        )}

        {/* Parsed Result */}
        {parsed && (
          <div className="space-y-2">
            {/* Intent */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-16">INTENT:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                parsed.intent === 'CREATE' ? 'bg-cyber-green/20 text-cyber-green' :
                parsed.intent === 'UPDATE' ? 'bg-cyber-yellow/20 text-cyber-yellow' :
                parsed.intent === 'DELETE' ? 'bg-cyber-pink/20 text-cyber-pink' :
                parsed.intent === 'MOVE' ? 'bg-cyber-purple/20 text-cyber-purple' :
                parsed.intent === 'QUERY' ? 'bg-cyber-cyan/20 text-cyber-cyan' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {parsed.intent}
              </span>
            </div>

            {/* Task Preview */}
            {parsed.task && (
              <div>
                <span className="text-xs text-gray-500">TASK:</span>
                <div className="mt-1 pl-4 border-l-2 border-cyber-cyan/30">
                  <div className="text-sm">
                    <span className="key">title:</span>{' '}
                    <span className="string">"{parsed.task.title}"</span>
                  </div>
                  {parsed.task.priority && (
                    <div className="text-sm">
                      <span className="key">priority:</span>{' '}
                      <span className="value">{parsed.task.priority}</span>
                    </div>
                  )}
                  {parsed.task.tags?.length > 0 && (
                    <div className="text-sm">
                      <span className="key">tags:</span>{' '}
                      <span className="value">[{parsed.task.tags.join(', ')}]</span>
                    </div>
                  )}
                  {parsed.task.assignee && (
                    <div className="text-sm">
                      <span className="key">assignee:</span>{' '}
                      <span className="value">@{parsed.task.assignee}</span>
                    </div>
                  )}
                  {parsed.task.dueDate && (
                    <div className="text-sm">
                      <span className="key">dueDate:</span>{' '}
                      <span className="value">{parsed.task.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Move Preview */}
            {parsed.intent === 'MOVE' && (
              <div>
                <span className="text-xs text-gray-500">MOVE:</span>
                <div className="mt-1 text-sm">
                  <span className="string">"{parsed.target}"</span>
                  <span className="text-gray-500"> → </span>
                  <span className="value">{parsed.destination}</span>
                </div>
              </div>
            )}

            {/* Query Preview */}
            {parsed.filters && Object.keys(parsed.filters).length > 0 && (
              <div>
                <span className="text-xs text-gray-500">FILTERS:</span>
                <div className="mt-1 text-sm">
                  {JSON.stringify(parsed.filters)}
                </div>
              </div>
            )}

            {/* LLM Enhanced Badge */}
            {parsed.llmEnhanced && (
              <div className="mt-2 flex items-center gap-1 text-xs text-cyber-purple">
                <Cpu size={12} />
                <span>Enhanced with Ollama</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ParsePreview;
