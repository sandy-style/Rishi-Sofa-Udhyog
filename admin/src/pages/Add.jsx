import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  // ============================================================
  // PRODUCT IMAGES
  // ============================================================

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  // ============================================================
  // BASIC PRODUCT DATA
  // ============================================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sofas");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");

  // ============================================================
  // CATEGORY OPTIONS
  // ============================================================

  const [seating, setSeating] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");

  // ============================================================
  // DIMENSIONS
  // ============================================================

  const [dimensions, setDimensions] = useState({
    width: "",
    length: "",
    depth: "",
    height: "",
    leftLength: "",
    rightLength: "",
    unit: "cm",
  });

  // ============================================================
  // MATTRESS OPTIONS
  // ============================================================

  const [mattressType, setMattressType] = useState("");
  const [thickness, setThickness] = useState("");
  const [firmness, setFirmness] = useState("");

  // ============================================================
  // OFFER OPTIONS
  // ============================================================

  const [offerEnabled, setOfferEnabled] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");

  // ============================================================
  // PRODUCT STATUS
  // ============================================================

  const [onStock, setOnStock] = useState(true);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // UPDATE DIMENSION
  // ============================================================

  const updateDimension = (field, value) => {
    setDimensions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // CATEGORY CHANGE
  // ============================================================

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;

    setCategory(newCategory);

    // Reset category-specific options
    setMaterial("");
    setSeating("");
    setSize("");
    setColor("");
    setStyle("");

    setMattressType("");
    setThickness("");
    setFirmness("");

    // Reset dimensions
    setDimensions({
      width: "",
      length: "",
      depth: "",
      height: "",
      leftLength: "",
      rightLength: "",
      unit: "cm",
    });
  };

  // ============================================================
  // CALCULATE DISCOUNTED PRICE
  // ============================================================

  const calculateOfferPrice = () => {
    if (!price || !discountPercentage) return 0;

    const originalPrice = Number(price);
    const discount = Number(discountPercentage);

    return originalPrice - (originalPrice * discount) / 100;
  };

  // ============================================================
  // SUBMIT PRODUCT
  // ============================================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ============================================================
    // BASIC VALIDATION
    // ============================================================

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !category ||
      !material
    ) {
      toast.error(
        "Please fill all required product details including material",
      );
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!image1) {
      toast.error("Please upload at least one product image");
      return;
    }

    // ============================================================
    // DIMENSION VALIDATION
    // ============================================================

    const numericDimensionFields = [
      "width",
      "length",
      "depth",
      "height",
      "leftLength",
      "rightLength",
    ];

    for (const field of numericDimensionFields) {
      if (
        dimensions[field] !== "" &&
        (Number.isNaN(Number(dimensions[field])) ||
          Number(dimensions[field]) < 0)
      ) {
        toast.error(`Please enter a valid ${field} dimension`);
        return;
      }
    }

    // ============================================================
    // L SHAPE VALIDATION
    // ============================================================

    if (category === "Sofas" && size === "L Shape") {
      if (dimensions.leftLength === "" || dimensions.rightLength === "") {
        toast.error(
          "Please enter both Left Length and Right Length for an L Shape sofa",
        );
        return;
      }
    }

    // ============================================================
    // OFFER VALIDATION
    // ============================================================

    if (offerEnabled) {
      if (
        !discountPercentage ||
        Number(discountPercentage) <= 0 ||
        Number(discountPercentage) > 100
      ) {
        toast.error("Please enter a valid discount percentage");
        return;
      }

      if (!offerTitle.trim()) {
        toast.error("Please enter an offer title");
        return;
      }

      if (!offerEndsAt) {
        toast.error("Please select an offer ending date");
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // ============================================================
      // BASIC DATA
      // ============================================================

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("material", material);

      // ============================================================
      // ATTRIBUTES
      // ============================================================

      const options = {
        seating: seating || "",
        color: color || "",
        style: style || "",
        mattressType: mattressType || "",
        thickness: thickness || "",
        firmness: firmness || "",
      };

      formData.append("attributes", JSON.stringify(options));

      // ============================================================
      // SIZE
      // ============================================================

      formData.append("size", size || "");

      // ============================================================
      // DIMENSIONS
      // ============================================================

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

      // ============================================================
      // OFFER
      // ============================================================

      const offer = {
        isActive: offerEnabled,
        discountType: "percentage",
        discountValue: offerEnabled ? Number(discountPercentage) : 0,
        offerTitle: offerEnabled ? offerTitle.trim() : "",
        offerEndsAt: offerEnabled && offerEndsAt ? offerEndsAt : null,
      };

      formData.append("offer", JSON.stringify(offer));

      // ============================================================
      // STOCK
      // ============================================================

      formData.append("stock", String(onStock));

      // ============================================================
      // IMAGES
      // ============================================================

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // ============================================================
      // API REQUEST
      // ============================================================

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

        // ============================================================
        // RESET BASIC DATA
        // ============================================================

        setName("");
        setDescription("");
        setCategory("Sofas");
        setPrice("");
        setMaterial("");

        // ============================================================
        // RESET CATEGORY OPTIONS
        // ============================================================

        setSeating("");
        setSize("");
        setColor("");
        setStyle("");

        // ============================================================
        // RESET DIMENSIONS
        // ============================================================

        setDimensions({
          width: "",
          length: "",
          depth: "",
          height: "",
          leftLength: "",
          rightLength: "",
          unit: "cm",
        });

        // ============================================================
        // RESET MATTRESS OPTIONS
        // ============================================================

        setMattressType("");
        setThickness("");
        setFirmness("");

        // ============================================================
        // RESET OFFER
        // ============================================================

        setOfferEnabled(false);
        setDiscountPercentage("");
        setOfferTitle("");
        setOfferEndsAt("");

        // ============================================================
        // RESET IMAGES
        // ============================================================

        setImage1("");
        setImage2("");
        setImage3("");
        setImage4("");

        // ============================================================
        // RESET STOCK
        // ============================================================

        setOnStock(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // IMAGE UPLOAD COMPONENT
  // ============================================================

  const ImageUpload = ({ image, setImage, id }) => {
    return (
      <label
        htmlFor={id}
        className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-black hover:bg-gray-100 sm:h-48 sm:rounded-2xl md:h-52"
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
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
          onChange={(e) => setImage(e.target.files[0])}
          id={id}
        />
      </label>
    );
  };

  // ============================================================
  // DIMENSION INPUT
  // ============================================================

  const DimensionInput = ({ label, field, placeholder }) => {
    return (
      <div>
        <label className="font-medium text-gray-800">{label}</label>

        <div className="mt-2 flex">
          <input
            type="number"
            min="0"
            step="any"
            value={dimensions[field]}
            onChange={(e) => updateDimension(field, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
          />

          <span className="ml-2 flex min-w-[55px] items-center justify-center rounded-xl border bg-gray-100 px-3 text-sm font-medium text-gray-600">
            {dimensions.unit}
          </span>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 md:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border bg-white p-4 shadow-xl sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
        <div className="mb-7 sm:mb-10">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add New Product
          </h1>

          <p className="mt-1 text-sm leading-6 text-gray-500 sm:text-base">
            Add furniture products, category options, offers and images.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-8 sm:space-y-10">
          {/* ================================================== */}
          {/* PRODUCT IMAGES */}
          {/* ================================================== */}

          <div>
            <h2 className="mb-4 text-lg font-semibold sm:mb-5">
              Product Images
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 md:gap-6">
              <ImageUpload image={image1} setImage={setImage1} id="image1" />

              <ImageUpload image={image2} setImage={setImage2} id="image2" />

              <ImageUpload image={image3} setImage={setImage3} id="image3" />

              <ImageUpload image={image4} setImage={setImage4} id="image4" />
            </div>
          </div>

          {/* ================================================== */}
          {/* PRODUCT NAME */}
          {/* ================================================== */}

          <div>
            <label className="font-medium text-gray-800">Product Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-black sm:px-5 sm:text-base"
              placeholder="Modern 3 Seater Sofa"
              required
            />
          </div>

          {/* ================================================== */}
          {/* DESCRIPTION */}
          {/* ================================================== */}

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
              required
            />
          </div>

          {/* ================================================== */}
          {/* CATEGORY */}
          {/* ================================================== */}

          <div>
            <label className="font-medium text-gray-800">
              Product Category
            </label>

            <select
              value={category}
              onChange={handleCategoryChange}
              className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
            >
              <option value="Sofas">Sofas</option>

              <option value="Beds">Beds</option>

              <option value="Matteress">Mattress</option>

              <option value="Almirahs">Almirahs</option>

              <option value="Tables">Tables</option>

              <option value="Tv-units">TV Units</option>
            </select>
          </div>

          {/* ================================================== */}
          {/* CATEGORY OPTIONS */}
          {/* ================================================== */}

          <div>
            <h2 className="mb-5 text-lg font-semibold">{category} Options</h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {/* ================================================== */}
              {/* SOFA SEATING */}
              {/* ================================================== */}

              {category === "Sofas" && (
                <div>
                  <label className="font-medium text-gray-800">
                    Seating Capacity
                  </label>

                  <select
                    value={seating}
                    onChange={(e) => setSeating(e.target.value)}
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
              )}

              {/* ================================================== */}
              {/* SOFA SIZE */}
              {/* ================================================== */}

              {category === "Sofas" && (
                <div>
                  <label className="font-medium text-gray-800">Size</label>

                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  >
                    <option value="">Select Size</option>

                    <option value="1 Seater">1 Seater</option>

                    <option value="2 Seater">2 Seater</option>

                    <option value="3 Seater">3 Seater</option>

                    <option value="4 Seater">4 Seater</option>

                    <option value="5 Seater">5 Seater</option>

                    <option value="6 Seater">6 Seater</option>

                    <option value="L Shape">L Shape</option>
                  </select>
                </div>
              )}

              {/* ================================================== */}
              {/* MATTRESS TYPE */}
              {/* ================================================== */}

              {category === "Matteress" && (
                <div>
                  <label className="font-medium text-gray-800">
                    Mattress Type
                  </label>

                  <select
                    value={mattressType}
                    onChange={(e) => setMattressType(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  >
                    <option value="">Select Mattress Type</option>

                    <option value="Memory Foam">Memory Foam</option>

                    <option value="Spring">Spring</option>

                    <option value="Pocket Spring">Pocket Spring</option>

                    <option value="Latex">Latex</option>

                    <option value="Orthopedic">Orthopedic</option>

                    <option value="Coir">Coir</option>

                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              )}

              {/* ================================================== */}
              {/* MATTRESS SIZE */}
              {/* ================================================== */}

              {category === "Matteress" && (
                <div>
                  <label className="font-medium text-gray-800">
                    Mattress Size
                  </label>

                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  >
                    <option value="">Select Mattress Size</option>

                    <option value="Single">Single</option>

                    <option value="Double">Double</option>

                    <option value="Queen">Queen</option>

                    <option value="King">King</option>

                    <option value="Custom">Custom</option>
                  </select>
                </div>
              )}

              {/* ================================================== */}
              {/* THICKNESS */}
              {/* ================================================== */}

              {category === "Matteress" && (
                <div>
                  <label className="font-medium text-gray-800">Thickness</label>

                  <select
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  >
                    <option value="">Select Thickness</option>

                    <option value={'4"'}>4 inches</option>

                    <option value={'5"'}>5 inches</option>

                    <option value={'6"'}>6 inches</option>

                    <option value={'8"'}>8 inches</option>

                    <option value={'10"'}>10 inches</option>

                    <option value={'12"'}>12 inches</option>
                  </select>
                </div>
              )}

              {/* ================================================== */}
              {/* FIRMNESS */}
              {/* ================================================== */}

              {category === "Matteress" && (
                <div>
                  <label className="font-medium text-gray-800">Firmness</label>

                  <select
                    value={firmness}
                    onChange={(e) => setFirmness(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  >
                    <option value="">Select Firmness</option>

                    <option value="Soft">Soft</option>

                    <option value="Medium">Medium</option>

                    <option value="Medium Firm">Medium Firm</option>

                    <option value="Firm">Firm</option>
                  </select>
                </div>
              )}

              {/* ================================================== */}
              {/* MATERIAL */}
              {/* ================================================== */}

              <div>
                <label className="font-medium text-gray-800">
                  Material <span className="text-red-500">*</span>
                </label>

                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  required
                >
                  <option value="">Select Material</option>

                  {category === "Sofas" ? (
                    <>
                      <option value="Leather">Leather</option>

                      <option value="Fabric">Fabric</option>

                      <option value="Velvet">Velvet</option>

                      <option value="Linen">Linen</option>

                      <option value="Leatherette">Leatherette</option>
                    </>
                  ) : category === "Matteress" ? (
                    <>
                      <option value="Memory Foam">Memory Foam</option>

                      <option value="Latex">Latex</option>

                      <option value="Coir">Coir</option>

                      <option value="Spring">Spring</option>

                      <option value="Pocket Spring">Pocket Spring</option>

                      <option value="Hybrid">Hybrid</option>

                      <option value="Cotton">Cotton</option>
                    </>
                  ) : (
                    <>
                      <option value="Wood">Wood</option>

                      <option value="Engineered Wood">Engineered Wood</option>

                      <option value="Metal">Metal</option>

                      <option value="Glass">Glass</option>
                    </>
                  )}
                </select>
              </div>

              {/* ================================================== */}
              {/* OTHER CATEGORY SIZE */}
              {/* ================================================== */}

              {category !== "Sofas" && category !== "Matteress" && (
                <div>
                  <label className="font-medium text-gray-800">Size</label>

                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  >
                    <option value="">Select Size</option>

                    {category === "Beds" ? (
                      <>
                        <option value="Single">Single</option>

                        <option value="Double">Double</option>

                        <option value="Queen">Queen</option>

                        <option value="King">King</option>
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
              )}

              {/* ================================================== */}
              {/* COLOR */}
              {/* ================================================== */}

              <div>
                <label className="font-medium text-gray-800">Color</label>

                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                  placeholder="Walnut Brown"
                />
              </div>

              {/* ================================================== */}
              {/* STYLE */}
              {/* ================================================== */}

              <div>
                <label className="font-medium text-gray-800">Style</label>

                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
                >
                  <option value="">Select Style</option>

                  <option value="Modern">Modern</option>

                  <option value="Contemporary">Contemporary</option>

                  <option value="Classic">Classic</option>

                  <option value="Minimalist">Minimalist</option>

                  <option value="Traditional">Traditional</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* PRODUCT DIMENSIONS */}
          {/* ================================================== */}

          <div className="rounded-2xl border bg-gray-50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Product Dimensions</h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Enter the actual measurements of this product.
                </p>
              </div>

              {/* UNIT */}
              <div className="sm:w-32">
                <label className="text-sm font-medium text-gray-700">
                  Unit
                </label>

                <select
                  value={dimensions.unit}
                  onChange={(e) => updateDimension("unit", e.target.value)}
                  className="mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="cm">cm</option>

                  <option value="in">in</option>

                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {/* WIDTH */}

              <DimensionInput label="Width" field="width" placeholder="180" />

              {/* LENGTH */}

              <DimensionInput label="Length" field="length" placeholder="200" />

              {/* DEPTH */}

              <DimensionInput label="Depth" field="depth" placeholder="90" />

              {/* HEIGHT */}

              <DimensionInput label="Height" field="height" placeholder="100" />

              {/* L SHAPE LEFT LENGTH */}

              {category === "Sofas" && size === "L Shape" && (
                <DimensionInput
                  label="Left Length"
                  field="leftLength"
                  placeholder="260"
                />
              )}

              {/* L SHAPE RIGHT LENGTH */}

              {category === "Sofas" && size === "L Shape" && (
                <DimensionInput
                  label="Right Length"
                  field="rightLength"
                  placeholder="180"
                />
              )}
            </div>

            {/* EXAMPLE */}

            <div className="mt-5 rounded-xl border border-dashed bg-white p-4 text-sm leading-6 text-gray-500">
              <span className="font-semibold text-gray-700">Example:</span> A
              King Bed can be entered as Width{" "}
              <span className="font-medium text-gray-700">180 cm</span>, Length{" "}
              <span className="font-medium text-gray-700">200 cm</span> and
              Height <span className="font-medium text-gray-700">100 cm</span>.
            </div>
          </div>

          {/* ================================================== */}
          {/* PRICE */}
          {/* ================================================== */}

          <div>
            <label className="font-medium text-gray-800">Price</label>

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              placeholder="Enter price"
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:text-base"
              required
            />
          </div>

          {/* ================================================== */}
          {/* OFFER */}
          {/* ================================================== */}

          <div className="rounded-2xl border bg-gray-50 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Product Offer</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a discount or promotional offer.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={offerEnabled}
                  onChange={() => setOfferEnabled(!offerEnabled)}
                  className="h-5 w-5 cursor-pointer accent-black"
                />

                <span className="font-medium">Enable Offer</span>
              </label>
            </div>

            {offerEnabled && (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {/* DISCOUNT */}

                <div>
                  <label className="font-medium text-gray-800">
                    Discount %
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="20"
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* OFFER TITLE */}

                <div>
                  <label className="font-medium text-gray-800">
                    Offer Title
                  </label>

                  <input
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="Summer Sale"
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* OFFER END */}

                <div>
                  <label className="font-medium text-gray-800">
                    Offer Ends
                  </label>

                  <input
                    type="date"
                    value={offerEndsAt}
                    onChange={(e) => setOfferEndsAt(e.target.value)}
                    className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* OFFER PRICE */}

                <div className="sm:col-span-2 md:col-span-3">
                  <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-gray-500">Offer Price</p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {calculateOfferPrice() > 0
                        ? `₹${calculateOfferPrice().toLocaleString()}`
                        : "₹0"}
                    </p>

                    {price && discountPercentage && (
                      <p className="mt-1 text-sm text-gray-500">
                        Original Price: ₹{Number(price).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================================================== */}
          {/* STOCK */}
          {/* ================================================== */}

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-8">
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

          {/* ================================================== */}
          {/* SUBMIT */}
          {/* ================================================== */}

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
