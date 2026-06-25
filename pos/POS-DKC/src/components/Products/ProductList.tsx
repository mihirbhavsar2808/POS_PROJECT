import useFetchProducts from "../../hooks/useFetchProducts";
import ProductCard from "./ProductCard";
import Cart from "../Cart";
import type { CartItem } from "../types";
import { useCart } from "../../auth/cartContext";

const ProductList = () => {
  const { addToCart } = useCart();
  const { products } = useFetchProducts();
  const selectedCategory = "All";
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: CartItem) => {
    addToCart(product);
    console.log("Add to cart:", product.title);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 scrollbar-hide rounded-md pb-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => handleAddToCart(product)}
        />
      ))}
      <Cart />
    </div>
  );
};

export default ProductList;

