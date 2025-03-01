'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { tv } from 'tailwind-variants';
import confetti from 'canvas-confetti';

// 버튼 스타일 정의
const submitButton = tv({
  base: "relative overflow-visible rounded-lg shadow-xl bg-amber-800 text-white border-none transition duration-300 transform hover:scale-95 active:scale-90 hover:bg-amber-900",
  variants: {
    isSubmitting: {
      true: 'opacity-70 cursor-not-allowed',
      false: ''
    }
  },
  defaultVariants: {
    isSubmitting: false
  }
});

// Next 버튼 스타일 정의
const nextButton = tv({
  base: "relative overflow-visible rounded-lg shadow-xl bg-amber-800 text-white border-none transition duration-300 transform hover:scale-95 active:scale-90 hover:bg-amber-900 w-full py-2 mt-4",
});

interface Medspa {
  id: string;
  name?: string;
  medspa_name?: string;
  image_url1?: string;
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medspa: Medspa | undefined;
}

export default function ConsultationModal({ isOpen, onClose, medspa }: ConsultationModalProps) {
  console.log('ConsultationModal rendered with props:', { isOpen, medspa });

  if (!isOpen) {
    console.log('Modal is not open, not rendering');
    return null;
  }

  if (!medspa) {
    console.log('No medspa data provided');
    return null;
  }

  const supabase = createClient();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerConfetti = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const x = (buttonRect.left + buttonRect.width / 2) / window.innerWidth;
      const y = (buttonRect.top + buttonRect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24'],
        zIndex: 9999
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (formData.firstname && formData.lastname) {
      setStep(2);
    } else {
      setError('이름과 성을 모두 입력해주세요.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      const consultationId = crypto.randomUUID 
        ? crypto.randomUUID() 
        : 'manual-' + Math.random().toString(36).substring(2, 15);

      const { error: insertError } = await supabase
        .from('consultation_requests')
        .insert({
          consultation_id: consultationId,
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
          phone_number: formData.phone,
          medspa_id: medspa?.id || null,
          created_at: new Date().toISOString()
        });

      if (insertError) throw new Error(insertError.message || 'Failed to submit consultation request');

      triggerConfetti();

      setTimeout(() => {
        setFormData({ firstname: '', lastname: '', email: '', phone: '' });
        onClose();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : '요청을 처리하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <dialog id="consultation_modal" className={`modal fixed top-0 left-0 w-full h-full flex justify-center items-start`}>
        <div className="modal-box bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
          </form>
          <h3 className="font-bold text-lg text-amber-800 mb-2">Request Consultation</h3>

          {error && <div className="alert alert-error mb-4"><p>{error}</p></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
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
                    autoFocus
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
                
                <button
                  type="button"
                  className={nextButton()}
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
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

                <div className="form-control mt-6">
                  <button
                    ref={buttonRef}
                    type="submit"
                    className={`${submitButton({ isSubmitting })} consultation-button`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Request Consultation'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
      </dialog>
    </>
  );
}
