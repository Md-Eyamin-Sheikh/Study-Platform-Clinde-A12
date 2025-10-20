import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

const PricingPlans = () => {
  const plans = [
    {
      name: "Basic",
      price: 29,
      period: "month",
      features: [
        "Access to 50+ study sessions",
        "Basic chat support",
        "Download materials",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: 59,
      period: "month",
      features: [
        "Unlimited study sessions",
        "Priority support",
        "1-on-1 tutoring sessions",
        "Advanced analytics",
        "Custom study plans",
        "Offline access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 99,
      period: "month",
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "Admin dashboard",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Choose Your Learning Plan
          </motion.h2>
          <p className="text-xl text-gray-600">
            Flexible pricing options to fit your learning needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-green-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star size={14} className="fill-current" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-green-600">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
