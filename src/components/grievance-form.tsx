
"use client";

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Loader2, MessageSquareWarning, Upload } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { addGrievance } from '@/lib/reports';
import { grievanceSchema } from '@/app/grievance/schema';

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
            'Submit Grievance Anonymously'
        )}
        </Button>
    );
}

export function GrievanceForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const photoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    const validatedFields = grievanceSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        photoDataUri: photoPreview,
    });

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        setErrors(fieldErrors);
        toast({
            variant: 'destructive',
            title: t('toast.submissionError.title'),
            description: 'Please check your input.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
        const newGrievance = await addGrievance(validatedFields.data);
        toast({
            title: 'Grievance Submitted',
            description: 'Your grievance has been submitted successfully.',
        });
        router.push(`/submission-confirmation/${newGrievance.id}`);
    } catch (error) {
        console.error('Error submitting grievance:', error);
        toast({
            variant: 'destructive',
            title: t('toast.error'),
            description: 'An unexpected error occurred while submitting your grievance. Please try again.',
        });
        setIsSubmitting(false);
    }
  };

  return (
      <form ref={formRef} onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl mx-auto shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-lg w-fit">
                    <MessageSquareWarning className="h-8 w-8 text-primary" />
                </div>
            </div>
            <CardTitle className="text-center">Voice a Grievance</CardTitle>
            <CardDescription className="text-center">
              Submit your concerns about rules, governance, or social issues. Your submission is anonymous.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Grievance Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="A brief title for your grievance"
                required
                className="shadow-lg"
              />
               {errors?.title && <p className="text-sm font-medium text-destructive">{errors.title[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the issue in detail. What is the problem, who does it affect, and what change would you like to see?"
                rows={8}
                required
                className="shadow-lg"
              />
              {errors?.description && <p className="text-sm font-medium text-destructive">{errors.description[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Upload Supporting Photo (Optional)</Label>
              <input type="hidden" name="photoDataUri" value={photoPreview || ''} />
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
            </div>
            {errors?.photoDataUri && <p className="text-sm font-medium text-destructive">{errors.photoDataUri[0]}</p>}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <SubmitButton isSubmitting={isSubmitting} />
          </CardFooter>
        </Card>
      </form>
  );
}
