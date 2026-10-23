import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { Mail, MessageSquare, Send, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill in name, email, and message");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/contact/send`,
        formData
      );

      toast.success(res.data?.message || "Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong sending your message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/40 to-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left Column: Contact Details & Socials */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                Help & Support
              </span>
              <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-3 tracking-tight">
                Get In Touch
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed max-w-lg mx-auto md:mx-0">
                Have questions about your order, products, or need assistance?
                Our team is always here to support you.
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 p-4 bg-white rounded-xl border border-gray-200/80 shadow-2xs max-w-md mx-auto md:mx-0">
              <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs text-gray-400 font-medium">Email Support</p>
                <a
                  href="mailto:kpandita68@gmail.com"
                  className="text-pink-600 font-semibold hover:underline text-sm sm:text-base truncate block"
                >
                  kpandita68@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">
                Connect With Us
              </h3>
              <div className="flex gap-3 justify-center md:justify-start items-center">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border border-gray-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 rounded-xl flex items-center justify-center transition-all shadow-2xs"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-lg" />
                </a>

                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border border-gray-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 rounded-xl flex items-center justify-center transition-all shadow-2xs"
                  aria-label="LinkedIn"
                >
                  <IoLogoLinkedin className="text-lg" />
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border border-gray-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 rounded-xl flex items-center justify-center transition-all shadow-2xs"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-lg" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full max-w-lg mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Send us a Message
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-gray-50 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-gray-50 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Order inquiry, Feedback, etc."
                  className="w-full border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-gray-50 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Message *
                </label>
                <textarea
                  rows="4"
                  name="message"
                  placeholder="Type your message here..."
                  className="w-full border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-gray-50 text-sm outline-none focus:border-pink-500 focus:bg-white transition-all resize-none"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending Message..." : "Submit Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
