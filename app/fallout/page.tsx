"use client";
import React from "react";
export default function Fallout() {
  return (
    <div className="h-screen w-screen">
      <div id="fallout" className="h-full w-full relative z-10">
        <iframe
          src="https://wrongholt.github.io/fallout/index.html"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  );
}
