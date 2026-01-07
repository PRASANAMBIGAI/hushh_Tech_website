/**
 * Hushh Folio - Persona-Based Portfolio Configuration
 * 12 User Personas with persona-specific questions and templates
 */

// =====================================================
// Persona Types
// =====================================================

export type PersonaId = 
  | 'student'
  | 'fresher'
  | 'professional'
  | 'executive'
  | 'founder'
  | 'freelancer'
  | 'creative'
  | 'developer'
  | 'investor'
  | 'academic'
  | 'creator'
  | 'career_changer';

export interface Persona {
  id: PersonaId;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  color: string;
  sectionPriority: string[];
}

// =====================================================
// 12 User Personas
// =====================================================

export const PERSONAS: Persona[] = [
  {
    id: 'student',
    name: 'Student',
    emoji: '🎓',
    description: 'College/University student building future career',
    tagline: 'Showcase projects, skills, and potential',
    color: '#8B5CF6',
    sectionPriority: ['education', 'projects', 'skills', 'experience', 'achievements', 'about'],
  },
  {
    id: 'fresher',
    name: 'Fresh Graduate',
    emoji: '🌱',
    description: '0-1 years experience, entering the workforce',
    tagline: 'Highlight education and first steps',
    color: '#10B981',
    sectionPriority: ['education', 'experience', 'projects', 'skills', 'certifications', 'about'],
  },
  {
    id: 'professional',
    name: 'Working Professional',
    emoji: '💼',
    description: '2-8 years experience in industry',
    tagline: 'Showcase career growth and expertise',
    color: '#3B82F6',
    sectionPriority: ['experience', 'skills', 'projects', 'achievements', 'education', 'about'],
  },
  {
    id: 'executive',
    name: 'Senior Executive',
    emoji: '🎯',
    description: '10+ years, CXO/VP/Director level',
    tagline: 'Demonstrate leadership and strategic impact',
    color: '#1E3A5F',
    sectionPriority: ['experience', 'stats', 'achievements', 'board_positions', 'publications', 'about'],
  },
  {
    id: 'founder',
    name: 'Startup Founder',
    emoji: '🚀',
    description: 'Building or built a company',
    tagline: 'Tell your startup story and traction',
    color: '#F97316',
    sectionPriority: ['ventures', 'stats', 'vision', 'experience', 'team', 'about'],
  },
  {
    id: 'freelancer',
    name: 'Freelancer/Consultant',
    emoji: '💡',
    description: 'Independent professional offering services',
    tagline: 'Showcase work, clients, and results',
    color: '#EC4899',
    sectionPriority: ['services', 'portfolio_work', 'testimonials', 'clients', 'skills', 'about'],
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    emoji: '🎨',
    description: 'Designer, Artist, Photographer',
    tagline: 'Display your visual portfolio and style',
    color: '#A855F7',
    sectionPriority: ['portfolio_work', 'services', 'clients', 'awards', 'process', 'about'],
  },
  {
    id: 'developer',
    name: 'Developer/Engineer',
    emoji: '💻',
    description: 'Software engineers and tech builders',
    tagline: 'Showcase code, projects, and tech stack',
    color: '#22C55E',
    sectionPriority: ['tech_stack', 'projects', 'open_source', 'experience', 'certifications', 'about'],
  },
  {
    id: 'investor',
    name: 'Investor/VC/Angel',
    emoji: '📈',
    description: 'Angel investors, VCs, fund managers',
    tagline: 'Share investment thesis and portfolio',
    color: '#0EA5E9',
    sectionPriority: ['investment_thesis', 'portfolio_companies', 'stats', 'exits', 'value_add', 'about'],
  },
  {
    id: 'academic',
    name: 'Academic/Researcher',
    emoji: '👨‍🏫',
    description: 'Professors, Teachers, Researchers',
    tagline: 'Highlight publications and research',
    color: '#6366F1',
    sectionPriority: ['publications', 'research', 'teaching', 'education', 'awards', 'about'],
  },
  {
    id: 'creator',
    name: 'Content Creator',
    emoji: '🎤',
    description: 'YouTubers, Podcasters, Influencers',
    tagline: 'Showcase content and audience reach',
    color: '#EF4444',
    sectionPriority: ['stats', 'content', 'platforms', 'collaborations', 'services', 'about'],
  },
  {
    id: 'career_changer',
    name: 'Career Changer',
    emoji: '🔄',
    description: 'Transitioning between industries',
    tagline: 'Connect past experience to new direction',
    color: '#F59E0B',
    sectionPriority: ['transferable_skills', 'new_skills', 'past_experience', 'projects', 'why_hire_me', 'about'],
  },
];

