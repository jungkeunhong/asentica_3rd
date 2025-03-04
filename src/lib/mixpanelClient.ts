import mixpanel from 'mixpanel-browser';
 
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
 
export const initMixpanel = () => {
  if (typeof window === 'undefined') {
    return; // Don't run on server side
  }

  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is missing! Check your .env file.');
    return;
  }
 
  mixpanel.init(MIXPANEL_TOKEN, { debug: process.env.NODE_ENV !== 'production' });
};

// Track event helper function
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !MIXPANEL_TOKEN) {
    return;
  }
  
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Identify user helper function
export const identifyUser = (userId: string, traits?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !MIXPANEL_TOKEN) {
    return;
  }
  
  try {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};