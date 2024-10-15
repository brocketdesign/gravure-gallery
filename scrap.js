const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/gravure_gallery'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Image schema
const ImageSchema = new mongoose.Schema({
    title: String,
    tags: [String],
    url: String,
    category: String,
    postUrl: String, // Track the URL of the post the image came from
    createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', ImageSchema);

// Define the Post schema to track scraped posts
const PostSchema = new mongoose.Schema({
    url: { type: String, unique: true },
    scrapedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

// Function to fetch XML Sitemap and extract post URLs
async function fetchSitemap(sitemapUrl) {
    try {
        const { data } = await axios.get(sitemapUrl);
        const $ = cheerio.load(data, { xmlMode: true });
        const postUrls = [];

        $('url loc').each((i, el) => {
            postUrls.push($(el).text());
        });

        return postUrls;
    } catch (error) {
        console.error(`Error fetching sitemap: ${error}`);
        return [];
    }
}

// Function to scrape each post for images, title, and tags
async function scrapePost(postUrl) {
    try {
        const { data } = await axios.get(postUrl);
        const $ = cheerio.load(data);

        // Extract post title
        const title = $('h1').text().trim() || $('title').text().trim();

        // Extract post tags
        const tags = [];
        $('.post-tags [rel="tag"]').each((i, el) => {
            tags.push($(el).text().trim());
        });
        $('a.c-tagList__link').each((i, el) => {
            tags.push($(el).text().trim());
        });
        // Extract category from post
        const category = new URL(postUrl).hostname || 'Uncategorized';

        // Extract images
        const images = [];
        $('img').each((i, el) => {
            const imgSrc = $(el).attr('data-src') || $(el).attr('src');
            if (imgSrc && !imgSrc.includes('logo') && !imgSrc.includes('icon')) {
                images.push(imgSrc);
            }
        });

        return { title, tags, category, images, postUrl };
    } catch (error) {
        console.error(`Error scraping post: ${error}`);
        return null;
    }
}

// Function to save the image data to MongoDB
async function saveImageData(title, tags, category, imageUrl, postUrl) {
    const image = new Image({
        title,
        tags,
        url: imageUrl,
        category,
        postUrl,
    });

    try {
        await image.save();
        console.log(`Saved image: ${imageUrl}`);
    } catch (error) {
        console.error(`Error saving image: ${error}`);
    }
}

// Function to reset the database
async function resetDatabase() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Image.deleteMany({});
        await Post.deleteMany({});
        console.log('Database has been reset.');
    } catch (error) {
        console.error(`Error resetting database: ${error}`);
    } finally {
        await mongoose.disconnect();
    }
}

// Main scraping function
async function scrapeSite(xmlMap) {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const sitemapUrl = xmlMap; // Sitemap URL for posts
        const postUrls = await fetchSitemap(sitemapUrl);

        // Limit the number of posts to scrape
        const scrapeLimit = 10; // Set the number of posts to scrape here
        const limitedPostUrls = postUrls.slice(0, scrapeLimit);

        console.log(`Found ${limitedPostUrls.length} posts to scrape.`);

        for (const postUrl of limitedPostUrls) {
            const existingPost = await Post.findOne({ url: postUrl });
            if (existingPost) {
                console.log(`Post already scraped: ${postUrl}`);
                continue;
            }

            const postData = await scrapePost(postUrl);
            if (postData) {
                const { title, tags, category, images } = postData;

                for (const imageUrl of images) {
                    await saveImageData(title, tags, category, imageUrl, postUrl);
                }

                // Save the post URL to track that it has been scraped
                const post = new Post({ url: postUrl });
                try {
                    await post.save();
                    console.log(`Saved post as scraped: ${postUrl}`);
                } catch (error) {
                    console.error(`Error saving post URL: ${error}`);
                }
            }
        }

        console.log('Scraping complete.');
    } catch (error) {
        console.error(`Error during scraping: ${error}`);
    } finally {
        await mongoose.disconnect();
    }
}

// Uncomment to reset the database
//resetDatabase();

// Run the scraper
//scrapeSite('https://everia.club/wp-sitemap-posts-post-1.xml')
//scrapeSite('https://erotok.com/sitemap-posttype-post.2024.xml');