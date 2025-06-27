import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small projects',
      monthlyPrice: 12,
      annualPrice: 120,
      features: [
        'Up to 5 projects',
        '5GB storage',
        'Basic analytics',
        'Email support',
        'Community access'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing teams and businesses',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Unlimited projects',
        '50GB storage',
        'Advanced analytics',
        'Priority support',
        'Team collaboration',
        'Custom branding',
        'API access'
      ],
      cta: 'Get Started',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Unlimited everything',
        'Advanced security',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        'Premium support',
        'Team training'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for you
          </p>

          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
              <span className="ml-2 text-xs font-medium inline-block bg-green-100 text-green-800 rounded px-2 py-0.5">
                Save 20%
              </span>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={!isAnnual}
                onChange={togglePricing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className={`ml-3 ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-indigo-600 text-white shadow-xl scale-105 my-4'
                  : 'bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mb-6 ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-500'}>
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>

                <Button
                  variant={plan.highlighted ? 'secondary' : 'primary'}
                  size="lg"
                  fullWidth
                  className={plan.highlighted ? 'bg-white text-indigo-600 hover:bg-gray-100' : ''}
                >
                  {plan.cta}
                </Button>
              </div>

              <div className={`px-8 pb-8 pt-2 ${plan.highlighted ? 'border-t border-indigo-500' : 'border-t border-gray-100'}`}>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${plan.highlighted ? 'text-indigo-300' : 'text-indigo-500'}`} />
                      <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;