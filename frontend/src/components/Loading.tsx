import { Loader } from "lucide-react";

function Loading() {
   return (
      <div className="flex items-center justify-center">
         <Loader size={50} className="stroke-black animate-spin" />
      </div>
   );
}

export default Loading;
