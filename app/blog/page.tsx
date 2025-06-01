"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPosts, urlFor } from "../../lib/sanity";

// Define the Post type based on typical Sanity blog post structure
type Post = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt?: string;
  body?: unknown; // Rich text content
  image?: {
    asset: {
      url: string;
      _id: string;
    };
    alt?: string;
  };
  author?: {
    name: string;
    image?: {
      asset: {
        _ref: string;
        _type: string;
      };
    };
  };
  categories?: Array<{
    title: string;
    slug: {
      current: string;
    };
    color?: string;
  }>;
  readTime?: number;
  featured?: boolean;
};

type Category = {
  title: string;
  slug: string;
  color?: string;
  count: number;
};

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);

        // Extract and count categories
        const categoryMap = new Map<string, Category>();

        fetchedPosts.forEach((post: Post) => {
          if (post.categories) {
            post.categories.forEach((cat) => {
              const existing = categoryMap.get(cat.slug.current);
              if (existing) {
                existing.count += 1;
              } else {
                categoryMap.set(cat.slug.current, {
                  title: cat.title,
                  slug: cat.slug.current,
                  color: cat.color,
                  count: 1,
                });
              }
            });
          }
        });

        setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) =>
        post.categories?.some((cat) => cat.slug.current === selectedCategory)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm, posts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (body: unknown) => {
    if (!body) return 5;
    // Simple estimation based on word count
    const wordCount = JSON.stringify(body).split(" ").length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const getCategoryColor = (category?: { color?: string }) => {
    if (category?.color) return category.color;

    // Default category colors
    const colors = [
      "from-blue-500 to-blue-700",
      "from-green-500 to-green-700",
      "from-purple-500 to-purple-700",
      "from-orange-500 to-orange-700",
      "from-red-500 to-red-700",
      "from-teal-500 to-teal-700",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getImageUrl = (image: Post["image"]) => {
    if (!image?.asset) return null;

    try {
      // Handle both old format (url) and new format (_ref)
      if (typeof image.asset === "string") {
        return urlFor(image.asset).width(800).height(400).url();
      } else if (image.asset.url) {
        return urlFor(image).width(800).height(400).url();
      }
      return null;
    } catch (error) {
      console.error("Error generating image URL:", error, image);
      return null;
    }
  };

  const featuredPosts = filteredPosts
    .filter((post) => post.featured)
    .slice(0, 2);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full mx-auto mb-4"></div>
          <p className="text-amber-200 text-lg font-serif">
            Loading Archive...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 text-white">
      {/* Simplified lighting effects - only show after mount */}
      {mounted && (
        <div className="fixed inset-0 opacity-40 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-32 h-64 bg-gradient-to-b from-yellow-200/20 to-transparent blur-xl"
            style={{
              transform: `translateY(${scrollY * 0.05}px) rotate(15deg)`,
            }}
          />
          <div
            className="absolute top-0 right-1/4 w-28 h-56 bg-gradient-to-b from-amber-200/15 to-transparent blur-xl"
            style={{
              transform: `translateY(${scrollY * 0.03}px) rotate(-12deg)`,
            }}
          />
        </div>
      )}

      {/* Header Section */}
      <div className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold pb-6 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 font-serif">
              The Digital Archive
            </h1>

            <div className="mt-6 mx-auto w-fit bg-gradient-to-r from-amber-900/60 to-amber-800/60 px-8 py-3 border-2 border-amber-600/40 rounded-sm">
              <p className="text-amber-200 text-lg font-serif tracking-wide">
                Essays on Code, Games, and Digital Creativity
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-600/40 rounded-lg text-white placeholder-stone-400 focus:border-amber-600/60 focus:outline-none transition-colors duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400">
                  🔍
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-300 font-serif text-sm ${
                    selectedCategory === "all"
                      ? "bg-amber-600/80 border-amber-600 text-white"
                      : "bg-stone-900/60 border-stone-600/40 text-stone-300 hover:border-amber-600/40"
                  }`}
                >
                  All ({posts.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-300 font-serif text-sm ${
                      selectedCategory === category.slug
                        ? "bg-amber-600/80 border-amber-600 text-white"
                        : "bg-stone-900/60 border-stone-600/40 text-stone-300 hover:border-amber-600/40"
                    }`}
                  >
                    {category.title} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-amber-400 mb-8 font-serif text-center">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block"
              >
                <div className="relative bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-stone-900/60 p-8 rounded-lg border-4 border-amber-700/50 shadow-2xl group-hover:border-amber-600/70 transition-all duration-300">
                  {/* Featured Badge */}
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </div>

                  {/* Corner ornaments */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-amber-500/70 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-amber-500/70 rounded-tr-lg"></div>

                  {/* Post Image */}
                  {post.image && getImageUrl(post.image) && (
                    <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(post.image)!}
                        alt={post.image.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Categories */}
                  {post.categories && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.map((category) => (
                        <span
                          key={category.slug.current}
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(
                            category
                          )} text-white`}
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-amber-100 mb-4 font-serif leading-tight group-hover:text-amber-50 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-stone-300 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-amber-400/80">
                    <div className="flex items-center space-x-4">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>•</span>
                      <span>
                        {post.readTime || estimateReadTime(post.body)} min read
                      </span>
                    </div>
                    {post.author && (
                      <div className="flex items-center space-x-2">
                        {post.author.image && (
                          <div className="relative w-6 h-6">
                            {/* Add fallback for author image */}
                            <Image
                              src={urlFor(post.author.image)
                                .width(48)
                                .height(48)
                                .url()}
                              alt={post.author.name}
                              fill
                              className="rounded-full object-cover"
                              sizes="24px"
                            />
                          </div>
                        )}
                        <span>{post.author.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-yellow-200/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {regularPosts.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-amber-400 mb-8 font-serif text-center">
              {selectedCategory === "all"
                ? "All Articles"
                : `${
                    categories.find((c) => c.slug === selectedCategory)?.title
                  } Articles`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group block"
                >
                  <div className="h-full bg-gradient-to-br from-stone-800/60 to-stone-900/80 p-6 border-2 border-stone-600/40 rounded-lg shadow-xl group-hover:border-amber-600/50 group-hover:shadow-2xl transition-all duration-300">
                    {/* Spotlight effect */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-yellow-200/10 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Post Image */}
                    {post.image && getImageUrl(post.image) && (
                      <div className="relative h-40 mb-4 rounded overflow-hidden">
                        <Image
                          src={getImageUrl(post.image)!}
                          alt={post.image.alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    {/* Categories */}
                    {post.categories && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category.slug.current}
                            className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getCategoryColor(
                              category
                            )} text-white`}
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-stone-200 mb-3 leading-tight group-hover:text-amber-100 transition-colors duration-300 font-serif">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-stone-400 group-hover:text-amber-400/80 transition-colors duration-300">
                      <div className="flex items-center space-x-2">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>
                          {post.readTime || estimateReadTime(post.body)} min
                        </span>
                      </div>
                      {post.author && (
                        <span className="font-medium">{post.author.name}</span>
                      )}
                    </div>

                    {/* Museum label effect */}
                    <div className="absolute bottom-2 right-2 w-6 h-1 bg-amber-600/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4 font-serif">
              No Articles Found
            </h3>
            <p className="text-stone-400 mb-8">
              {searchTerm
                ? `No articles match "${searchTerm}"`
                : `No articles in the ${
                    categories.find((c) => c.slug === selectedCategory)?.title
                  } category`}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 border-2 border-amber-600/50 rounded font-serif hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
            >
              View All Articles
            </button>
          </div>
        )}
      </div>

      {/* Decorative elements - only show after mount */}
      {mounted && (
        <>
          <div
            className="fixed bottom-20 left-20 w-8 h-8 border border-amber-700/30 rotate-45 opacity-60 pointer-events-none"
            style={{
              transform: `rotate(${45 + scrollY * 0.02}deg)`,
            }}
          >
            <div className="absolute inset-1 border border-amber-600/20"></div>
          </div>

          <div
            className="fixed top-20 right-20 w-6 h-6 bg-amber-600/20 rounded-full opacity-40 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`,
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.2)",
            }}
          />
        </>
      )}
    </div>
  );
};

export default BlogPage;
