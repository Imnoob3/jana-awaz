'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export function ReCaptchaVerification() {
  const [isOpen, setIsOpen] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Add reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      console.log('reCAPTCHA script loaded successfully');
    };
    script.onerror = (error) => {
      console.error('Error loading reCAPTCHA script:', error);
    };
    document.body.appendChild(script);

    console.log('Using site key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA not loaded yet');
      }

      console.log('Attempting verification with site key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
      
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' });
      console.log('Received token:', token);
      
      // Here you would typically verify the token on your backend
      // For now, we'll just simulate a successful verification
      setIsVerified(true);
      setIsOpen(false);
      // Store verification status in localStorage
      localStorage.setItem('recaptchaVerified', 'true');
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      alert('reCAPTCHA verification failed. Please check the console for details.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Check if already verified
  useEffect(() => {
    const isVerified = localStorage.getItem('recaptchaVerified');
    if (isVerified === 'true') {
      setIsOpen(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Verify to Continue</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-center text-muted-foreground">
            Please verify that you are human to continue using Jana Awaz.
          </p>
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            size="lg"
            className="w-full max-w-xs"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify with reCAPTCHA'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
