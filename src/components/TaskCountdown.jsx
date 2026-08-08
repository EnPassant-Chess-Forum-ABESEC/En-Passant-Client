import React, { useState, useEffect } from 'react';
import Counter from './Counter';

export default function TaskCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    const date = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = date - now;

      if (distance <= 0) {
        clearInterval(interval);
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired) {
    return <div className="text-[#ff3333] font-bold uppercase tracking-widest text-sm text-center">Revealing Soon...</div>;
  }

  const renderCounterBlock = (value, label) => (
    <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-xl px-4 py-4 min-w-[80px]">
      <div className="flex items-center text-white font-bold font-mono">
        <Counter value={Math.floor(value / 10)} fontSize={36} padding={0} />
        <Counter value={value % 10} fontSize={36} padding={0} />
      </div>
      <span className="text-[10px] text-white/50 tracking-widest uppercase mt-2">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-3">
      {timeLeft.days > 0 && (
        <>
          {renderCounterBlock(timeLeft.days, "Days")}
          <span className="text-white/20 font-bold mb-3">:</span>
        </>
      )}
      {renderCounterBlock(timeLeft.hours, "Hrs")}
      <span className="text-white/20 font-bold mb-3">:</span>
      {renderCounterBlock(timeLeft.minutes, "Min")}
      <span className="text-white/20 font-bold mb-3">:</span>
      {renderCounterBlock(timeLeft.seconds, "Sec")}
    </div>
  );
}
