// Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageCard from '../components/ImageCard';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function Home() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); // Correctly use the t function from useTranslation

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchImages = async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/images?page=${page}&limit=20`);
      const fetchedImages = res.data;

      // If no images are returned, set hasMore to false
      if (fetchedImages.length === 0) {
        setHasMore(false);
        return;
      }

      // Append new images to the existing list
      setImages((prevImages) => [...prevImages, ...fetchedImages]);

      // Increment page for next fetch
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(t('error_loading_images')); // Ensure this key exists in your translations
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gravure Gallery</title>
        <meta
          name="description"
          content="Browse the latest images of famous Japanese gravure models."
        />
        {/* Google Tag */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GOOGLE_TAG_ID}`}
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.REACT_APP_GOOGLE_TAG_ID}');
          `}
        </script>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">{t('latest_images')}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <InfiniteScroll
          dataLength={images.length}
          next={fetchImages}
          hasMore={hasMore}
          loader={<h4>{t('loading')}</h4>}
          endMessage={
            <p className="text-center mt-4">
              <b>{t('no_more_images')}</b>
            </p>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <ImageCard key={image._id} image={image} />
            ))}
          </div>
        </InfiniteScroll>
        {loading && <p className="text-center mt-4">{t('loading')}</p>}
      </div>
    </>
  );
}

export default Home;
