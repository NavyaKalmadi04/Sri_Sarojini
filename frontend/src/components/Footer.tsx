import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-navy-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-display font-bold">
                VB
              </div>
              <span className="text-white font-display font-bold text-lg">Vidya Bharati</span>
            </div>
            <p className="text-sm leading-relaxed">
              Nurturing minds, building futures. Established in 1985, providing world-class education
              with a strong foundation in values and character.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['Home', 'About', 'Curriculum', 'Alumni', 'Contact'].map((link) => (
                <Link
                  key={link}
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="block text-sm hover:text-primary-400 transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>123 Education Lane</p>
              <p>Hyderabad, Telangana 500001</p>
              <p>Phone: +91 40 2345 6789</p>
              <p>Email: info@vidyabharati.edu</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-4">School Hours</h4>
            <div className="space-y-2 text-sm">
              <p>Monday - Friday: 8:00 AM - 3:30 PM</p>
              <p>Saturday: 8:00 AM - 12:30 PM</p>
              <p>Sunday: Closed</p>
              <p className="pt-2 text-primary-400 font-semibold">Office: 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Vidya Bharati International School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
