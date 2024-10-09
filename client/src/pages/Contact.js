import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/contact', formData);
    alert('Message sent successfully');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>{t('contact_us')} - Gravure Gallery</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">{t('contact_us')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>{t('name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>{t('email')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>{t('message')}</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border p-2 w-full"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            {t('send')}
          </button>
        </form>
      </div>
    </>
  );
}

export default Contact;
