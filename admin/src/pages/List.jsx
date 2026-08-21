import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { MdCloudUpload } from "react-icons/md";
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [id, setId] = useState("");
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
  const [doEdit, setDoEdit] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState("");
  const [seating, setseating] = useState("");
  const [bestSeller, setBestSeller] = useState(null);
  const [onStock, setOnStock] = useState(null);

  // Edit data manipulation
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const handleEdit = async (id, product) => {
    console.log(product);
    setImage1(product.image[0]);
    setImage2(product.image[1]);
    setImage3(product.image[2]);
    setImage4(product.image[3]);
    setName(product.name);
    setDescription(product.description);
    setMaterial(product.material);
    setPrice(product.price);
    setseating(product.seating);
    setBestSeller(product.bestSeller);
    setOnStock(product.stock);
    setId(id);
    setDoEdit(!doEdit);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("material", material);
      formData.append("bestSeller", bestSeller);
      formData.append("stock", onStock);
      formData.append("seating", seating);
      if (image1 instanceof File) {
        formData.append("image1", image1);
      }

      if (image2 instanceof File) {
        formData.append("image2", image2);
      }

      if (image3 instanceof File) {
        formData.append("image3", image3);
      }

      if (image4 instanceof File) {
        formData.append("image4", image4);
      }

      const response = await axios.post(
        backendUrl + "/api/admin/updateproduct",
        formData,
        {
          headers: { token },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setDoEdit(false);
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
                <button
                  onClick={() => handleEdit(product._id, product)}
                  className="flex-1 rounded-xl bg-black py-3 text-white font-semibold transition hover:bg-gray-800"
                >
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
      {doEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
          <div
            className="
      relative ml-[75px]
      w-full max-w-3xl
      max-h-[90vh]
      overflow-y-auto
      rounded-2xl
      border border-gray-200
      bg-white
      font-sans
      shadow-2xl
    "
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-7 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Product Management
                  </p>

                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Update Product
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Modify the information, images and availability of this
                    sofa.
                  </p>
                </div>

                <button
                  type="button"
                  className="
            flex h-9 w-9 items-center justify-center
            rounded-full text-gray-400
            transition hover:bg-gray-100 hover:text-gray-700
          "
                  onClick={() => setDoEdit(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={submitHandler} className="space-y-7 px-7 py-6">
              {/* ================= IMAGES ================= */}
              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Product Images
                </h3>

                <p className="mb-4 text-xs text-gray-400">
                  Upload up to four images of the sofa.
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {/* Image 1 */}
                  <label
                    htmlFor="image1"
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100 transition h-52 flex flex-col items-center justify-center"
                  >
                    {image1 ? (
                      <img
                        src={
                          typeof image1 === "string"
                            ? image1
                            : URL.createObjectURL(image1)
                        }
                        alt=""
                        className="m-0.5 w-45"
                      />
                    ) : (
                      <div>
                        <MdCloudUpload size={45} className="text-gray-500" />

                        <p className="mt-3 font-medium">Upload Image</p>

                        <span className="text-xs text-gray-500">PNG / JPG</span>
                      </div>
                    )}

                    <input
                      hidden
                      type="file"
                      onChange={(e) => setImage1(e.target.files[0])}
                      id="image1"
                    />
                  </label>
                  <label
                    htmlFor="image2"
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100 transition h-52 flex flex-col items-center justify-center"
                  >
                    {image2 ? (
                      <img
                        src={
                          typeof image2 === "string"
                            ? image2
                            : URL.createObjectURL(image2)
                        }
                        alt=""
                        className="m-0.5 w-45"
                      />
                    ) : (
                      <div>
                        <MdCloudUpload size={45} className="text-gray-500" />

                        <p className="mt-3 font-medium">Upload Image</p>

                        <span className="text-xs text-gray-500">PNG / JPG</span>
                      </div>
                    )}

                    <input
                      hidden
                      type="file"
                      onChange={(e) => setImage2(e.target.files[0])}
                      id="image2"
                    />
                  </label>
                  <label
                    htmlFor="image3"
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100 transition h-52 flex flex-col items-center justify-center"
                  >
                    {image3 ? (
                      <img
                        src={
                          typeof image3 === "string"
                            ? image3
                            : URL.createObjectURL(image3)
                        }
                        alt=""
                        className="m-0.5 w-45"
                      />
                    ) : (
                      <div>
                        <MdCloudUpload size={45} className="text-gray-500" />

                        <p className="mt-3 font-medium">Upload Image</p>

                        <span className="text-xs text-gray-500">PNG / JPG</span>
                      </div>
                    )}

                    <input
                      hidden
                      type="file"
                      onChange={(e) => setImage3(e.target.files[0])}
                      id="image3"
                    />
                  </label>{" "}
                  <label
                    htmlFor="image4"
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100 transition h-52 flex flex-col items-center justify-center"
                  >
                    {image4 ? (
                      <img
                        src={
                          typeof image4 === "string"
                            ? image4
                            : URL.createObjectURL(image4)
                        }
                        alt=""
                        className="m-0.5 w-45"
                      />
                    ) : (
                      <div>
                        <MdCloudUpload size={45} className="text-gray-500" />

                        <p className="mt-3 font-medium">Upload Image</p>

                        <span className="text-xs text-gray-500">PNG / JPG</span>
                      </div>
                    )}

                    <input
                      hidden
                      type="file"
                      onChange={(e) => setImage4(e.target.files[0])}
                      id="image4"
                    />
                  </label>
                </div>
              </div>

              {/* ================= BASIC INFORMATION ================= */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Product Name
                    </label>

                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="
                w-full rounded-lg border border-gray-300
                bg-gray-50 px-4 py-2.5
                text-sm text-gray-900
                outline-none transition
                focus:border-gray-500
                focus:bg-white
                focus:ring-2 focus:ring-gray-200
              "
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Product Description
                    </label>

                    <textarea
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      value={description}
                      className="
                w-full resize-none rounded-lg border border-gray-300
                bg-gray-50 px-4 py-2.5
                text-sm text-gray-900
                outline-none transition
                focus:border-gray-500
                focus:bg-white
                focus:ring-2 focus:ring-gray-200
              "
                    />
                  </div>
                </div>
              </div>

              {/* ================= PRODUCT DETAILS ================= */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Product Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Material */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Material
                    </label>

                    <select
                      onChange={(e) => e.target.value}
                      value={material}
                      className="
                w-full rounded-lg border border-gray-300
                bg-gray-50 px-4 py-2.5
                text-sm text-gray-700
                outline-none transition
                focus:border-gray-500
                focus:bg-white
                focus:ring-2 focus:ring-gray-200
              "
                    >
                      <option value="fabric">Fabric</option>
                      <option value="leather">Leather</option>
                      <option value="velvet">Velvet</option>
                      <option value="linen">Linen</option>
                    </select>
                  </div>

                  {/* Seating */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Seating Capacity
                    </label>

                    <select
                      value={seating}
                      onChange={(e) => setseating(e.target.value)}
                      className="
      w-full rounded-lg border border-gray-300
      bg-gray-50 px-4 py-2.5
      text-sm text-gray-900
      outline-none transition
      focus:border-gray-500
      focus:bg-white
      focus:ring-2 focus:ring-gray-200
    "
                    >
                      <option value="">Select seating</option>
                      <option value="1 Seater">1 Seater</option>
                      <option value="2 Seater">2 Seater</option>
                      <option value="3 Seater">3 Seater</option>
                      <option value="4 Seater">4 Seater</option>
                      <option value="5 Seater">5 Seater</option>
                      <option value="L Shape">L Shape</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        Rs.
                      </span>

                      <input
                        onChange={(e) => e.target.value}
                        type="number"
                        value={price}
                        className="
                  w-full rounded-lg border border-gray-300
                  bg-gray-50 py-2.5 pl-11 pr-4
                  text-sm text-gray-900
                  outline-none transition
                  focus:border-gray-500
                  focus:bg-white
                  focus:ring-2 focus:ring-gray-200
                "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= STATUS ================= */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Product Status
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    className="
              flex cursor-pointer items-center gap-3
              rounded-lg border border-gray-200
              bg-gray-50 px-4 py-3
              transition hover:border-gray-400 hover:bg-white
            "
                  >
                    <input
                      type="checkbox"
                      onChange={() => setBestSeller(!bestSeller)}
                      checked={bestSeller}
                      className="h-4 w-4 rounded border-gray-300"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Best Seller
                      </p>

                      <p className="text-xs text-gray-500">
                        Show this product as a popular item
                      </p>
                    </div>
                  </label>

                  <label
                    className="
              flex cursor-pointer items-center gap-3
              rounded-lg border border-gray-200
              bg-gray-50 px-4 py-3
              transition hover:border-gray-400 hover:bg-white
            "
                  >
                    <input
                      type="checkbox"
                      checked={onStock}
                      onChange={() => setOnStock(!onStock)}
                      className="h-4 w-4 rounded border-gray-300"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        In Stock
                      </p>

                      <p className="text-xs text-gray-500">
                        Product is currently available
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* ================= SUBMIT ================= */}
              <div className="border-t border-gray-200 pt-5">
                <button
                  type="submit"
                  className="
            w-full rounded-lg
            bg-gray-900 px-5 py-3
            text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-gray-800
            active:scale-[0.99]
          "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
