import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Billing: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Billing page coming soon. This is a placeholder for the upgrade flow.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

