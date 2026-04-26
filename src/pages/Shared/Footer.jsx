import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-green-500 text-white pt-14 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Logo Section */}
        <div>
          <h1 className="text-5xl font-extrabold">SB</h1>
          <div className="w-28 border-b-2 border-white my-3"></div>
          <p className="text-sm leading-relaxed">
            Clean & Green Pakistan <br /> Initiative
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-5">
            <span className="bg-white text-green-500 p-2 rounded-full cursor-pointer">
              <FaFacebookF size={14} />
            </span>
            <span className="bg-white text-green-500 p-2 rounded-full cursor-pointer">
              <FaXTwitter size={14} />
            </span>
            <span className="bg-white text-green-500 p-2 rounded-full cursor-pointer">
              <FaLinkedinIn size={14} />
            </span>
            <span className="bg-white text-green-500 p-2 rounded-full cursor-pointer">
              <FaYoutube size={14} />
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline">• Home</Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:underline">• How It Works</Link>
            </li>
            <li>
              <Link to="/features" className="hover:underline">• Features</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">• Dashboard</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">• Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>• Blog</li>
            <li>• FAQs</li>
            <li>• User Guides</li>
            <li>• IoT Research</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <MdEmail /> info@smartwaste.pk
            </p>

            <p className="flex items-center gap-2">
              <MdPhone /> +92 300 1234567
            </p>

            <p className="flex items-start gap-2">
              <MdLocationOn /> 123, Green City, Lahore, Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-300 mt-10 pt-4 text-sm flex flex-col md:flex-row justify-between text-center md:text-left">
        <p>© 2024 All Rights Reserved.</p>
        <p>Designed & Developed by IoT Solutions</p>
      </div>
    </footer>
  );
};

export default Footer;
