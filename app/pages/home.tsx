"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BookCard from "../components/bookModals";
import { useRouter } from "next/navigation";
import { getPosts, urlFor } from "../../lib/sanity"; // Adjust path as needed
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  type Project = {
    title: string;
    tech: string;
    description: string;
    image: string;
    color: keyof typeof colorMap;
    page: string;
  };
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const router = useRouter();
  type Post = {
    _id: string;
    title: string;
    slug: { current: string };
    image?: unknown;
    excerpt?: string;
    publishedAt: string;
    readTime?: number;
    body?: unknown;
    categories?: { title: string }[];
  };
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Helper functions (add these to your component)
  const formatDate = (dateString: string | number | Date) => {
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

  const getImageUrl = (image: SanityImageSource) => {
    if (!image) return null;
    try {
      // If image is a string (asset reference id)
      if (typeof image === "string") {
        return urlFor(image).width(400).height(200).url();
      }
      // If image is an object with asset property (Sanity image object)
      if (typeof image === "object" && "asset" in image && image.asset) {
        return urlFor(image).width(400).height(200).url();
      }
      return null;
    } catch (error) {
      console.error("Error generating image URL:", error);
      return null;
    }
  };
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      // Calculate current section based on scroll position
      const windowHeight = window.innerHeight;
      const section = Math.floor(newScrollY / windowHeight);
      setCurrentSection(Math.min(section, 4)); // 0: hero, 1: books, 2: projects
    };

    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const books = [
    {
      title: "Jericho's Odyssey",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/bf9b71230312d8a2e59ffd0daf015f0963b9c2e0-1324x2000.png",
      subtitle: "From Code to Creation",
      description:
        "A comprehensive guide exploring the evolution from learning your first programming language to shipping commercial applications. This book covers practical development strategies, debugging techniques, and the mindset shifts required to become a professional developer.",
      pages: 280,
      color: "from-blue-600 to-blue-800",
      accent: "from-blue-400 to-cyan-400",
      link: "https://www.amazon.com/Jerichos-Odyssey-William-Rongholt/dp/B0C5VZ3K9F",
    },
    {
      title: "Orphans",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/4afdd32201ffd7b8ce75297243ad1004f5978c85-1800x2700.jpg",
      subtitle: "Building Engaging Experiences",
      description:
        "Dive deep into the psychology of game design, player engagement mechanisms, and the technical implementation of compelling gameplay systems. Learn how to balance challenge and reward while creating memorable gaming experiences.",
      pages: 320,
      color: "from-purple-600 to-purple-800",
      accent: "from-purple-400 to-pink-400",
      link: "https://www.amazon.com/Orphans-William-Rongholt/dp/B0C5VZ3K9F",
    },
  ];

  const colorMap = {
    "orange-red": "from-orange-500 to-red-600",
    "yellow-orange": "from-yellow-600 to-orange-700",
    "blue-purple": "from-blue-500 to-purple-600",
    "teal-blue": "from-teal-500 to-blue-600",
    "indigo-purple": "from-indigo-500 to-purple-600",
    "green-teal": "from-green-500 to-teal-600",
  };

  const projects: Project[] = [
    {
      title: "Small & Furious",
      tech: "Unity • C#",
      description:
        "Watch as chaos unfolds in this miniature racing game where toy-sized cars drift, boost, and battle through oversized environments! ",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/169d8ede343ea648658fe6613e0352e95cbb2751-1536x1024.png",
      color: "orange-red",
      page: "/smallfurious",
    },
    {
      title: "Unofficial Fallout Game",
      tech: "JS • HTML5",
      description:
        "A post-apocalyptic survival game inspired by the Fallout universe. Features immersive storytelling mechanics in a text-based adventure.",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/6da61c9395dba5b09c5c46e17769becab23d791c-500x500.jpg",
      color: "yellow-orange",
      page: "/fallout",
    },
    {
      title: "Reef Unity Game",
      tech: "Unity • C#",
      description:
        "Underwater exploration game featuring realistic water physics, marine life AI, and environmental storytelling.",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/62df86712de5dd86736f26d514a6d694dbf40dc7-889x500.jpg",
      color: "teal-blue",
      page: "/reef",
    },
    {
      title: "Alexa Skills",
      tech: "Node.js • AWS Lambda",
      description:
        "Collection of voice-activated applications including a trivia game, name generator, and other games. Deployed on AWS with natural language processing.",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/09ff34789033a5df06edd3289a536bb36ff2bb74-1170x545.png",
      color: "indigo-purple",
      page: "/alexa",
    },
    {
      title: "Resume",
      tech: "Next.js • React",
      description:
        "Interactive portfolio website featuring advanced animations, parallax effects, and responsive design. Built with modern web technologies and optimized for performance.",
      image:
        "https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/ac8e35f87447199dd98a0d1f14b58c984bfb844c-711x400.jpg",
      color: "green-teal",
      page: "/resume",
    },
  ];

  return (
    <div className="bg-black text-white w-full">
      {/* Add scroll snapping */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @media (min-width: 640px) {
          html {
            scroll-snap-type: y mandatory;
          }
          .snap-section {
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }
      `}</style>

      {/* Starry Background - Fixed */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              transform: `translateY(${
                scrollY * (0.1 + Math.random() * 0.5)
              }px) translateX(${mousePos.x * (Math.random() * 0.3)}px)`,
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        className="snap-section relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="text-center z-10 transition-all duration-1000 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.5}px) scale(${
              1 - scrollY * 0.0005
            })`,
            opacity: Math.max(0, 1 - scrollY * 0.003),
          }}
        >
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold pb-2 mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-orbitron"
            style={{
              transform: `rotateX(${mousePos.y * 0.05}deg) rotateY(${
                mousePos.x * 0.05
              }deg)`,
            }}
          >
            William Rongholt
          </h1>
          <p
            className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-6 sm:mb-8 md:mb-12"
            style={{
              transform: `translateY(${mousePos.y * 0.3}px)`,
            }}
          >
            <span className="font-unbounded">Developer</span> •{" "}
            <span className="font-zen">Game Creator</span> •{" "}
            <span className="font-fall">Author</span>
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          style={{
            opacity: Math.max(0, 1 - scrollY * 0.01),
          }}
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section
        id="books"
        className="snap-section relative h-screen flex items-center justify-center overflow-hidden py-8 sm:py-0"
      >
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          style={{
            transform: `translateY(${(scrollY - windowHeight) * 0.3}px)`,
            opacity:
              currentSection === 1
                ? 1
                : Math.max(0, 1 - Math.abs(scrollY - windowHeight) * 0.002),
          }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold p-2 mb-8 sm:mb-16 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent text-center"
            style={{
              transform: `translateY(${mousePos.y * 0.2}px) scale(${
                1 + mousePos.x * 0.01
              })`,
            }}
          >
            My Books
          </h2>

          <div className="flex flex-col space-y-6 sm:space-y-8 md:flex-row md:space-y-0 md:space-x-8 lg:space-x-16 items-center justify-center">
            {books.map((book, index) => (
              <BookCard key={book.title} book={book} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="snap-section relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-8 sm:py-0"
      >
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 transition-all duration-700 ease-out">
          {selectedProject && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
              style={{
                backgroundImage: `url(${selectedProject.image})`,
                filter: "blur(8px)",
                transform: `scale(${1.1 + scrollY * 0.0001})`,
              }}
            />
          )}
        </div>

        <div
          className="relative z-10 w-full h-full"
          style={{
            transform: `translateY(${(scrollY - windowHeight * 2) * 0.2}px)`,
            opacity:
              currentSection === 2
                ? 1
                : Math.max(0, 1 - Math.abs(scrollY - windowHeight * 2) * 0.001),
          }}
        >
          {/* Main Title - Center Left */}
          <div className="relative top-0 sm:absolute sm:top-8 sm:left-10 lg:left-20 z-20 text-center sm:text-left mb-8 sm:mb-0">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent leading-tight"
              style={{
                transform: `translateX(${mousePos.x * 0.3}px) translateY(${
                  mousePos.y * 0.2
                }px)`,
              }}
            >
              Featured
              <br />
              Projects
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl mt-4 text-gray-300 max-w-xs sm:max-w-sm md:max-w-md mx-auto sm:mx-0"
              style={{
                transform: `translateX(${mousePos.x * 0.1}px)`,
              }}
            >
              Interactive games and applications built with modern technologies
            </p>
          </div>

          {/* Project Info Display */}
          <div className="relative sm:absolute sm:top-16 lg:top-20 sm:right-8 lg:right-16 max-w-sm lg:max-w-md z-20 mb-8 sm:mb-0 px-4 sm:px-0">
            <div
              className={`transition-all duration-500 ${
                selectedProject
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transform: `translateX(${mousePos.x * -0.2}px)`,
              }}
            >
              {selectedProject && (
                <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm text-blue-400 mb-4">
                    {selectedProject.tech}
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {selectedProject.description}
                  </p>
                  {/* Close button for mobile */}
                  <button
                    className="sm:hidden mt-4 text-xs text-gray-400 hover:text-white transition-colors"
                    onClick={() => setSelectedProject(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Project Grid */}
          <div className="relative sm:absolute sm:bottom-8 lg:bottom-16 sm:right-8 lg:right-16 z-20 px-4 sm:px-0">
            <div
              className="flex flex-wrap gap-4 lg:gap-4 max-w-sm sm:max-w-md lg:max-w-5xl mx-auto justify-center items-center"
              style={{
                transform: `translateY(${mousePos.y * -0.1}px)`,
              }}
            >
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[3/4] transition-all duration-500 hover:scale-105 w-20 sm:w-16 lg:w-20"
                  onMouseEnter={() => {
                    // Only show on hover for desktop
                    if (window.innerWidth >= 640) {
                      setSelectedProject(project);
                    }
                  }}
                  onMouseLeave={() => {
                    // Only hide on mouse leave for desktop
                    if (window.innerWidth >= 640) {
                      setSelectedProject(null);
                    }
                  }}
                  onClick={() => {
                    // Mobile: show project info, Desktop: navigate
                    if (window.innerWidth < 640) {
                      setSelectedProject(
                        selectedProject?.title === project.title
                          ? null
                          : project
                      );
                    } else {
                      router.push(project.page);
                    }
                  }}
                  style={{
                    transform: `translateY(${
                      (scrollY - windowHeight * 2) * (0.02 + index * 0.005)
                    }px) rotateY(${mousePos.x * 0.02}deg)`,
                  }}
                >
                  {/* Project Image Background */}
                  <div className="absolute inset-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      colorMap[project.color]
                    } opacity-60 group-hover:opacity-40 transition-opacity duration-300`}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 px-2">
                      <h3 className="text-xs font-bold text-white mb-1 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-300">
                        {project.tech.split(" • ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Subtle border */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-300"></div>

                  {/* Selected indicator for mobile */}
                  {selectedProject?.title === project.title && (
                    <div className="sm:hidden absolute inset-0 rounded-2xl border-2 border-blue-400/80 bg-blue-400/10"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile instruction text */}
            <p className="sm:hidden text-center text-xs text-gray-400 mt-4">
              Tap a project to view details
            </p>

            {/* Floating elements for visual interest */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl"
              style={{
                transform: `translateY(${
                  (scrollY - windowHeight * 2) * 0.03
                }px) rotate(${scrollY * 0.1}deg)`,
              }}
            ></div>
            <div
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg"
              style={{
                transform: `translateY(${
                  (scrollY - windowHeight * 2) * -0.02
                }px) rotate(${scrollY * -0.05}deg)`,
              }}
            ></div>
          </div>
        </div>

        {/* Background Effects */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
            transform: `translateY(${(scrollY - windowHeight * 2) * 0.1}px)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            transform: `translateY(${(scrollY - windowHeight * 2) * -0.05}px)`,
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        ></div>
      </section>

      {/* Blog Section - Art Museum */}
      <section
        id="blog"
        className="snap-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 py-8 sm:py-0"
      >
        {/* Museum lighting effects */}
        <div className="absolute inset-0 opacity-40">
          {/* Spotlights */}
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
          <div
            className="absolute top-0 left-1/2 w-24 h-48 bg-gradient-to-b from-white/10 to-transparent blur-xl"
            style={{
              transform: `translateY(${scrollY * 0.04}px) translateX(-50%)`,
            }}
          />

          {/* Museum floor pattern */}
          <div
            className="absolute bottom-0 inset-x-0 h-32 opacity-20"
            style={{
              backgroundImage: `
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.1) 0px,
            rgba(255,255,255,0.1) 2px,
            transparent 2px,
            transparent 60px
          ),
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.05) 0px,
            rgba(255,255,255,0.05) 2px,
            transparent 2px,
            transparent 60px
          )
        `,
            }}
          />
        </div>

        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center"
          style={{
            transform: `translateY(10px)`,
            opacity:
              currentSection === 3
                ? 1
                : Math.max(0, 1 - Math.abs(scrollY - windowHeight * 3) * 0.001),
          }}
        >
          {/* Museum Header */}
          <div className="text-center mb-8 ">
            <div className="relative inline-block">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 font-serif"
                style={{
                  transform: `translateY(-10px)`,
                  textShadow: "0 0 30px rgba(251, 191, 36, 0.3)",
                }}
              >
                The Archive
              </h2>

              {/* Decorative museum nameplate */}
              <div className="mt-4 mx-auto w-fit bg-gradient-to-r from-amber-900/60 to-amber-800/60 px-6 py-2 border-2 border-amber-600/40 rounded-sm">
                <p className="text-amber-200 text-sm sm:text-base font-serif tracking-wide">
                  Collection of Digital Essays & Tales
                </p>
              </div>

              {/* Museum info plaque */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent"></div>
            </div>
          </div>

          {/* Blog Gallery */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-6xl">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full mx-auto mb-4"></div>
                  <p className="text-amber-200 text-lg font-serif">
                    Loading Archive...
                  </p>
                </div>
              ) : (
                <>
                  {/* Main featured blog frame */}
                  {posts.length > 0 && (
                    <div
                      className="relative mx-auto mb-8"
                      style={{
                        transform: `translateY(${mousePos.y * 0.1}px) rotateY(${
                          mousePos.x * 0.01
                        }deg)`,
                      }}
                    >
                      {/* Ornate frame for featured blog */}
                      <div className="relative bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-stone-900/60 p-6 rounded-lg border-4 border-amber-700/50 shadow-2xl max-w-5xl max-h-125 mx-auto">
                        {/* Corner ornaments */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-amber-500/70 rounded-tl-lg"></div>
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-amber-500/70 rounded-tr-lg"></div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-amber-500/70 rounded-bl-lg"></div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-amber-500/70 rounded-br-lg"></div>

                        {/* Featured blog content */}
                        <div className="text-center">
                          <div className="mb-4 sm:mb-6">
                            <span className="text-amber-400 text-xs sm:text-sm font-serif tracking-wider uppercase">
                              Featured Article
                            </span>
                          </div>

                          {/* Featured post image */}

                          {(() => {
                            const imgUrl = posts[0].image
                              ? getImageUrl(posts[0].image)
                              : null;
                            if (!imgUrl) return null;
                            return (
                              <div className="relative h-30 mb-4 rounded-lg overflow-hidden mx-auto max-w-sm">
                                <Image
                                  src={imgUrl}
                                  alt={
                                    typeof posts[0].image === "object" &&
                                    posts[0].image &&
                                    "alt" in posts[0].image
                                      ? (posts[0].image as { alt?: string })
                                          .alt || posts[0].title
                                      : posts[0].title
                                  }
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 468px) 300px"
                                />
                              </div>
                            );
                          })()}

                          <h3 className="text-xl sm:text-2xl font-bold text-amber-100 mb-3 sm:mb-4 font-serif leading-tight">
                            {posts[0].title}
                          </h3>

                          {posts[0].excerpt && (
                            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 max-h-14 max-w-4xl mx-auto overflow-hidden text-ellipsis">
                              {posts[0].excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-center space-x-4 text-xs sm:text-sm text-amber-400/80 mb-4 sm:mb-6">
                            <span>{formatDate(posts[0].publishedAt)}</span>
                            <span>•</span>
                            <span>
                              {posts[0].readTime ||
                                estimateReadTime(posts[0].body)}{" "}
                              min read
                            </span>
                            {posts[0].categories && posts[0].categories[0] && (
                              <>
                                <span>•</span>
                                <span>{posts[0].categories[0].title}</span>
                              </>
                            )}
                          </div>

                          <button
                            className="group relative px-6 py-2 bg-gradient-to-r from-amber-800/80 to-amber-900/80 text-amber-100 border border-amber-600/50 rounded font-serif transition-all duration-300 hover:from-amber-700/90 hover:to-amber-800/90 hover:border-amber-500/70"
                            onClick={() =>
                              router.push(`/blog/${posts[0].slug.current}`)
                            }
                          >
                            <span className="relative z-10">Read Article</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>
                          </button>
                        </div>

                        {/* Museum lighting effect on frame */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-yellow-200/5 rounded-lg pointer-events-none"
                          style={{
                            opacity: 0.6 + Math.sin(scrollY * 0.01) * 0.2,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Gallery of other blogs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
                    {posts.slice(1, 5).map((post, index) => (
                      <div
                        key={post._id}
                        className="group cursor-pointer"
                        style={{
                          transform: `translateY(${
                            (scrollY - windowHeight * 3) *
                            (0.01 + index * 0.005)
                          }px) rotateY(${mousePos.x * 0.005}deg)`,
                        }}
                        onClick={() =>
                          router.push(`/blog/${post.slug.current}`)
                        }
                      >
                        {/* Smaller museum frames */}
                        <div className="relative bg-gradient-to-br from-stone-800/60 to-stone-900/80 p-3 sm:p-4 border-2 border-stone-600/40 rounded shadow-xl group-hover:border-amber-600/50 transition-all duration-300 group-hover:shadow-2xl">
                          {/* Mini spotlight effect */}
                          <div
                            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-yellow-200/10 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              transform: `translateX(-50%) translateY(-20px)`,
                            }}
                          />

                          {/* Blog preview image */}
                          <div className="w-full h-20 sm:h-24 bg-gradient-to-br from-stone-700 to-stone-800 rounded mb-3 border border-stone-600/30 group-hover:border-amber-600/30 transition-colors duration-300 overflow-hidden">
                            {(() => {
                              const imgUrl = getImageUrl(
                                post.image as SanityImageSource
                              );
                              if (post.image && imgUrl) {
                                return (
                                  <div className="relative w-full h-full">
                                    <Image
                                      src={imgUrl}
                                      alt={
                                        typeof post.image === "object" &&
                                        post.image &&
                                        "alt" in post.image
                                          ? (post.image as { alt?: string })
                                              .alt || post.title
                                          : post.title
                                      }
                                      fill
                                      className="object-cover"
                                      sizes="200px"
                                    />
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center">
                                      <div className="w-3 h-3 bg-amber-500/40 rounded-full"></div>
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-200 leading-tight group-hover:text-amber-100 transition-colors duration-300 font-serif line-clamp-2">
                              {post.title}
                            </h4>

                            <div className="flex flex-col space-y-1 text-xs text-stone-400 group-hover:text-amber-400/80 transition-colors duration-300">
                              {post.categories && post.categories[0] && (
                                <span className="font-medium">
                                  {post.categories[0].title}
                                </span>
                              )}
                              <div className="flex items-center space-x-2">
                                <span>{formatDate(post.publishedAt)}</span>
                                <span>•</span>
                                <span>
                                  {post.readTime || estimateReadTime(post.body)}{" "}
                                  min
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Mini museum label */}
                          <div className="absolute bottom-1 right-1 w-4 h-1 bg-amber-600/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Museum visitor information */}
                  <div className="text-center mt-8">
                    <div className="inline-block bg-stone-900/80 px-6 py-3 border border-stone-600/40 rounded-lg">
                      <p className="text-stone-400 text-xs sm:text-sm font-serif">
                        Browse Collection •{" "}
                        <button
                          className="text-amber-400 hover:text-amber-300 transition-colors duration-300 underline"
                          onClick={() => router.push("/blog")}
                        >
                          View All Articles ({posts.length})
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Museum ambient elements */}
        <div
          className="absolute bottom-20 left-20 w-8 h-8 border border-amber-700/30 rotate-45 opacity-60"
          style={{
            transform: `rotate(${45 + scrollY * 0.02}deg)`,
          }}
        >
          <div className="absolute inset-1 border border-amber-600/20"></div>
        </div>

        <div
          className="absolute top-20 right-20 w-6 h-6 bg-amber-600/20 rounded-full opacity-40"
          style={{
            transform: `translateY(${scrollY * 0.03}px)`,
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.2)",
          }}
        />

        {/* Vintage museum typography */}
        <div
          className="absolute top-10 left-10 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.01}px)`,
          }}
        >
          <div className="text-4xl font-serif text-amber-700/40 leading-none">
            EST.
          </div>
          <div className="text-xs text-amber-600/60 tracking-widest">
            MMXXIV
          </div>
        </div>

        {/* Vintage paper grain overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(217, 119, 6, 0.03) 2px,
          rgba(217, 119, 6, 0.03) 4px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(146, 64, 14, 0.02) 2px,
          rgba(146, 64, 14, 0.02) 4px
        )
      `,
          }}
        />
      </section>
      {/* About Me Section - Rustic Noir Steampunk */}
      <section
        id="about"
        className="snap-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900/20 via-stone-900 to-zinc-900 py-8 sm:py-0"
      >
        {/* Steampunk Background Elements */}
        <div className="absolute inset-0 opacity-30">
          {/* Gear overlays */}
          <div
            className="absolute top-20 left-20 w-32 h-32 border-4 border-amber-700/40 rounded-full"
            style={{
              transform: `rotate(${scrollY * 0.1}deg)`,
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(217, 119, 6, 0.1) 45deg, transparent 90deg, rgba(217, 119, 6, 0.1) 135deg, transparent 180deg, rgba(217, 119, 6, 0.1) 225deg, transparent 270deg, rgba(217, 119, 6, 0.1) 315deg, transparent 360deg)",
            }}
          >
            <div className="absolute inset-4 border-2 border-amber-600/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-amber-700/60 rounded-full"></div>
          </div>

          <div
            className="absolute bottom-32 right-16 w-24 h-24 border-3 border-amber-800/50 rounded-full"
            style={{
              transform: `rotate(${scrollY * -0.15}deg)`,
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(146, 64, 14, 0.2) 60deg, transparent 120deg, rgba(146, 64, 14, 0.2) 180deg, transparent 240deg, rgba(146, 64, 14, 0.2) 300deg, transparent 360deg)",
            }}
          >
            <div className="absolute inset-3 border border-amber-700/40 rounded-full"></div>
          </div>

          {/* Vintage paper texture overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(217, 119, 6, 0.1) 0%, transparent 25%),
                radial-gradient(circle at 75% 75%, rgba(146, 64, 14, 0.1) 0%, transparent 25%),
                linear-gradient(45deg, transparent 40%, rgba(180, 83, 9, 0.05) 50%, transparent 60%)
              `,
            }}
          />

          {/* Steam/smoke effects */}
          <div
            className="absolute top-0 left-1/4 w-2 h-40 bg-gradient-to-t from-amber-900/30 to-transparent opacity-60 blur-sm"
            style={{
              transform: `translateY(${scrollY * 0.05}px) scaleY(${
                1 + Math.sin(scrollY * 0.01) * 0.2
              })`,
            }}
          />
          <div
            className="absolute top-0 right-1/3 w-1 h-32 bg-gradient-to-t from-stone-700/40 to-transparent opacity-50 blur-sm"
            style={{
              transform: `translateY(${scrollY * 0.03}px) scaleY(${
                1 + Math.cos(scrollY * 0.015) * 0.3
              })`,
            }}
          />
        </div>

        <div
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
          style={{
            opacity:
              currentSection === 4
                ? 1
                : Math.max(0, 1 - Math.abs(scrollY - windowHeight * 4) * 0.001),
          }}
        >
          {/* Left side - Portrait and decorative elements */}
          <div className="relative">
            {/* Vintage frame effect */}
            <div className="relative order-2 lg:order-1">
              <div
                className="relative bg-gradient-to-br from-amber-900/40 to-stone-900/60 p-4 sm:p-6 lg:p-8 rounded-lg border-4 border-amber-700/30 shadow-2xl"
                style={{
                  transform: `rotateY(${mousePos.x * 0.02}deg) rotateX(${
                    mousePos.y * -0.01
                  }deg)`,
                  boxShadow:
                    "inset 0 0 20px rgba(217, 119, 6, 0.1), 0 0 40px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600/60"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600/60"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600/60"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600/60"></div>

                {/* Placeholder for profile image */}
                <div className="w-full h-60 sm:h-80 bg-gradient-to-br from-stone-800 to-zinc-800 rounded border-2 border-amber-800/40 flex items-center justify-center">
                  <Image
                    src="https://cdn.sanity.io/media-libraries/mlV5UAgbUN0G/images/bf0dd5037d5672f789659091fd8eb6e9dbc28ebb-1350x1080.jpg"
                    alt="William Rongholt"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating mechanical elements */}
            <div
              className="absolute -top-4 -right-4 w-12 h-12 border-2 border-amber-700/50 bg-stone-900/80 rounded rotate-45 flex items-center justify-center"
              style={{
                transform: `rotate(${45 + scrollY * 0.1}deg) translateY(${
                  mousePos.y * 0.1
                }px)`,
              }}
            >
              <div className="w-4 h-4 border border-amber-600/60 rounded-full"></div>
            </div>
          </div>

          {/* Right side - About content */}
          <div className="sm:space-y-8 order-1 lg:order-2 text-center lg:text-left">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 leading-tight font-serif">
                About Me
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mb-6 sm:mb-8 mx-auto lg:mx-0"></div>
            </div>

            <div className="space-y-4 sm:space-y-6 text-stone-200">
              <p className="text-sm sm:text-base leading-relaxed text-stone-300/80">
                William Rongholt began his creative journey in 2018 by writing
                immersive content for Dungeons & Dragons, crafting adventures
                that blended narrative depth with player agency. This early
                exploration into interactive storytelling ignited a passion that
                would drive the rest of his career. Fascinated by the potential
                of voice-driven experiences, Rongholt soon turned to Alexa-based
                games, where he developed Space Marauders—a sci-fi adventure
                that allowed users to interact with a dynamic galaxy using only
                their voice. The success and originality of this concept set the
                stage for even bigger ambitions.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-stone-300/80">
                What began as a voice-driven game evolved into a fully realized
                universe. Space Marauders grew into a PC game currently in
                development and inspired a series of novels that further
                expanded its lore. Rongholt&apos;s work stands out for its
                unique fusion of storytelling, game development, and software
                engineering, delivering experiences that are both narratively
                rich and technically innovative. Whether on the page, on screen,
                or through gameplay, he continues to explore new ways to immerse
                audiences in the worlds of science fiction and fantasy.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border-l-4 border-amber-600/60 pl-4 text-left">
                  <h3 className="text-amber-400 font-semibold mb-2">
                    Expertise
                  </h3>
                  <ul className="text-base sm:text-md text-amber-100/90 font-light space-y-1">
                    <li>• Game Development</li>
                    <li>• Mobile Applications</li>
                    <li>• Web Experiences</li>
                    <li>• Sci-fi/Fantasy Author</li>
                  </ul>
                </div>
                {/* Vintage button */}
                <div className="pt-4 sm:pt-6">
                  <button
                    className="group relative px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 border-2 border-amber-600/50 rounded font-semibold transition-all duration-300 hover:from-amber-700 hover:to-amber-800 hover:border-amber-500 overflow-hidden"
                    style={{
                      transform: `translateY(${mousePos.y * 0.05}px)`,
                      boxShadow: "0 4px 15px rgba(217, 119, 6, 0.2)",
                    }}
                  >
                    <span className="relative z-10">Get In Touch</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional atmospheric elements */}
        <div
          className="absolute bottom-10 left-10 w-16 h-16 border border-amber-700/30 rotate-45"
          style={{
            transform: `rotate(${45 + scrollY * 0.05}deg)`,
          }}
        >
          <div className="absolute inset-2 border border-amber-600/20 rotate-45"></div>
        </div>

        {/* Vintage typography element in corner */}
        <div
          className="absolute top-10 right-10 text-right opacity-30"
          style={{
            transform: `translateY(-30px)`,
          }}
        >
          <div className="text-6xl font-serif text-amber-700/40 leading-none">
            WR
          </div>
          <div className="text-xs text-amber-600/60 tracking-widest">
            EST. 2010
          </div>
        </div>
      </section>

      <div className="fixed right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3 sm:space-y-4">
        {["Hero", "Books", "Projects", "Blog", "About"].map(
          (section, index) => (
            <button
              key={section}
              onClick={() => {
                const targetId = section.toLowerCase();
                const element = document.getElementById(targetId);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === index
                  ? "bg-white border-white scale-125"
                  : "bg-transparent border-white/50 hover:border-white/80"
              }`}
              title={section}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Home;
