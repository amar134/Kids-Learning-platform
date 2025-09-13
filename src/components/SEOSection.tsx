import React from 'react';
import { Star, Users, BookOpen, Award, CheckCircle } from 'lucide-react';

export function SEOSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of 2nd grader",
      content: "My daughter loves the interactive games! Her math skills have improved so much in just 2 months.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Elementary Teacher",
      content: "I use this app to create custom exercises for my students. The AI-powered content generation is amazing!",
      rating: 5,
      avatar: "👨‍🏫"
    },
    {
      name: "Lisa Rodriguez",
      role: "Homeschool Mom",
      content: "Perfect for homeschooling! The grade-appropriate content and progress tracking keep my kids engaged.",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  const features = [
    "Interactive learning games for all subjects",
    "AI-powered exercise generation from textbooks",
    "Progress tracking and performance analytics",
    "Grade-appropriate content (K-5)",
    "Parent dashboard with custom exercise creation",
    "Printable worksheets and activities",
    "Speech-to-text and audio pronunciation",
    "Reward system with badges and points"
  ];

  const stats = [
    { number: "10,000+", label: "Happy Students" },
    { number: "5,000+", label: "Parent Users" },
    { number: "50,000+", label: "Exercises Created" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands of Families</h2>
            <p className="text-xl text-blue-100">Join the learning revolution that's making education fun and effective</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Everything Your Child Needs to Excel</h2>
            <p className="text-xl text-gray-600">Comprehensive learning tools designed by educators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Parents & Teachers Say</h2>
            <p className="text-xl text-gray-600">Real feedback from our learning community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our learning platform</p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "What age groups is this app suitable for?",
                answer: "Our app is designed for children in grades 1-5 (ages 6-11). Content is automatically adjusted based on the selected grade level."
              },
              {
                question: "Can parents create custom exercises?",
                answer: "Yes! Our Parent Dashboard allows you to upload images, text, or use voice input to create personalized exercises for your child."
              },
              {
                question: "Is there a free trial available?",
                answer: "Absolutely! We offer a 7-day free trial with full access to all features. No credit card required to start."
              },
              {
                question: "How does the AI exercise generation work?",
                answer: "Our AI analyzes uploaded content (textbook pages, worksheets) and automatically generates age-appropriate questions, word scrambles, and other exercises."
              },
              {
                question: "Can I track my child's progress?",
                answer: "Yes! The app includes comprehensive progress tracking, showing performance across subjects, time spent learning, and areas for improvement."
              },
              {
                question: "Are the exercises aligned with school curricula?",
                answer: "Our content is designed to complement standard K-5 curricula and can be customized based on your local syllabus requirements."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Child's Learning?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of families who are already seeing amazing results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200">
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-purple-200 mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}