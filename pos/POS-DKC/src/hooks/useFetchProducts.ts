import { useEffect, useState } from "react";

interface Product {
  _id: string;
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  quantity: number;
}

const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
        setAllProducts(data);
        // console.log(data);
      } catch (error) {
        setError(error);
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // useEffect(() => {
  //   fetch("https://dummyjson.com/products")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const productsWithQuantity = data.products.map((product: any) => ({
  //         ...product,
  //         quantity: 1,
  //       }));
  //       setProducts(productsWithQuantity);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching products:", err);
  //       setError(err);
  //       setLoading(false);
  //     });
  // }, []);

  return { products, allProducts , setProducts, loading, error };
};

export default useFetchProducts;
