import React, { useEffect, useRef, useState } from 'react';

const Carousel = ({ slides = [], interval = 3000 }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!slides.length) return;
    startTimer();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, interval]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const goTo = (i) => setIndex((i + slides.length) % slides.length);

  if (!slides.length) return null;

  return (
    <section className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-lg shadow-lg"
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
      >
        <div
          className="flex w-full transition-transform duration-700"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="min-w-full flex-shrink-0 h-56 md:h-80 bg-center bg-cover" style={{ backgroundImage: `url(${s})` }} />
          ))}
        </div>

        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="bg-white/80 text-slate-700 p-2 rounded-full shadow hover:bg-white"
            aria-label="Previous"
          >
            ‹
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="bg-white/80 text-slate-700 p-2 rounded-full shadow hover:bg-white"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
