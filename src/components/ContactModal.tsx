'use client';

import { useState } from 'react';
import { Modal } from './Modal';

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          motivation,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitSuccess(false);
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhone('');
          setMotivation('');
        }, 2000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error sending your message. Please try emailing directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-['Jost',sans-serif] font-medium text-[#427d78] hover:text-[#5eb3a1] transition-colors"
      >
        Contact
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Get in Touch">
        {submitSuccess ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-2xl mb-2">
              Message Sent!
            </h3>
            <p className="font-['Bitter',serif] text-gray-600">
              Thank you for reaching out. I&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-firstName" className="font-['Jost',sans-serif] font-medium text-gray-700 block mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#427d78] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-lastName" className="font-['Jost',sans-serif] font-medium text-gray-700 block mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#427d78] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-email" className="font-['Jost',sans-serif] font-medium text-gray-700 block mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#427d78] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-phone" className="font-['Jost',sans-serif] font-medium text-gray-700 block mb-2">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#427d78] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-motivation" className="font-['Jost',sans-serif] font-medium text-gray-700 block mb-2">
                What&apos;s motivating you to work with me? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                required
                rows={4}
                placeholder="Tell me about what brings you here and what you're hoping to explore..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#427d78] focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#427d78] to-[#4682B4] text-white font-['Jost',sans-serif] font-bold py-3 px-6 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
