"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Code,
  Briefcase,
  GraduationCap,
  Star,
  Coffee,
  Gamepad2,
  Music,
} from "lucide-react";

export default function FunResume() {
  const [activeSection, setActiveSection] = useState("about");
  const [isPartyMode, setIsPartyMode] = useState(false);

  const sections = [
    { id: "about", label: "About Me", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
  ];
  const [playlist, setPlaylist] = useState([
    {
      name: "Alien Planet Showdown",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Alien+Planet+Showdown.wav",
    },
    {
      name: "Back Against the Wall",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Back+Against+the+Wall.mp3",
    },
    {
      name: "Back Room of Space",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Back+Room+of+Space.mp3",
    },
    {
      name: "Blast off Bounce",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Blast+Off+Bounce.mp3",
    },
    {
      name: "Binary Love",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Binary+Love.mp3",
    },
    {
      name: "Cosmic Highway",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Cosmic+Highway.mp3",
    },
    {
      name: "Dark Matter Dreams",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Dark+Matter+Dreams.mp3",
    },
    {
      name: "Draw Something",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Draw+Something.mp3",
    },
    {
      name: "Fangs and Fire Acoustic",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Fangs+and+Fire+Acoustic.mp3",
    },
    {
      name: "Fangs and Fire",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Fangs+and+Fire.mp3",
    },
    {
      name: "Five Faction War",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Five+Faction+War.mp3",
    },
    {
      name: "Future World",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Future+World.mp3",
    },
    {
      name: "Future World",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Future+World.mp3",
    },
    {
      name: "Hunter's Code",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Hunter's+Code.mp3",
    },
    {
      name: "Hyperion Matter Drive",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Hyperion+Matter+Drive.mp3",
    },
    {
      name: "Intergalactic Funk",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Intergalactic+Funk.mp3",
    },
    {
      name: "Jericho's Odyssey",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Jericho's+Odyssey.mp3",
    },
    {
      name: "Let's Take a Spacewalk",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Let%E2%80%99s+Take+a+Spacewalk.mp3",
    },
    {
      name: "Lightspeed Flow",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Lightspeed+Flow.mp3",
    },
    {
      name: "Lower Bright City",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Lower+Bright+City.mp3",
    },
    {
      name: "Marauder Space Marauder",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Marauder+space+marauder.mp3",
    },
    {
      name: "March of the Stars Acoustic",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/March+of+the+Stars+Acoustic.mp3",
    },
    {
      name: "March of the Stars",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/March+of+the+Stars.mp3",
    },
    {
      name: "Metal Rebellion Acoustic",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Metal+Rebellion+Acoustic.mp3",
    },
    {
      name: "Metal Rebellion",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Metal+Rebellion.mp3",
    },
    {
      name: "Neon Dominion Acoustic",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Neon+Dominion+Acoustic.mp3",
    },
    {
      name: "Neon Dominion",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Neon+Dominion.mp3",
    },
    {
      name: "Orphans Rising",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Orphans+Rising.mp3",
    },
    {
      name: "Run the Stars",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Run+the+Stars.mp3",
    },
    {
      name: "Scars and Stardust",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Scars+and+Stardust.mp3",
    },
    {
      name: "Sci-fi City Groove",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Sci-fi+city+groove.mp3",
    },
    {
      name: "Smoke and Lasers",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Smoke+and+Lasers.mp3",
    },
    {
      name: "Solar Flare",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Solar+Flare.mp3",
    },

    {
      name: "Starlight Renegade",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Starlight+Renegade.mp3",
    },
    {
      name: "The Ballad of the Starborn Crew",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/The+Ballad+of+the+Starborn+Crew.mp3",
    },
    {
      name: "Wanted in the Stars",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wanted+in+the+Stars.mp3",
    },
    {
      name: "Wayfarer's Light Acoustic",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wayfarer%E2%80%99s+Light+Acoustic.mp3",
    },
    {
      name: "Wayfarer's Light",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wayfarer%E2%80%99s+Light.mp3",
    },
    {
      name: "Wild Wild Space",
      src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wild+Wild+Space.mp3",
    },
  ]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // Shuffle once on mount
    setPlaylist((prev) => [...prev].sort(() => Math.random() - 0.5));
  }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && playlist.length > 0) {
      audio.src = playlist[currentTrackIndex]?.src || "";
      audio.load();
    }
  }, [currentTrackIndex, playlist]);
  const playTrack = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.src !== playlist[index].src) {
      setCurrentTrackIndex(index);
    }

    audio.play();
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPartyMode) {
      playTrack(0);
    } else {
      audio.pause();
    }
  }, [isPartyMode]);
  const skills = [
    { name: "HTML", level: 95, years: "7+" },
    { name: "CSS", level: 95, years: "7+" },
    { name: "JavaScript", level: 95, years: "7+" },
    { name: "Node", level: 80, years: "3+" },
    { name: "React", level: 80, years: "3+" },
    { name: ".NET", level: 70, years: "2+" },
    { name: "SQL", level: 70, years: "2+" },
  ];

  const experiences = [
    {
      title: "Lead Developer",
      company: "WellSaid.ai",
      period: "2024 - Present",
      description: "Creating aging tech applications for Alexa and web",
      achievements: [
        "Building refreshing tech applications",
        "Collaborated with all teams to ensure project success",
        "Coordinated with cross-functional teams to deliver high-quality products",
      ],
    },
    {
      title: "Content Developer",
      company: "Dealer Inspire",
      period: "2018 - 2024",
      description:
        "Creating engaging web content and developing responsive applications",
      achievements: [
        "Built responsive web applications",
        "Collaborated with cross-functional teams",
        "Maintained high code quality standards",
      ],
    },
    {
      title: "Property Management Assistant",
      company: "Goldridge Capital Management",
      period: "2015 - 2016",
      description: "Technical maintenance and troubleshooting",
      achievements: [
        "Collaborated with property management team",
        "Went on Property Inspections",
        "Created and maintained reports and documentation",
      ],
    },
    {
      title: "Operations Manager",
      company: "Ship Shape Plus/Crossroads Detailing",
      period: "2009 - 2015",
      description: "Managed daily operations and team coordination",
      achievements: [
        "Led team of 5+ employees",
        "Improved operational efficiency",
        "Maintained customer satisfaction",
      ],
    },
  ];

  const education = [
    {
      degree: "Bachelor's in Business Administration",
      school: "Globe University",
      year: "2012",
    },
    {
      degree: "Associates in IT: Software Development",
      school: "CVTC",
      year: "2017",
    },
    {
      degree: "Nanodegree: Android Development",
      school: "Udacity",
      year: "2018",
    },
    {
      degree: "Associates in Business Management",
      school: "CVTC",
      year: "2010",
    },
  ];

  const hobbies = [
    { icon: Coffee, name: "Coffee Enthusiast" },
    { icon: Gamepad2, name: "Gaming" },
    { icon: Music, name: "Music Lover" },
    { icon: Code, name: "Side Projects" },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isPartyMode
          ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
          : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      }`}
    >
      <audio ref={audioRef} controls className="hidden" />
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white rounded-full opacity-20 animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-white">
              WR
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            William Rongholt
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Content Developer • Problem Solver • Tech Enthusiast
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a
              href="mailto:wrongholt@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
                <Mail size={16} />
                <span>wrongholt@gmail.com</span>
              </div>
            </a>
            <div className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
              <MapPin size={16} />
              <span>Available Remote</span>
            </div>
            <a
              href="https://www.linkedin.com/in/williamrongholt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </div>
            </a>
            <a
              href="https://github.com/wrongholt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">
                <Github size={16} />
                <span>GitHub</span>
              </div>
            </a>
          </div>

          {/* Party Mode Toggle */}
          <button
            onClick={() => setIsPartyMode(!isPartyMode)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              isPartyMode
                ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-white animate-pulse"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isPartyMode ? "🎉 Party Mode ON!" : "🎨 Enable Party Mode"}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-2 flex gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto">
          {activeSection === "about" && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 transform transition-all duration-500">
              <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Hey there! I&apos;m Will, a passionate Developer with over 6
                    years of experience crafting digital experiences. I love
                    solving problems, building responsive web applications, and
                    bringing creative ideas to life through code.
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    My journey spans from military service to technical
                    training, always with a focus on seeing projects through to
                    completion. I&apos;m known for my positive attitude, strong
                    work ethic, and excellent communication skills.
                  </p>
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border-l-4 border-purple-400">
                    <p className="text-purple-200 italic">
                      &quot;Will does well at problem solving, communicates well
                      with others, and exhibits a strong work ethic.&quot;
                      <span className="text-purple-400">
                        - Previous Team Leader
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    When I&apos;m not coding...
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {hobbies.map((hobby, index) => {
                      const Icon = hobby.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-gray-300 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Icon size={20} className="text-purple-400" />
                          <span>{hobby.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "experience" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Experience</h2>
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 transform transition-all duration-500 hover:scale-105"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {exp.title}
                      </h3>
                      <p className="text-purple-400 font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-gray-400 text-sm bg-slate-700 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.achievements.map((achievement, i) => (
                      <span
                        key={i}
                        className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "skills" && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Skills & Technologies
              </h2>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">
                        {skill.name}
                      </span>
                      <span className="text-purple-400 text-sm">
                        {skill.years} years
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {skill.level}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Other Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Windows",
                    "Linux",
                    "MacOS",
                    "AWS",
                    "Azure",
                    "DigitalOcean",
                    "Microsoft Office",
                    "Crystal Reports",
                    "Quickbooks",
                  ].map((tech, index) => (
                    <span
                      key={index}
                      className="bg-slate-700 text-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-purple-600 hover:text-white transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "education" && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Education</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{edu.degree}</h3>
                      <p className="text-purple-400">{edu.school}</p>
                    </div>
                    <span className="text-gray-400 text-sm bg-slate-600 px-3 py-1 rounded-full">
                      {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-700">
          <p className="text-gray-400 mb-4">
            Ready to build something amazing together?
          </p>
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={() =>
              (window.location.href = "mailto:wrongholt@gmail.com")
            }
          >
            Let&apos;s Connect!
          </button>
        </div>
      </div>
    </div>
  );
}
