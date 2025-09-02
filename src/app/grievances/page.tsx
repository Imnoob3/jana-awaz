'use client';

import { GrievancesList } from '@/components/grievances-list';

export default function RecentGrievancesPage() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Recent Grievances</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">View all submitted grievances and concerns from the community.</p>
        </div>
        <GrievancesList />
      </div>
    </main>
  );
}
