import { Link } from "react-router-dom";

function _404() {
   return (
      <div>
         <div className=" text-white">
            <div className="flex h-screen">
               <div className="m-auto text-center">
                  <p className="text-sm md:text-base text-white p-2 mb-4">
                     404 page not found
                  </p>
                  <Link to={"/"} className="text-white underline">
                     Go back to home
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}

export default _404;