// =====================================================
// Persona-Specific Questions
// =====================================================

export interface PersonaQuestion {
  id: number;
  question: string;
  category: string;
  followUpIf?: {
    condition: string;
    question: string;
  };
}

export const PERSONA_QUESTIONS: Record<PersonaId, PersonaQuestion[]> = {
  student: [
    { id: 1, question: "What are you studying and at which college/university?", category: 'education' },
    { id: 2, question: "What's your expected graduation year?", category: 'education' },
    { id: 3, question: "Have you done any internships? Where and what did you work on?", category: 'experience', followUpIf: { condition: 'yes', question: "What was your biggest learning or achievement there?" } },
    { id: 4, question: "What are your top 2-3 projects you're proud of?", category: 'projects' },
    { id: 5, question: "What technical skills have you learned? (Languages, tools, frameworks)", category: 'skills' },
    { id: 6, question: "Are you part of any clubs, societies, or leadership roles?", category: 'activities' },
    { id: 7, question: "What kind of job/role are you targeting after graduation?", category: 'goals' },
  ],
  fresher: [
    { id: 1, question: "What's your current role and company?", category: 'experience' },
    { id: 2, question: "Where did you graduate from and what was your major?", category: 'education' },
    { id: 3, question: "What's your biggest achievement in your first job so far?", category: 'achievements' },
    { id: 4, question: "What skills are you developing or want to master?", category: 'skills' },
    { id: 5, question: "Any personal projects or side work you're proud of?", category: 'projects' },
    { id: 6, question: "What certifications or courses have you completed?", category: 'certifications' },
    { id: 7, question: "Where do you see yourself in 2-3 years?", category: 'goals' },
  ],
  professional: [
    { id: 1, question: "What's your current role, company, and industry?", category: 'experience' },
    { id: 2, question: "How many years of experience do you have?", category: 'experience' },
    { id: 3, question: "What are your top 3 skills or areas of expertise?", category: 'skills' },
    { id: 4, question: "Tell me about your proudest achievement or biggest win.", category: 'achievements' },
    { id: 5, question: "What major projects have you led or contributed to?", category: 'projects' },
    { id: 6, question: "What makes you unique in your field?", category: 'unique' },
    { id: 7, question: "What kind of opportunities are you looking for?", category: 'goals' },
  ],
  executive: [
    { id: 1, question: "What's your current title and organization?", category: 'experience' },
    { id: 2, question: "What's the scale of your responsibility? (Team size, P&L, revenue)", category: 'stats' },
    { id: 3, question: "What strategic initiatives have you led?", category: 'achievements' },
    { id: 4, question: "Do you hold any board or advisory positions?", category: 'board_positions' },
    { id: 5, question: "What's your leadership philosophy?", category: 'about' },
    { id: 6, question: "Any speaking engagements, publications, or media features?", category: 'publications' },
    { id: 7, question: "What opportunities interest you? (Board seats, advisory, new ventures)", category: 'goals' },
  ],
  founder: [
    { id: 1, question: "What's your company name and what problem does it solve?", category: 'ventures' },
    { id: 2, question: "What stage is your startup at? (Idea, MVP, Revenue, Funded)", category: 'ventures' },
    { id: 3, question: "What's your traction? (Users, revenue, growth rate)", category: 'stats', followUpIf: { condition: 'raised funding', question: "How much have you raised and from whom?" } },
    { id: 4, question: "Why did you start this company? What's your founder story?", category: 'about' },
    { id: 5, question: "Who are your co-founders or key team members?", category: 'team' },
    { id: 6, question: "Any press coverage or notable achievements?", category: 'press' },
    { id: 7, question: "What's your vision for the next 5 years?", category: 'vision' },
  ],
  freelancer: [
    { id: 1, question: "What services do you offer?", category: 'services' },
    { id: 2, question: "How many years have you been freelancing?", category: 'experience' },
    { id: 3, question: "Can you share 3-5 notable projects or clients?", category: 'portfolio_work' },
    { id: 4, question: "What results have you delivered for clients?", category: 'testimonials' },
    { id: 5, question: "What tools and technologies do you specialize in?", category: 'skills' },
    { id: 6, question: "What makes you different from other freelancers?", category: 'unique' },
    { id: 7, question: "What types of projects are you looking for?", category: 'goals' },
  ],
  creative: [
    { id: 1, question: "What type of creative work do you do? (Design, Photography, Art)", category: 'services' },
    { id: 2, question: "How would you describe your creative style or aesthetic?", category: 'about' },
    { id: 3, question: "Can you share 5-10 of your best works?", category: 'portfolio_work' },
    { id: 4, question: "Which brands or clients have you worked with?", category: 'clients' },
    { id: 5, question: "Have you won any awards or been featured anywhere?", category: 'awards' },
    { id: 6, question: "What's your creative process like?", category: 'process' },
    { id: 7, question: "What kind of projects excite you most?", category: 'goals' },
  ],
  developer: [
    { id: 1, question: "What's your primary tech stack? (Languages, frameworks, tools)", category: 'tech_stack' },
    { id: 2, question: "What's your current role and focus area?", category: 'experience' },
    { id: 3, question: "Share 3-5 projects you've built. What did you learn?", category: 'projects' },
    { id: 4, question: "Do you contribute to open source? Share your GitHub username.", category: 'open_source', followUpIf: { condition: 'yes', question: "Which projects are you most proud of?" } },
    { id: 5, question: "Any certifications? (AWS, GCP, Azure, etc.)", category: 'certifications' },
    { id: 6, question: "Do you write technical blogs or tutorials?", category: 'writing' },
    { id: 7, question: "What kind of tech challenges interest you?", category: 'goals' },
  ],
  investor: [
    { id: 1, question: "What's your investment focus? (Sectors, stages, check size)", category: 'investment_thesis' },
    { id: 2, question: "How many companies have you invested in?", category: 'portfolio_companies' },
    { id: 3, question: "Any notable exits or successful investments?", category: 'exits' },
    { id: 4, question: "What's your background before investing?", category: 'experience' },
    { id: 5, question: "How do you help founders beyond capital?", category: 'value_add' },
    { id: 6, question: "Any thought leadership - articles, podcasts, talks?", category: 'publications' },
    { id: 7, question: "What makes a founder reach out to you?", category: 'about' },
  ],
  academic: [
    { id: 1, question: "What's your current title and institution?", category: 'education' },
    { id: 2, question: "What's your research focus area?", category: 'research' },
    { id: 3, question: "List your top 3-5 publications with citations.", category: 'publications' },
    { id: 4, question: "What courses do you teach?", category: 'teaching' },
    { id: 5, question: "Any grants, fellowships, or awards?", category: 'awards' },
    { id: 6, question: "How many PhD students have you mentored?", category: 'students' },
    { id: 7, question: "What collaborations or speaking opportunities interest you?", category: 'goals' },
  ],
  creator: [
    { id: 1, question: "What type of content do you create? (Video, Podcast, Social)", category: 'content' },
    { id: 2, question: "What's your niche or topic focus?", category: 'niche' },
    { id: 3, question: "What are your audience stats? (Followers, subscribers, views)", category: 'stats' },
    { id: 4, question: "Which platforms are you active on?", category: 'platforms' },
    { id: 5, question: "Share some of your best content pieces.", category: 'content' },
    { id: 6, question: "Which brands have you collaborated with?", category: 'collaborations' },
    { id: 7, question: "What sponsorship or collaboration opportunities are you open to?", category: 'goals' },
  ],
  career_changer: [
    { id: 1, question: "What field are you transitioning FROM?", category: 'past_experience' },
    { id: 2, question: "What field are you transitioning TO?", category: 'new_direction' },
    { id: 3, question: "Why are you making this change?", category: 'about' },
    { id: 4, question: "What transferable skills from your past career apply?", category: 'transferable_skills' },
    { id: 5, question: "What new skills have you learned? (Courses, bootcamps, self-study)", category: 'new_skills' },
    { id: 6, question: "Any projects in your new field?", category: 'projects' },
    { id: 7, question: "What unique perspective does your background give you?", category: 'why_hire_me' },
  ],
};

