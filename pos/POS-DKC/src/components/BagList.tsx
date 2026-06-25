import { useState } from "react";

interface BagOrderInputProps {
  onBagQuantitySubmit: (quantity: number) => void;
}

const BagOrderInput = ({ onBagQuantitySubmit }: BagOrderInputProps) => {
  const [bags, setBags] = useState<number | "">("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && bags && typeof bags === "number" && bags > 0) {
      onBagQuantitySubmit(bags);
      setBags(""); 
    }
  };

  return (
    <div className="border border-(--main)/50 rounded-xl p-4 w-full mx-auto">
      <label className="block text-gray-700 font-medium mb-2">
        How many bags would you like to order?
      </label>
      <input
        type="number"
        value={bags}
        onChange={(e) => setBags(Number(e.target.value))}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border border-(--primary) rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
        placeholder="Enter number of bags and press Enter"
      />
    </div>
  );
};

export default BagOrderInput;