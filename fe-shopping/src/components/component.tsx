import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";

interface CartSectionProps {
  updateCartCount: () => void;
}

interface Item {
  id: number;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  total_price_per_product: number;
  thumbnail: string;
}

export function Component({ updateCartCount }: CartSectionProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [overallTotalPrice, setOverallTotalPrice] = useState<number>(0);
  const userIdLocal = Number(localStorage.getItem("20b6c672f3f1")); // แปลงเป็น number

  const fetchCartData = () => {
    axios
      .get(`http://localhost:4000/cart/${userIdLocal}`)
      .then((response) => {


        const sortedItems = (response.data.items || []).sort(
          (a: Item, b: Item) => a.product_id - b.product_id
        );
        setItems(sortedItems);
        setOverallTotalPrice(response.data.overallTotalPrice || 0);
      })
      .catch((error) => console.error("Error fetching cart data:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("95c0c5912b84");

    if (!token) {
      window.location.href = "/login"; // Redirect ไปหน้า Home หลังจากกดปุ่ม OK
    }
    if (!userIdLocal) {
      window.location.href = "/login"; // Redirect ไปหน้า Home หลังจากกดปุ่ม OK
    }

    fetchCartData();
  }, []);

  const updateQuantity = (productId: number, quantityChange: number) => {
    axios
      .post("http://localhost:4000/cart", {
        userId: userIdLocal,
        productId,
        quantity: quantityChange,
      })
      .then(() => {
        fetchCartData(); // ดึงข้อมูลใหม่หลังจากอัปเดตสำเร็จ
        updateCartCount();
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };

  const deleteItem = (productId: number) => {
    axios
      .delete("http://localhost:4000/cart", {
        data: {
          userId: userIdLocal,
          productId,
        },
      })
      .then(() => {
        fetchCartData(); // ดึงข้อมูลใหม่หลังจากลบสำเร็จ
        updateCartCount();
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="flex items-center text-2xl font-bold mb-4 text-gray-700">
        <ShoppingCart size={24} className="mr-2" />
        Shopping Cart
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Price (THB)</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total (THB)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-12 object-cover"
                />
              </td>
              <td className="border px-4 py-2">{item.title}</td>
              <td className="border px-4 py-2">
                ${Number(item.price).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => updateQuantity(item.product_id, -1)}
                  className="px-2 py-1 bg-gray-300 rounded-l"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product_id, 1)}
                  className="px-2 py-1 bg-gray-300 rounded-r"
                >
                  +
                </button>
              </td>
              <td className="border px-4 py-2">
                ${Number(item.total_price_per_product).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteItem(item.product_id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td colSpan={4} className="border px-4 py-2 text-right">
              Total
            </td>
            <td className="border px-4 py-2">{overallTotalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
