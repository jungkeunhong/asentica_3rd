'use client';

/**
 * Handles the phone call initialization for a medspa
 * @param phone The phone number to call
 * @param medspaName The name of the medspa for tracking purposes
 * @returns A boolean indicating whether the call was initiated
 */
export const initiatePhoneCall = (phone: string, medspaName: string): boolean => {
  if (!phone) {
    console.error('No phone number provided for', medspaName);
    return false;
  }

  try {
    // Format phone number for tel: protocol
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Track the phone call event if analytics is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'phone_call', {
        event_category: 'Contact',
        event_label: medspaName,
        value: formattedPhone
      });
    }

    // Create and click a temporary link to initiate the call
    const link = document.createElement('a');
    link.href = `tel:${formattedPhone}`;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    return true;
  } catch (error) {
    console.error('Error initiating phone call:', error);
    return false;
  }
};

/**
 * Formats a phone number for display
 * @param phone The raw phone number to format
 * @returns The formatted phone number string
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format the phone number as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone; // Return original if format doesn't match
}; 