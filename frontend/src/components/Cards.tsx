import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";

function Cards() {
   return (
      <div className="w-full px-10 min-h-[40vh]">
         <p className="text-5xl font-bold text-center my-10">History</p>
         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
            <Card cardType={"saving"} />
            <Card cardType={"expense"} />
            <Card cardType={"investment"} />
            <Card cardType={"investment"} />
            <Card cardType={"saving"} />
            <Card cardType={"expense"} />
         </div>
      </div>
   );
}

const categoryColorMap = {
   saving: "from-green-700 to-green-400",
   expense: "from-pink-800 to-pink-600",
   investment: "from-blue-700 to-blue-400",
};

type CardType = keyof typeof categoryColorMap;

function Card({ cardType }: { cardType: CardType }) {
   const cardClass = categoryColorMap[cardType];

   return (
      <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
         <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between">
               <h2 className="text-lg font-bold text-white">Saving</h2>
               <div className="flex items-center gap-2">
                  <FaTrash className={"cursor-pointer"} />
                  <Link to={`/transaction/123`}>
                     <HiPencilAlt className="cursor-pointer" size={20} />
                  </Link>
               </div>
            </div>
            <p className="text-white flex items-center gap-1">
               <BsCardText />
               Description: Salary
            </p>
            <p className="text-white flex items-center gap-1">
               <MdOutlinePayments />
               Payment Type: Cash
            </p>
            <p className="text-white flex items-center gap-1">
               <FaSackDollar />
               Amount: $150
            </p>
            <p className="text-white flex items-center gap-1">
               <FaLocationDot />
               Location: New York
            </p>
            <div className="flex justify-between items-center">
               <p className="text-xs text-black font-bold">21 Sep, 2001</p>
               <img
                  src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
                  className="h-8 w-8 border rounded-full"
                  alt=""
               />
            </div>
         </div>
      </div>
   );
}

export default Cards;
