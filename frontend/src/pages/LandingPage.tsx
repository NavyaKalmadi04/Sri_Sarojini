import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    bg: 'linear-gradient(135deg, #102a43 0%, #243b53 40%, #334e68 100%)',
    title: 'Shaping Tomorrow\'s Leaders',
    subtitle: 'Excellence in education since 1985',
    overlay: 'radial-gradient(ellipse at 30% 50%, rgba(241,145,50,0.15) 0%, transparent 60%)',
  },
  {
    bg: 'linear-gradient(135deg, #1a365d 0%, #2d4a7a 40%, #3c6397 100%)',
    title: 'World-Class Infrastructure',
    subtitle: 'State-of-the-art labs, library, and sports facilities',
    overlay: 'radial-gradient(ellipse at 70% 40%, rgba(241,145,50,0.15) 0%, transparent 60%)',
  },
  {
    bg: 'linear-gradient(135deg, #0d3b66 0%, #1a5276 40%, #2471a3 100%)',
    title: 'Holistic Development',
    subtitle: 'Academics, sports, arts, and character building',
    overlay: 'radial-gradient(ellipse at 50% 60%, rgba(241,145,50,0.2) 0%, transparent 50%)',
  },
  {
    bg: 'linear-gradient(135deg, #14213d 0%, #1b3a5c 40%, #22577a 100%)',
    title: '100% Board Results',
    subtitle: 'Consistently outstanding academic performance',
    overlay: 'radial-gradient(ellipse at 40% 30%, rgba(241,145,50,0.15) 0%, transparent 55%)',
  },
];

const highlights = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Experienced Faculty',
    desc: 'Our team of 50+ highly qualified educators bring decades of teaching experience with a passion for nurturing young minds.',
    accent: 'from-blue-500 to-blue-700',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Modern Infrastructure',
    desc: 'Smart classrooms, science labs, computer center, library with 20,000+ books, and a sprawling campus built for learning.',
    accent: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Academic Excellence',
    desc: 'Consistently achieving 100% board results with top district ranks. Our students excel in national and international competitions.',
    accent: 'from-amber-500 to-amber-700',
  },
];

const stats = [
  { value: '2500+', label: 'Students' },
  { value: '50+', label: 'Faculty' },
  { value: '38+', label: 'Years Legacy' },
  { value: '100%', label: 'Board Results' },
];

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Announcement Bar */}
      <div className="bg-primary-600 text-white py-2 overflow-hidden relative">
        <div className="animate-scroll whitespace-nowrap font-body font-semibold text-sm tracking-wide">
          🎓 Admissions are open for 2026-27!!! &nbsp;&nbsp;&nbsp;📢 Apply Now!
          &nbsp;&nbsp;&nbsp;🏆 Our students scored top ranks in JEE &amp; NEET!
          &nbsp;&nbsp;&nbsp;📚 Admissions are open!!! &nbsp;&nbsp;&nbsp;🎯 Scholarship test on April 15th!
          &nbsp;&nbsp;&nbsp;🎓 Admissions are open for 2026-27!!! &nbsp;&nbsp;&nbsp;📢 Apply Now!
        </div>
      </div>

      {/* Hero Carousel */}
      <section className="relative h-[85vh] min-h-[550px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            style={{ background: slide.bg }}
          >
            <div className="absolute inset-0" style={{ background: slide.overlay }} />
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-white/5" />
            <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full border border-white/5" />
            <div className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full border border-primary-500/10" />
          </div>
        ))}

        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 absolute
                    ${index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                >
                  <span className="inline-block px-4 py-1.5 bg-primary-500/20 text-primary-300 rounded-full
                                 text-sm font-body font-semibold mb-6 border border-primary-500/30">
                    Welcome to Vidya Bharati
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-navy-200 font-body mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <Link to="/contact" className="btn-primary text-lg px-8 py-3">
                      Apply Now
                    </Link>
                    <Link to="/about" className="btn-outline border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300
                ${index === currentSlide ? 'w-10 bg-primary-500' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-800 py-8 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-primary-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-navy-300 font-body text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-gradient-to-b from-[#faf9f6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-body font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="section-title">Excellence in Every Dimension</h2>
            <p className="section-subtitle mx-auto mt-3">
              We believe in developing well-rounded individuals ready to face the challenges of tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="card p-8 group hover:-translate-y-2"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.accent}
                              flex items-center justify-center text-white mb-6
                              group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-navy-500 font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-500 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-blue-500 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-navy-300 text-lg font-body mb-8 max-w-2xl mx-auto">
            Join our community of learners. Admissions open for the academic year 2026-27.
          </p>
          <Link to="/contact" className="btn-primary text-lg px-10 py-4">
            Contact Admissions
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
