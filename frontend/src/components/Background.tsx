import React from "react";

function Background({ children }: { children: React.ReactNode }) {
   return (
      <div className="w-full bg-gray-300 text-gray-700 bg-grid-white/[0.2] bg-opacity-50 relative h-screen">
         <div className="absolute inset-0"></div>
         {children}
      </div>
   );
}
export default Background;
