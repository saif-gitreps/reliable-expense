import { Doughnut, Pie } from "react-chartjs-2";
import TransactionForm from "../components/TransactionForm";
import useHomePageChartData from "../hooks/useHomePageChartData";

function HomePage() {
   const { chartData } = useHomePageChartData(110);

   return (
      <>
         <div className="flex space-y-5 flex-col xs:flex-row gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
            <div className="flex flex-wrap w-full justify-center items-center gap-6">
               <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
                  <h1 className="text-center font-bold uppercase">
                     Current Financial Distribution
                  </h1>
                  <Pie data={chartData} />
               </div>

               <TransactionForm />
            </div>

            <div>
               <h1 className="text-center font-bold uppercase">
                  Recent few transactions
               </h1>
            </div>
         </div>
      </>
   );
}
export default HomePage;
