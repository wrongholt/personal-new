"use client";
import { url } from "inspector";
import { platform } from "os";
import { useState } from "react";

const AlexaSkillsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const skills = [
    {
      id: "fabella-story",
      url: "https://player.fabella.io/8212087a-9e4b-4334-8bf8-67146cebf37f",

      title: "Pet Tales",
      description:
        "Interactive storytelling experience with branching narratives. This uses Fabella's platform to create engaging stories.",
      category: "Entertainment",
      platform: "Fabella",
      features: ["Interactive stories", "Multiple paths", "Voice narration"],
    },
    {
      id: "cards-of-wonder",
      url: "https://alexa-skills.amazon.com/apis/custom/skills/amzn1.ask.skill.8c41b116-0a0c-42a0-92c2-141dafa32e51/launch",
      title: "Cards of Wonder",
      description: "A magical card-based game experience for Alexa.",
      category: "Games",
      platform: "Alexa",
      features: ["Card gameplay", "Strategy elements", "Voice commands"],
    },
    {
      id: "powers",
      url: "https://alexa-skills.amazon.com/apis/custom/skills/amzn1.ask.skill.d0823ef7-f666-43c3-b673-9ca8a461e08e/launch",

      title: "Powers",
      description:
        "Discover and explore supernatural abilities in this unique skill.",
      category: "Games",
      platform: "Alexa",
      features: [
        "Supernatural theme",
        "Power discovery",
        "Interactive elements",
      ],
    },
    {
      id: "unofficial-marvel-facts",
      url: "https://alexa-skills.amazon.com/apis/custom/skills/amzn1.ask.skill.1d68c9c5-f1d6-4dbf-a19b-3d20dabc760e/launch",

      title: "Unofficial Marvel Facts",
      description: "Learn fascinating facts about the Marvel universe.",
      category: "Education",
      platform: "Alexa",
      features: ["Marvel trivia", "Educational content", "Daily facts"],
    },
    {
      id: "unofficial-marvel-trivia",
      url: "https://alexa-skills.amazon.com/apis/custom/skills/amzn1.ask.skill.0aca28e6-8ba7-4b37-942d-44b1b1b737b7/launch",

      title: "Unofficial Marvel Trivia",
      description:
        "Test your knowledge of the Marvel universe with trivia questions.",
      category: "Education",
      platform: "Alexa",
      features: ["Trivia questions", "Score tracking", "Marvel knowledge"],
    },
    {
      id: "rainbow-words",
      url: "https://alexa-skills.amazon.com/apis/custom/skills/amzn1.ask.skill.b59d78aa-2096-415e-9cb9-c03bf3d5e504/launch",

      title: "Rainbow Words",
      description: "A colorful word game that challenges your vocabulary.",
      category: "Education",
      platform: "Alexa",
      features: ["Word games", "Vocabulary building", "Colorful theme"],
    },
    {
      id: "character-name-generator",
      url: "https://alexa-skills.amazon.com/apis/custom/skills/amzn1.ask.skill.9f09bebe-17b2-46c2-aedf-126e7b7a8648/launch",

      title: "Character Name Generator",
      description:
        "Generate unique character names for your stories and games.",
      category: "Utility",
      platform: "Alexa",
      features: [
        "Name generation",
        "Creative writing aid",
        "Multiple categories",
      ],
    },
  ];

  const categories = ["All", ...new Set(skills.map((skill) => skill.category))];
  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Games: "bg-blue-100 text-blue-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Education: "bg-green-100 text-green-800",
      Utility: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full mx-auto px-4 py-8 transition-colors duration-300 bg-gray-900 text-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 p-4 mb-4">
          Alexa Skills
        </h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Discover my collection of voice-powered applications for Amazon Alexa
          or Fabella. From interactive games to educational tools, these skills
          bring entertainment and utility to your smart speaker.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="w-3/4 m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                    skill.category
                  )}`}
                >
                  {skill.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {skill.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {skill.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Features:
                </h4>
                <ul className="space-y-1">
                  {skill.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                Try on {skill.platform}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Use These Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Enable the Skill
              </h3>
              <p className="text-gray-600 text-sm">
                Search for the skill in your Alexa app and enable it
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Launch with Voice
              </h3>
              <p className="text-gray-600 text-sm">
                Say &quot;Alexa, open [skill name]&quot; to start
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Enjoy the Experience
              </h3>
              <p className="text-gray-600 text-sm">
                Follow the voice prompts and have fun!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlexaSkillsPage;
