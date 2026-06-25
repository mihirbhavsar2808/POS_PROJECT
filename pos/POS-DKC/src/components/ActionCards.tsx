import { Link } from "react-router-dom";

const ActionCards = ({ icon, label, link }: any ) => {
  return (
     <Link to={link || "#"} className="bg-[var(--primary)] p-5 gap-15 rounded-lg text-xl shadow-md flex flex-col items-start">
    <div className="text-5xl mb-2">{icon}</div>
    <span className="break-words w-full">{label}</span>
  </Link>
  );
};

export default ActionCards;
