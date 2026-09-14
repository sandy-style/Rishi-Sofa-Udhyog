import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { MdCloudUpload } from "react-icons/md";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [id, setId] = useState("");
  const [doEdit, setDoEdit] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sofas");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");

  const [seating, setSeating] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");

  const [mattressType, setMattressType] = useState("");
  const [thickness, setThickness] = useState("");
  const [firmness, setFirmness] = useState("");

  // =========================
  // DIMENSIONS
  // =========================
  const [dimensions, setDimensions] = useState({
    width: "",
    length: "",
    depth: "",
    height: "",
    leftLength: "",
    rightLength: "",
    unit: "cm",
  });

  const [offerEnabled, setOfferEnabled] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");

  const [onStock, setOnStock] = useState(true);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/admin/listproducts", {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setId("");
    setName("");
    setDescription("");
    setCategory("Sofas");
    setPrice("");
    setMaterial("");

    setSeating("");
    setSize("");
    setColor("");
    setStyle("");

    setMattressType("");
    setThickness("");
    setFirmness("");

    setDimensions({
      width: "",
      length: "",
      depth: "",
      height: "",
      leftLength: "",
      rightLength: "",
      unit: "cm",
    });

    setOfferEnabled(false);
    setDiscountType("percentage");
    setDiscountValue("");
    setOfferTitle("");
    setOfferEndsAt("");

    setOnStock(true);

    setImage1("");
    setImage2("");
    setImage3("");
    setImage4("");

    setDoEdit(false);
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEdit = (productId, product) => {
    setId(productId);

    setName(product.name || "");
    setDescription(product.description || "");
    setCategory(product.category || "Sofas");
    setPrice(product.price || "");
    setMaterial(product.material || "");

    const attributes = product.attributes || {};

    setSeating(attributes.seating || "");
    setColor(attributes.color || "");
    setStyle(attributes.style || "");

    setMattressType(attributes.mattressType || "");
    setThickness(attributes.thickness || "");
    setFirmness(attributes.firmness || "");

    // =========================
    // LOAD SIZE
    // =========================
    setSize(product.size || attributes.size || "");

    // =========================
    // LOAD DIMENSIONS
    // =========================
    const productDimensions = product.dimensions || {};

    setDimensions({
      width: productDimensions.width ?? "",
      length: productDimensions.length ?? "",
      depth: productDimensions.depth ?? "",
      height: productDimensions.height ?? "",
      leftLength: productDimensions.leftLength ?? "",
      rightLength: productDimensions.rightLength ?? "",
      unit: productDimensions.unit || "cm",
    });

    // =========================
    // OFFER
    // =========================
    const offer = product.offer || {};

    setOfferEnabled(offer.isActive || false);
    setDiscountType(offer.discountType || "percentage");
    setDiscountValue(offer.discountValue ?? "");
    setOfferTitle(offer.offerTitle || "");
    setOfferEndsAt(
      offer.offerEndsAt
        ? new Date(offer.offerEndsAt).toISOString().slice(0, 16)
        : "",
    );

    setOnStock(product.stock ?? true);

    // =========================
    // IMAGES
    // =========================
    setImage1(product.image?.[0] || "");
    setImage2(product.image?.[1] || "");
    setImage3(product.image?.[2] || "");
    setImage4(product.image?.[3] || "");

    setDoEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DIMENSION HANDLER
  // =========================
  const updateDimension = (field, value) => {
    setDimensions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!material.trim()) {
      toast.error("Material is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!image1) {
      toast.error("At least one product image is required");
      return;
    }

    if (offerEnabled) {
      if (!discountValue || Number(discountValue) <= 0) {
        toast.error("Please enter a valid discount value");
        return;
      }

      if (discountType === "percentage" && Number(discountValue) > 100) {
        toast.error("Percentage discount cannot exceed 100%");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("id", id);
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("price", price);
      formData.append("material", material.trim());

      // =========================
      // ATTRIBUTES
      // =========================
      const attributes = {
        seating: seating || "",
        color: color || "",
        style: style || "",
        mattressType: mattressType || "",
        thickness: thickness || "",
        firmness: firmness || "",
      };

      formData.append("attributes", JSON.stringify(attributes));

      // =========================
      // SIZE
      // =========================
      formData.append("size", size || "");

      // =========================
      // DIMENSIONS
      // =========================
      const cleanedDimensions = {
        width: dimensions.width !== "" ? Number(dimensions.width) : null,

        length: dimensions.length !== "" ? Number(dimensions.length) : null,

        depth: dimensions.depth !== "" ? Number(dimensions.depth) : null,

        height: dimensions.height !== "" ? Number(dimensions.height) : null,

        leftLength:
          dimensions.leftLength !== "" ? Number(dimensions.leftLength) : null,

        rightLength:
          dimensions.rightLength !== "" ? Number(dimensions.rightLength) : null,

        unit: dimensions.unit || "cm",
      };

      formData.append("dimensions", JSON.stringify(cleanedDimensions));

      // =========================
      // OFFER
      // =========================
      const offer = {
        isActive: offerEnabled,
        discountType,
        discountValue: offerEnabled ? Number(discountValue) || 0 : 0,
        offerTitle: offerEnabled ? offerTitle.trim() : "",
        offerEndsAt: offerEnabled && offerEndsAt ? offerEndsAt : null,
      };

      formData.append("offer", JSON.stringify(offer));

      // =========================
      // STOCK
      // =========================
      formData.append("stock", String(onStock));

      // =========================
      // IMAGES
      // =========================
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
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REMOVE PRODUCT
  // =========================
  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/admin/removeproduct",
        {
          id: productId,
        },
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // =========================
  // IMAGE HANDLER
  // =========================
  const imageHandler = (e, setImage) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  // =========================
  // FORM
  // =========================
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 pb-10">
      {/* =========================
          EDIT FORM
      ========================= */}
      {doEdit && (
        <div className="bg-white border border-[#E5DDD3] rounded-xl p-5 sm:p-7 mb-10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#3B2B20]">
                Edit Product
              </h2>

              <p className="text-sm text-[#7E746D] mt-1">
                Update product information
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-[#E5DDD3] rounded-lg text-sm text-[#3B2B20] hover:bg-[#F8F5F0]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            {/* =========================
                IMAGES
            ========================= */}
            <div className="mb-8">
              <p className="text-sm font-medium text-[#3B2B20] mb-3">
                Product Images
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* IMAGE 1 */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-[#B07B45] bg-[#FBF8F4] aspect-square rounded-lg flex items-center justify-center overflow-hidden">
                    {image1 ? (
                      <img
                        src={
                          image1 instanceof File
                            ? URL.createObjectURL(image1)
                            : image1
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdCloudUpload size={30} className="text-[#B07B45]" />
                    )}
                  </div>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => imageHandler(e, setImage1)}
                  />
                </label>

                {/* IMAGE 2 */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-[#B07B45] bg-[#FBF8F4] aspect-square rounded-lg flex items-center justify-center overflow-hidden">
                    {image2 ? (
                      <img
                        src={
                          image2 instanceof File
                            ? URL.createObjectURL(image2)
                            : image2
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdCloudUpload size={30} className="text-[#B07B45]" />
                    )}
                  </div>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => imageHandler(e, setImage2)}
                  />
                </label>

                {/* IMAGE 3 */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-[#B07B45] bg-[#FBF8F4] aspect-square rounded-lg flex items-center justify-center overflow-hidden">
                    {image3 ? (
                      <img
                        src={
                          image3 instanceof File
                            ? URL.createObjectURL(image3)
                            : image3
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdCloudUpload size={30} className="text-[#B07B45]" />
                    )}
                  </div>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => imageHandler(e, setImage3)}
                  />
                </label>

                {/* IMAGE 4 */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-[#B07B45] bg-[#FBF8F4] aspect-square rounded-lg flex items-center justify-center overflow-hidden">
                    {image4 ? (
                      <img
                        src={
                          image4 instanceof File
                            ? URL.createObjectURL(image4)
                            : image4
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdCloudUpload size={30} className="text-[#B07B45]" />
                    )}
                  </div>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => imageHandler(e, setImage4)}
                  />
                </label>
              </div>
            </div>

            {/* =========================
                BASIC INFORMATION
            ========================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#3B2B20] mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B2B20] mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                >
                  <option value="Sofas">Sofas</option>
                  <option value="Beds">Beds</option>
                  <option value="Matteress">Mattress</option>
                  <option value="Almirahs">Almirahs</option>
                  <option value="Tables">Tables</option>
                  <option value="Tv-units">TV Units</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B2B20] mb-2">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B2B20] mb-2">
                  Material
                </label>

                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                  className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#3B2B20] mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45] resize-none"
                />
              </div>
            </div>

            {/* =========================
                ATTRIBUTES
            ========================= */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#3B2B20] mb-4">
                Product Attributes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* SEATING */}
                <div>
                  <label className="block text-sm text-[#7E746D] mb-2">
                    Seating
                  </label>

                  <input
                    type="text"
                    value={seating}
                    onChange={(e) => setSeating(e.target.value)}
                    className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                {/* COLOR */}
                <div>
                  <label className="block text-sm text-[#7E746D] mb-2">
                    Color
                  </label>

                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                {/* STYLE */}
                <div>
                  <label className="block text-sm text-[#7E746D] mb-2">
                    Style
                  </label>

                  <input
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                {/* MATTRESS TYPE */}
                <div>
                  <label className="block text-sm text-[#7E746D] mb-2">
                    Mattress Type
                  </label>

                  <input
                    type="text"
                    value={mattressType}
                    onChange={(e) => setMattressType(e.target.value)}
                    className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                {/* THICKNESS */}
                <div>
                  <label className="block text-sm text-[#7E746D] mb-2">
                    Thickness
                  </label>

                  <input
                    type="text"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                {/* FIRMNESS */}
                <div>
                  <label className="block text-sm text-[#7E746D] mb-2">
                    Firmness
                  </label>

                  <input
                    type="text"
                    value={firmness}
                    onChange={(e) => setFirmness(e.target.value)}
                    className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* =========================
                SIZE & DIMENSIONS
            ========================= */}
            <div className="mt-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#3B2B20]">
                  Size & Dimensions
                </h3>

                <p className="text-xs text-[#7E746D] mt-1">
                  Select the standard size and enter the actual product
                  measurements below.
                </p>
              </div>

              <div className="border border-[#E5DDD3] rounded-xl p-5 bg-[#FBF8F4]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* SIZE */}
                  <div>
                    <label className="block text-sm text-[#7E746D] mb-2">
                      Size
                    </label>

                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                    >
                      <option value="">Select Size</option>

                      {category === "Sofas" ? (
                        <>
                          <option value="1 Seater">1 Seater</option>
                          <option value="2 Seater">2 Seater</option>
                          <option value="3 Seater">3 Seater</option>
                          <option value="4 Seater">4 Seater</option>
                          <option value="5 Seater">5 Seater</option>
                          <option value="6 Seater">6 Seater</option>
                          <option value="L Shape">L Shape</option>
                        </>
                      ) : category === "Beds" ? (
                        <>
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Queen">Queen</option>
                          <option value="King">King</option>
                        </>
                      ) : category === "Matteress" ? (
                        <>
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Queen">Queen</option>
                          <option value="King">King</option>
                          <option value="Custom">Custom</option>
                        </>
                      ) : (
                        <>
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* UNIT */}
                  <div>
                    <label className="block text-sm text-[#7E746D] mb-2">
                      Measurement Unit
                    </label>

                    <select
                      value={dimensions.unit}
                      onChange={(e) => updateDimension("unit", e.target.value)}
                      className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="in">Inches (in)</option>
                      <option value="ft">Feet (ft)</option>
                    </select>
                  </div>
                </div>

                {/* DIMENSIONS */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-[#3B2B20] mb-3">
                    Dimensions
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* WIDTH */}
                    <div>
                      <label className="block text-xs text-[#7E746D] mb-2">
                        Width
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.width}
                        onChange={(e) =>
                          updateDimension("width", e.target.value)
                        }
                        placeholder="Enter width"
                        className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                      />
                    </div>

                    {/* LENGTH */}
                    <div>
                      <label className="block text-xs text-[#7E746D] mb-2">
                        Length
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.length}
                        onChange={(e) =>
                          updateDimension("length", e.target.value)
                        }
                        placeholder="Enter length"
                        className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                      />
                    </div>

                    {/* DEPTH */}
                    <div>
                      <label className="block text-xs text-[#7E746D] mb-2">
                        Depth
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.depth}
                        onChange={(e) =>
                          updateDimension("depth", e.target.value)
                        }
                        placeholder="Enter depth"
                        className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                      />
                    </div>

                    {/* HEIGHT */}
                    <div>
                      <label className="block text-xs text-[#7E746D] mb-2">
                        Height
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.height}
                        onChange={(e) =>
                          updateDimension("height", e.target.value)
                        }
                        placeholder="Enter height"
                        className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                      />
                    </div>
                  </div>
                </div>

                {/* L SHAPE DIMENSIONS */}
                {category === "Sofas" && size === "L Shape" && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-[#3B2B20] mb-3">
                      L Shape Measurements
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* LEFT LENGTH */}
                      <div>
                        <label className="block text-xs text-[#7E746D] mb-2">
                          Left Length
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={dimensions.leftLength}
                          onChange={(e) =>
                            updateDimension("leftLength", e.target.value)
                          }
                          placeholder="Enter left length"
                          className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                        />
                      </div>

                      {/* RIGHT LENGTH */}
                      <div>
                        <label className="block text-xs text-[#7E746D] mb-2">
                          Right Length
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={dimensions.rightLength}
                          onChange={(e) =>
                            updateDimension("rightLength", e.target.value)
                          }
                          placeholder="Enter right length"
                          className="w-full bg-white border border-[#E5DDD3] rounded-lg px-4 py-3 outline-none focus:border-[#B07B45]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-[#7E746D] mt-4">
                  Leave any dimension blank if it does not apply to the product.
                </p>
              </div>
            </div>

            {/* =========================
                OFFER
            ========================= */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-5">
                <input
                  type="checkbox"
                  checked={offerEnabled}
                  onChange={(e) => setOfferEnabled(e.target.checked)}
                  className="w-4 h-4"
                />

                <label className="text-sm font-medium text-[#3B2B20]">
                  Enable Offer
                </label>
              </div>

              {offerEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* DISCOUNT TYPE */}
                  <div>
                    <label className="block text-sm text-[#7E746D] mb-2">
                      Discount Type
                    </label>

                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Fixed</option>
                    </select>
                  </div>

                  {/* DISCOUNT VALUE */}
                  <div>
                    <label className="block text-sm text-[#7E746D] mb-2">
                      Discount Value
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3"
                    />
                  </div>

                  {/* OFFER TITLE */}
                  <div>
                    <label className="block text-sm text-[#7E746D] mb-2">
                      Offer Title
                    </label>

                    <input
                      type="text"
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                      className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3"
                    />
                  </div>

                  {/* OFFER ENDS */}
                  <div>
                    <label className="block text-sm text-[#7E746D] mb-2">
                      Offer Ends
                    </label>

                    <input
                      type="datetime-local"
                      value={offerEndsAt}
                      onChange={(e) => setOfferEndsAt(e.target.value)}
                      className="w-full border border-[#E5DDD3] rounded-lg px-4 py-3"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* =========================
                PRODUCT STATUS
            ========================= */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#3B2B20] mb-4">
                Product Status
              </h3>

              <div className="flex items-center gap-3 border border-[#E5DDD3] rounded-lg p-4">
                <input
                  type="checkbox"
                  checked={onStock}
                  onChange={(e) => setOnStock(e.target.checked)}
                  className="w-4 h-4"
                />

                <div>
                  <p className="text-sm font-medium text-[#3B2B20]">In Stock</p>

                  <p className="text-xs text-[#7E746D]">
                    Product is currently available for purchase
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#7E746D] mt-3">
                Best Seller status is now calculated automatically from the
                number of units sold.
              </p>
            </div>

            {/* =========================
                UPDATE BUTTON
            ========================= */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 bg-[#3B2B20] text-white px-7 py-3 rounded-lg hover:bg-[#2d2119] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      )}

      {/* =========================
          PRODUCT LIST
      ========================= */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#3B2B20]">
              Product List
            </h2>

            <p className="text-sm text-[#7E746D] mt-1">
              Manage your furniture products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-[#E5DDD3] rounded-xl overflow-hidden shadow-sm"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/3] bg-[#F8F5F0] overflow-hidden">
                {product.image?.[0] && (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* DYNAMIC BEST SELLER BADGE */}
                {product.soldCount > 0 && (
                  <div className="absolute top-3 left-3 bg-[#B07B45] text-white text-xs px-3 py-1.5 rounded-full">
                    Best Seller
                  </div>
                )}

                {/* OUT OF STOCK */}
                {!product.stock && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* PRODUCT INFORMATION */}
              <div className="p-4">
                <h3 className="font-medium text-[#3B2B20] line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xs text-[#7E746D] mt-1">
                  {product.category}
                </p>

                <p className="text-sm font-semibold text-[#3B2B20] mt-3">
                  Rs. {product.price}
                </p>

                {/* SIZE */}
                {(product.size || product.attributes?.size) && (
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-[#7E746D]">Size</span>

                    <span className="font-semibold text-[#3B2B20]">
                      {product.size || product.attributes?.size}
                    </span>
                  </div>
                )}

                {/* SOLD COUNT */}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-[#7E746D]">Units Sold</span>

                  <span className="font-semibold text-[#3B2B20]">
                    {product.soldCount ?? 0}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(product._id, product)}
                    className="flex-1 border border-[#E5DDD3] rounded-lg py-2 text-sm text-[#3B2B20] hover:bg-[#F8F5F0]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeProduct(product._id)}
                    className="flex-1 bg-red-50 text-red-600 rounded-lg py-2 text-sm hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
