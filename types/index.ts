export interface HeroSection {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    cta_text: string;
    cta_link: string;
    availability_status: string;
    background_image: string | null;
    profile_image: string | null;
    updated_at: string;
}

export interface AboutSection {
    id: string;
    title: string;
    content: string;
    image: string | null;
    resume_url: string | null;
    updated_at: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    icon: string | null;
    order_index: number;
    created_at: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    description: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    location: string;
    company_logo: string | null;
    order_index: number;
    created_at: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    long_description: string;
    image: string | null;
    video: string | null;
    demo_url: string | null;
    github_url: string | null;
    technologies: string[];
    featured: boolean;
    order_index: number;
    created_at: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    logo: string | null;
    order_index: number;
    created_at: string;
}

export interface ContactInfo {
    id: string;
    email: string;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    github: string | null;
    twitter: string | null;
    portfolio_url: string | null;
    updated_at: string;
}
