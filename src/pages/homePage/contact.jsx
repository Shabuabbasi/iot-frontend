import React from "react";

const Contact = () => {
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-12">
          Contact <span className="text-green-500">Us</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <textarea
              rows="6"
              placeholder="Your Message"
              className="w-full p-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition"
            >
              Send Message →
            </button>
          </form>

          {/* Map */}
          <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=islamabad&t=&z=11&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
