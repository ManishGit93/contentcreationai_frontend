import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put('/me', { name });
      setUser(response.data);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {user?.plan || 'Free'}
              </p>
            </div>

            {user?.plan === 'free' && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">
                  Upgrade to Pro for unlimited proposals, advanced templates, and priority support.
                </p>
                <Link to="/billing">
                  <Button className="w-full">Upgrade to Pro</Button>
                </Link>
              </div>
            )}

            {user?.plan === 'pro' && (
              <div className="pt-4 border-t">
                <p className="text-sm text-green-600 mb-2">✓ You're on the Pro plan</p>
                <Link to="/billing">
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

