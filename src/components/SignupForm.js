import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { FORM_ACTION } from '../data';

export default function SignupForm({ cta = 'Join the list', note, successMessage = "You're on the list.", variant = 'light' }) {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (!city || !city.trim()) {
      alert('Please enter your city');
      return;
    }

    setLoading(true);

    try {
      // EmailOctopus form submission (reCAPTCHA disabled)
      // Form field IDs (from the form's HTML): field_0 = Email, field_3 = City
      const formData = new FormData();
      formData.append('field_0', email);
      formData.append('field_3', city.trim());
      formData.append('hpc4b27b6e-eb3b-11e9-be00-06b4694bee2a', '');

      const response = await fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setEmail('');
        setCity('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(result.error?.message || 'Submission failed');
      }
    } catch (error) {
      console.error('EmailOctopus error:', error);
      alert('Something went wrong. Please try again. (' + (error.message || 'unknown') + ')');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`signup signup--${variant}`} onSubmit={handleSubmit} noValidate>
      <div className="signup__row">
        <input
          className="signup__input"
          type="email"
          placeholder="Your email"
          aria-label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="signup__input signup__input--city"
          type="text"
          placeholder="Your city"
          aria-label="City"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="btn btn--red" disabled={loading}>
          {loading ? 'Sending...' : cta} {!loading && <ArrowRight size={18} />}
        </button>
      </div>
      {submitted ? (
        <p className="signup__note signup__note--ok" role="status">
          <CheckCircle size={16} /> {successMessage}
        </p>
      ) : (
        note && <p className="signup__note">{note}</p>
      )}
    </form>
  );
}