// =====================================================
// 12 Templates with Custom Styling Options
// =====================================================

export type ExtendedTemplateId = 
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'modern'
  | 'developer'
  | 'gradient'
  | 'elegant'
  | 'bold'
  | 'nature'
  | 'neon'
  | 'classic'
  | 'startup';

export interface ExtendedTemplate {
  id: ExtendedTemplateId;
  name: string;
  emoji: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  features: string[];
  recommendedFor: PersonaId[];
  isPremium: boolean;
}

export const EXTENDED_TEMPLATES: ExtendedTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    emoji: '✨',
    description: 'Clean, white background with typography-focused design',
    colors: { primary: '#F97316', secondary: '#FB923C', background: '#FFFFFF', text: '#1A1A1A', accent: '#F97316' },
    features: ['Clean Design', 'Fast Loading', 'Mobile First'],
    recommendedFor: ['student', 'fresher', 'professional'],
    isPremium: false,
  },
  {
    id: 'executive',
    name: 'Executive',
    emoji: '👔',
    description: 'Corporate feel with navy and gold accents',
    colors: { primary: '#1E3A5F', secondary: '#C9A227', background: '#F8FAFC', text: '#1E3A5F', accent: '#C9A227' },
    features: ['Testimonials', 'Achievements', 'Corporate Style'],
    recommendedFor: ['executive', 'professional', 'investor'],
    isPremium: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    description: 'Bold colors and gradients for designers',
    colors: { primary: '#8B5CF6', secondary: '#EC4899', background: '#0F172A', text: '#FFFFFF', accent: '#EC4899' },
    features: ['Gradients', 'Animations', 'Portfolio Gallery'],
    recommendedFor: ['creative', 'freelancer', 'creator'],
    isPremium: false,
  },
  {
    id: 'modern',
    name: 'Modern',
    emoji: '🌙',
    description: 'Dark mode with glassmorphism effects',
    colors: { primary: '#10B981', secondary: '#34D399', background: '#111827', text: '#F3F4F6', accent: '#10B981' },
    features: ['Dark Mode', 'Glassmorphism', 'Smooth Animations'],
    recommendedFor: ['developer', 'professional', 'founder'],
    isPremium: false,
  },
  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    description: 'Terminal-style design for techies',
    colors: { primary: '#22C55E', secondary: '#4ADE80', background: '#0D1117', text: '#C9D1D9', accent: '#22C55E' },
    features: ['Terminal Style', 'GitHub Stats', 'Code Snippets'],
    recommendedFor: ['developer', 'student'],
    isPremium: false,
  },
  {
    id: 'gradient',
    name: 'Gradient Flow',
    emoji: '🌈',
    description: 'Vibrant gradient backgrounds with smooth transitions',
    colors: { primary: '#667EEA', secondary: '#764BA2', background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', text: '#FFFFFF', accent: '#F0ABFC' },
    features: ['Gradient Bg', 'Floating Cards', 'Vibrant Colors'],
    recommendedFor: ['creator', 'creative', 'freelancer'],
    isPremium: true,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    emoji: '🖤',
    description: 'Sophisticated black and white with serif fonts',
    colors: { primary: '#18181B', secondary: '#52525B', background: '#FAFAFA', text: '#18181B', accent: '#A1A1AA' },
    features: ['Serif Typography', 'Elegant Layout', 'Print-Ready'],
    recommendedFor: ['academic', 'executive', 'investor'],
    isPremium: true,
  },
  {
    id: 'bold',
    name: 'Bold Impact',
    emoji: '💥',
    description: 'High-contrast design with bold typography',
    colors: { primary: '#EF4444', secondary: '#F97316', background: '#FAFAFA', text: '#1F2937', accent: '#EF4444' },
    features: ['Large Type', 'High Contrast', 'Impact Focus'],
    recommendedFor: ['founder', 'creator', 'career_changer'],
    isPremium: true,
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    description: 'Earthy tones with organic feel',
    colors: { primary: '#059669', secondary: '#84CC16', background: '#ECFDF5', text: '#1F2937', accent: '#10B981' },
    features: ['Organic Design', 'Calming Colors', 'Eco-Friendly'],
    recommendedFor: ['academic', 'freelancer', 'creative'],
    isPremium: true,
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    emoji: '💜',
    description: 'Cyberpunk-inspired with neon accents',
    colors: { primary: '#A855F7', secondary: '#EC4899', background: '#0F0F23', text: '#E0E0FF', accent: '#00FF94' },
    features: ['Neon Glow', 'Cyber Style', 'Dark Theme'],
    recommendedFor: ['developer', 'creator', 'creative'],
    isPremium: true,
  },
  {
    id: 'classic',
    name: 'Classic Pro',
    emoji: '📄',
    description: 'Traditional resume-style clean layout',
    colors: { primary: '#1E40AF', secondary: '#3B82F6', background: '#FFFFFF', text: '#1F2937', accent: '#1E40AF' },
    features: ['Resume Style', 'ATS Friendly', 'Professional'],
    recommendedFor: ['fresher', 'professional', 'career_changer'],
    isPremium: false,
  },
  {
    id: 'startup',
    name: 'Startup Vibe',
    emoji: '🚀',
    description: 'Modern SaaS-inspired with orange accents',
    colors: { primary: '#F97316', secondary: '#FBBF24', background: '#18181B', text: '#F4F4F5', accent: '#F97316' },
    features: ['SaaS Style', 'Metrics Focus', 'CTA Buttons'],
    recommendedFor: ['founder', 'investor', 'freelancer'],
    isPremium: false,
  },
];

