import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { Modal } from '../components/ui/Modal';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Proposal {
  id: string;
  clientName: string;
  clientCompany?: string;
  projectTitle: string;
  scopeOfWork: string | object;
  deliverables: string | object;
  timeline: string | object;
  pricing: string | object;
  terms: string | object;
  status: 'draft' | 'sent';
  createdAt: string;
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

export const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProposal();
    }
  }, [id]);

  const fetchProposal = async () => {
    try {
      const response = await api.get(`/proposals/${id}`);
      setProposal(response.data);
    } catch (err: any) {
      setError('Failed to load proposal');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyEntireProposal = () => {
    if (!proposal) return;
    const fullText = `
PROPOSAL: ${proposal.projectTitle}
Client: ${proposal.clientName}${proposal.clientCompany ? ` (${proposal.clientCompany})` : ''}

SCOPE OF WORK
${formatSectionContent(proposal.scopeOfWork)}

DELIVERABLES
${formatSectionContent(proposal.deliverables)}

TIMELINE & MILESTONES
${formatSectionContent(proposal.timeline)}

PRICING BREAKDOWN
${formatSectionContent(proposal.pricing)}

TERMS & CONDITIONS
${formatSectionContent(proposal.terms)}
    `.trim();
    navigator.clipboard.writeText(fullText);
    // You could add a toast notification here
  };

  const generateMarkdown = () => {
    if (!proposal) return '';
    return `# ${proposal.projectTitle}

**Client:** ${proposal.clientName}${proposal.clientCompany ? ` (${proposal.clientCompany})` : ''}  
**Status:** ${proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}  
**Created:** ${new Date(proposal.createdAt).toLocaleDateString()}

---

## Scope of Work

${formatSectionContent(proposal.scopeOfWork)}

## Deliverables

${formatSectionContent(proposal.deliverables)}

## Timeline & Milestones

${formatSectionContent(proposal.timeline)}

## Pricing Breakdown

${formatSectionContent(proposal.pricing)}

## Terms & Conditions

${formatSectionContent(proposal.terms)}
`;
  };

  const handleDuplicate = async () => {
    if (!proposal) return;
    setIsDuplicating(true);
    try {
      // Assuming the backend has a duplicate endpoint, or we can create a new proposal with the same data
      const response = await api.post('/proposals', {
        ...proposal,
        projectTitle: `${proposal.projectTitle} (Copy)`,
        status: 'draft',
      });
      navigate(`/proposals/${response.data.id}`);
    } catch (err: any) {
      setError('Failed to duplicate proposal');
      console.error(err);
    } finally {
      setIsDuplicating(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (error || !proposal) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-red-600">{error || 'Proposal not found'}</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          ← Back to Dashboard
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{proposal.projectTitle}</h1>
            <p className="text-lg text-gray-600">
              {proposal.clientName}
              {proposal.clientCompany && ` • ${proposal.clientCompany}`}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                proposal.status === 'sent'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={copyEntireProposal}>
              Copy Entire Proposal
            </Button>
            <Button variant="outline" onClick={handleDuplicate} isLoading={isDuplicating}>
              Duplicate
            </Button>
            <Button variant="outline" onClick={() => setShowMarkdownModal(true)}>
              Export as Markdown
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {[
          { title: 'Scope of Work', content: proposal.scopeOfWork, key: 'scope' },
          { title: 'Deliverables', content: proposal.deliverables, key: 'deliverables' },
          { title: 'Timeline & Milestones', content: proposal.timeline, key: 'timeline' },
          { title: 'Pricing Breakdown', content: proposal.pricing, key: 'pricing' },
          { title: 'Terms & Conditions', content: proposal.terms, key: 'terms' },
        ].map((section) => {
          const formattedContent = formatSectionContent(section.content);
          return (
            <Card key={section.key}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{formattedContent}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={showMarkdownModal}
        onClose={() => setShowMarkdownModal(false)}
        title="Export as Markdown"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Copy the markdown below to use in your documentation or export to a file.
          </p>
          <textarea
            readOnly
            value={generateMarkdown()}
            className="w-full h-96 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          />
          <div className="flex justify-end">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generateMarkdown());
                setShowMarkdownModal(false);
              }}
            >
              Copy Markdown
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

