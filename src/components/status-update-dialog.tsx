'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface StatusUpdateDialogProps {
  reportId: string;
  currentStatus: string;
  onStatusUpdate?: () => void;
}

export function StatusUpdateDialog({ 
  reportId, 
  currentStatus, 
  onStatusUpdate 
}: StatusUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const statuses = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'action_taken', label: 'Action Taken' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsSubmitting(true);
    console.log('Updating status for report:', {
      track_id: reportId,
      currentStatus,
      newStatus: selectedStatus
    });
    const { error } = await supabase
      .from('police')
      .update({ status: selectedStatus })
      .eq('track_id', reportId);

    setIsSubmitting(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status. Please try again.',
      });
      console.error('Error updating status:', error);
    } else {
      toast({
        title: 'Success',
        description: 'Status updated successfully.',
      });
      setIsOpen(false);
      onStatusUpdate?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogDescription>
            Select the new status for this report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            className="grid grid-cols-1 gap-4"
          >
            {statuses.map((status) => (
              <div
                key={status.value}
                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer
                  ${selectedStatus === status.value ? 'border-primary' : 'border-input'}`}
              >
                <RadioGroupItem value={status.value} id={status.value} />
                <Label htmlFor={status.value} className="flex-grow cursor-pointer">
                  {status.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
