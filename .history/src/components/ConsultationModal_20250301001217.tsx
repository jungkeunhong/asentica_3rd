'use client';

import { useState, useRef, useEffect } from 'react';
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

const buttonVariants = tv({
  base: "relative overflow-visible rounded-lg shadow-xl bg-amber-800 text-white border-none transition duration-300 transform hover:scale-95 active:scale-90 hover:bg-amber-900 w-full py-2 mt-4",
  variants: {
    variant: {
      default: 'bg-gray-600 text-white',
    }
  },
  defaultVariants: {
    variant: 'default'
  }
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
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      console.log('Success state activated, triggering confetti');
      // 컨페티 효과 실행
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isSuccess]);

  if (!isOpen) {
    console.log('Modal is not open, not rendering');
    return null;
  }

  if (!medspa) {
    console.log('No medspa data provided, not rendering modal');
    return null;
  }

  // 다음 단계로 넘어가는 함수
  const handleNextStep = () => {
    if (formData.firstname && formData.lastname) {
      setStep(2);
    } else {
      setError('Please write your full name.');
    }
  };

  // 폼 제출 처리
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

      setIsSuccess(true);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <dialog 
        id="consultation_modal" 
        className={`modal fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50`}
        open={isOpen}
      >
        <div className="modal-box bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
          </form>
          
          <div className="py-4">
            {isSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
                <p className="text-gray-600">Your consultation request has been submitted successfully. We&apos;ll contact you soon!</p>
                <button
                  onClick={onClose}
                  className={buttonVariants({ variant: "default" })}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg text-amber-800 mb-2">Request Consultation</h3>

                {error && <div className="mb-4"><p className="text-red-500">{error}</p></div>}

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
                          className={`${submitButton({ isSubmitting })} consultation-button h-14`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Request Consultation'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
      </dialog>
    </>
  );
}
