import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageCard from '../components/ImageCard';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function Home() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await axios.get(`/api/images?page=${page}`);
    setImages([...images, ...res.data]);
    setPage(page + 1);
  };

  return (
    <>
      <Helmet>
        <title>Gravure Gallery</title>
        <meta name="description" content="Browse the latest images of famous Japanese gravure models." />
        {/* Google Tag */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GOOGLE_TAG_ID}`}></script>
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
        <InfiniteScroll
          dataLength={images.length}
          next={fetchImages}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <ImageCard key={image._id} image={image} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Home;
