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
        const title = $('h1.entry-title').text().trim() || $('title').text().trim();

        // Extract post tags
        const tags = [];
        $('.post-tags [rel="tag"]').each((i, el) => {
            tags.push($(el).text().trim());
        });

        // Extract category from post
        const category = $('a[rel="category tag"]').first().text().trim() || 'Uncategorized';

        // Extract images
        const images = [];
        $('img').each((i, el) => {
            const imgSrc = $(el).attr('src');
            if (imgSrc && !imgSrc.includes('logo') && !imgSrc.includes('icon')) {
                images.push(imgSrc);
            }
        });

        return { title, tags, category, images };
    } catch (error) {
        console.error(`Error scraping post: ${error}`);
        return null;
    }
}

// Function to save the image data to MongoDB
async function saveImageData(title, tags, category, imageUrl) {
    const image = new Image({
        title,
        tags,
        url: imageUrl,
        category,
    });

    try {
        await image.save();
        console.log(`Saved image: ${imageUrl}`);
    } catch (error) {
        console.error(`Error saving image: ${error}`);
    }
}

// Main scraping function
async function scrapeSite() {
    const sitemapUrl = 'https://everia.club/wp-sitemap-posts-post-1.xml'; // Sitemap URL for posts
    const postUrls = await fetchSitemap(sitemapUrl);

    // Limit the number of posts to scrape
    const scrapeLimit = 50; // Set the number of posts to scrape here
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
                await saveImageData(title, tags, category, imageUrl);
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
}

// Run the scraper
scrapeSite().then(() => mongoose.disconnect());