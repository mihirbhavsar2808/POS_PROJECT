import Checkout from "./Checkout";
import SearchBar from "./SearchBar";
import Header from "./Header";
import { useEffect, useState, type ReactNode } from "react";
import ActionBar from "./SlideBar/ActionBar";
import ActionCards from "./ActionCards";
import CustomerSvg from "./SvgCommon/CustomerSvg";
import DiscountSvg from "./SvgCommon/DiscountSvg";
// import RequestSvg from "./SvgCommon/RequestSvg";
import DefaultSvg from "./SvgCommon/DefaultSvg";
import InventorySvg from "./SvgCommon/InventorySvg";
import AddAction from "./SvgCommon/AddAction";
import WinterSvg from "./SvgCommon/WinterSvg";
import HoldOrderSvg from "./SvgCommon/HoldOrderSvg";
import HoldOrders from "./HoldOrders";

interface ActionCardType {
  label: string;
  link: string;
  icon?: ReactNode;
}

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);

  useEffect(() => {
    const holdOrdersRaw = localStorage.getItem("holdOrders");
    const holdOrders: { id: string }[] = holdOrdersRaw
      ? JSON.parse(holdOrdersRaw)
      : [];
    const orderIds = holdOrders.map((order) => order.id);
    setOrderNumbers(orderIds);
  }, []);

  const [actionCards, setActionCards] = useState<ActionCardType[]>([
    { label: "Inventory", link: "/inventory", icon: <InventorySvg /> },
    { label: "Customer", link: "/customer", icon: <CustomerSvg /> },
    { label: "Discount", link: "/discount", icon: <DiscountSvg /> },
    // { label: "Request", link: "./request", icon: <RequestSvg /> },
    { label: "Hold-Order", link: "/hold-order", icon: <HoldOrderSvg /> },
  ]);

  const iconMap: Record<string, ReactNode> = {
    inventory: <InventorySvg />,
    customer: <CustomerSvg />,
    discount: <DiscountSvg />,
    // request: <RequestSvg />,
    // HoldOrder: <HoldOrderSvg/>,
    "hold-order": <HoldOrderSvg />,
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query.toLowerCase());
  };

  const handleAddCard = (title: string) => {
    const lower = title.toLowerCase();

    const exists = actionCards.some(
      (card) => card.label.toLowerCase() === lower
    );
    if (exists) {
      setShowModal(false);
      return;
    }

    let icon = iconMap[lower] || <DefaultSvg />;
    if (lower === "winter collection") {
      icon = <WinterSvg />;
    }

    setActionCards((prev) => [
      ...prev,
      {
        label: title,
        link: `/${lower}`,
        icon,
      },
    ]);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const filteredCards = actionCards.filter((card) =>
    card.label.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-[70%] flex flex-col justify-between bg-white rounded-md">
          <div className="relative flex-1 overflow-y-auto p-4 scrollbar-hide">
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2 gap-4">
              {filteredCards.map((card, index) => (
                <ActionCards
                  key={index}
                  icon={card.icon}
                  label={card.label}
                  link={card.link}
                />
              ))}
              {/* <div
                className="bg-white border-2 border-gray-400 p-5 gap-4 text-xl rounded-lg shadow-md flex flex-col items-start cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <div className="text-5xl mb-2">
                  <AddAction />
                </div>
                <span>Add quick action</span>
              </div> */}
            </div>
          </div>

        </div>

        <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
          <Checkout />
        </div>
        {showModal && (
          <div className="absolute inset-0 z-50 bg-black/30  flex items-end justify-center">
            <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] bg-white rounded-t-2xl p-6 shadow-lg animate-slideUp">
              <ActionBar handleClose={handleClose} onSave={handleAddCard} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
