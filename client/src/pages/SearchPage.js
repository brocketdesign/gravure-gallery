// SearchPage.js

import React, { useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageCard from '../components/ImageCard';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const searchImages = async () => {
    try {
      const res = await axios.get(`/api/images/search?q=${encodeURIComponent(query)}&page=1`);
      console.log(res)
      setImages(res.data);
      setPage(2);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchMoreImages = async () => {
    try {
      const res = await axios.get(`/api/images/search?q=${encodeURIComponent(query)}&page=${page}`);
      setImages((prevImages) => [...prevImages, ...res.data]);
      setPage(page + 1);
    } catch (error) {
      console.error('Error fetching more images:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Search - Gravure Gallery</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <input
          type="text"
          placeholder={t('search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button onClick={searchImages} className="bg-blue-500 text-white p-2 mb-4">
          {t('search')}
        </button>
        {images.length > 0 && (
          <InfiniteScroll
            dataLength={images.length}
            next={fetchMoreImages}
            hasMore={true}
            loader={<h4>{t('loading')}</h4>}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <ImageCard key={image._id} image={image} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}

export default SearchPage;
