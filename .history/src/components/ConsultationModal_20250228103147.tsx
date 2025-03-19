'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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
  const supabase = createClient();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }
      
    // UUID 생성 (브라우저에서 지원하는 경우)
    const consultationId = crypto.randomUUID ? crypto.randomUUID() : 
    'manual-' + Math.random().toString(36).substring(2, 15);

      // Supabase에 데이터 삽입
        const { data, error: insertError } = await supabase
        .from('consultation_requests')
        .insert({
          consultation_id: consultationId, // 여기에 UUID 추가
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
          phone_number: formData.phone,
          message: formData.message,
          medspa_id: medspa?.id || null,
          created_at: new Date().toISOString()
        });  



      if (insertError) {
        console.error('Supabase error:', insertError);
        throw new Error(insertError.message || 'Failed to submit consultation request');
      }

      console.log('Consultation request submitted successfully', data);

      // 폼 초기화 및 모달 닫기
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        message: ''
      });

      // 성공 메시지 표시
    alert('Your consultation request has been submitted successfully!');

      // Close the modal and return to search content
      onClose();
    } catch (err) {
      console.error('Error submitting consultation request:', err);
      setError(err instanceof Error ? err.message : '요청을 처리하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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

        {error && (
          <div className="alert alert-error mb-4">
            <p>{error}</p>
          </div>
        )}

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
              autoComplete="given-name"
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
              autoComplete="family-name"
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
              className={`btn bg-amber-800 hover:bg-amber-900 text-white border-none shadow-md ${isSubmitting ? 'loading' : ''}`}
              style={{
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(139, 69, 19, 0.3), 0 2px 4px -1px rgba(139, 69, 19, 0.2)'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}
