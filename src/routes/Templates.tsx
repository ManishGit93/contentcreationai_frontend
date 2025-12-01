import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Loader } from '../components/ui/Loader';
import { Modal } from '../components/ui/Modal';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Template {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      // Handle different response structures
      let templatesData = response.data;
      
      // If response.data is an object with a templates/data/items property
      if (templatesData && typeof templatesData === 'object' && !Array.isArray(templatesData)) {
        templatesData = templatesData.templates || templatesData.data || templatesData.items || [];
      }
      
      // Ensure it's an array
      if (!Array.isArray(templatesData)) {
        console.warn('Expected array but got:', templatesData);
        templatesData = [];
      }
      
      setTemplates(templatesData);
    } catch (err: any) {
      setError('Failed to load templates');
      console.error('Error fetching templates:', err);
      setTemplates([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.title || !newTemplate.content) {
      return;
    }

    setIsCreating(true);
    try {
      await api.post('/templates', newTemplate);
      setShowCreateModal(false);
      setNewTemplate({ title: '', content: '' });
      fetchTemplates();
    } catch (err: any) {
      setError('Failed to create template');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleApplyTemplate = (template: Template) => {
    // Navigate to new proposal page with template data pre-filled
    // This would require passing state through navigation or storing in context
    navigate('/proposals/new', { state: { template } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create New Template</Button>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {isLoading ? (
        <Loader />
      ) : templates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any templates yet.</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Your First Template</Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} hover>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Created {formatDate(template.createdAt)}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {template.content.substring(0, 150)}...
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleApplyTemplate(template)}
              >
                Apply Template
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Template"
        size="lg"
      >
        <form onSubmit={handleCreateTemplate} className="space-y-4">
          <Input
            label="Template Title"
            value={newTemplate.title}
            onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
            required
            placeholder="e.g., Web Development Proposal Template"
          />
          <Textarea
            label="Template Content"
            value={newTemplate.content}
            onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
            required
            rows={10}
            placeholder="Enter your template content here. You can use this as a base for new proposals..."
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Create Template
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

