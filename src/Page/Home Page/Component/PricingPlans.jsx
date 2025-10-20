import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const PricingPlans = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: "Student Basic",
      price: 19,
      originalPrice: 29,
      period: "month",
      icon: Check,
      color: "blue",
      features: [
        "Access to 25+ study sessions",
        "Basic chat support",
        "Download study materials",
        "Mobile app access",
        "Email notifications",
        "Basic progress tracking"
      ],
      popular: false,
      savings: "Save $10"
    },
    {
      id: 'pro',
      name: "Student Pro",
      price: 39,
      originalPrice: 59,
      period: "month",
      icon: Zap,
      color: "green",
      features: [
        "Unlimited study sessions",
        "Priority 24/7 support",
        "1-on-1 tutoring sessions (2/month)",
        "Advanced analytics & insights",
        "Custom study plans",
        "Offline content access",
        "Session recordings",
        "Certificate of completion"
      ],
      popular: true,
      savings: "Save $20"
    },
    {
      id: 'premium',
      name: "Tutor Premium",
      price: 79,
      originalPrice: 99,
      period: "month",
      icon: Crown,
      color: "purple",
      features: [
        "Everything in Pro",
        "Create unlimited sessions",
        "Advanced tutor dashboard",
        "Revenue analytics",
        "Custom branding",
        "Priority session placement",
        "Dedicated account manager",
        "Marketing support"
      ],
      popular: false,
      savings: "Save $20"
    }
  ];

  const handleGetStarted = (plan) => {
    console.log('Get Started clicked for plan:', plan.name);
    
    if (!user) {
      console.log('User not logged in, showing login prompt');
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to subscribe to a plan',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#16a34a'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    console.log('User logged in, navigating to payment');
    // Navigate to payment page with plan details (remove non-serializable data)
    const planData = {
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      type: 'subscription'
    };

    const serializablePlan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice,
      period: plan.period,
      color: plan.color,
      features: plan.features,
      popular: plan.popular,
      savings: plan.savings
    };
    
    navigate('/payment', { 
      state: { 
        bookingData: planData,
        fee: plan.price,
        planDetails: serializablePlan
      } 
    });
  };

  const getColorClasses = (color, isPopular) => {
    const colors = {
      blue: {
        bg: isPopular ? 'from-blue-500 to-blue-600' : 'from-blue-50 to-blue-100',
        text: isPopular ? 'text-white' : 'text-blue-600',
        button: isPopular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700',
        icon: 'text-blue-600'
      },
      green: {
        bg: isPopular ? 'from-green-500 to-green-600' : 'from-green-50 to-green-100',
        text: isPopular ? 'text-white' : 'text-green-600',
        button: isPopular ? 'bg-white text-green-600 hover:bg-green-50' : 'bg-green-600 text-white hover:bg-green-700',
        icon: 'text-green-600'
      },
      purple: {
        bg: isPopular ? 'from-purple-500 to-purple-600' : 'from-purple-50 to-purple-100',
        text: isPopular ? 'text-white' : 'text-purple-600',
        button: isPopular ? 'bg-white text-purple-600 hover:bg-purple-50' : 'bg-purple-600 text-white hover:bg-purple-700',
        icon: 'text-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Rocket className="text-green-600" size={32} />
            <h2 className="text-5xl font-bold text-gray-900">
              Choose Your Learning Journey
            </h2>
          </motion.div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your potential with our flexible subscription plans. 
            Start free, upgrade anytime, cancel whenever you want.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <Star className="fill-current" size={16} />
            <span className="font-medium">Limited Time: 30% Off All Plans!</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const colorClasses = getColorClasses(plan.color, plan.popular);
            const IconComponent = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular 
                    ? 'transform scale-105 ring-4 ring-green-200' 
                    : 'hover:scale-105'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Star size={14} className="fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`bg-gradient-to-br ${colorClasses.bg} p-8 text-center`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center`}>
                    <IconComponent className={plan.popular ? 'text-white' : colorClasses.icon} size={32} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  
                  {plan.savings && (
                    <div className="mb-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : colorClasses.text}`}>
                        ${plan.price}
                      </span>
                      <div className="text-left">
                        <div className={`text-sm line-through ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                          ${plan.originalPrice}
                        </div>
                        <div className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                          /{plan.period}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleGetStarted(plan)}
                    type="button"
                    className="w-full py-4 rounded-xl font-bold text-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Get Started Now
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    No setup fees • Cancel anytime • 14-day free trial
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎓 Special Student Discount Available!
            </h3>
            <p className="text-gray-600 mb-6">
              Verify your student status and get an additional 20% off any plan. 
              Perfect for college and university students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Verify Student Status
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Compare All Features
              </motion.button>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default PricingPlans;