// =====================================================
// Custom Styling Options
// =====================================================

export interface CustomStyling {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  
  // Typography
  fontFamily: FontFamily;
  headingWeight: FontWeight;
  bodyWeight: FontWeight;
  
  // Layout
  borderRadius: BorderRadius;
  cardStyle: CardStyle;
  
  // Effects
  enableAnimations: boolean;
  enableGradients: boolean;
  enableShadows: boolean;
}

export type FontFamily = 
  | 'inter' 
  | 'poppins' 
  | 'playfair' 
  | 'roboto' 
  | 'montserrat' 
  | 'merriweather'
  | 'source_code'
  | 'dm_sans';

export type FontWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

export type BorderRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

export type CardStyle = 'flat' | 'elevated' | 'bordered' | 'glass';

export const FONT_OPTIONS: { id: FontFamily; name: string; preview: string }[] = [
  { id: 'inter', name: 'Inter', preview: 'Modern & Clean' },
  { id: 'poppins', name: 'Poppins', preview: 'Friendly & Round' },
  { id: 'playfair', name: 'Playfair Display', preview: 'Elegant Serif' },
  { id: 'roboto', name: 'Roboto', preview: 'Professional' },
  { id: 'montserrat', name: 'Montserrat', preview: 'Bold & Modern' },
  { id: 'merriweather', name: 'Merriweather', preview: 'Classic Serif' },
  { id: 'source_code', name: 'Source Code Pro', preview: 'Developer Style' },
  { id: 'dm_sans', name: 'DM Sans', preview: 'Geometric Sans' },
];

