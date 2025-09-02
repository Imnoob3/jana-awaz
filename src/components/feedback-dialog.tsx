'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FeedbackDialogProps {
  reportId: string;
  onFeedbackSubmit?: () => void;
  feedbackBy: 'Police' | 'ICC';
}

export function FeedbackDialog({ reportId, onFeedbackSubmit, feedbackBy }: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter feedback before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('police')
      .update({
        feedback: feedback,
        feedback_date: new Date().toLocaleTimeString(),
        feedback_by: feedbackBy,
        status: 'under_review'
      })
      .eq('id', reportId);

    setIsSubmitting(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
      });
      console.error('Error submitting feedback:', error);
    } else {
      toast({
        title: 'Success',
        description: 'Feedback submitted successfully.',
      });
      setIsOpen(false);
      setFeedback('');
      onFeedbackSubmit?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Give Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Enter your feedback for this report. This will be visible to the person who submitted the report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
