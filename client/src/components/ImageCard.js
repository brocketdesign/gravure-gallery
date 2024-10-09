import React from 'react';
import { Link } from 'react-router-dom';

function ImageCard({ image }) {
  return (
    <Link to={`/image/${image._id}`}>
      <img src={image.url} alt={image.title} className="w-full h-auto" />
    </Link>
  );
}

export default ImageCard;
