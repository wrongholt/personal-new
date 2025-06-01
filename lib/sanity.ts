import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID, // replace with your project ID
  dataset: process.env.SANITY_DATASET || "production", // replace with your dataset name

  useCdn: true, // use CDN for faster response
  apiVersion: "2023-05-03", // use current date in YYYY-MM-DD format
});

// Add these functions to your existing lib/sanity.js file

// Add this function to build image URLs
const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);

// Function to get a single post by slug
export async function getPostBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    image{
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    author->{
      name,
      bio,
      image{
        asset->{
          url
        }
      }
    },
    categories[]->{
      title,
      slug,
      color
    },
    readTime,
    featured,
    seo{
      metaDescription,
      metaKeywords
    }
  }`;

  const post = await client.fetch(query, { slug });
  return post;
}

// Enhanced function to get all posts with more details
export async function getPostsDetailed() {
  const query = `*[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    image{
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    author->{
      name,
      bio,
      image{
        asset->{
          url
        }
      }
    },
    categories[]->{
      title,
      slug,
      color
    },
    readTime,
    featured
  }`;

  const posts = await client.fetch(query);
  return posts;
}

// Get all posts with full details for blog page
export async function getPosts() {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      image{
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
      author-> {
        name,
      },
      categories[]-> {
        name,
      },
      readTime,
      featured
    }
  `);
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string) {
  return await client.fetch(
    `
    *[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      image {
        asset-> {
          url
        },
        alt
      },
      author-> {
        name,
        image {
          asset-> {
            url
          }
        }
      },
      categories[]-> {
        title,
        slug,
        color
      },
      readTime,
      featured
    }
  `,
    { categorySlug }
  );
}

// Get single post by slug
export async function getPost(slug: string) {
  return await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      image {
        asset-> {
          url
        },
        alt
      },
      author-> {
        name,
        bio,
        image {
          asset-> {
            url
          }
        }
      },
      categories[]-> {
        title,
        slug,
        color
      },
      readTime,
      featured,
      "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...3] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        image {
          asset-> {
            url
          },
          alt
        },
        categories[]-> {
          title,
          slug,
          color
        },
        readTime
      }
    }
  `,
    { slug }
  );
}

// Get all categories with post counts
export async function getCategories() {
  return await client.fetch(`
    *[_type == "category"] {
      title,
      slug,
      color,
      "postCount": count(*[_type == "post" && references(^._id)])
    } | order(postCount desc)
  `);
}

// Get featured posts
export async function getFeaturedPosts() {
  return await client.fetch(`
    *[_type == "post" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      image {
        asset-> {
          url
        },
        alt
      },
      author-> {
        name,
        image {
          asset-> {
            url
          }
        }
      },
      categories[]-> {
        title,
        slug,
        color
      },
      readTime
    }
  `);
}

// Search posts
export async function searchPosts(searchTerm: string) {
  return await client.fetch(
    `
    *[_type == "post" && (
      title match $searchTerm + "*" ||
      excerpt match $searchTerm + "*" ||
      pt::text(body) match $searchTerm + "*"
    )] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      image {
        asset-> {
          url
        },
        alt
      },
      author-> {
        name,
        image {
          asset-> {
            url
          }
        }
      },
      categories[]-> {
        title,
        slug,
        color
      },
      readTime,
      featured
    }
  `,
    { searchTerm }
  );
}
