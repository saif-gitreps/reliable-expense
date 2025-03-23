import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartDataType = {
   labels: string[];
   datasets: {
      label: string;
      data: unknown[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      borderRadius: number;
      spacing: number;
      cutout: number;
   }[];
};

export default function useHomePageChartData(cutout?: number) {
   const { data } = useQuery(GET_TRANSACTION_STATISTICS);

   const [chartData, setChartData] = useState<ChartDataType>({
      labels: [],
      datasets: [
         {
            label: "$",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            borderRadius: 30,
            spacing: 10,
            cutout: cutout ?? 130, // Default to 130 for Doughnut, but Pie will override
         },
      ],
   });

   useEffect(() => {
      if (data?.categoryStatistics) {
         const categories = data.categoryStatistics.map(
            (stat: { category: string }) => stat.category
         );
         const totalAmounts = data.categoryStatistics.map(
            (stat: { totalAmount: number }) => stat.totalAmount
         );

         const backgroundColors: string[] = [];
         const borderColors: string[] = [];

         categories.forEach((category: string) => {
            if (category === "saving") {
               backgroundColors.push("rgba(3, 86, 3, 0.8)");
               borderColors.push("rgba(256, 256, 256)");
            } else if (category === "expense") {
               backgroundColors.push("rgba(129, 20, 20, 0.8)");
               borderColors.push("rgba(256, 256, 256)");
            } else if (category === "investment") {
               backgroundColors.push("rgba(255, 191, 0, 0.8)");
               borderColors.push("rgba(256, 256, 256)");
            }
         });

         setChartData((prev) => ({
            labels: categories,
            datasets: [
               {
                  ...prev.datasets[0],
                  data: totalAmounts,
                  backgroundColor: backgroundColors,
                  borderColor: borderColors,
                  cutout: cutout ?? prev.datasets[0].cutout, // Adjust cutout dynamically
               },
            ],
         }));
      }
   }, [data, cutout]);

   return {
      chartData,
   };
}
