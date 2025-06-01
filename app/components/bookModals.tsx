import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
interface Book {
  title: string;
  image: string;
  subtitle: string;
  description: string;
  pages: number;
  color: string;
  accent: string;
  link: string;
}

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false); // NEW
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window;
      setIsMobile(mobile);

      // Reset mobile expanded state when switching to desktop
      if (!mobile) {
        setIsExpandedMobile(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };
  // NEW: Handle mobile tap/click
  const handleMobileClick = () => {
    if (isMobile) {
      setIsExpandedMobile((prev) => !prev);
    }
  };
  // Determine if card should be expanded
  const isExpanded = isMobile ? isExpandedMobile : isHovered;

  // Get responsive dimensions
  const getCardDimensions = () => {
    if (isExpanded && isMobile) {
      return "w-screen h-80 fixed left-0"; // True full screen width on mobile
    } else if (isExpanded && !isMobile) {
      return "scale-110 w-[480px] h-[320px]"; // Desktop hover size
    } else {
      return "w-64 h-80"; // Default size
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative perspective-1000 transition-transform duration-500 ${
        isExpanded && isMobile ? "z-50 pb-16" : "mx-auto"
      }`}
      style={{
        transform: isExpanded && isMobile ? "none" : `translateY(${0})`, // Remove scrollY transform
        zIndex: isExpanded ? 50 : index,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMobileClick} // NEW: handle tap on mobile
    >
      {/* Book Container */}
      <div
        className={`relative transition-all duration-700 transform-style-preserve-3d ${getCardDimensions()}`}
      >
        {/* Book Cover (left panel) */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            book.color
          } rounded-lg shadow-2xl transition-transform duration-700 ease-in-out ${
            isExpanded ? "rotate-y-[-160deg]" : "rotate-y-0"
          }`}
          style={{
            transformOrigin:
              isExpanded && isMobile ? "50% center" : "left center",
            backfaceVisibility: "hidden",
            zIndex: 2,
          }}
        >
          <Image
            src={book.image}
            width={400}
            height={600}
            alt={book.title}
            className="w-full h-full absolute rounded-lg"
          />
          <div
            className={`p-6 h-full flex flex-col justify-between text-white ${
              isExpanded && isMobile ? "p-8" : ""
            }`}
          ></div>
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-white opacity-30 rounded-l"></div>
        </div>

        {/* Description Page (right side) */}
        <div
          className={`absolute inset-0 bg-white text-black rounded-lg shadow-xl transition-opacity duration-700 ease-in-out ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
            zIndex: 1,
            padding: isExpanded && isMobile ? "2rem" : "1.5rem",
          }}
        >
          <div className="flex flex-col h-full">
            <div
              className={`font-bold mb-4 bg-gradient-to-r ${
                book.accent
              } bg-clip-text text-transparent ${
                isExpanded && isMobile ? "text-3xl" : "text-2xl"
              }`}
            >
              About {book.title}
            </div>
            <p
              className={`leading-relaxed text-gray-700 mb-4 overflow-y-auto ${
                isExpanded && isMobile ? "text-base" : "text-sm"
              }`}
            >
              {book.description}
            </p>
            <div
              className={`text-gray-500 mt-auto ${
                isExpanded && isMobile ? "text-sm" : "text-xs"
              }`}
            >
              Available now • {book.pages} pages
            </div>
            <a
              href={book.link} // Make sure your Book type has a `link` property
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-2 rounded-lg transition-colors duration-300 bg-blue-600 text-white hover:bg-blue-700 text-center"
            >
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
