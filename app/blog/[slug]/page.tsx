"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  PortableText,
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
  TypedObject,
} from "@portabletext/react";

// You'll need to create this function in your lib/sanity.js file
import { getPostBySlug, urlFor } from "../../../lib/sanity";

type Post = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt?: string;
  body?: TypedObject | TypedObject[]; // Portable Text content
  image?: {
    asset: {
      url: string;
      _id: string;
    };
    alt?: string;
    caption?: string;
  };
  author?: {
    name: string;
    bio?: string;
    image?: {
      asset: {
        url: string;
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
  seo?: {
    metaDescription?: string;
    metaKeywords?: string[];
  };
};

// Custom components for Portable Text
const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref?: string }; alt?: string; caption?: string };
    }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={urlFor(value).width(800).height(400).url()}
              alt={value.alt || "Blog image"}
              width={800}
              height={400}
              className="w-full h-auto"
            />
          </div>
          {value.caption && (
            <p className="text-center text-sm text-stone-400 mt-3 italic font-serif">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    code: ({ value }: { value: { language?: string; code: string } }) => (
      <div className="my-6">
        <div className="bg-stone-900/80 border border-stone-700/50 rounded-lg overflow-hidden">
          <div className="bg-stone-800/60 px-4 py-2 border-b border-stone-700/50">
            <span className="text-amber-400 text-sm font-medium">
              {value.language || "Code"}
            </span>
          </div>
          <pre className="p-4 text-sm text-stone-200 overflow-x-auto">
            <code>{value.code}</code>
          </pre>
        </div>
      </div>
    ),
  },
  block: {
    h1: (props) => (
      <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mt-12 mb-6 font-serif">
        {props.children}
      </h1>
    ),
    h2: (props) => (
      <h2 className="text-2xl md:text-3xl font-bold text-amber-200 mt-10 mb-5 font-serif">
        {props.children}
      </h2>
    ),
    h3: (props) => (
      <h3 className="text-xl md:text-2xl font-semibold text-amber-300 mt-8 mb-4 font-serif">
        {props.children}
      </h3>
    ),
    h4: (props) => (
      <h4 className="text-lg md:text-xl font-semibold text-amber-400 mt-6 mb-3 font-serif">
        {props.children}
      </h4>
    ),
    normal: (props) => (
      <p className="text-stone-300 leading-relaxed mb-6 text-base md:text-lg">
        {props.children}
      </p>
    ),
    blockquote: (props) => (
      <blockquote className="border-l-4 border-amber-600/50 pl-6 my-8 bg-amber-900/20 py-4 rounded-r-lg">
        <div className="text-amber-200 italic text-lg leading-relaxed font-serif">
          {props.children}
        </div>
      </blockquote>
    ),
  },
  list: {
    bullet: (props: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-stone-300 ml-4">
        {props.children}
      </ul>
    ),
    number: (props: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-stone-300 ml-4">
        {props.children}
      </ol>
    ),
  },
  listItem: {
    bullet: (props: { children?: React.ReactNode }) => (
      <li className="text-stone-300 leading-relaxed">{props.children}</li>
    ),
    number: (props: { children?: React.ReactNode }) => (
      <li className="text-stone-300 leading-relaxed">{props.children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold text-amber-200">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-amber-300">{children}</em>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="bg-stone-800/60 text-amber-300 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: function LinkMark(
      props: PortableTextMarkComponentProps<{ _type: string; href: string }>
    ) {
      const { value, children } = props;
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-amber-400 hover:text-amber-300 underline decoration-amber-600/50 hover:decoration-amber-400 transition-colors duration-200"
        >
          {children}
        </a>
      );
    },
  },
};

const BlogPostPage = () => {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollY(scrollTop);
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.slug) return;

      try {
        setLoading(true);
        const fetchedPost = await getPostBySlug(params.slug as string);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (body: unknown) => {
    if (!body) return 5;
    const wordCount = JSON.stringify(body).split(" ").length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const getCategoryColor = (category?: { color?: string }) => {
    if (category?.color) return category.color;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full mx-auto mb-4"></div>
          <p className="text-amber-200 text-lg font-serif">
            Loading Article...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold text-amber-400 mb-4 font-serif">
            Article Not Found
          </h1>
          <p className="text-stone-400 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 border-2 border-amber-600/50 rounded font-serif hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
          >
            Back to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 text-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-stone-800/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Museum lighting effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
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

      {/* Hero Section */}
      <div className="relative pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          {post.categories && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {post.categories.map((category) => (
                <span
                  key={category.slug.current}
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(
                    category
                  )} text-white`}
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 font-serif text-center leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-lg md:text-xl text-stone-300 leading-relaxed text-center font-serif italic border-l-4 border-amber-600/50 pl-6 bg-amber-900/10 py-4 rounded-r-lg">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-amber-400/80 mb-12">
            <div className="flex items-center space-x-4">
              <span className="font-serif">{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span className="font-serif">
                {post.readTime || estimateReadTime(post.body)} min read
              </span>
            </div>

            {post.author && (
              <div className="flex items-center space-x-3">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image.asset.url)
                      .width(800)
                      .height(400)
                      .url()}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-amber-600/40"
                  />
                )}
                <span className="font-serif">by {post.author.name}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="relative mb-12">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(post.image.asset.url)
                    .width(800)
                    .height(400)
                    .url()}
                  alt={post.image.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              {post.image.caption && (
                <p className="text-center text-sm text-stone-400 mt-4 italic font-serif">
                  {post.image.caption}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-stone-900/40 to-stone-800/40 p-8 md:p-12 rounded-lg border border-stone-600/30 shadow-2xl backdrop-blur-sm">
          {/* Content Body */}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.body && (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            )}

            {/* Author Bio */}
            {post.author?.bio && (
              <div className="mt-16 pt-8 border-t border-stone-600/40">
                <div className="flex items-start space-x-4">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image.asset.url)
                        .width(800)
                        .height(400)
                        .url()}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-amber-600/40"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-amber-300 mb-2 font-serif">
                      About {post.author.name}
                    </h3>
                    <p className="text-stone-300 leading-relaxed">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 border-2 border-amber-600/50 rounded-lg font-serif hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-xl"
          >
            ← Return to Digital Archive
          </Link>
        </div>
      </article>

      {/* Decorative elements */}
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
    </div>
  );
};

export default BlogPostPage;
