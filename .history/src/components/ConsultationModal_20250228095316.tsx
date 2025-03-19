'use client';

import { useState } from 'react';

interface Medspa {
  id: string;
  medspa_name: string;
  number?: string;
  // Add other fields as needed
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medspa: Medspa | null;
}

export default function ConsultationModal({ isOpen, onClose, medspa }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData, 'for medspa:', medspa?.medspa_name);
    
    // Reset form and close modal
    setFormData({
      firstname: '',
    lastname: '',
      email: '',
      phone: '',
      message: ''
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <dialog id="consultation_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-amber-800 mb-2">
          Request Consultation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {medspa?.medspa_name ? `Complete the form below to request a consultation with ${medspa.medspa_name}` : 'Complete the form below to request a consultation'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">First Name</span>
            </label>
            <input 
              type="text" 
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder="Enter your first name" 
              className="input input-bordered w-full focus:border-amber-800 bg-white text-gray-900" 
              required 
              autoComplete="name"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Last Name</span>
            </label>
            <input 
              type="text" 
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder="Enter your last name" 
              className="input input-bordered w-full focus:border-amber-800 bg-white text-gray-900" 
              required 
              autoComplete="name"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Email</span>
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com" 
              className="input input-bordered w-full focus:border-amber-800 bg-white text-gray-900" 
              required 
              autoComplete="email"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Phone Number</span>
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890" 
              className="input input-bordered w-full focus:border-amber-800 bg-white text-gray-900" 
              required 
              autoComplete="tel"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Message</span>
            </label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24 focus:border-amber-800 bg-white text-gray-900" 
              placeholder="Tell us about the treatment you're interested in..."
            ></textarea>
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn bg-amber-800 hover:bg-amber-900 text-white border-none shadow-md"
              style={{ 
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(139, 69, 19, 0.3), 0 2px 4px -1px rgba(139, 69, 19, 0.2)'
              }}
            >
              Send your request
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}
