export interface Project {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  techStack: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  techStack?: string[];
}
