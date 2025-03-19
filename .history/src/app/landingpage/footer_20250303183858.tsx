import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="mailto:support@asentica.com" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact: support@asentica.com
            </a>
          </div>
          <div className="text-gray-500 text-sm">
            COPYRIGHT © 2025 Asentica, LLC
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
