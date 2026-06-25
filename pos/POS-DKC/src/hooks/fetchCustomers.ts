import { useEffect, useState } from "react";

export interface customers {
  name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
}

const fetchCustomers = () => {
  const [customers, setCustomers] = useState<customers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchcust = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers");
        const data = await res.json();
        setCustomers(data);
        // console.log(data)
      } catch (error) {
        setError(error);
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchcust();
  }, []);
  return { customers , setCustomers, loading, error };
};

export default fetchCustomers;
