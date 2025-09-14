import { BookOpen, Users, DollarSign, Award, Clock, Shield } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Expert Tutors",
    description: "Learn from industry professionals with years of teaching experience.",
    icon: <Users className="w-10 h-10 text-blue-600" />,
  },
  {
    id: 2,
    title: "Affordable Fees",
    description: "High-quality study sessions at pocket-friendly prices.",
    icon: <DollarSign className="w-10 h-10 text-green-600" />,
  },
  {
    id: 3,
    title: "Flexible Schedule",
    description: "Choose sessions that match your time and availability.",
    icon: <Clock className="w-10 h-10 text-purple-600" />,
  },
  {
    id: 4,
    title: "Practical Learning",
    description: "Hands-on projects and real-world examples for better understanding.",
    icon: <BookOpen className="w-10 h-10 text-orange-600" />,
  },
  {
    id: 5,
    title: "Certified Programs",
    description: "Earn valuable certificates after completing sessions successfully.",
    icon: <Award className="w-10 h-10 text-yellow-500" />,
  },
  {
    id: 6,
    title: "Secure Platform",
    description: "Your data and payments are fully secured with modern encryption.",
    icon: <Shield className="w-10 h-10 text-red-600" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-green-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Why <span className="text-green-600">Choose Us?</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
