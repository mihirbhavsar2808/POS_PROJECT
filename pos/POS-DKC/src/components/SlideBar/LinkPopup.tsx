import type React from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

type LinkProps = {
  closeLinkPopup: () => void;
  onSave: (title: string) => void;
};

const LinkPopup: React.FC<LinkProps> = ({ onSave, closeLinkPopup }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // add price state
  
    const handleClear = () => {
      setTitle("");
      setPrice("");
    };
    
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto bg-white rounded-t-2xl h-[75%] max-h-[80vh] w-full sm:w-[90%] md:w-[80%] px-4 sm:px-6 pt-5 border border-b-0 shadow-lg z-40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 font-semibold text-lg">Link </h2>
        <button
          className="text-2xl text-gray-500 hover:text-gray-700"
          onClick={closeLinkPopup}
        >
          <IoMdClose />
        </button>
      </div>

      <div className="space-y-4 border-2 border-[#333333]/50 p-4 rounded-xl">
        <div className="border-[0.5px] border-[#EBDFD1] px-2 py-1 flex flex-col gap-2 rounded-md">
          <label className="absolute text-sm text-gray-500 ">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Google"
            className="relative w-full h-10 mt-1 pt-4 text-gray-800 outline-0"
          />
        </div>
        <div className="border-[0.5px] border-[#EBDFD1] px-2 py-1 flex flex-col gap-2 rounded-md">
          <label className="absolute text-sm text-gray-500 ">URL</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="www.google.com"
            className="relative w-full h-10 mt-1 pt-4 text-gray-800 outline-0"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button onClick={handleClear} className="px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-100">
          CLEAR
        </button>
        <button
          onClick={() => onSave(title)}
          className="px-4 py-2 text-sm bg-peach-100 text-gray-800 rounded-md hover:bg-peach-200"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default LinkPopup;
