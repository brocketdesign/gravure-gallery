import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageCard from '../components/ImageCard';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function ImagePage() {
  const { id } = useParams();
  const [image, setImage] = useState({});
  const [relatedImages, setRelatedImages] = useState([]);
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchImage();
    fetchRelatedImages();
  }, [id]);

  const fetchImage = async () => {
    const res = await axios.get(`/api/images/${id}`);
    setImage(res.data);
  };

  const fetchRelatedImages = async () => {
    const res = await axios.get(`/api/images/related/${id}?page=${page}`);
    setRelatedImages([...relatedImages, ...res.data]);
    setPage(page + 1);
  };

  return (
    <>
      <Helmet>
        <title>{image.title?.[i18n.language]}</title>
        <meta name="description" content={image.title?.[i18n.language]} />
      </Helmet>
      <div className="container mx-auto p-4">
        <img src={image.url} alt={image.title?.[i18n.language]} className="w-full h-auto mb-4" />
        <h2 className="text-xl mb-4">{t('related_images')}</h2>
        <InfiniteScroll
          dataLength={relatedImages.length}
          next={fetchRelatedImages}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedImages.map((img) => (
              <ImageCard key={img._id} image={img} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}

export default ImagePage;
