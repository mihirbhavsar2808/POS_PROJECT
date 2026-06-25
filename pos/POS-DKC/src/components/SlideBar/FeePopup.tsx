import type React from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

type FeeProps = {
  closeFeePopup: () => void;
  onSave: (title: string) => void;
};

const FeePopup: React.FC<FeeProps> = ({ closeFeePopup, onSave }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // add price state

  const handleClear = () => {
    setTitle("");
    setPrice("");
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto bg-white rounded-t-2xl h-[75%] max-h-[80vh] w-full sm:w-[90%] md:w-[80%] px-4 sm:px-6 pt-5 border border-b-0 shadow-lg z-40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 font-semibold text-lg">Fee </h2>
        <button
          className="text-2xl text-gray-500 hover:text-gray-700"
          onClick={closeFeePopup}
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
            placeholder="Bag fee"
            className="relative w-full h-10 mt-1 pt-4 text-gray-800 outline-0"
          />
        </div>
        <div className="border-[0.5px] border-[#EBDFD1] px-2 py-1 flex flex-col gap-2 rounded-md">
          <label className="absolute text-sm text-gray-500 ">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="$ 2.00"
            className="relative w-full h-10 mt-1 pt-4 text-gray-800 outline-0"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleClear}
          className="text-gray-600 px-4 py-1 rounded-md bg-gray-100"
        >
          CLEAR
        </button>
        <button
          onClick={() => onSave(title)}
          className="bg-(--buttonbg) flex items-center gap-2 text-black font-semibold px-2 py-1 rounded-md"
        >
          SAVE
          <Link to="#">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 12 13" fill="none">
									<path d="M4.65109 1.55133C4.40418 1.30441 4.00175 1.31135 3.76349 1.56663C3.53766 1.80859 3.5429 2.18561 3.77535 2.42121L7.10639 5.79726C7.49061 6.18667 7.49061 6.81254 7.10639 7.20195L3.77535 10.578C3.5429 10.8136 3.53766 11.1906 3.76349 11.4326C4.00175 11.6879 4.40417 11.6948 4.65109 11.4479L8.89227 7.20672C9.28279 6.81619 9.28279 6.18303 8.89227 5.7925L4.65109 1.55133Z" fill="#333333" />
								</svg>
							</Link>
        </button>
      </div>
    </div>
  );
};

export default FeePopup;