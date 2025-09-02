'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ExpandableText } from '@/components/expandable-text';
import { FeedbackDialog } from '@/components/feedback-dialog';
import { ImagePreview } from '@/components/image-preview';
import { StatusUpdateDialog } from '@/components/status-update-dialog';

interface Report {
  id: string;
  type_of_crime: string;
  Specific_Type_of_Crime: string;
  Report_Details: string;
  District: string;
  Local_Address_Tole: string;
  image: string;
  created_at: string;
  feedback?: string;
  feedback_date?: string;
  feedback_by?: string;
  status?: string;
}

export default function ICCAdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from('police')
        .select('*')
        .eq('type_of_crime', 'Government Crime')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    }

    fetchReports();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">ICC Admin Dashboard - Government Crime Reports</h1>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Crime Type</TableHead>
              <TableHead>Specific Type</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Local Address</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <ImagePreview imageUrl={report.image} alt={`Report from ${report.District}`} />
                </TableCell>
                <TableCell>{report.type_of_crime}</TableCell>
                <TableCell>{report.Specific_Type_of_Crime}</TableCell>
                <TableCell>{report.District}</TableCell>
                <TableCell>{report.Local_Address_Tole}</TableCell>
                <TableCell className="max-w-md">
                  <ExpandableText text={report.Report_Details} />
                </TableCell>
                <TableCell>
                  {new Date(report.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{report.status || 'submitted'}</TableCell>
                <TableCell>
                  {report.feedback ? (
                    <ExpandableText text={`${report.feedback} (${report.feedback_date})`} />
                  ) : (
                    'No feedback yet'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <FeedbackDialog 
                      reportId={report.id} 
                      feedbackBy="ICC"
                      onFeedbackSubmit={() => window.location.reload()}
                    />
                    <StatusUpdateDialog
                      reportId={report.id}
                      currentStatus={report.status || 'submitted'}
                      onStatusUpdate={() => window.location.reload()}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
