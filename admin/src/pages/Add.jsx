import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("leather");
  const [seating, setseating] = useState("");
  const [price, setPrice] = useState("");
  const [bestSeller, setBestSeller] = useState(false);
  const [onStock, setOnStock] = useState(true);

  const [loading, setLoading] = useState(false);

  // Form handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("material", material);
      formData.append("seating", seating);
      formData.append("price", price);
      formData.append("stock", onStock);
      formData.append("bestSeller", bestSeller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/admin/add",
        formData,
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setName("");
        setDescription("");
        setMaterial("leather");
        setPrice("");
        setseating("");
        setImage1("");
        setImage2("");
        setImage3("");
        setImage4("");
        setBestSeller(false);
        setOnStock(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 md:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border bg-white p-4 shadow-xl sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
        {/* Header */}
        <div className="mb-7 sm:mb-10">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add New Product
          </h1>

          <p className="mt-1 text-sm leading-6 text-gray-500 sm:text-base">
            Upload product details and showcase your premium sofa.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-8 sm:space-y-10">
          {/* ================= PRODUCT IMAGES ================= */}
          <div>
            <h2 className="mb-4 text-lg font-semibold sm:mb-5">
              Product Images
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 md:gap-6">
              {/* Image 1 */}
              <label
                htmlFor="image1"
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-black hover:bg-gray-100 sm:h-48 sm:rounded-2xl md:h-52"
              >
                {image1 ? (
                  <img
                    src={URL.createObjectURL(image1)}
                    alt=""
                    className="h-full w-full rounded-xl object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <MdCloudUpload
                      size={38}
                      className="mx-auto text-gray-500 sm:size-11"
                    />

                    <p className="mt-2 text-sm font-medium sm:mt-3 sm:text-base">
                      Upload Image
                    </p>

                    <span className="text-[10px] text-gray-500 sm:text-xs">
                      PNG / JPG
                    </span>
                  </div>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setImage1(e.target.files[0])}
                  id="image1"
                />
              </label>

              {/* Image 2 */}
              <label
                htmlFor="image2"
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-black hover:bg-gray-100 sm:h-48 sm:rounded-2xl md:h-52"
              >
                {image2 ? (
                  <img
                    src={URL.createObjectURL(image2)}
                    alt=""
                    className="h-full w-full rounded-xl object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <MdCloudUpload
                      size={38}
                      className="mx-auto text-gray-500 sm:size-11"
                    />

                    <p className="mt-2 text-sm font-medium sm:mt-3 sm:text-base">
                      Upload Image
                    </p>

                    <span className="text-[10px] text-gray-500 sm:text-xs">
                      PNG / JPG
                    </span>
                  </div>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setImage2(e.target.files[0])}
                  id="image2"
                />
              </label>

              {/* Image 3 */}
              <label
                htmlFor="image3"
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-black hover:bg-gray-100 sm:h-48 sm:rounded-2xl md:h-52"
              >
                {image3 ? (
                  <img
                    src={URL.createObjectURL(image3)}
                    alt=""
                    className="h-full w-full rounded-xl object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <MdCloudUpload
                      size={38}
                      className="mx-auto text-gray-500 sm:size-11"
                    />

                    <p className="mt-2 text-sm font-medium sm:mt-3 sm:text-base">
                      Upload Image
                    </p>

                    <span className="text-[10px] text-gray-500 sm:text-xs">
                      PNG / JPG
                    </span>
                  </div>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setImage3(e.target.files[0])}
                  id="image3"
                />
              </label>

              {/* Image 4 */}
              <label
                htmlFor="image4"
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-black hover:bg-gray-100 sm:h-48 sm:rounded-2xl md:h-52"
              >
                {image4 ? (
                  <img
                    src={URL.createObjectURL(image4)}
                    alt=""
                    className="h-full w-full rounded-xl object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <MdCloudUpload
                      size={38}
                      className="mx-auto text-gray-500 sm:size-11"
                    />

                    <p className="mt-2 text-sm font-medium sm:mt-3 sm:text-base">
                      Upload Image
                    </p>

                    <span className="text-[10px] text-gray-500 sm:text-xs">
                      PNG / JPG
                    </span>
                  </div>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setImage4(e.target.files[0])}
                  id="image4"
                />
              </label>
            </div>
          </div>

          {/* ================= PRODUCT NAME ================= */}
          <div>
            <label className="font-medium text-gray-800">Product Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-black sm:px-5 sm:text-base"
              placeholder="Luxury Leather Sofa"
            />
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div>
            <label className="font-medium text-gray-800">
              Product Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-black sm:px-5 sm:text-base"
              placeholder="Describe your product..."
            />
          </div>

          {/* ================= OPTIONS ================= */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {/* Material */}
            <div>
              <label className="font-medium text-gray-800">Material</label>

              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
              >
                <option value="leather">Leather</option>
                <option value="fabric">Fabric</option>
                <option value="velvet">Velvet</option>
                <option value="linen">Linen</option>
              </select>
            </div>

            {/* Seating */}
            <div>
              <label className="font-medium text-gray-800">
                Seating Capacity
              </label>

              <select
                value={seating}
                onChange={(e) => setseating(e.target.value)}
                className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
              >
                <option value="">Select Seating Capacity</option>
                <option value="1 Seater">1 Seater</option>
                <option value="2 Seater">2 Seater</option>
                <option value="3 Seater">3 Seater</option>
                <option value="4 Seater">4 Seater</option>
                <option value="5 Seater">5 Seater</option>
                <option value="6 Seater">6 Seater</option>
                <option value="L Shape">L Shape</option>
              </select>
            </div>

            {/* Price */}
            <div className="sm:col-span-2 md:col-span-1">
              <label className="font-medium text-gray-800">Price</label>

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Enter price"
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
              />
            </div>
          </div>

          {/* ================= CHECKBOXES ================= */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-8">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={bestSeller}
                onChange={() => setBestSeller(!bestSeller)}
                className="h-5 w-5 cursor-pointer accent-black"
              />

              <span className="font-medium">Best Seller</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={onStock}
                onChange={() => setOnStock(!onStock)}
                className="h-5 w-5 cursor-pointer accent-black"
              />

              <span className="font-medium">In Stock</span>
            </label>
          </div>

          {/* ================= SUBMIT ================= */}
          <div className="pt-2 sm:pt-5">
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl px-6 py-3.5 font-semibold text-white transition sm:w-auto sm:px-10 sm:py-4 ${
                loading
                  ? "cursor-not-allowed bg-gray-600"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Adding Product...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
