import React from 'react';
import { Zap, Shield, BarChart, Users, GitBranch, Globe } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Powerful features for modern teams
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to build, launch, and scale your next big idea
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap />}
            title="Lightning Fast"
            description="Enjoy blazing fast performance with our optimized infrastructure. Load pages in milliseconds, not seconds."
          />
          <FeatureCard
            icon={<Shield />}
            title="Enterprise Security"
            description="Bank-grade security with end-to-end encryption and advanced authentication protocols."
          />
          <FeatureCard
            icon={<BarChart />}
            title="Advanced Analytics"
            description="Gain valuable insights with comprehensive analytics and reporting tools."
          />
          <FeatureCard
            icon={<Users />}
            title="Team Collaboration"
            description="Work seamlessly with your team using our collaborative features and real-time updates."
          />
          <FeatureCard
            icon={<GitBranch />}
            title="Version Control"
            description="Keep track of changes with built-in versioning and easy rollbacks when needed."
          />
          <FeatureCard
            icon={<Globe />}
            title="Global CDN"
            description="Deliver content quickly to users anywhere in the world with our global content delivery network."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
        {React.cloneElement(icon, { className: 'h-6 w-6' })}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Features;