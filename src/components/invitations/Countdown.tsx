import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-display font-bold mb-4 text-center opacity-90">
        ⏰ Cuenta Regresiva
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Días', value: timeLeft.days },
          { label: 'Horas', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Seg', value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-3xl font-bold mb-1">{String(item.value).padStart(2, '0')}</div>
            <div className="text-xs opacity-80 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};