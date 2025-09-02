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

interface Report {
  id: string;
  type_of_crime: string;
  Specific_Type_of_Crime: string;
  Report_Details: string;
  District: string;
  Local_Address_Tole: string;
  image: string;
  created_at: string;
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
              <TableHead>Crime Type</TableHead>
              <TableHead>Specific Type</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Local Address</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.type_of_crime}</TableCell>
                <TableCell>{report.Specific_Type_of_Crime}</TableCell>
                <TableCell>{report.District}</TableCell>
                <TableCell>{report.Local_Address_Tole}</TableCell>
                <TableCell className="max-w-md truncate">
                  {report.Report_Details}
                </TableCell>
                <TableCell>
                  {new Date(report.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
