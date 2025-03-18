export function formatDate(timestamp: string) {
   const date = new Date(timestamp);
   const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
   };
   return date.toLocaleDateString("en-US", options);
}
