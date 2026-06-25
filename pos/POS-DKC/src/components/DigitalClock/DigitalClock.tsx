import { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    console.log(typeof time.toLocaleTimeString());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  const getFormattedDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate(); 
    const year = date.getFullYear(); 

    return `${dayOfWeek} | ${month} ${day} , ${year}`;
  };

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold font-serif">
          {getFormattedTime(time)}
        </h2>
        <p>{getFormattedDate(time)}</p>
      </div>
    </div>
  );
};

export default DigitalClock;
