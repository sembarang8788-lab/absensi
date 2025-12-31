import React from 'react';
import Marquee from 'react-fast-marquee';

const Sponsors = ({ logos = [], direction = 'left', speed = 50 }) => {
  if (!logos.length) return null;

  return (
    <section className="w-full py-2">
      <div className="max-w-7xl mx-auto px-4 -mt-2">
        <Marquee gradient={false} pauseOnHover={true} speed={speed} direction={direction} play={true}>
          {logos.map((src, i) => (
            <div key={i} className="inline-flex items-center justify-center flex-shrink-0 w-64 md:w-72 h-36 md:h-44 px-4">
              <img src={src} alt={`sponsor-${i}`} className="max-h-32 md:max-h-40 object-contain" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Sponsors;
