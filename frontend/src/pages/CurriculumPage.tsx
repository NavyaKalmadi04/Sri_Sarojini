import React from 'react';

const academics = [
  { subject: 'Mathematics', desc: 'From foundational arithmetic to advanced calculus, building analytical and problem-solving skills.', icon: '📐' },
  { subject: 'Sciences', desc: 'Hands-on experiments in Physics, Chemistry, and Biology with fully equipped laboratories.', icon: '🔬' },
  { subject: 'Languages', desc: 'English, Hindi, and Sanskrit with emphasis on communication, literature, and creative expression.', icon: '📖' },
  { subject: 'Social Studies', desc: 'History, Geography, Civics, and Economics to develop informed, socially aware citizens.', icon: '🌍' },
  { subject: 'Computer Science', desc: 'Programming, digital literacy, and emerging technology skills for the modern age.', icon: '💻' },
  { subject: 'Arts & Humanities', desc: 'Fine arts, performing arts, and value education for holistic personality development.', icon: '🎨' },
];

const coCurricular = [
  {
    title: 'Sports',
    desc: 'Cricket, football, basketball, athletics, swimming, table tennis, and chess with professional coaches and inter-school tournaments.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Music',
    desc: 'Vocal and instrumental training including classical, folk, and contemporary music. Annual concerts and music festivals.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Cultural Activities',
    desc: 'Dance, drama, debate, elocution, art exhibitions, and cultural festivals celebrating India\'s rich heritage.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m10-4V2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100 4m0-4a2 2 0 110 4M3 20h18" />
      </svg>
    ),
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
  },
  {
    title: 'Olympiads & Competitions',
    desc: 'National Science Olympiad, Math Olympiad, SOF, NTSE, and various quiz competitions with dedicated coaching.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
];

const CurriculumPage: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full bg-primary-500 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block px-4 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-body font-semibold mb-4">
            Academics
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Curriculum & Co-Curriculum</h1>
          <p className="text-navy-300 text-lg font-body max-w-2xl">
            A balanced blend of rigorous academics and enriching co-curricular activities.
          </p>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-body font-semibold mb-4">
              Academics
            </span>
            <h2 className="section-title">Our Curriculum</h2>
            <p className="section-subtitle mx-auto mt-3">
              Following the CBSE curriculum with an enriched approach that goes beyond textbooks. 
              We focus on conceptual understanding, critical thinking, and practical application across all subjects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {academics.map((item, i) => (
              <div key={i} className="card p-7 group hover:-translate-y-1">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-navy-900 mb-2">{item.subject}</h3>
                <p className="text-navy-500 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Approach */}
          <div className="mt-16 card p-10 bg-gradient-to-r from-navy-50 to-primary-50/30 border-l-4 border-primary-500">
            <h3 className="text-xl font-display font-bold text-navy-900 mb-3">Our Teaching Approach</h3>
            <p className="text-navy-600 font-body leading-relaxed">
              We employ a blend of traditional and progressive teaching methods including project-based learning, 
              flipped classrooms, peer learning, and technology-integrated instruction. Regular assessments, 
              parent-teacher meetings, and personalized attention ensure every student achieves their academic potential.
            </p>
          </div>
        </div>
      </section>

      {/* Co-Curricular Section */}
      <section className="py-20 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-body font-semibold mb-4">
              Beyond Academics
            </span>
            <h2 className="section-title">Co-Curricular Activities</h2>
            <p className="section-subtitle mx-auto mt-3">
              Building well-rounded personalities through sports, arts, and competitive excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coCurricular.map((item, i) => (
              <div key={i} className="card p-8 flex gap-6 group hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color}
                              flex items-center justify-center text-white flex-shrink-0
                              group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-navy-500 font-body leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Gallery Placeholder */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Facilities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'Auditorium', 'Art Room', 'Music Room', 'Swimming Pool'].map((facility, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-navy-100 to-navy-200
                                    flex items-center justify-center group hover:from-primary-100 hover:to-primary-200
                                    transition-all duration-300 cursor-pointer">
                <span className="text-navy-600 font-display font-semibold text-center px-4 
                               group-hover:text-primary-700 transition-colors">
                  {facility}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CurriculumPage;
