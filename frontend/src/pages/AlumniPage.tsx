import React, { useState, useRef } from 'react';
import { Alumni } from '../types';

const alumniData: Alumni[] = [
  { id: 1, name: 'Dr. Sneha Rao', batch: '2005', profession: 'Cardiologist, Apollo Hospitals', location: 'Chennai', message: 'Vidya Bharati gave me the discipline and determination to pursue medicine. Forever grateful for the foundation.', photo: 'SR' },
  { id: 2, name: 'Amit Kulkarni', batch: '2003', profession: 'Software Architect, Google', location: 'San Francisco, USA', message: 'The problem-solving mindset I developed here has been the cornerstone of my career in technology.', photo: 'AK' },
  { id: 3, name: 'Priya Menon', batch: '2008', profession: 'IAS Officer', location: 'New Delhi', message: 'The values and ethics instilled during my school years continue to guide my service to the nation.', photo: 'PM' },
  { id: 4, name: 'Vikram Joshi', batch: '2006', profession: 'Founder & CEO, EduTech Solutions', location: 'Bangalore', message: 'From school science projects to running a startup — the entrepreneurial spirit was nurtured right here.', photo: 'VJ' },
  { id: 5, name: 'Anita Deshmukh', batch: '2010', profession: 'Research Scientist, ISRO', location: 'Hyderabad', message: 'The curiosity that my teachers sparked in me has taken me all the way to space research.', photo: 'AD' },
  { id: 6, name: 'Rahul Verma', batch: '2007', profession: 'Chartered Accountant', location: 'Mumbai', message: 'The school\'s emphasis on excellence and integrity shaped my approach to professional life.', photo: 'RV' },
  { id: 7, name: 'Kavitha Nair', batch: '2004', profession: 'Professor, IIT Madras', location: 'Chennai', message: 'My love for mathematics began in the classrooms of Vidya Bharati. Best years of my life.', photo: 'KN' },
  { id: 8, name: 'Siddharth Patel', batch: '2009', profession: 'Documentary Filmmaker', location: 'London, UK', message: 'The cultural activities and creative freedom at school ignited my passion for visual storytelling.', photo: 'SP' },
];

const colorPalette = [
  'from-navy-700 to-navy-900',
  'from-primary-600 to-primary-800',
  'from-emerald-600 to-emerald-800',
  'from-blue-600 to-blue-800',
  'from-violet-600 to-violet-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800',
  'from-teal-600 to-teal-800',
];

const AlumniCard: React.FC<{ alumni: Alumni; index: number }> = ({ alumni, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer [perspective:1000px] w-full"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full aspect-[3/4] transition-transform duration-600 [transform-style:preserve-3d]
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ transitionDuration: '600ms' }}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-lg">
          <div className={`w-full h-full bg-gradient-to-br ${colorPalette[index % colorPalette.length]}
                         flex flex-col items-center justify-center p-6 relative`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full border border-white/30" />
              <div className="absolute bottom-8 left-6 w-12 h-12 rounded-full border border-white/20" />
            </div>
            <div className="w-24 h-24 rounded-full bg-white/20 border-3 border-white/40
                          flex items-center justify-center mb-5 backdrop-blur-sm">
              <span className="text-3xl font-display font-bold text-white">{alumni.photo}</span>
            </div>
            <h3 className="text-lg font-display font-bold text-white text-center">{alumni.name}</h3>
            <p className="text-white/70 font-body text-sm mt-1">Batch of {alumni.batch}</p>
            <div className="mt-4 px-3 py-1 bg-white/10 rounded-full">
              <p className="text-white/80 font-body text-xs">Tap to know more</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full h-full bg-white border-2 border-navy-100 flex flex-col justify-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-lg font-display font-bold text-primary-600">{alumni.photo}</span>
            </div>
            <h3 className="text-lg font-display font-bold text-navy-900 text-center mb-1">{alumni.name}</h3>
            <p className="text-primary-600 font-body text-xs text-center font-semibold mb-3">Batch of {alumni.batch}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-navy-400 flex-shrink-0 mt-0.5">💼</span>
                <span className="text-navy-700 font-body">{alumni.profession}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-navy-400 flex-shrink-0 mt-0.5">📍</span>
                <span className="text-navy-700 font-body">{alumni.location}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-navy-100">
              <p className="text-navy-500 font-body text-xs italic leading-relaxed">"{alumni.message}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlumniPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const scrollMobile = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.max(0, mobileIndex - 1)
      : Math.min(alumniData.length - 1, mobileIndex + 1);
    setMobileIndex(newIndex);
    
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/3 w-64 h-64 rounded-full bg-primary-500 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block px-4 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-body font-semibold mb-4">
            Our Pride
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Distinguished Alumni</h1>
          <p className="text-navy-300 text-lg font-body max-w-2xl">
            Our graduates are making their mark across the globe. Click on any card to learn more about their journey.
          </p>
        </div>
      </section>

      {/* Desktop Grid View */}
      <section className="py-20 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-6">
            {alumniData.map((alumni, i) => (
              <AlumniCard key={alumni.id} alumni={alumni} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Scroll View */}
      <section className="py-12 md:hidden">
        <div className="relative px-4">
          <div
            ref={scrollRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {alumniData.map((alumni, i) => (
              <div key={alumni.id} className="snap-center flex-shrink-0 w-[85vw] max-w-[300px]">
                <AlumniCard alumni={alumni} index={i} />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => scrollMobile('left')}
              disabled={mobileIndex === 0}
              className="w-12 h-12 rounded-full bg-navy-800 text-white flex items-center justify-center
                       disabled:opacity-30 disabled:cursor-not-allowed hover:bg-navy-700 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              {alumniData.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300
                  ${i === mobileIndex ? 'bg-primary-500 w-6' : 'bg-navy-300'}`} />
              ))}
            </div>

            <button
              onClick={() => scrollMobile('right')}
              disabled={mobileIndex === alumniData.length - 1}
              className="w-12 h-12 rounded-full bg-navy-800 text-white flex items-center justify-center
                       disabled:opacity-30 disabled:cursor-not-allowed hover:bg-navy-700 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlumniPage;
