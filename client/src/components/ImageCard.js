// ImageCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

function ImageCard({ image }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation(); // Destructure i18n to get current language

  const handleClick = () => {
    navigate(`/image/${image._id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <img
        src={image.url}
        alt={image.title?.[i18n.language] || 'Image'}
        className="w-full h-auto"
      />
    </div>
  );
}

export default ImageCard;
