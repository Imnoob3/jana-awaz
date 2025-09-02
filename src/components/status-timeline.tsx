'use client';

import { CheckCircle2, XCircle, Settings2, ThumbsUp } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: 'submitted' | 'under_review' | 'action_taken' | 'resolved';
}

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const statuses = [
    {
      id: 'submitted',
      label: 'Submitted',
      icon: CheckCircle2,
      description: 'Your submission has been successfully received by our system.'
    },
    {
      id: 'under_review',
      label: 'Under Review',
      icon: XCircle,
      description: 'The appropriate authorities are currently reviewing your submission.'
    },
    {
      id: 'action_taken',
      label: 'Action Taken',
      icon: Settings2,
      description: 'Initial action or investigation has been initiated based on your submission.'
    },
    {
      id: 'resolved',
      label: 'Resolved',
      icon: ThumbsUp,
      description: 'The case has been resolved or closed. Thank you for your contribution.'
    }
  ];

  const getStatusIndex = (status: string) => {
    return statuses.findIndex(s => s.id === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="space-y-8">
      {statuses.map((status, index) => {
        const Icon = status.icon;
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;

        return (
          <div key={status.id} className="flex items-start gap-4">
            <div className={`relative flex items-center justify-center rounded-full p-1 
              ${isComplete ? 'text-green-500' : 
                isActive ? 'text-blue-500' : 
                'text-gray-400'}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
              {index < statuses.length - 1 && (
                <div className={`absolute top-full h-12 w-0.5 -translate-x-1/2 transform 
                  ${isComplete ? 'bg-green-500' : 'bg-gray-200'}`} 
                />
              )}
            </div>
            <div className="pb-8">
              <p className={`font-medium ${
                isComplete ? 'text-green-500' : 
                isActive ? 'text-blue-500' : 
                'text-gray-500'
              }`}>
                {status.label}
              </p>
              <p className="text-sm text-gray-500">{status.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
