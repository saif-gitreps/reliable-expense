import { Link } from "react-router-dom";

function _404() {
   return (
      <div className="flex flex-col items-center justify-center font-bold">
         <div className="text-sm md:text-base p-2 mb-4">404 page not found</div>
         <Link to={"/"} className="underline">
            Go back to home
         </Link>
      </div>
   );
}

export default _404;
