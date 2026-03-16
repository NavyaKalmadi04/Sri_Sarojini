import React from 'react';

const management = [
  { name: 'Dr. Rajesh Kumar', designation: 'Chairman & Founder', initials: 'RK', color: 'from-navy-700 to-navy-900' },
  { name: 'Mrs. Lakshmi Kumar', designation: 'Vice Chairperson', initials: 'LK', color: 'from-primary-600 to-primary-800' },
  { name: 'Mr. Suresh Reddy', designation: 'Secretary', initials: 'SR', color: 'from-emerald-600 to-emerald-800' },
  { name: 'Dr. Meena Iyer', designation: 'Principal', initials: 'MI', color: 'from-blue-600 to-blue-800' },
  { name: 'Mr. Anil Sharma', designation: 'Vice Principal', initials: 'AS', color: 'from-violet-600 to-violet-800' },
  { name: 'Mrs. Kavita Nair', designation: 'Academic Director', initials: 'KN', color: 'from-rose-600 to-rose-800' },
];

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-primary-500 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block px-4 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-body font-semibold mb-4">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Our Story & Legacy</h1>
          <p className="text-navy-300 text-lg font-body max-w-2xl">
            Over three decades of shaping minds, building character, and creating leaders for tomorrow.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="w-80 h-96 mx-auto rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900
                            flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <div className="relative text-center">
                  <div className="w-32 h-32 rounded-full bg-primary-500/20 border-4 border-primary-500/40
                                flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl font-display font-bold text-primary-300">RK</span>
                  </div>
                  <p className="text-white font-display font-bold text-xl">Dr. Rajesh Kumar</p>
                  <p className="text-primary-300 font-body text-sm">Founder & Chairman</p>
                </div>
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-4 -right-4 w-80 h-96 rounded-2xl border-2 border-primary-200 -z-10" />
            </div>

            <div>
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-body font-semibold mb-4">
                Message from the Founder
              </span>
              <h2 className="text-3xl font-display font-bold text-navy-900 mb-6">
                "Education is the cornerstone of a progressive society."
              </h2>
              <div className="space-y-4 text-navy-600 font-body leading-relaxed">
                <p>
                  When I founded Vidya Bharati International School in 1985, my vision was simple yet profound — 
                  to create an institution that nurtures not just academic brilliance, but character, compassion, 
                  and courage in every child.
                </p>
                <p>
                  Over the past 38 years, we have grown from a modest school of 60 students to a thriving 
                  community of over 2,500 learners. Our graduates have gone on to become doctors, engineers, 
                  artists, entrepreneurs, and changemakers across the globe.
                </p>
                <p>
                  We remain committed to our founding principles: every child deserves the opportunity to 
                  discover their potential and build a future filled with purpose and possibility.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-0.5 bg-primary-500" />
                <span className="text-navy-900 font-display font-semibold italic">Dr. Rajesh Kumar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section className="py-20 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-body font-semibold mb-4">
              Leadership
            </span>
            <h2 className="section-title">Our Management Team</h2>
            <p className="section-subtitle mx-auto mt-3">
              Dedicated leaders committed to excellence in education.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {management.map((person, i) => (
              <div key={i} className="card p-6 text-center group hover:-translate-y-2">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${person.color}
                              flex items-center justify-center mx-auto mb-4
                              group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-2xl font-display font-bold text-white">{person.initials}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-navy-900">{person.name}</h3>
                <p className="text-navy-500 font-body text-sm mt-1">{person.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Vision & Mission</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="card p-10 border-t-4 border-primary-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-navy-900 mb-4">Our Vision</h3>
                <p className="text-navy-600 font-body leading-relaxed">
                  To be a globally recognized center of learning that empowers students to become innovative 
                  thinkers, responsible citizens, and compassionate leaders. We envision a world where every 
                  child has access to transformative education that unlocks their fullest potential.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="card p-10 border-t-4 border-navy-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-navy-50 rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-navy-900 mb-4">Our Mission</h3>
                <p className="text-navy-600 font-body leading-relaxed">
                  To provide a nurturing and stimulating environment that fosters academic excellence, 
                  creative thinking, and moral values. We are committed to employing innovative teaching 
                  methodologies, building strong teacher-student relationships, and maintaining the highest 
                  standards of educational quality for every learner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
