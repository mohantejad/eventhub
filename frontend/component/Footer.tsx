import Link from 'next/link';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

// Footer component displays site info, navigation, and social links
const Footer = () => {
  return (
    <footer className='bg-[#81a7e3] text-black py-8'>
      <div className='max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* About Section */}
        <div>
          <h3 className='text-lg font-bold uppercase'>About</h3>
          <ul className='mt-4 space-y-2'>
            <li>
              <Link href='/about' className='hover:underline'>
                How it Works
              </Link>
            </li>
            <li>
              <Link href='/about' className='hover:underline'>
                Our Mission
              </Link>
            </li>
            <li>
              <Link href='/careers' className='hover:underline'>
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h3 className='text-lg font-bold uppercase'>Help</h3>
          <ul className='mt-4 space-y-2'>
            <li>
              <Link href='/help' className='hover:underline'>
                Support
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:underline'>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href='/help' className='hover:underline'>
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media & Copyright */}
        <div>
          <h3 className='text-lg font-bold uppercase'>Connect</h3>
          <div className='flex space-x-4 mt-4'>
            {/* Social media icons */}
            <a href='#' className='hover:scale-110 transition-transform'>
              <FaFacebookF size={20} />
            </a>
            <a href='#' className='hover:scale-110 transition-transform'>
              <FaTwitter size={20} />
            </a>
            <a href='#' className='hover:scale-110 transition-transform'>
              <FaInstagram size={20} />
            </a>
            <a href='#' className='hover:scale-110 transition-transform'>
              <FaLinkedinIn size={20} />
            </a>
          </div>
          {/* Copyright notice */}
          <p className='mt-4 text-sm'>
            &copy; {new Date().getFullYear()} Sai Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
