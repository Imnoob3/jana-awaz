
'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from './ui/input';

const governmentCrimeTypes = [
  'Bribery',
  'Embezzlement',
  'Nepotism',
  'Abuse of Authority',
  'Other',
];

const civilianCrimeTypes = [
  'Theft',
  'Assault',
  'Vandalism',
  'Fraud',
  'Other',
];

interface CrimeTypeSelectorProps {
  crimeType: 'Government Crime' | 'Civilian Crime';
}

export function CrimeTypeSelector({ crimeType }: CrimeTypeSelectorProps) {
  const { t } = useTranslation();
  const options = crimeType === 'Government Crime' ? governmentCrimeTypes : civilianCrimeTypes;
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Set initial value when the component mounts or options change
    if (options.length > 0 && !selectedValue) {
      setSelectedValue(options[0]);
    }
  }, [options, selectedValue]);

  return (
    <div className="space-y-3">
      <Label>{t('reportForm.specificCrimeType')}</Label>
      <Input type="hidden" name="crimeSubType" value={selectedValue} />
      <div className="relative w-full rounded-2xl bg-muted p-1 flex flex-wrap justify-center items-center gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedValue(option)}
            className={cn(
              "relative z-10 rounded-full py-1.5 px-4 text-sm font-medium transition-colors duration-300 ease-in-out flex-grow text-center",
              selectedValue === option
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t(`crimeSubTypes.${option.toLowerCase().replace(/ /g, '')}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
