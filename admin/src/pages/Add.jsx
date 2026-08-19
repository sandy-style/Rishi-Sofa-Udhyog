import React, { useEffect, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [showMore, setShowMore] = useState(false);
  const [selectedColor, setSelectedColor] = useState([]);

  console.log(selectedColor);
  const colorHandler = (color) => {
    let toggleColor = structuredClone(selectedColor);
    const exist = toggleColor.some((item) => item.name === color.name);
    if (exist) {
      toggleColor = toggleColor.filter((prev) => prev.name !== color.name);
    } else {
      toggleColor.push(color);
    }
    setSelectedColor(toggleColor);
  };

  const sofaColors = [
    { name: "White", hex: "#FFFFFF" },
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Sand", hex: "#C2B280" },
    { name: "Light Grey", hex: "#D3D3D3" },
    { name: "Grey", hex: "#808080" },
    { name: "Charcoal", hex: "#36454F" },
    { name: "Black", hex: "#000000" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Camel", hex: "#C19A6B" },
    { name: "Brown", hex: "#8B4513" },
    { name: "Chocolate Brown", hex: "#5D3A1A" },
    { name: "Navy Blue", hex: "#1E3A8A" },
    { name: "Dusty Blue", hex: "#6C8EBF" },
    { name: "Sage Green", hex: "#9CAF88" },
    { name: "Olive Green", hex: "#708238" },
    { name: "Emerald Green", hex: "#50C878" },
    { name: "Mustard", hex: "#D4A017" },
    { name: "Terracotta", hex: "#E2725B" },
    { name: "Burgundy", hex: "#800020" },
  ];

  // data manipulation to send to backend
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

  const visibleColors = showMore ? sofaColors : sofaColors.slice(0, 8);

  // form handler
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submitted");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("material", material);
      formData.append("seating", seating);
      formData.append("price", price);
      formData.append("stock", onStock);
      formData.append("bestSeller", bestSeller);
      formData.append(
        "color",
        JSON.stringify(selectedColor.map((item) => item.name)),
      );
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/admin/add",
        formData,
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setMaterial("leather");
        setSelectedColor([]);
        setPrice(25000);
        setseating("");
        setImage1("");
        setImage2("");
        setImage3("");
        setImage4("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5">
      <div className=" max-w-6xl rounded-3xl bg-white shadow-xl border p-10">
        <h1 className="text-3xl font-bold mb-1">Add New Product</h1>

        <p className="text-gray-500 mb-10">
          Upload product details and showcase your premium sofa.
        </p>

        <form onSubmit={submitHandler} className="space-y-10">
          {/* Upload Images */}
          <div>
            <h2 className="text-lg font-semibold mb-5">Product Images</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <label
                htmlFor="image1"
                className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100 transition h-52 flex flex-col items-center justify-center"
              >
                {image1 ? (
                  <img
                    src={URL.createObjectURL(image1)}
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
                    src={URL.createObjectURL(image2)}
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
                    src={URL.createObjectURL(image3)}
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
              </label>
              <label
                htmlFor="image4"
                className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100 transition h-52 flex flex-col items-center justify-center"
              >
                {image4 ? (
                  <img
                    src={URL.createObjectURL(image4)}
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
          {/* Product Name */}
          <div>
            <label className="font-medium">Product Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border px-5 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Luxury Leather Sofa"
            />
          </div>
          {/* Description */}
          <div>
            <label className="font-medium">Product Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-2 w-full rounded-xl border px-5 py-3 outline-none resize-none focus:ring-2 focus:ring-black"
              placeholder="Describe your product..."
            />
          </div>
          {/* Options */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-medium">Material</label>

              <select
                defaultValue={"leather"}
                onChange={(e) => setMaterial(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-black"
              >
                <option value={"leather"}>Leather</option>

                <option value={"fabric"}>Fabric</option>

                <option value={"velvet"}>Velvet</option>

                <option value={"linen"}>Linen</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Seating Capacity</label>

              <select
                value={seating}
                onChange={(e) => setseating(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 bg-white focus:ring-2 focus:ring-black outline-none"
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

            <div>
              <label className="font-medium">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="enter price"
                className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          {/* Colors */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="font-medium">Available Colors</label>

              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {showMore ? (
                  <>
                    Show Less
                    <FiChevronUp />
                  </>
                ) : (
                  <>
                    Show More
                    <FiChevronDown />
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {visibleColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => colorHandler(color)}
                  className={`rounded-xl border p-3 transition-all duration-200 hover:scale-105 hover:shadow-md

                  ${
                    selectedColor.some((item) => item.name === color.name)
                      ? "ring-2 ring-black border-black"
                      : ""
                  }`}
                >
                  <div
                    className="h-10 w-10 rounded-full mx-auto border"
                    style={{ background: color.hex }}
                  />

                  <p className="text-xs mt-2 text-center">{color.name}</p>
                </button>
              ))}
            </div>
          </div>{" "}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-3 text-balance cursor-pointer">
              <input
                type="checkbox"
                checked={bestSeller}
                onChange={() => setBestSeller(!bestSeller)}
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <span className="font-medium">Best Seller</span>
            </label>

            <label className="flex items-center gap-3 text-balance cursor-pointer">
              <input
                type="checkbox"
                checked={onStock}
                onChange={() => setOnStock(!onStock)}
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <span className="font-medium">In Stock</span>
            </label>
          </div>
          {/* Submit */}
          <div className="pt-5">
            <button
              type="submit"
              className="rounded-xl bg-black text-white px-10 py-4 hover:bg-gray-800 transition font-semibold"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
