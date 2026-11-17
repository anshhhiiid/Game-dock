import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Gamepad2,
  Headphones,
} from "lucide-react";
import toast from "react-hot-toast";

function Contact() {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Opens the user's email application
    const recipient = "support@gamedock.com"; // Replace with your real email

    const mailSubject = encodeURIComponent(subject);

    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

    toast.success("Opening your email application!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#100E1B] text-white px-4 pt-32 pb-16 md:px-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-16">

          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <MessageCircle size={16} />
            WE'RE HERE TO HELP
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Get in{" "}
            <span className="text-purple-500">Touch</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Have a question about a product, order, or anything gaming?
            Our team is ready to help you. Send us a message and let's talk!
          </p>

        </div>

        {/* CONTACT CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CONTACT INFORMATION */}

          <div className="lg:col-span-1 space-y-6">

            <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-7">

              <h2 className="text-2xl font-bold mb-3">
                Contact Information
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Reach out to us through any of the following channels.
                We're happy to assist you!
              </p>

              {/* EMAIL */}

              <div className="flex items-start gap-4 mb-7">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Mail className="text-purple-400" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">
                    Email Us
                  </h3>

                  <p className="text-gray-400 text-sm">
                    support@gamedock.com
                  </p>
                </div>

              </div>

              {/* PHONE */}

              <div className="flex items-start gap-4 mb-7">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Phone className="text-purple-400" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">
                    Call Us
                  </h3>

                  <p className="text-gray-400 text-sm">
                    +91 8848305066
                  </p>
                </div>

              </div>

              {/* LOCATION */}

              <div className="flex items-start gap-4 mb-7">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <MapPin className="text-purple-400" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">
                    Our Location
                  </h3>

                  <p className="text-gray-400 text-sm">
                    India
                  </p>
                </div>

              </div>

              {/* WORKING HOURS */}

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Clock className="text-purple-400" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">
                    Working Hours
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Monday - Saturday
                  </p>

                  <p className="text-gray-400 text-sm">
                    9:00 AM - 6:00 PM
                  </p>
                </div>

              </div>

            </div>

            {/* SUPPORT CARD */}

            <div className="bg-gradient-to-br from-purple-700 to-purple-950 rounded-2xl p-7 relative overflow-hidden">

              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Gamepad2 size={150} />
              </div>

              <Headphones size={35} className="mb-5" />

              <h3 className="text-xl font-bold mb-2">
                Need Gaming Support?
              </h3>

              <p className="text-purple-100/80 text-sm leading-relaxed">
                Whether it's a console, game, or accessory,
                we're here to help you find the right solution.
              </p>

            </div>

          </div>

          {/* RIGHT CONTACT FORM */}

          <div className="lg:col-span-2">

            <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6 md:p-10">

              <div className="mb-8">

                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Send Us a Message
                </h2>

                <p className="text-gray-400 text-sm">
                  Fill out the form below and tell us how we can help.
                </p>

              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* NAME AND EMAIL */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Your Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-[#100E1B] border border-[#30283F] rounded-xl px-4 py-3.5 outline-none focus:border-purple-500 transition placeholder:text-gray-600"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full bg-[#100E1B] border border-[#30283F] rounded-xl px-4 py-3.5 outline-none focus:border-purple-500 transition placeholder:text-gray-600"
                    />

                  </div>

                </div>

                {/* SUBJECT */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    className="w-full bg-[#100E1B] border border-[#30283F] rounded-xl px-4 py-3.5 outline-none focus:border-purple-500 transition placeholder:text-gray-600"
                  />

                </div>

                {/* MESSAGE */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Your Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Write your message here..."
                    className="w-full bg-[#100E1B] border border-[#30283F] rounded-xl px-4 py-3.5 outline-none focus:border-purple-500 transition placeholder:text-gray-600 resize-none"
                  />

                </div>

                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold transition duration-300 shadow-lg shadow-purple-900/20"
                >
                  Send Message
                  <Send size={18} />
                </button>

              </form>

            </div>

          </div>

        </div>

        {/* BOTTOM MESSAGE */}

        <div className="text-center mt-16">

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            GAME ON. WE'VE GOT YOUR BACK.
          </h2>

          <p className="text-gray-400 text-sm">
            Thank you for choosing GAME DOCK.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Contact;
