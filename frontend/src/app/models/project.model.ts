import { Ticket } from "./ticket.model";

export interface Project {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  techStack: string[] | null;
  hasBackend: boolean;
  backendStack: string[] | null;
  createdAt: string;
  updatedAt: string;
  tickets: Ticket[];
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  techStack?: string[];
  hasBackend?: boolean;
  backendStack?: string[];
}

export interface TechOption {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops';
  logo: string;
}
