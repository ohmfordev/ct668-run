import { ShoppingCart } from "lucide-react";

export function Component2() {
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
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="border px-4 py-2">
              <img src="/images/placeholder.png" className="w-12 h-12 object-cover" />
            </td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2 flex items-center">
              <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l">-</button>
              <span className="px-4" />
              <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r">+</button>
            </td>
            <td className="border px-4 py-2" />
          </tr>
          <tr className="bg-gray-100 font-bold">
            <td colSpan={4} className="border px-4 py-2 text-right">
              Total
            </td>
            <td className="border px-4 py-2" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
