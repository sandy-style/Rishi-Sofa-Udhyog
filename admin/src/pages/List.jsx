import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { MdCloudUpload } from "react-icons/md";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [id, setId] = useState("");

  const [doEdit, setDoEdit] = useState(false);

  // ==========================================
  // BASIC PRODUCT DATA
  // ==========================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sofas");
  const [price, setPrice] = useState("");

  // ==========================================
  // PRODUCT OPTIONS
  // ==========================================

  const [material, setMaterial] = useState("");
  const [seating, setSeating] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");

  // ==========================================
  // MATTRESS OPTIONS
  // ==========================================

  const [mattressType, setMattressType] = useState("");
  const [thickness, setThickness] = useState("");
  const [firmness, setFirmness] = useState("");

  // ==========================================
  // OFFER
  // ==========================================

  const [offerEnabled, setOfferEnabled] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");

  // ==========================================
  // STATUS
  // ==========================================

  const [bestSeller, setBestSeller] = useState(false);
  const [onStock, setOnStock] = useState(true);

  // ==========================================
  // IMAGES
  // ==========================================

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/admin/listproducts");

      if (response.data.success) {
        setList(response.data.products);
        console.log("Fetched products:", response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const removeProducts = async (productId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/admin/removeproduct",
        { id: productId },
        {
          headers: {
            token,
          },
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

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;

    setCategory(newCategory);

    setMaterial("");
    setSeating("");
    setSize("");
    setColor("");
    setStyle("");

    setMattressType("");
    setThickness("");
    setFirmness("");
  };

  // ==========================================
  // CALCULATE OFFER PRICE
  // ==========================================

  const calculateOfferPrice = () => {
    if (!price || !discountValue) {
      return 0;
    }

    const originalPrice = Number(price);
    const discount = Number(discountValue);

    if (originalPrice <= 0 || discount <= 0) {
      return 0;
    }

    if (discountType === "percentage") {
      if (discount > 100) {
        return 0;
      }

      return originalPrice - (originalPrice * discount) / 100;
    }

    const finalPrice = originalPrice - discount;

    return finalPrice > 0 ? finalPrice : 0;
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (productId, product) => {
    console.log("Editing product:", product);

    setId(productId);

    setName(product.name || "");
    setDescription(product.description || "");
    setCategory(product.category || "Sofas");
    setPrice(product.price ?? "");

    // ==========================================
    // OPTIONS
    // ==========================================

    if (product.attributes) {
      setMaterial(product.attributes.material || product.material || "");
      setSeating(product.attributes.seating || product.seating || "");
      setSize(product.attributes.size || "");
      setColor(product.attributes.color || "");
      setStyle(product.attributes.style || "");

      setMattressType(product.attributes.mattressType || "");
      setThickness(product.attributes.thickness || "");
      setFirmness(product.attributes.firmness || "");
    } else if (product.options) {
      setMaterial(product.options.material || "");
      setSeating(product.options.seating || "");
      setSize(product.options.size || "");
      setColor(product.options.color || "");
      setStyle(product.options.style || "");

      setMattressType(product.options.mattressType || "");
      setThickness(product.options.thickness || "");
      setFirmness(product.options.firmness || "");
    } else {
      setMaterial(product.material || "");
      setSeating(product.seating || "");
      setSize(product.size || "");
      setColor(product.color || "");
      setStyle(product.style || "");

      setMattressType("");
      setThickness("");
      setFirmness("");
    }

    // ==========================================
    // OFFER
    // ==========================================

    if (product.offer) {
      setOfferEnabled(product.offer.isActive ?? false);

      setDiscountType(product.offer.discountType || "percentage");

      setDiscountValue(product.offer.discountValue ?? "");

      setOfferTitle(product.offer.offerTitle || "");

      if (product.offer.offerEndsAt) {
        setOfferEndsAt(
          new Date(product.offer.offerEndsAt).toISOString().split("T")[0],
        );
      } else {
        setOfferEndsAt("");
      }
    } else {
      setOfferEnabled(false);
      setDiscountType("percentage");
      setDiscountValue("");
      setOfferTitle("");
      setOfferEndsAt("");
    }

    // ==========================================
    // STATUS
    // ==========================================

    setBestSeller(product.bestSeller ?? false);
    setOnStock(product.stock ?? true);

    // ==========================================
    // IMAGES
    // ==========================================

    setImage1(product.image?.[0] || "");
    setImage2(product.image?.[1] || "");
    setImage3(product.image?.[2] || "");
    setImage4(product.image?.[3] || "");

    setDoEdit(true);
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();

      // ==========================================
      // BASIC DATA
      // ==========================================

      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      // ==========================================
      // OPTIONS
      // ==========================================

      const options = {
        seating: seating || undefined,
        material: material || undefined,
        size: size || undefined,
        color: color || undefined,
        style: style || undefined,

        mattressType: mattressType || undefined,
        thickness: thickness || undefined,
        firmness: firmness || undefined,
      };

      formData.append("options", JSON.stringify(options));

      // ==========================================
      // OFFER
      // ==========================================

      const offer = {
        isActive: offerEnabled,
        discountType: offerEnabled ? discountType : "percentage",
        discountValue: offerEnabled ? Number(discountValue) : 0,
        offerTitle: offerEnabled ? offerTitle : "",
        offerEndsAt: offerEnabled && offerEndsAt ? offerEndsAt : undefined,
      };

      formData.append("offer", JSON.stringify(offer));

      // ==========================================
      // STATUS
      // ==========================================

      formData.append("bestSeller", bestSeller);
      formData.append("stock", onStock);

      // ==========================================
      // NEW IMAGES ONLY
      // ==========================================

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

      // ==========================================
      // API REQUEST
      // ==========================================

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

        setDoEdit(false);

        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ON LOAD
  // ==========================================

  useEffect(() => {
    fetchList();
  }, []);

  // ==========================================
  // IMAGE UPLOAD COMPONENT
  // ==========================================

  const ImageUpload = ({ image, setImage, id }) => {
    return (
      <label
        htmlFor={id}
        className="
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          border-gray-300
          bg-gray-50
          transition
          hover:border-black
          hover:bg-gray-100
          h-40
          sm:h-52
          flex
          flex-col
          items-center
          justify-center
          overflow-hidden
        "
      >
        {image ? (
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt=""
            className="
              h-full
              w-full
              object-contain
              p-2
            "
          />
        ) : (
          <div className="text-center">
            <MdCloudUpload size={40} className="mx-auto text-gray-500" />

            <p className="mt-2 text-sm font-medium">Upload Image</p>

            <span className="text-xs text-gray-500">PNG / JPG</span>
          </div>
        )}

        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => {
            if (e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
          id={id}
        />
      </label>
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="w-full bg-gray-50 p-3 sm:p-5 md:p-8">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-5 sm:mb-7 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          All Products
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your furniture catalog.
        </p>
      </div>

      {/* ==========================================
          PRODUCT GRID
      ========================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          sm:gap-6
          xl:grid-cols-3
          md:gap-8
        "
      >
        {list.map((product) => {
          // ==========================================
          // PRODUCT OPTIONS
          // ==========================================

          const productOptions = product.attributes || product.options || {};

          const productMaterial =
            productOptions.material || product.material || "";

          const productSeating =
            productOptions.seating || product.seating || "";

          const productSize = productOptions.size || "";

          const productColor = productOptions.color || "";

          const productStyle = productOptions.style || "";

          // ==========================================
          // MATTRESS DISPLAY VALUES
          // ==========================================

          const productMattressType = productOptions.mattressType || "";

          const productThickness = productOptions.thickness || "";

          const productFirmness = productOptions.firmness || "";

          // ==========================================
          // OFFER DATA
          // ==========================================

          const hasOffer = product.offer?.isActive === true;

          const offerTitle = product.offer?.offerTitle || "";

          const offerDiscountType = product.offer?.discountType || "percentage";

          const offerDiscountValue = Number(product.offer?.discountValue || 0);

          // ==========================================
          // CALCULATE OFFER PRICE
          // ==========================================

          let cardOfferPrice = product.price;

          if (hasOffer && offerDiscountValue > 0) {
            if (offerDiscountType === "percentage") {
              cardOfferPrice =
                product.price - (product.price * offerDiscountValue) / 100;
            } else {
              cardOfferPrice = product.price - offerDiscountValue;
            }
          }

          return (
            <div
              key={product._id}
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                sm:rounded-3xl
              "
            >
              {/* ==========================================
                  IMAGE
              ========================================== */}

              <div
                className="
                  relative
                  h-56
                  overflow-hidden
                  bg-gray-100
                  sm:h-64
                  md:h-72
                "
              >
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

                {/* ==========================================
                    CATEGORY
                ========================================== */}

                {product.category && (
                  <span
                    className="
                      absolute
                      bottom-3
                      left-3
                      rounded-full
                      bg-white/95
                      px-3
                      py-1
                      text-[10px]
                      font-semibold
                      text-gray-800
                      shadow-sm
                      sm:bottom-4
                      sm:left-4
                      sm:text-xs
                    "
                  >
                    {product.category}
                  </span>
                )}

                {/* ==========================================
                    BEST SELLER
                ========================================== */}

                {product.bestSeller && (
                  <span
                    className="
                      absolute
                      left-3
                      top-3
                      rounded-full
                      bg-black
                      px-3
                      py-1
                      text-[10px]
                      font-semibold
                      text-white
                      sm:left-4
                      sm:top-4
                      sm:px-4
                      sm:text-xs
                    "
                  >
                    BEST SELLER
                  </span>
                )}

                {/* ==========================================
                    OUT OF STOCK
                ========================================== */}

                {!product.stock && (
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      rounded-full
                      bg-red-600
                      px-3
                      py-1
                      text-[10px]
                      font-semibold
                      text-white
                      shadow-md
                      sm:right-4
                      sm:top-4
                      sm:px-4
                      sm:text-xs
                    "
                  >
                    OUT OF STOCK
                  </span>
                )}

                {/* ==========================================
                    OFFER TITLE + DISCOUNT
                    SIDE BY SIDE
                ========================================== */}

                {hasOffer && (offerTitle || offerDiscountValue > 0) && (
                  <div
                    className="
                        absolute
                        right-3
                        top-3
                        flex
                        max-w-[70%]
                        items-center
                        gap-1.5
                        sm:right-4
                        sm:top-4
                      "
                  >
                    {/* OFFER TITLE */}

                    {offerTitle && (
                      <span
                        className="
                            max-w-[150px]
                            truncate
                            rounded-full
                            bg-green-600
                            px-3
                            py-1
                            text-[10px]
                            font-semibold
                            text-white
                            shadow-md
                            sm:max-w-[180px]
                            sm:px-4
                            sm:text-xs
                          "
                      >
                        {offerTitle}
                      </span>
                    )}

                    {/* DISCOUNT */}

                    {offerDiscountValue > 0 && (
                      <span
                        className="
                            shrink-0
                            rounded-full
                            bg-green-600
                            px-3
                            py-1
                            text-[10px]
                            font-bold
                            text-white
                            shadow-md
                            sm:px-3
                            sm:text-xs
                          "
                      >
                        {offerDiscountType === "percentage"
                          ? `${offerDiscountValue}% OFF`
                          : `Rs. ${offerDiscountValue} OFF`}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ==========================================
                  DETAILS
              ========================================== */}

              <div
                className="
                  space-y-4
                  p-4
                  sm:p-5
                  md:p-6
                "
              >
                {/* ==========================================
                    NAME + PRICE
                ========================================== */}

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                  "
                >
                  <div className="min-w-0">
                    <h2
                      className="
                        truncate
                        text-lg
                        font-bold
                        text-gray-900
                        sm:text-xl
                      "
                    >
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>

                  {/* ==========================================
                      PRICE
                  ========================================== */}

                  <div className="shrink-0">
                    {hasOffer ? (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          whitespace-nowrap
                        "
                      >
                        <p
                          className="
                            text-lg
                            font-bold
                            text-black
                            sm:text-xl
                          "
                        >
                          Rs. {Number(cardOfferPrice).toLocaleString()}
                        </p>

                        <p
                          className="
                            text-sm
                            text-gray-400
                            line-through
                          "
                        >
                          Rs. {Number(product.price).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p
                        className="
                          text-xl
                          font-bold
                          text-black
                          sm:text-2xl
                        "
                      >
                        Rs. {Number(product.price || 0).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* ==========================================
                    RATING
                ========================================== */}

                <div className="flex items-center gap-2">
                  <div className="flex text-sm">
                    {"★★★★★".split("").map((star, index) => (
                      <span
                        key={index}
                        className={
                          index < Math.round(product.rating || 0)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      >
                        {star}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs text-gray-500">
                    {product.rating ? product.rating.toFixed(1) : "0.0"} (
                    {product.reviewCount || product.reviews?.length || 0}{" "}
                    reviews)
                  </span>
                </div>

                {/* ==========================================
                    SPECIFICATIONS
                ========================================== */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2
                    text-sm
                    sm:gap-3
                  "
                >
                  {/* Seating */}

                  {productSeating && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">
                        Seating
                      </p>

                      <p className="font-semibold">{productSeating}</p>
                    </div>
                  )}

                  {/* Mattress Type */}

                  {productMattressType && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">
                        Mattress Type
                      </p>

                      <p className="truncate font-semibold">
                        {productMattressType}
                      </p>
                    </div>
                  )}

                  {/* Material */}

                  {productMaterial && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">
                        Material
                      </p>

                      <p className="truncate font-semibold">
                        {productMaterial}
                      </p>
                    </div>
                  )}

                  {/* Size */}

                  {productSize && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">Size</p>

                      <p className="font-semibold">{productSize}</p>
                    </div>
                  )}

                  {/* Thickness */}

                  {productThickness && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">
                        Thickness
                      </p>

                      <p className="font-semibold">{productThickness}</p>
                    </div>
                  )}

                  {/* Firmness */}

                  {productFirmness && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">
                        Firmness
                      </p>

                      <p className="font-semibold">{productFirmness}</p>
                    </div>
                  )}

                  {/* Color */}

                  {productColor && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">Color</p>

                      <p className="truncate font-semibold">{productColor}</p>
                    </div>
                  )}

                  {/* Style */}

                  {productStyle && (
                    <div className="rounded-xl bg-gray-100 p-3">
                      <p className="text-xs text-gray-500 sm:text-sm">Style</p>

                      <p className="truncate font-semibold">{productStyle}</p>
                    </div>
                  )}
                </div>

                {/* ==========================================
                    ACTIONS
                ========================================== */}

                <div
                  className="
                    flex
                    gap-2
                    border-t
                    pt-4
                    sm:gap-3
                  "
                >
                  <button
                    onClick={() => handleEdit(product._id, product)}
                    className="
                      flex-1
                      rounded-xl
                      bg-black
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-gray-800
                      sm:py-3
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeProducts(product._id)}
                    className="
                      flex-1
                      rounded-xl
                      bg-red-600
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-red-700
                      sm:py-3
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================= */}
      {/* ================= EDIT MODAL ==================== */}
      {/* ================================================= */}

      {doEdit && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/30
            p-2
            backdrop-blur-[2px]
            sm:p-4
          "
        >
          <div
            className="
              relative
              w-full
              max-w-4xl
              max-h-[96vh]
              overflow-y-auto
              rounded-xl
              border
              border-gray-200
              bg-white
              font-sans
              shadow-2xl
              sm:max-h-[90vh]
              sm:rounded-2xl
            "
          >
            {/* ==========================================
                MODAL HEADER
            ========================================== */}

            <div
              className="
                border-b
                border-gray-200
                px-4
                py-4
                sm:px-7
                sm:py-5
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className="
                      mb-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-widest
                      text-gray-400
                      sm:text-xs
                    "
                  >
                    Product Management
                  </p>

                  <h2
                    className="
                      text-xl
                      font-bold
                      tracking-tight
                      text-gray-900
                      sm:text-2xl
                    "
                  >
                    Update Product
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-500
                      sm:text-sm
                    "
                  >
                    Modify product information, category options, images and
                    offers.
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                    sm:h-9
                    sm:w-9
                  "
                  onClick={() => setDoEdit(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ==========================================
                FORM
            ========================================== */}

            <form
              onSubmit={submitHandler}
              className="
                space-y-7
                px-4
                py-5
                sm:px-7
                sm:py-6
              "
            >
              {/* ==========================================
                  IMAGES
              ========================================== */}

              <div>
                <h3
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Product Images
                </h3>

                <p className="mb-4 text-xs text-gray-400">
                  Upload up to four product images.
                </p>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-4
                    sm:gap-4
                  "
                >
                  <ImageUpload
                    image={image1}
                    setImage={setImage1}
                    id="edit-image1"
                  />

                  <ImageUpload
                    image={image2}
                    setImage={setImage2}
                    id="edit-image2"
                  />

                  <ImageUpload
                    image={image3}
                    setImage={setImage3}
                    id="edit-image3"
                  />

                  <ImageUpload
                    image={image4}
                    setImage={setImage4}
                    id="edit-image4"
                  />
                </div>
              </div>

              {/* ==========================================
                  BASIC INFORMATION
              ========================================== */}

              <div>
                <h3
                  className="
                    mb-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Product Name
                    </label>

                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-50
                        px-4
                        py-2.5
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        focus:border-gray-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-gray-200
                      "
                    />
                  </div>

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Product Description
                    </label>

                    <textarea
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      value={description}
                      required
                      className="
                        w-full
                        resize-none
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-50
                        px-4
                        py-2.5
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        focus:border-gray-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-gray-200
                      "
                    />
                  </div>
                </div>
              </div>

              {/* ==========================================
                  CATEGORY
              ========================================== */}

              <div>
                <h3
                  className="
                    mb-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Category
                </h3>

                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-gray-50
                    px-4
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-gray-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-gray-200
                  "
                >
                  <option value="Sofas">Sofas</option>
                  <option value="Beds">Beds</option>
                  <option value="Mattress">Mattress</option>
                  <option value="Almirahs">Almirahs</option>
                  <option value="Tables">Tables</option>
                  <option value="TV Units">TV Units</option>
                </select>
              </div>

              {/* ==========================================
                  CATEGORY OPTIONS
              ========================================== */}

              <div>
                <h3
                  className="
                    mb-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  {category} Options
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  {/* SOFA SEATING */}

                  {category === "Sofas" && (
                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Seating Capacity
                      </label>

                      <select
                        value={seating}
                        onChange={(e) => setSeating(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-gray-50
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:border-gray-500
                          focus:bg-white
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      >
                        <option value="">Select Seating</option>

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

                  {/* MATTRESS TYPE */}

                  {category === "Mattress" && (
                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Mattress Type
                      </label>

                      <select
                        value={mattressType}
                        onChange={(e) => setMattressType(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-gray-50
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:border-gray-500
                          focus:bg-white
                          focus:ring-2
                          focus:ring-gray-200
                        "
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

                  {/* MATERIAL */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Material
                    </label>

                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-50
                        px-4
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-gray-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-gray-200
                      "
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
                      ) : category === "Mattress" ? (
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

                          <option value="Engineered Wood">
                            Engineered Wood
                          </option>

                          <option value="Metal">Metal</option>

                          <option value="Glass">Glass</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* SIZE */}

                  {category !== "Sofas" && (
                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Size
                      </label>

                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-gray-50
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:border-gray-500
                          focus:bg-white
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      >
                        <option value="">Select Size</option>

                        {category === "Beds" || category === "Mattress" ? (
                          <>
                            <option value="Single">Single</option>

                            <option value="Double">Double</option>

                            <option value="Queen">Queen</option>

                            <option value="King">King</option>

                            {category === "Mattress" && (
                              <option value="Custom">Custom</option>
                            )}
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

                  {/* THICKNESS */}

                  {category === "Mattress" && (
                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Thickness
                      </label>

                      <select
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-gray-50
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:border-gray-500
                          focus:bg-white
                          focus:ring-2
                          focus:ring-gray-200
                        "
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

                  {/* FIRMNESS */}

                  {category === "Mattress" && (
                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Firmness
                      </label>

                      <select
                        value={firmness}
                        onChange={(e) => setFirmness(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-gray-50
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:border-gray-500
                          focus:bg-white
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      >
                        <option value="">Select Firmness</option>

                        <option value="Soft">Soft</option>

                        <option value="Medium">Medium</option>

                        <option value="Medium Firm">Medium Firm</option>

                        <option value="Firm">Firm</option>
                      </select>
                    </div>
                  )}

                  {/* COLOR */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Color
                    </label>

                    <input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Walnut Brown"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-50
                        px-4
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-gray-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-gray-200
                      "
                    />
                  </div>

                  {/* STYLE */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Style
                    </label>

                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-50
                        px-4
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-gray-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-gray-200
                      "
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

              {/* ==========================================
                  PRICE
              ========================================== */}

              <div>
                <h3
                  className="
                    mb-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Pricing
                </h3>

                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Price
                </label>

                <div className="relative">
                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-gray-500
                    "
                  >
                    Rs.
                  </span>

                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    min="0"
                    value={price}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-gray-50
                      py-2.5
                      pl-11
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      focus:border-gray-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-gray-200
                    "
                  />
                </div>
              </div>

              {/* ==========================================
                  OFFER
              ========================================== */}

              <div
                className="
                  rounded-2xl
                  border
                  bg-gray-50
                  p-5
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    justify-between
                    gap-4
                    sm:flex-row
                    sm:items-center
                  "
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      Product Offer
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Manage discounts and promotional pricing.
                    </p>
                  </div>

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                    "
                  >
                    <input
                      type="checkbox"
                      checked={offerEnabled}
                      onChange={() => setOfferEnabled(!offerEnabled)}
                      className="
                        h-5
                        w-5
                        accent-black
                      "
                    />

                    <span className="text-sm font-semibold">Enable Offer</span>
                  </label>
                </div>

                {offerEnabled && (
                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    {/* DISCOUNT TYPE */}

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Discount Type
                      </label>

                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      >
                        <option value="percentage">Percentage</option>

                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    {/* DISCOUNT VALUE */}

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        {discountType === "percentage"
                          ? "Discount %"
                          : "Discount Amount"}
                      </label>

                      <input
                        type="number"
                        min="1"
                        max={discountType === "percentage" ? "100" : undefined}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder={
                          discountType === "percentage" ? "20" : "1000"
                        }
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      />
                    </div>

                    {/* OFFER TITLE */}

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Offer Title
                      </label>

                      <input
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        placeholder="Dashain Offer"
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      />
                    </div>

                    {/* END DATE */}

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Offer Ends
                      </label>

                      <input
                        type="date"
                        value={offerEndsAt}
                        onChange={(e) => setOfferEndsAt(e.target.value)}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          outline-none
                          focus:ring-2
                          focus:ring-gray-200
                        "
                      />
                    </div>

                    {/* OFFER PRICE */}

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Offer Price
                      </label>

                      <div
                        className="
                          rounded-lg
                          border
                          bg-white
                          px-4
                          py-2.5
                        "
                      >
                        <p className="text-lg font-bold text-gray-900">
                          Rs.{" "}
                          {calculateOfferPrice()
                            ? calculateOfferPrice().toLocaleString()
                            : "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==========================================
                  STATUS
              ========================================== */}

              <div>
                <h3
                  className="
                    mb-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Product Status
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  {/* BEST SELLER */}

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      transition
                      hover:border-gray-400
                      hover:bg-white
                    "
                  >
                    <input
                      type="checkbox"
                      onChange={() => setBestSeller(!bestSeller)}
                      checked={bestSeller}
                      className="
                        h-4
                        w-4
                        rounded
                        border-gray-300
                      "
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

                  {/* STOCK */}

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      transition
                      hover:border-gray-400
                      hover:bg-white
                    "
                  >
                    <input
                      type="checkbox"
                      checked={onStock}
                      onChange={() => setOnStock(!onStock)}
                      className="
                        h-4
                        w-4
                        rounded
                        border-gray-300
                      "
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

              {/* ==========================================
                  SUBMIT
              ========================================== */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-gray-200
                  pt-5
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={() => setDoEdit(false)}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-100
                    sm:w-auto
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    rounded-lg
                    bg-gray-900
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-gray-800
                    disabled:cursor-not-allowed
                    disabled:bg-gray-500
                    sm:w-auto
                  "
                >
                  {loading ? "Saving..." : "Save Changes"}
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
