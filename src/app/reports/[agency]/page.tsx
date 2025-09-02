
'use client';

import { useEffect, useState } from 'react';
import { getReportsByAgency } from '@/lib/reports';
import { notFound } from 'next/navigation';
import { ReportsList } from '@/components/reports-list';
import { Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { LocalReport } from '@/lib/types';

const agencyConfig = {
    ciaa: {
        title: 'CIAA Reports',
        description: 'Reports concerning government officials and corruption, routed to the Commission for the Investigation of Abuse of Authority (CIAA).',
        icon: <Shield className="h-8 w-8 text-primary" />,
        dbKey: 'Government' as const
    },
    police: {
        title: 'Police Reports',
        description: 'Reports concerning civilian-related crimes, routed to the Nepal Police.',
        icon: <Users className="h-8 w-8 text-primary" />,
        dbKey: 'Civilian' as const
    }
};

export default function ReportsByAgencyPage({ params }: any) {
  const agencyKey = params.agency.toLowerCase();
  const [reports, setReports] = useState<LocalReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agencyKey === 'ciaa' || agencyKey === 'police') {
      const config = agencyConfig[agencyKey as keyof typeof agencyConfig];
      const fetchedReports = getReportsByAgency(config.dbKey);
      setReports(fetchedReports);
    }
    setLoading(false);
  }, [agencyKey]);
  
  if (agencyKey !== 'ciaa' && agencyKey !== 'police') {
    notFound();
  }
  
  const config = agencyConfig[agencyKey as keyof typeof agencyConfig];

  if (loading) {
    return (
        <main className="container mx-auto px-4 py-12">
            <p>Loading reports...</p>
        </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
        <Button asChild variant="outline" className="mb-8">
            <Link href="/reports"> &larr; Back to All Reports</Link>
        </Button>
        <div className="space-y-12">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {config.icon}
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{config.title}</h2>
                    <p className="text-muted-foreground mt-1 max-w-3xl">{config.description}</p>
                </div>
            </div>
            <ReportsList initialReports={reports} />
        </div>
    </main>
  );
}
