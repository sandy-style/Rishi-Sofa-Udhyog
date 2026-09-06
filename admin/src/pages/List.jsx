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
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState("");
  const [seating, setseating] = useState("");
  const [bestSeller, setBestSeller] = useState(null);
  const [onStock, setOnStock] = useState(null);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  // ================= FETCH PRODUCTS =================

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

  // ================= REMOVE PRODUCT =================

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

  // ================= EDIT PRODUCT =================

  const handleEdit = async (id, product) => {
    console.log(product);

    setImage1(product.image[0] || "");
    setImage2(product.image[1] || "");
    setImage3(product.image[2] || "");
    setImage4(product.image[3] || "");

    setName(product.name);
    setDescription(product.description);
    setMaterial(product.material);
    setPrice(product.price);
    setseating(product.seating);
    setBestSeller(product.bestSeller);
    setOnStock(product.stock);

    setId(id);
    setDoEdit(true);
  };

  // ================= UPDATE PRODUCT =================

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

  // ================= IMAGE UPLOAD COMPONENT =================

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
            className="h-full w-full object-contain p-2"
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
          accept="image/png,image/jpeg"
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

  return (
    <div className="w-full p-3 sm:p-5 md:p-8">
      {/* ================= PAGE HEADER ================= */}

      <h1 className="mb-5 text-2xl font-bold sm:mb-7 sm:text-3xl md:mb-8">
        All Products
      </h1>

      {/* ================= PRODUCT GRID ================= */}

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
        {list.map((product) => (
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
            {/* ================= IMAGE ================= */}

            <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-64 md:h-72">
              <img
                src={product.image[0]}
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
                    sm:right-4
                    sm:top-4
                    sm:px-4
                    sm:text-xs
                  "
                >
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* ================= DETAILS ================= */}

            <div className="space-y-4 p-4 sm:p-5 md:p-6">
              {/* Name + Price */}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                    {product.name}
                  </h2>

                  <p className="mt-1 text-sm capitalize text-gray-500">
                    {product.material}
                  </p>
                </div>

                <p className="shrink-0 text-xl font-bold text-black sm:text-2xl">
                  Rs. {product.price}
                </p>
              </div>

              {/* Specifications */}

              <div className="grid grid-cols-2 gap-2 text-sm sm:gap-3">
                <div className="rounded-xl bg-gray-100 p-3">
                  <p className="text-xs text-gray-500 sm:text-sm">Seating</p>

                  <p className="font-semibold">{product.seating}</p>
                </div>

                <div className="rounded-xl bg-gray-100 p-3">
                  <p className="text-xs text-gray-500 sm:text-sm">Material</p>

                  <p className="truncate font-semibold capitalize">
                    {product.material}
                  </p>
                </div>
              </div>

              {/* Actions */}

              <div className="flex gap-2 border-t pt-4 sm:gap-3">
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
        ))}
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
              max-w-3xl
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
            {/* ================= MODAL HEADER ================= */}

            <div className="border-b border-gray-200 px-4 py-4 sm:px-7 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 sm:text-xs">
                    Product Management
                  </p>

                  <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    Update Product
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Modify the information, images and availability of this
                    sofa.
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

            {/* ================= FORM ================= */}

            <form
              onSubmit={submitHandler}
              className="space-y-6 px-4 py-5 sm:space-y-7 sm:px-7 sm:py-6"
            >
              {/* ================= IMAGES ================= */}

              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Product Images
                </h3>

                <p className="mb-4 text-xs text-gray-400">
                  Upload up to four images of the sofa.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  <ImageUpload
                    image={image1}
                    setImage={setImage1}
                    id="image1"
                  />

                  <ImageUpload
                    image={image2}
                    setImage={setImage2}
                    id="image2"
                  />

                  <ImageUpload
                    image={image3}
                    setImage={setImage3}
                    id="image3"
                  />

                  <ImageUpload
                    image={image4}
                    setImage={setImage4}
                    id="image4"
                  />
                </div>
              </div>

              {/* ================= BASIC INFORMATION ================= */}

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  {/* Name */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Product Name
                    </label>

                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
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

                  {/* Description */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Product Description
                    </label>

                    <textarea
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      value={description}
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
                      onChange={(e) => setMaterial(e.target.value)}
                      value={material}
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
                        value={price}
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
                </div>
              </div>

              {/* ================= STATUS ================= */}

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Product Status
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Best Seller */}

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

                  {/* Stock */}

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
