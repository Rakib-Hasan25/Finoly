import React from "react";

function BaseBackground() {
 return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#052F2F] via-[#0A2647] to-[#052F2F]">
      {/* Overlay animated gradient */}
      <div className="absolute inset-0 z-0 bg-animated-gradient-deep-light opacity-70"></div>

      {/* Floating orbs */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute top-[10%] left-[5%] w-6 h-6 rounded-full bg-blue-500 blur-xl animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-8 h-8 rounded-full bg-cyan-400 blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] right-[5%] w-4 h-4 rounded-full bg-emerald-400 blur-lg animate-float"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-[5%] left-[25%] w-10 h-10 rounded-full bg-teal-400 blur-2xl animate-float"
          style={{ animationDelay: "6s" }}
        />
      </div>
    </div>
  );
}

export default BaseBackground;
