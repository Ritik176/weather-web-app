import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorBanner({ message, onRetry, onDismiss }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-4xl mx-auto px-4 mb-4"
    >
      <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 backdrop-blur-md shadow-lg shadow-rose-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-rose-100">
              Notice
            </div>
            <div className="text-xs text-rose-200/80">
              {message}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-100 border border-rose-500/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 text-rose-300/70 hover:text-rose-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
