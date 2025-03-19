import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start">
          <div className="flex flex-col space-y-2 mb-4">
            <a href="#" className="text-black hover:text-gray-600 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-black hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="mailto:support@asentica.com" className="text-black hover:text-gray-600 transition-colors">
              Contact</br>support@asentica.com
            </a>
            <a href="mailto:support@asentica.com" className="text-black hover:text-gray-600 transition-colors">
              support@asentica.com
            </a>
          </div>
          <div className="text-black text-sm">
            COPYRIGHT © 2025 Asentica, LLC
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