export const COLOR_PRESETS: { name: string; colors: Partial<CustomStyling> }[] = [
  { name: 'Ocean Blue', colors: { primaryColor: '#0EA5E9', secondaryColor: '#38BDF8', accentColor: '#0284C7' } },
  { name: 'Forest Green', colors: { primaryColor: '#059669', secondaryColor: '#34D399', accentColor: '#10B981' } },
  { name: 'Sunset Orange', colors: { primaryColor: '#F97316', secondaryColor: '#FB923C', accentColor: '#EA580C' } },
  { name: 'Royal Purple', colors: { primaryColor: '#8B5CF6', secondaryColor: '#A78BFA', accentColor: '#7C3AED' } },
  { name: 'Rose Pink', colors: { primaryColor: '#EC4899', secondaryColor: '#F472B6', accentColor: '#DB2777' } },
  { name: 'Midnight Black', colors: { primaryColor: '#1F2937', secondaryColor: '#374151', accentColor: '#111827' } },
  { name: 'Gold Luxury', colors: { primaryColor: '#D97706', secondaryColor: '#FBBF24', accentColor: '#B45309' } },
  { name: 'Teal Fresh', colors: { primaryColor: '#14B8A6', secondaryColor: '#2DD4BF', accentColor: '#0D9488' } },
];

