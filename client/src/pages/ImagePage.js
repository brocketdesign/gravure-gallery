// ImagePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageCard from '../components/ImageCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function ImagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [samePostImages, setSamePostImages] = useState([]);
  const [relatedImages, setRelatedImages] = useState([]);
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset state when ID changes
    setImage(null);
    setSamePostImages([]);
    setRelatedImages([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchImageData();
  }, [id]);

  const fetchImageData = async () => {
    try {
      // Fetch the main image
      const res = await axios.get(`/api/images/${id}`);
      const imageData = res.data;
      setImage(imageData);

      // Fetch images with the same postUrl using a query parameter
      const samePostRes = await axios.get(
        `/api/images/post?postUrl=${encodeURIComponent(imageData.postUrl)}`
      );
      // Exclude the main image from the samePostImages
      const filteredSamePostImages = samePostRes.data.filter(
        (img) => img._id !== id
      );
      setSamePostImages(filteredSamePostImages);

      // Fetch initial related images
      fetchMoreData(imageData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async (imageData) => {
    if (!imageData) return;
    try {
      const res = await axios.get(
        `/api/images/related/${imageData._id}?page=${page}`
      );
      setRelatedImages((prevImages) => [...prevImages, ...res.data]);
      setPage(page + 1);
      if (res.data.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoreDataWrapper = () => {
    if (image) {
      fetchMoreData(image);
    }
  };

  const handleImageClick = (imgId) => {
    navigate(`/image/${imgId}`);
  };

  return (
    <>
      <Helmet>
        <title>{image?.title || 'Image Page'}</title>
        <meta name="description" content={image?.title || 'Image description'} />
      </Helmet>
      <div className="container mx-auto p-4">
        {/* Main Image */}
        {loading ? (
          <p>{t('loading_image')}</p>
        ) : image ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{image?.title}</h1>
            <img
              src={image.url}
              alt={image.title || 'Main Image'}
              className="w-full h-auto mb-4"
              onClick={() => handleImageClick(image._id)}
              style={{ cursor: 'pointer' }}
            />
          </>
        ) : (
          <p>{t('image_not_found')}</p>
        )}

        {/* Same Post Images */}
        {samePostImages.length > 0 && (
          <>
            <h2 className="text-xl mb-4">{t('same_post_images')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {samePostImages.map((img) => (
                <img
                  key={img._id}
                  src={img.url}
                  alt={img.title || 'Same Post Image'}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => handleImageClick(img._id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Related Images */}
        <h2 className="text-xl mb-4">{t('related_images')}</h2>
        {relatedImages.length > 0 ? (
          <InfiniteScroll
            dataLength={relatedImages.length}
            next={fetchMoreDataWrapper}
            hasMore={hasMore}
            loader={<h4>{t('loading')}</h4>}
            endMessage={<p>{t('no_more_images')}</p>}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedImages.map((img) => (
                <ImageCard key={img._id} image={img} onClick={() => handleImageClick(img._id)} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <p>{t('no_related_images')}</p>
        )}
      </div>
    </>
  );
}

export default ImagePage;
