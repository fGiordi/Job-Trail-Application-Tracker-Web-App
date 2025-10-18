export interface JobApplication {
  id: string;
  company: string;
  title: string;
  dateApplied: string;
  status: "applied" | "interviewing" | "offer" | "rejected" | "accepted";
  location?: string;
  salary?: string;
  notes?: string;
}
