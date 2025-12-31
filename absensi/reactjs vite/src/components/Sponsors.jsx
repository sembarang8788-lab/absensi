import React from 'react';

// Simple auto-scrolling sponsor strip using CSS animation.
const Sponsors = ({ logos = [], direction = 'left' }) => {
  if (!logos.length) return null;

  // Duplicate logos for seamless loop
  const items = [...logos, ...logos];

  return (
    <section className="w-full py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-hidden -mt-2">
          <div
            className={`flex items-center gap-8 marquee ${direction === 'right' ? 'marquee-right' : 'marquee-left'}`}
            style={{
              willChange: 'transform'
            }}
          >
            {items.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-72 h-36 md:h-44 flex items-center justify-center">
                <img src={src} alt={`sponsor-${i}`} className="max-h-32 md:max-h-40 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .marquee-left { animation: sponsorScrollLeft 18s linear infinite; }
        .marquee-right { animation: sponsorScrollRight 18s linear infinite; }
        .marquee-left.paused, .marquee-right.paused { animation-play-state: paused; }

        @keyframes sponsorScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes sponsorScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default Sponsors;
