
'use client';

import { LocalReport } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Clock, Shield, Users, MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from './ui/badge';

export function ReportCard({ report }: { report: LocalReport }) {
  const { t } = useTranslation();
  
  const getCrimeTypeIcon = () => {
    switch (report.crimeType) {
      case 'Government':
        return <Shield className="h-4 w-4 text-primary" />;
      case 'Civilian':
        return <Users className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };
  
  const recipient = report.crimeType === 'Government' ? 'CIAA' : report.crimeType === 'Civilian' ? 'Police' : 'ICC';

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:-translate-y-1">
      <CardHeader className="p-0 border-b">
        <div className="aspect-video relative">
            <Image
              src={report.photoDataUri}
              alt={t('reportCard.evidenceAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="crime scene"
            />
             <div className="absolute top-2 right-2 flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5 pl-1.5">
                    {getCrimeTypeIcon()}
                    {report.crimeType}
                </Badge>
             </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 flex-grow">
        <div className="flex items-center text-xs text-muted-foreground gap-2">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{report.localAddress}, {report.district}</span>
        </div>
         <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Tag className="h-3 w-3 flex-shrink-0" />
            <span>{report.crimeSubType}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-4 pt-2">{report.reportText}</p>
      </CardContent>
       <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
        <div className="w-full border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
            </div>
            <span className="font-medium">Routed to: {recipient}</span>
        </div>
       </CardFooter>
    </Card>
  );
}
