

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

export type Grievance = {
  id: string;
  title: string;
  description: string;
  photoDataUri?: string;
  createdAt: string;
};

    

    