import React, { useState } from 'react';
import Button from './Button';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setIsError(true);
      return;
    }
    
    // Simulate form submission
    setIsError(false);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-20 bg-indigo-600">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Stay updated with our newsletter
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Get the latest news, updates, and special offers delivered directly to your inbox.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border ${
                      isError ? 'border-red-400' : 'border-transparent'
                    } text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsError(false);
                    }}
                  />
                  {isError && (
                    <p className="mt-1 text-red-300 text-sm text-left">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="whitespace-nowrap bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  Subscribe
                </Button>
              </div>
              
              {isSubmitted && (
                <p className="mt-3 text-indigo-200 text-sm">
                  Thanks for subscribing! Check your email for confirmation.
                </p>
              )}
              
              <p className="mt-4 text-indigo-200 text-sm">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;