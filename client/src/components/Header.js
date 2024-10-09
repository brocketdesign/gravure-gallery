import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <Link to="/" className="text-xl font-bold">
        Gravure Gallery
      </Link>
      <nav className="flex space-x-4">
        <Link to="/">{t('latest_images')}</Link>
        <Link to="/search">{t('search')}</Link>
        <Link to="/contact">{t('contact_us')}</Link>
        <Link to="/disclaimer">{t('disclaimer')}</Link>
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ja')}>日本語</button>
      </nav>
    </header>
  );
}

export default Header;
