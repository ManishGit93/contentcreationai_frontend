import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface ProposalSections {
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  terms: string;
}

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
      const response = await api.post('/ai/generate-proposal', formData);
      setGeneratedSections(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate proposal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedSections) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await api.post('/proposals', {
        ...formData,
        ...generatedSections,
        status: 'draft',
      });
      navigate(`/proposals/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save proposal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
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
          ].map((section) => (
            <Card key={section.key}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(section.content)}
                >
                  Copy
                </Button>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

