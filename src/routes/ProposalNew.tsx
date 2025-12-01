import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface ProposalSections {
  scopeOfWork: string | object;
  deliverables: string | object;
  timeline: string | object;
  pricing: string | object;
  terms: string | object;
}

// Helper function to convert objects to readable strings
const formatSectionContent = (content: string | object): string => {
  if (typeof content === 'string') {
    return content;
  }
  
  if (typeof content === 'object' && content !== null) {
    // Handle timeline object with {start, mid, end}
    if ('start' in content && 'mid' in content && 'end' in content) {
      return `# Timeline & Milestones

## Project Start
${(content as any).start || 'N/A'}

## Mid-Project Milestones
${(content as any).mid || 'N/A'}

## Project Completion
${(content as any).end || 'N/A'}`;
    }
    
    // Handle pricing object with {totalCost, paymentTerms}
    if ('totalCost' in content || 'paymentTerms' in content) {
      const pricing = content as any;
      return `# Pricing Breakdown

## Total Cost
${pricing.totalCost || 'To be discussed'}

## Payment Terms
${pricing.paymentTerms || 'Standard payment terms apply'}

${pricing.breakdown ? `## Cost Breakdown\n${pricing.breakdown}` : ''}
${pricing.notes ? `## Additional Notes\n${pricing.notes}` : ''}`;
    }
    
    // Generic object - convert to formatted string
    return JSON.stringify(content, null, 2);
  }
  
  return String(content || '');
};

export const ProposalNew: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    clientCompany: '',
    projectTitle: '',
    projectDescription: '',
    budgetRange: '',
    timeline: '',
    services: [] as string[],
    tone: 'professional',
  });
  const [generatedSections, setGeneratedSections] = useState<ProposalSections | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const servicesOptions = ['Web Design', 'Development', 'SEO', 'Maintenance', 'Consulting', 'Branding'];

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.clientName || !formData.projectTitle || !formData.projectDescription) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);

    try {
      // Clean the data - remove empty strings and ensure services is an array
      const cleanedData: any = {
        clientName: formData.clientName.trim(),
        projectTitle: formData.projectTitle.trim(),
        projectDescription: formData.projectDescription.trim(),
        tone: formData.tone,
      };
      
      // Add optional fields only if they have values
      if (formData.clientCompany.trim()) {
        cleanedData.clientCompany = formData.clientCompany.trim();
      }
      if (formData.budgetRange) {
        cleanedData.budgetRange = formData.budgetRange;
      }
      if (formData.timeline) {
        cleanedData.timeline = formData.timeline;
      }
      if (formData.services.length > 0) {
        cleanedData.services = formData.services;
      }
      
      // Log the request data for debugging
      console.log('Sending proposal generation request:', cleanedData);
      
      const response = await api.post('/ai/generate-proposal', cleanedData);
      
      // Handle different response structures
      let sectionsData = response.data;
      
      // If response.data is an object with nested data
      if (sectionsData && typeof sectionsData === 'object') {
        // Check if sections are nested in a 'data' or 'sections' property
        sectionsData = sectionsData.data || sectionsData.sections || sectionsData;
      }
      
      // Validate that we have the required sections
      if (!sectionsData || typeof sectionsData !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      // Ensure all required sections exist
      const requiredSections = ['scopeOfWork', 'deliverables', 'timeline', 'pricing', 'terms'];
      const missingSections = requiredSections.filter(section => !sectionsData[section]);
      
      if (missingSections.length > 0) {
        console.warn('Missing sections in response:', missingSections);
      }
      
      setGeneratedSections(sectionsData as ProposalSections);
    } catch (err: any) {
      console.error('Error generating proposal:', err);
      
      // Better error messages
      let errorMessage = 'Failed to generate proposal. Please try again.';
      
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 500) {
          errorMessage = data?.message || 'Server error. Please check your backend logs or try again later.';
        } else if (status === 400) {
          errorMessage = data?.message || 'Invalid request. Please check all fields are filled correctly.';
        } else if (status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (data?.message) {
          errorMessage = data.message;
        } else {
          errorMessage = `Error ${status}: ${data?.error || 'Request failed'}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check if your backend is running.';
      } else {
        // Error setting up the request
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedSections) return;

    setIsSaving(true);
    setError('');

    try {
      // Convert all sections to strings before saving
      const sectionsToSave = {
        scopeOfWork: formatSectionContent(generatedSections.scopeOfWork),
        deliverables: formatSectionContent(generatedSections.deliverables),
        timeline: formatSectionContent(generatedSections.timeline),
        pricing: formatSectionContent(generatedSections.pricing),
        terms: formatSectionContent(generatedSections.terms),
      };

      const response = await api.post('/proposals', {
        ...formData,
        ...sectionsToSave,
        status: 'draft',
      });
      navigate(`/proposals/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save proposal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (content: string | object) => {
    const text = formatSectionContent(content);
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Proposal</h1>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {!generatedSections ? (
        <Card>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Client Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
              <Input
                label="Client Company"
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
              />
            </div>

            <Input
              label="Project Title *"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              required
            />

            <Textarea
              label="Project Description / Requirements *"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              required
              rows={8}
              placeholder="Describe the project requirements, goals, and any specific details..."
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-plus">$50,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline Preference
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                >
                  <option value="">Select timeline</option>
                  <option value="2-4-weeks">2-4 weeks</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-months-plus">6+ months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {servicesOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposal Tone
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="bold">Bold</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isGenerating}>
              Generate Proposal with AI
            </Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Generated Proposal</h2>
            <Button onClick={handleSave} isLoading={isSaving}>
              Save Proposal
            </Button>
          </div>

          {[
            { title: 'Scope of Work', content: generatedSections.scopeOfWork, key: 'scope' },
            { title: 'Deliverables', content: generatedSections.deliverables, key: 'deliverables' },
            { title: 'Timeline & Milestones', content: generatedSections.timeline, key: 'timeline' },
            { title: 'Pricing Breakdown', content: generatedSections.pricing, key: 'pricing' },
            { title: 'Terms & Conditions', content: generatedSections.terms, key: 'terms' },
          ].map((section) => {
            const formattedContent = formatSectionContent(section.content);
            return (
              <Card key={section.key}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formattedContent)}
                  >
                    Copy
                  </Button>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{formattedContent}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

