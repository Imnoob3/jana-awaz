
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, X, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { districtsOfNepal } from '@/lib/districts';
import { CrimeTypeSelector } from './crime-type-selector';
import { reportSchema } from '@/app/report/schema';
import { supabase } from '@/lib/supabase';
import type { Report } from '@/lib/types';


function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    const { t } = useTranslation();
    return (
        <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('reportForm.submitting')}
                </>
            ) : (
                t('reportForm.submitAnonymously')
            )}
        </Button>
    );
}

export function ReportForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const photoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [crimeType, setCrimeType] = useState<'Government Crime' | 'Civilian Crime' | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          toast({ 
            variant: "destructive", 
            title: t('toast.fileTooLarge.title'), 
            description: t('toast.fileTooLarge.description') 
          });
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if(photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const validatedFields = reportSchema.safeParse({
        crimeType: formData.get('crimeType'),
        crimeSubType: formData.get('crimeSubType'),
        district: formData.get('district'),
        localAddress: formData.get('localAddress'),
        incident_details: formData.get('incident_details'),
        photoDataUri: photoPreview,
    });

    if (!validatedFields.success) {
        setErrors(validatedFields.error.flatten().fieldErrors);
        toast({
            variant: 'destructive',
            title: t('toast.submissionError.title'),
            description: 'Please check your input.',
        });
        setIsSubmitting(false);
        return;
    }
    
    const submissionData = {
        type_of_crime: validatedFields.data.crimeType,
        Specific_Type_of_Crime: validatedFields.data.crimeSubType,
        Report_Details: validatedFields.data.incident_details,
        District: validatedFields.data.district,
        Local_Address_Tole: validatedFields.data.localAddress,
        image: validatedFields.data.photoDataUri || 'https://picsum.photos/400/300',
    };
    
    console.log('Submitting data:', submissionData);

    const { data, error } = await supabase
      .from("police")
      .insert([submissionData])
      .select()
      .single();

    if (error) {
        console.error('Supabase error:', error);
        toast({
            variant: 'destructive',
            title: t('toast.error'),
            description: 'Failed to submit report to the database.',
        });
        setIsSubmitting(false);
    } else {
        router.push(`/submission-confirmation/${data.track_id}`);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl mx-auto shadow-2xl">
          <CardHeader>
            <CardTitle>{t('reportForm.title')}</CardTitle>
            <CardDescription>
              {t('reportForm.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
                <Label>{t('reportForm.crimeType')}</Label>
                <RadioGroup 
                  name="crimeType" 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4" 
                  onValueChange={(value) => setCrimeType(value as 'Government Crime' | 'Civilian Crime')}
                  required
                >
                  <div>
                    <RadioGroupItem value="Government Crime" id="government" className="peer sr-only" />
                    <Label
                      htmlFor="government"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary shadow-lg transition-all hover:-translate-y-1 cursor-pointer",
                        crimeType === 'Government Crime' && "border-primary"
                      )}
                    >
                      <Shield className="mb-3 h-6 w-6" />
                      {t('reportForm.governmentCrime.title')}
                      <span className="text-xs text-muted-foreground text-center mt-1">{t('reportForm.governmentCrime.description')}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="Civilian Crime" id="civilian" className="peer sr-only" />
                    <Label
                      htmlFor="civilian"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary shadow-lg transition-all hover:-translate-y-1 cursor-pointer",
                        crimeType === 'Civilian Crime' && "border-primary"
                      )}
                    >
                      <Users className="mb-3 h-6 w-6" />
                      {t('reportForm.civilianCrime.title')}
                      <span className="text-xs text-muted-foreground text-center mt-1">{t('reportForm.civilianCrime.description')}</span>
                    </Label>
                  </div>
                </RadioGroup>
                 {errors?.crimeType && <p className="text-sm font-medium text-destructive pt-2">{errors.crimeType[0]}</p>}
              </div>

              {crimeType && (
                <div className="space-y-3">
                    <CrimeTypeSelector
                      key={crimeType} // Re-mount when crimeType changes
                      crimeType={crimeType}
                    />
                    {errors?.crimeSubType && <p className="text-sm font-medium text-destructive">{errors.crimeSubType[0]}</p>}
                </div>
              )}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="district">{t('reportForm.district')}</Label>
                  <Select name="district" required>
                      <SelectTrigger id="district" className="shadow-lg">
                          <SelectValue placeholder={t('reportForm.selectDistrict')} />
                      </SelectTrigger>
                      <SelectContent>
                          {districtsOfNepal.map((district) => (
                              <SelectItem key={district} value={district}>
                                  {district}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {errors?.district && <p className="text-sm font-medium text-destructive">{errors.district[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localAddress">{t('reportForm.localAddress')}</Label>
                  <Input 
                    id="localAddress" 
                    name="localAddress" 
                    placeholder={t('reportForm.localAddressPlaceholder')} 
                    required
                    className="shadow-lg"
                  />
                  {errors?.localAddress && <p className="text-sm font-medium text-destructive">{errors.localAddress[0]}</p>}
                </div>
              </div>

            <div className="space-y-2">
              <Label htmlFor="incident_details">{t('reportForm.reportDetails')}</Label>
              <Textarea
                id="incident_details"
                name="incident_details"
                placeholder={t('reportForm.reportDetailsPlaceholder')}
                rows={8}
                required
                className="shadow-lg"
              />
               {errors?.incident_details && <p className="text-sm font-medium text-destructive">{errors.incident_details[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">{t('reportForm.uploadEvidence')}</Label>
              
              {photoPreview ? (
                <div className="relative group">
                  <Image src={photoPreview} alt="Photo preview" width={500} height={300} className="rounded-md object-cover w-full h-auto max-h-80 border shadow-lg" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removePhoto}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">{t('reportForm.removePhoto')}</span>
                  </Button>
                </div>
              ) : (
                <div 
                  className={cn(
                    "flex justify-center w-full h-48 px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors shadow-lg cursor-pointer hover:border-primary"
                  )}
                  onClick={() => photoInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && photoInputRef.current?.click()}
                  tabIndex={0}
                  role="button"
                  aria-label={t('reportForm.uploadPhotoAriaLabel')}
                >
                  <div className="space-y-1 text-center flex flex-col justify-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">{t('reportForm.clickToUpload')}</span> {t('reportForm.dragAndDrop')}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('reportForm.fileTypes')}</p>
                  </div>
                </div>
              )}
              <Input
                  id="photo"
                  name="photo"
                  type="file"
                  className="hidden"
                  ref={photoInputRef}
                  accept="image/png, image/jpeg"
                  onChange={handlePhotoChange}
              />
               {errors?.photoDataUri && <p className="text-sm font-medium text-destructive">{errors.photoDataUri[0]}</p>}
            </div>

          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
             <SubmitButton isSubmitting={isSubmitting} />
          </CardFooter>
        </Card>
      </form>
  );
}

    