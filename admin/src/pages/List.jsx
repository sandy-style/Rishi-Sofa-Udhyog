import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  // Fetch Products
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/admin/listproducts");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Remove Product
  const removeProducts = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/admin/removeproduct",
        { id },
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {list.map((product) => (
          <div
            key={product._id}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image */}
            <div className="relative h-72 overflow-hidden bg-gray-100">
              <img
                src={product.image[0]}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {product.bestSeller && (
                <span className="absolute left-4 top-4 rounded-full bg-black px-4 py-1 text-xs font-semibold text-white">
                  BEST SELLER
                </span>
              )}

              {!product.stock && (
                <span className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-1 text-xs font-semibold text-white">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 capitalize">
                    {product.material}
                  </p>
                </div>

                <p className="text-2xl font-bold text-black">
                  Rs. {product.price}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-100 p-3">
                  <p className="text-gray-500">Seating</p>
                  <p className="font-semibold">{product.seating} Seater</p>
                </div>

                <div className="rounded-xl bg-gray-100 p-3">
                  <p className="text-gray-500">Material</p>
                  <p className="font-semibold capitalize">{product.material}</p>
                </div>
              </div>

              {/* Colors */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Available Colors
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.color.map((color, index) => (
                    <span
                      key={index}
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t pt-4">
                <button className="flex-1 rounded-xl bg-black py-3 text-white font-semibold transition hover:bg-gray-800">
                  Edit
                </button>

                <button
                  onClick={() => removeProducts(product._id)}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-white font-semibold transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
