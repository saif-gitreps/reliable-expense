import React from "react";

function Background({ children }: { children: React.ReactNode }) {
   return <div className="w-full bg-gray-300 text-gray-700">{children}</div>;
}
export default Background;
