import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">ProposalPilot</div>
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth/register">
              <Button>Start for free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop wasting hours
            <br />
            <span className="text-blue-600">writing proposals manually</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered proposal & scope generator for freelancers and agencies.
            Create professional proposals in minutes, not hours.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/auth/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Problem
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stop wasting hours writing proposals manually. Every project requires
            a custom proposal, scope of work, pricing breakdown, and timeline.
            This repetitive work takes away from what you do best—delivering
            great work.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Scope Generator',
              description: 'Automatically generate detailed scope of work based on project requirements.',
              icon: '🤖',
            },
            {
              title: 'Pricing Builder',
              description: 'Create professional pricing breakdowns with customizable line items.',
              icon: '💰',
            },
            {
              title: 'Reusable Templates',
              description: 'Save and reuse your best proposals as templates for future projects.',
              icon: '📋',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Enter Project Details',
              description: 'Fill in client information, project requirements, and preferences.',
            },
            {
              step: '2',
              title: 'AI Generates Proposal',
              description: 'Our AI creates a comprehensive proposal with scope, pricing, and timeline.',
            },
            {
              step: '3',
              title: 'Review & Send',
              description: 'Review the generated proposal, make adjustments, and send to your client.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: 'Free',
              price: '$0',
              features: ['5 proposals/month', 'Basic templates', 'AI generation'],
            },
            {
              name: 'Pro',
              price: '$29',
              features: ['Unlimited proposals', 'Advanced templates', 'Priority support', 'Export options'],
            },
          ].map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={index === 1 ? 'border-2 border-blue-600' : ''}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {plan.price}
                  {plan.price !== '$0' && <span className="text-lg text-gray-600">/month</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/auth/register">
                  <Button variant={index === 1 ? 'primary' : 'outline'} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 ProposalPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

