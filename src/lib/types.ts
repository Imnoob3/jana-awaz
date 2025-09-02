

export type Report = {
  track_id: string;
  created_at: string; 
  type_of_crime: 'Government Crime' | 'Civilian Crime';
  Specific_Type_of_Crime: string;
  Report_Details: string;
  District: string;
  Local_Address_Tole: string;
  image: string | null;
  status?: 'submitted' | 'under_review' | 'action_taken' | 'resolved';
  feedback?: string;
  feedback_date?: string;
  feedback_by?: string;
};

export type GrievanceComment = {
  id: string;
  grievanceId: string;
  text: string;
  createdAt: string;
};

export type GrievanceLike = {
  id: string;
  grievanceId: string;
  createdAt: string;
};

export type Grievance = {
  id: string;
  title: string;
  description: string;
  photoDataUri?: string;
  createdAt: string;
  likes: number;
  comments: GrievanceComment[];
};

// Local-only report type used for demo/legacy UI lists
export type LocalReport = {
  id: string;
  reportText: string;
  photoDataUri: string;
  crimeType: 'Government' | 'Civilian' | 'ICC';
  crimeSubType: string;
  createdAt: string;
  district: string;
  localAddress: string;
};

    