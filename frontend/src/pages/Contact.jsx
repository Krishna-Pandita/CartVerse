import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";


const Contact = () => {
  const navigate = useNavigate();

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

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/contact/send",
        formData,
      );

      toast.success("Message sent successfully!");
      navigate("/"); // Redirect to home page after successful submission

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className=" bg-gray-100 flex justify-center grid grid-cols-2  bg-gradient-to-b from-gray-100 via-pink-100 to-gray-100 min-h-screen bg-cover bg-center bg-no-repeat ">
      {/* <img src={contactImage} alt="Contact" className="w-[700px] h-[500px] rounded-xl " />  */}

      <div className="pt-40 pl-35 flex flex-col gap-4">
        <h1 className="font-bold text-[40px] text-gray-900">
          Customer Support
        </h1>
        <h4 className="font-semibold text-[22px]">
          <span className="text-gray-700">Email: </span>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=kpandita68@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-700 hover:underline"
          >
            kpandita68@gmail.com
          </a>
        </h4>

        <div className="flex items-center gap-4 mt-4">
  <h2 className="font-semibold text-[22px]">
    <span className="text-gray-700">Find us on</span>
  </h2>

  <div className="flex gap-4 items-center">
    <a
      href="https://www.instagram.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaInstagram className="text-[26px] text-pink-600" />

    </a>

    <a
      href="https://www.linkedin.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IoLogoLinkedin className="text-[26px] text-pink-600" />

    </a>

    <a
      href="https://github.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaGithub className="text-[26px] text-pink-600" />
    </a>

    
  </div>
</div>


      </div>

      <div className="bg-gray-100 rounded-xl w-[550px] max-w-3xl p-8 shadow-lg mt-[120px] mb-7 mx-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-600">
          Get in touch
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 ">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border p-3 rounded-lg bg-gray-200"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border p-3 rounded-lg bg-gray-200"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full border p-3 rounded-lg bg-gray-200"
            value={formData.subject}
            onChange={handleChange}
          />

          <textarea
            rows="6"
            name="message"
            placeholder="Write your message..."
            className="w-full border p-3 rounded-lg bg-gray-200"
            value={formData.message}
            onChange={handleChange}
          />

          <button className="w-[85px] bg-pink-600 hover:bg-pink-700 text-white py-2  text-[13px] rounded-lg font-semibold">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
