import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function WeatherSkeleton() {
  const { styles } = useTheme();

  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Card Skeleton */}
      <div className={`w-full rounded-3xl p-6 sm:p-8 border ${styles.cardBg}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full space-y-4">
            <div className="h-6 w-48 bg-white/10 rounded-full" />
            <div className="h-10 w-64 bg-white/10 rounded-2xl" />
            <div className="h-20 w-44 bg-white/15 rounded-3xl" />
          </div>
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center" />
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/5" />
          ))}
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className={`w-full rounded-3xl p-6 border ${styles.cardBg}`}>
        <div className="h-6 w-36 bg-white/10 rounded-full mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="w-24 h-36 rounded-2xl bg-white/5 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Weekly Skeleton */}
      <div className={`w-full rounded-3xl p-6 border ${styles.cardBg} space-y-3`}>
        <div className="h-6 w-36 bg-white/10 rounded-full mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
