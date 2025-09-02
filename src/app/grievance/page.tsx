'use client';

import { GrievanceForm } from '@/components/grievance-form';
import { GrievancesList } from '@/components/grievances-list';

export default function GrievancePage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Voice a Grievance</h1>
          <p className="text-muted-foreground">Submit your concerns about rules, governance, or social issues. Your submission is anonymous.</p>
        </div>
        <GrievanceForm />
      </div>
    </main>
  );
}
