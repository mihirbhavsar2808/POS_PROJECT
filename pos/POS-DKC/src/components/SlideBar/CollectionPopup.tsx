import type React from "react";
import { IoMdClose } from "react-icons/io";
import TableComp from "../TableComp/TableComp";

type FeeProps = {
  closeCollection: () => void;
};

const columns = [
  { Header: "Image", accessor: "image" },
  { Header: "Name", accessor: "name" },
  { Header: "No. of Product", accessor: "product" },
];

const data = [
  {
    image: "/girl_img.png",
    name: "Winter collection",
    product: 8,
  },
  {
    image: "/kid_img.png",
    name: "Summer Collection",
    product: 205,
  },
  {
    image: "/girl_img.png",
    name: "Top collection",
    product: 537,
  },
  {
    image: "/kid_img.png",
    name: "T-shirt collection",
    product: 95,
  },
  {
    image: "/kid_img.png",
    name: "Abc",
    product: 28,
  },
  {
    image: "/kid_img.png",
    name: "Abc",
    product: 28,
  },
];

const CollectionPopup: React.FC<FeeProps> = ({ closeCollection }) => {
  return ( 
    <div className="fixed bottom-0 left-0 right-0 mx-auto bg-white rounded-t-2xl h-[75%] max-h-[80vh] w-full sm:w-[90%] md:w-[80%] px-4 sm:px-6 pt-5 border border-b-0 shadow-lg z-40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 font-semibold text-lg">Link </h2>
        <button
          className="text-2xl text-gray-500 hover:text-gray-700"
          onClick={closeCollection}
        >
          <IoMdClose />
        </button>
      </div>

      <div className="">
        <TableComp data={data} columns={columns}/>
      </div>
    </div>
  );
};

export default CollectionPopup;
