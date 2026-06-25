import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import Header from "./Header";

export interface Activities {
    name: string;
    phone: string;
    email: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zip: number;
}

const Activities = () => {
    const [loginTime, setLoginTime] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [collection, setCollection] = useState<any[]>([]);
    const [filteredCollection, setFilteredCollection] = useState<any[]>([]);

    const handleSearch = (query: string) => {
        const filtered = collection.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCollection(filtered);
    };

useEffect(() => {
    const loginTimestamp = localStorage.getItem("tokenLoginTime");
    const userData = localStorage.getItem("User");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser.name || "Unknown");
      } catch (error) {
        console.error("Error parsing User data from localStorage:", error);
      }
    }

    if (loginTimestamp) {
      const parsedTimestamp = parseInt(loginTimestamp);
      if (!isNaN(parsedTimestamp)) {
        const loginDate = new Date(parsedTimestamp);
        setLoginTime(loginDate.toLocaleString());
      }
    }
  }, []);
  
    useEffect(() => {
        const savedActivities = localStorage.getItem("activities");
        if (savedActivities) {
            const parsed = JSON.parse(savedActivities);
            setCollection(parsed);
            setFilteredCollection(parsed);
        }

        const loginTimestamp = localStorage.getItem("tokenLoginTime");
        if (loginTimestamp) {
            const parsedTimestamp = parseInt(loginTimestamp);
            if (!isNaN(parsedTimestamp)) {
                const loginDate = new Date(parsedTimestamp);
                setLoginTime(loginDate.toLocaleString());
            }
        }
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex flex-col gap-4 p-4 h-screen overflow-hidden">
                <SearchBar onSearch={handleSearch} />
                <div className="flex items-center gap-2">
                    <Link to="/" className="">
                        <IoIosArrowBack size={20} />
                    </Link>
                    <h1 className="text-xl capitalize font-bold">ACTIVITIES</h1>
                </div>
                <div className="flex flex-col gap-3 overflow-y-scroll scrollbar-hide rounded-xl">
                    <div className="flex justify-between p-2 bg-(--bgorder) rounded-xl">
                        <p>{user}</p>
                        <p>Login:{loginTime}</p>
                    </div>
                    {filteredCollection.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between p-2 bg-(--bgorder) rounded-2xl"
                        >
                            <div className="flex gap-3 items-center">
                                {item.thumbnail && (
                                    <img src={item.thumbnail} alt="product" className="w-14 h-14 rounded object-cover" />
                                )}
                                <div className="flex flex-col gap-2">
                                    <p>{item.name}</p>
                                    <p>{item.type == "inventory" ? <p>${item.price}</p> : <p className="w-35 py-2 text-center bg-(--secondary) rounded-xl">{item.quantity}</p>}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <p>{new Date(item.timestamp || Date.now()).toLocaleString()}</p>
                                <button
                                    className={`py-2 px-6 rounded-xl ${item.status === "Completed"
                                        ? "bg-(--completed)"
                                        : item.status === "Ongoing"
                                            ? "bg-(--ongoing)"
                                            : "bg-(--rejected)"}`}
                                >
                                    {item.status}
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Activities;
