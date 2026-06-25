import { Link } from "react-router-dom";

const TitleBanner = () => {
  return (
    <div className=" py-3 bg-(--main) font-bold text-white w-full text-center text-2xl">
      <Link to="/">
      DKC
      </Link>
    </div>
  );
};

export default TitleBanner;
