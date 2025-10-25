import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ navigationItems }) => {
  const socialLinks = [
    { icon: Facebook, url: "#", label: "Facebook" },
    { icon: Twitter, url: "#", label: "Twitter" },
    {
      icon: Instagram,
      url: "https://www.instagram.com/brijesh.mishra.566?igsh=dXB4cm85YTQ5Y2h3",
      label: "Instagram",
    },
    { icon: Linkedin, url: "#", label: "LinkedIn" },
    { icon: Youtube, url: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">YourBrand</h3>
            <p className="text-gray-400 mb-4">
              Grow your wealth consistently: invest today and enjoy fixed daily
              growth for a brighter tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="text-gray-400 space-y-2">
              <p>Email: meta.fund.growth@gmail.com</p>
              <p>Phone: +91 (831) 8348573</p>
              <p>Address: Santacurz(East), Mumbai 400055</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
