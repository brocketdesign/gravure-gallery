import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function Disclaimer() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('disclaimer')} - Gravure Gallery</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">{t('disclaimer')}</h1>
        <p>{t('disclaimer_text')}</p>
      </div>
    </>
  );
}

export default Disclaimer;
