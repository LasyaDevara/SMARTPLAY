import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "Horizon has completely transformed how our team works. The interface is intuitive, and the features are exactly what we needed. It's been a game-changer for our productivity.",
    author: "Alex Morgan",
    position: "Product Manager at Acme Inc.",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 5
  },
  {
    id: 2,
    content: "I've tried dozens of similar tools, but none compare to Horizon. The attention to detail and thoughtful design make it stand out. Our entire team adopted it within days.",
    author: "Sarah Chen",
    position: "CTO at TechForward",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 5
  },
  {
    id: 3,
    content: "The customer support is exceptional. When we had questions, the team was responsive and helpful. The product itself is fantastic, but the support makes it even better.",
    author: "James Wilson",
    position: "Engineering Lead at StartUp Co.",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-indigo-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Loved by teams worldwide
          </h2>
          <p className="text-xl text-gray-600">
            Hear what our customers have to say about their experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < testimonials[activeIndex].rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-center text-gray-700 italic mb-8">
              "{testimonials[activeIndex].content}"
            </blockquote>
            <div className="flex flex-col items-center">
              <img
                src={testimonials[activeIndex].avatar}
                alt={testimonials[activeIndex].author}
                className="w-16 h-16 rounded-full object-cover mb-3"
              />
              <div className="text-center">
                <p className="font-semibold text-gray-900">
                  {testimonials[activeIndex].author}
                </p>
                <p className="text-gray-600 text-sm">
                  {testimonials[activeIndex].position}
                </p>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full left-0 px-4">
              <button
                onClick={prevTestimonial}
                className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-indigo-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;