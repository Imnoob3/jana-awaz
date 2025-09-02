
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, MessageSquareQuote, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Report } from '@/lib/types';
import Image from 'next/image';
import { StatusTimeline } from '@/components/status-timeline';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function SubmissionStatusPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { t } = useTranslation();

  const [submission, setSubmission] = useState<Report | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('police')
            .select('*')
            .eq('track_id', id)
            .single();

        if (error) {
            console.error('Error fetching report:', error);
        } else if (data) {
            setSubmission(data);
        }
        setLoading(false);
    };

    if (id) {
        fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
        <main className="container mx-auto px-4 py-12 flex justify-center items-center">
            <p>Loading submission status...</p>
        </main>
    );
  }

  if (!submission) {
    return (
        <main className="container mx-auto px-4 py-12 flex justify-center items-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader className="items-center">
                     <div className="bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">{t('track.notFound.title')}</CardTitle>
                    <CardDescription>
                        {t('track.notFound.description')}
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                     <Button asChild>
                        <Link href="/track">{t('track.notFound.button')}</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
  }

  const hasPhoto = submission.image && submission.image.length > 0;

  return (
    <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-1 space-y-6">
                 <Card>
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                        <div className="bg-primary/10 p-3 rounded-lg w-fit">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{t('track.details.reportTitle')}</CardTitle>
                            <CardDescription className="font-mono text-xs pt-1 break-all">{submission.track_id}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-6">
                            {submission.Report_Details}
                        </p>
                        {hasPhoto && (
                             <div className="aspect-video relative rounded-md overflow-hidden border">
                                <Image
                                src={submission.image!}
                                alt={t('track.details.evidenceAlt')}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
               <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('track.status.title')}</CardTitle>
                        <CardDescription>{t('track.status.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StatusTimeline currentStatus={submission.status || 'submitted'} />
                    </CardContent>
                </Card>
            </div>
        </div>
    </main>
  );
}
