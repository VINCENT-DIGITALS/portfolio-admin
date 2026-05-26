export interface Profile {
  id: number;
  full_name: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  portfolio_url: string | null;
}

export interface Skill {
  id: number;
  name: string;
  category: string | null;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ProjectImage {
  id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  status: string | null;
  role: string | null;
  start_date: string | null;
  end_date: string | null;
  github_url: string | null;
  live_demo_url: string | null;
  featured_image_url: string | null;
  tech_stack: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  images?: ProjectImage[];
  created_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  cover_image_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
}

export interface Education {
  id: number;
  school: string;
  degree: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  certificate_url: string | null;
  image_url: string | null;
  sort_order: number;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected';
export interface Comment {
  id: number;
  name: string;
  email?: string | null;
  message: string;
  rating: number | null;
  project_id: number | null;
  status: CommentStatus;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MediaFile {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  folder: string | null;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface DashboardData {
  totals: {
    projects: number;
    published_projects: number;
    blogs: number;
    published_blogs: number;
    comments_total: number;
    comments_pending: number;
    comments_approved: number;
    unread_messages: number;
    contact_messages_total: number;
  };
  recent_comments: Comment[];
  recent_messages: ContactMessage[];
}

export interface ListResponse<T> { data: T[] }
export interface ItemResponse<T> { data: T }
