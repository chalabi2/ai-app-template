import { useState, useEffect, useRef } from "react";
import { AuthButtons } from "./AuthButtons";
import * as THREE from "three";

const model = "llama3-instruct-8b";
const terminalLines = [`Loading Model: ${model}`, `Initializing theme`];

export function LandingPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        setLines((prev) => [...prev, terminalLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setShowLogin(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen text-win-cyan p-4 overflow-hidden">
      <div className="z-10 justify-start">
        <pre className="text-pink-400 text-2xl mb-8 whitespace-pre overflow-x-auto max-w-full">
          BEST FWEND
        </pre>
        <div className="mb-8 h-64 overflow-hidden">
          <div className="">
            {lines.map((line, index) => (
              <p key={index} className="text-win-purple">
                {line}
              </p>
            ))}
          </div>
        </div>
        {showLogin && (
          <div className="text-center">
            <p className="text-win-pink mb-4">
              System Ready. Authenticate to proceed.
            </p>
            <AuthButtons />
          </div>
        )}
      </div>
    </div>
  );
}
