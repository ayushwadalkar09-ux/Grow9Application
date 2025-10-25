import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const baseURL = "http://localhost:5000";
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
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      alert("Please enter your query before submitting.");
      return;
    }
    try {
      const res = await fetch(baseURL + "/api/Admin/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        alert("Thank you! Your query has been sent to the support team.");
        setQuery("");
        setShowModal(false);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send your query. Please try again.");
    }
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
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Support Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Contact Support
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Please describe your issue or question below. Our team will get
              back to you shortly.
            </p>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Write your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
