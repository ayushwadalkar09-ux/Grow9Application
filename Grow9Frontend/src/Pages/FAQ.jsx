import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What services do you offer?",
    answer:
      "We provide comprehensive digital solutions including web development, mobile applications, and digital marketing services tailored to your business needs.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team through email, phone, or our online chat system. We're available 24/7 to assist you with any questions or concerns.",
  },
  {
    question: "What are your pricing plans?",
    answer:
      "We offer flexible pricing plans starting from basic packages for small businesses to enterprise solutions. Contact us for a customized quote based on your requirements.",
  },
  {
    question: "Do you provide ongoing maintenance?",
    answer:
      "Yes, we offer comprehensive maintenance and support packages to ensure your digital solutions continue to perform optimally after launch.",
  },
];

export default function Faq() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our services and solutions.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
