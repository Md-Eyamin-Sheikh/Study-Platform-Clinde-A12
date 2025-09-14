import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Student",
    image: "https://i.postimg.cc/7Z8pmZfc/pexels-anastasia-shuraeva-8466903.jpg",
    review:
      "The tutors are amazing and sessions are super interactive! I learned JavaScript basics and now I feel more confident.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "Student",
    image: "https://i.postimg.cc/jjCmjw9D/pexels-diego-romero-471613950-19147326.jpg",
    review:
      "The study sessions were very helpful. The tutor explained everything clearly. I really enjoyed the group discussions!",
    rating: 4,
  },
  {
    id: 3,
    name: "Sophia Brown",
    role: "Student",
    image: "https://i.postimg.cc/3RTXczg3/pexels-hson-33852291.jpg",
    review:
      "Great platform for learning! Affordable sessions and excellent support from the tutors.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-green-100 via-white to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          What Our <span className="text-green-600">Students</span> Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{testimonial.role}</p>

              {/* Rating Stars */}
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < testimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
