import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Proposal {
  id: string;
  clientName: string;
  projectTitle: string;
  status: 'draft' | 'sent';
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await api.get('/proposals');
      // Handle different response structures
      let proposalsData = response.data;
      
      // If response.data is an object with a proposals/data/items property
      if (proposalsData && typeof proposalsData === 'object' && !Array.isArray(proposalsData)) {
        proposalsData = proposalsData.proposals || proposalsData.data || proposalsData.items || [];
      }
      
      // Ensure it's an array
      if (!Array.isArray(proposalsData)) {
        console.warn('Expected array but got:', proposalsData);
        proposalsData = [];
      }
      
      setProposals(proposalsData);
    } catch (err: any) {
      setError('Failed to load proposals');
      console.error('Error fetching proposals:', err);
      setProposals([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/proposals/new">
          <Button>Create New Proposal</Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Card>
          <p className="text-red-600">{error}</p>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any proposals yet.</p>
            <Link to="/proposals/new">
              <Button>Create Your First Proposal</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Proposals</h2>
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} hover>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {proposal.projectTitle}
                    </h3>
                    <p className="text-gray-600 mb-2">{proposal.clientName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          proposal.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                      <span>Created {formatDate(proposal.createdAt)}</span>
                    </div>
                  </div>
                  <Link to={`/proposals/${proposal.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

