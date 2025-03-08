
import React from 'react';
import { Search, Home, Users, IndianRupee } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-secondary" />,
      title: "Search Properties",
      description: "Browse thousands of verified properties across India based on your preferences."
    },
    {
      icon: <Home className="h-12 w-12 text-secondary" />,
      title: "Schedule Visits",
      description: "Contact owners directly and schedule visits to your shortlisted properties."
    },
    {
      icon: <Users className="h-12 w-12 text-secondary" />,
      title: "Connect with Owners",
      description: "Negotiate directly with property owners without any middlemen."
    },
    {
      icon: <IndianRupee className="h-12 w-12 text-secondary" />,
      title: "Save on Brokerage",
      description: "Finalize your rental agreement and move in without paying any brokerage fee."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">How RentEasy Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your dream home without paying any brokerage with our simple 4-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-cream rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white rounded-full shadow-md">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-4 flex justify-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
