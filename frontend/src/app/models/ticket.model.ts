export interface Ticket {
  id: number;
  projectId: number;
  title: string;
  description: string;
  userStory: string | null;
  technicalSpecs: string[] | null;
  acceptanceCriteria: string[] | null;
  type: 'feature' | 'chore' | 'bug' | 'spike';
  status: 'todo' | 'in_progress' | 'code_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number;
  position: number;
  estimatedHours: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  projectId: number;
  title: string;
  description: string;
  userStory?: string;
  technicalSpecs?: string[];
  acceptanceCriteria?: string[];
  type: 'feature' | 'chore' | 'bug' | 'spike';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  complexity?: number;
  position?: number;
  estimatedHours?: number;
  notes?: string;
}
