export default function formatDate(dateString: string | number | Date): string {
   const date = new Date(Number(dateString)); // Convert to number

   if (isNaN(date.getTime())) {
      return String(dateString); // Ensure it's a string
   }

   const day = date.getDate().toString().padStart(2, "0");
   const month = (date.getMonth() + 1).toString().padStart(2, "0");
   const year = date.getFullYear();

   return `${day}-${month}-${year}`;
}
