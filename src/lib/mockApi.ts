// Mock API responses for development/testing without backend
// Set VITE_USE_MOCK_API=true in .env to enable

interface MockUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
}

interface MockProposal {
  id: string;
  clientName: string;
  projectTitle: string;
  status: 'draft' | 'sent';
  createdAt: string;
  clientCompany?: string;
  scopeOfWork?: string;
  deliverables?: string;
  timeline?: string;
  pricing?: string;
  terms?: string;
}

interface MockTemplate {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// In-memory storage (resets on page refresh)
let mockUsers: MockUser[] = [];
let mockProposals: MockProposal[] = [];
let mockTemplates: MockTemplate[] = [];
let currentUser: MockUser | null = null;

export const mockApi = {
  // Auth
  async register(data: { name: string; email: string; password: string }) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    if (mockUsers.find(u => u.email === data.email)) {
      throw { response: { data: { message: 'Email already registered' }, status: 400 } };
    }

    const user: MockUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      plan: 'free',
    };

    mockUsers.push(user);
    currentUser = user;

    const token = `mock_token_${Date.now()}`;
    return { data: { user, token } };
  },

  async login(data: { email: string; password: string }) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      throw { response: { data: { message: 'Invalid email or password' }, status: 401 } };
    }

    currentUser = user;
    const token = `mock_token_${Date.now()}`;
    return { data: { user, token } };
  },

  // Proposals
  async getProposals() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockProposals.filter(p => p.id.startsWith('proposal_')) };
  },

  async getProposal(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const proposal = mockProposals.find(p => p.id === id);
    if (!proposal) {
      throw { response: { data: { message: 'Proposal not found' }, status: 404 } };
    }
    return { data: proposal };
  },

  async createProposal(data: any) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const proposal: MockProposal = {
      id: `proposal_${Date.now()}`,
      clientName: data.clientName,
      clientCompany: data.clientCompany,
      projectTitle: data.projectTitle,
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      scopeOfWork: data.scopeOfWork,
      deliverables: data.deliverables,
      timeline: data.timeline,
      pricing: data.pricing,
      terms: data.terms,
    };
    mockProposals.push(proposal);
    return { data: proposal };
  },

  // AI Generation
  async generateProposal(data: any) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing time

    const mockSections = {
      scopeOfWork: `# Scope of Work\n\nThis project involves ${data.projectTitle} for ${data.clientName}${data.clientCompany ? ` (${data.clientCompany})` : ''}.\n\n## Overview\n${data.projectDescription}\n\n## Key Activities\n- Requirements gathering and analysis\n- Design and development\n- Testing and quality assurance\n- Deployment and handover\n\n## Services Included\n${data.services.join(', ') || 'Web Development'}`,
      
      deliverables: `# Deliverables\n\n## Primary Deliverables\n1. Complete ${data.projectTitle}\n2. Documentation and user guides\n3. Source code and assets\n4. Training materials (if applicable)\n\n## Deliverable Format\nAll deliverables will be provided in agreed formats and will be reviewed and approved before final delivery.`,
      
      timeline: `# Timeline & Milestones\n\n## Project Duration\n${data.timeline || '2-4 weeks'}\n\n## Key Milestones\n1. **Week 1**: Project kickoff and requirements finalization\n2. **Week 2**: Design and development phase\n3. **Week 3**: Testing and revisions\n4. **Week 4**: Final delivery and handover\n\n## Timeline Notes\nTimeline may be adjusted based on client feedback and scope changes.`,
      
      pricing: `# Pricing Breakdown\n\n## Project Budget\n${data.budgetRange ? `Budget Range: ${data.budgetRange}` : 'To be discussed'}\n\n## Cost Breakdown\n- Design & Development: 60%\n- Project Management: 20%\n- Testing & QA: 15%\n- Contingency: 5%\n\n## Payment Terms\n- 50% upfront payment\n- 50% upon completion and delivery\n\n## Additional Notes\nAll prices are estimates and may vary based on final requirements.`,
      
      terms: `# Terms & Conditions\n\n## Project Terms\n1. This proposal is valid for 30 days from the date of issue.\n2. Project scope may be adjusted with written agreement from both parties.\n3. Additional work outside the scope will be billed separately.\n\n## Intellectual Property\nUpon final payment, all project deliverables will be transferred to the client.\n\n## Cancellation\nEither party may cancel this agreement with 14 days written notice.\n\n## Acceptance\nBy proceeding with this project, the client agrees to these terms and conditions.`,
    };

    return { data: mockSections };
  },

  // Templates
  async getTemplates() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockTemplates };
  },

  async createTemplate(data: { title: string; content: string }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const template: MockTemplate = {
      id: `template_${Date.now()}`,
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    mockTemplates.push(template);
    return { data: template };
  },

  // Profile
  async updateProfile(data: { name: string }) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (currentUser) {
      currentUser.name = data.name;
      const updatedUser = { ...currentUser };
      return { data: updatedUser };
    }
    throw { response: { data: { message: 'User not found' }, status: 404 } };
  },
};

// Helper to check if mock API should be used
// Only use mock API if explicitly enabled via VITE_USE_MOCK_API=true
export const shouldUseMockApi = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};

