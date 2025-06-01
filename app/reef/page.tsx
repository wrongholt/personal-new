/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import Script from "next/script";
declare global {
  interface Window {
    createUnityInstance?: (
      canvas: HTMLCanvasElement,
      config: any
    ) => Promise<any>;
    UnityLoader?: {
      instantiate: (canvasId: string, configPath: string, options?: any) => any;
    };
    UnityProgress?: (gameInstance: any, progress: number) => void;
    gameInstance?: {
      SetFullscreen: (value: number) => void;
      // Add other methods/properties if needed
    };
  }
}

const Reef = () => {
  useEffect(() => {
    // Define UnityProgress function globally
    if (typeof window !== "undefined") {
      window.UnityProgress = function (gameInstance, progress) {
        console.log("Unity loading:", Math.round(progress * 100) + "%");
      };
    }
  }, []);

  const handleScriptLoad = () => {
    if (typeof window !== "undefined" && window.UnityLoader) {
      // This mirrors your exact HTML implementation
      window.gameInstance = window.UnityLoader.instantiate(
        "gameContainer",
        "/Build/Website.json",
        {
          onProgress: window.UnityProgress,
        }
      );
    }
  };

  const toggleFullscreen = () => {
    if (typeof window !== "undefined" && window.gameInstance) {
      window.gameInstance.SetFullscreen(1);
    }
  };

  return (
    <>
      <Script src="/Build/UnityLoader.js" onLoad={handleScriptLoad} />
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="webgl-content">
          <div id="gameContainer" style={{ width: "960px", height: "100%" }} />
          <div className="footer">
            <div className="webgl-logo"></div>
            <div className="fullscreen" onClick={toggleFullscreen}></div>
            <div className="title text-white">CapstoneMaze</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Reef;
