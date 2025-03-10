type InputProps = {
   label: string;
   id: string;
   name: string;
   type?: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   value: string;
};

const Input = ({ label, id, name, type = "text", onChange, value }: InputProps) => {
   return (
      <div>
         <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
         </label>
         <input
            className="mt-1 p-2 w-full border rounded-md text-black focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
         />
      </div>
   );
};

export default Input;