// =====================================================
// Default Styling
// =====================================================

export const DEFAULT_STYLING: CustomStyling = {
  primaryColor: '#F97316',
  secondaryColor: '#FB923C',
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  accentColor: '#F97316',
  fontFamily: 'inter',
  headingWeight: 'bold',
  bodyWeight: 'regular',
  borderRadius: 'medium',
  cardStyle: 'elevated',
  enableAnimations: true,
  enableGradients: true,
  enableShadows: true,
};

// =====================================================
// Updated Wizard Steps (8 steps with persona)
// =====================================================

export type ExtendedWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const EXTENDED_WIZARD_STEPS: { step: ExtendedWizardStep; title: string; description: string }[] = [
  { step: 1, title: 'Choose Persona', description: 'Select who you are' },
  { step: 2, title: 'Basic Info', description: 'Your name and contact' },
  { step: 3, title: 'Interview', description: 'Answer personalized questions' },
  { step: 4, title: 'Template', description: 'Pick your style' },
  { step: 5, title: 'Customize', description: 'Colors, fonts & styling' },
  { step: 6, title: 'Photo', description: 'Upload & enhance' },
  { step: 7, title: 'Preview', description: 'Review your portfolio' },
  { step: 8, title: 'Publish', description: 'Go live!' },
];

// =====================================================
// Helper Functions
// =====================================================

export function getPersonaById(id: PersonaId): Persona | undefined {
  return PERSONAS.find(p => p.id === id);
}

export function getQuestionsForPersona(personaId: PersonaId): PersonaQuestion[] {
  return PERSONA_QUESTIONS[personaId] || [];
}

export function getRecommendedTemplates(personaId: PersonaId): ExtendedTemplate[] {
  return EXTENDED_TEMPLATES.filter(t => t.recommendedFor.includes(personaId));
}

export function getTemplateById(id: ExtendedTemplateId): ExtendedTemplate | undefined {
  return EXTENDED_TEMPLATES.find(t => t.id === id);
}
