import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './Button';

const Hero = () => {
  return (
    <section className="pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                <span className="block">Elevate your digital</span>
                <span className="block mt-1 text-indigo-600">presence today</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your ideas into reality with our powerful platform. Build, launch, and scale your digital products faster than ever before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button href="#" variant="primary" size="lg">
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button href="#" variant="outline" size="lg">
                  Learn more
                </Button>
              </div>
              <div className="mt-8 text-sm text-gray-500 flex items-center justify-center lg:justify-start">
                <span className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="mx-3">•</span>
                <span className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  14-day free trial
                </span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-1 shadow-xl">
              <div className="bg-white rounded-3xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Dashboard preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 -z-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;