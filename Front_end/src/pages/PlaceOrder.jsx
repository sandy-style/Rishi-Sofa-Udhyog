import React, { useState, useContext } from "react";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { ShopContext } from "../context/shopContext";
import { toast } from "react-toastify";
import Agreement from "../components/Agreement";

const PlaceOrder = ({ setShowLogin }) => {
  const {
    totalAmount,
    setCartItem,
    cartItem,
    navigate,
    products,
    token,
    getCartCount,
  } = useContext(ShopContext);

  // ============================================
  // STATES
  // ============================================

  const [payMethod, setPayMethod] = useState("COD");

  // Controls Agreement popup
  const [showAgreement, setShowAgreement] = useState(false);

  // Stores whether user accepted the agreement
  const [terms, setTerms] = useState(false);

  // ============================================
  // NEPAL PROVINCES & DISTRICTS
  // ============================================

  const districtsByProvince = {
    Koshi: [
      "Bhojpur",
      "Dhankuta",
      "Ilam",
      "Jhapa",
      "Khotang",
      "Morang",
      "Okhaldhunga",
      "Panchthar",
      "Sankhuwasabha",
      "Solukhumbu",
      "Sunsari",
      "Taplejung",
      "Terhathum",
      "Udayapur",
    ],

    Madhesh: [
      "Bara",
      "Dhanusha",
      "Mahottari",
      "Parsa",
      "Rautahat",
      "Saptari",
      "Sarlahi",
      "Siraha",
    ],

    Bagmati: [
      "Bhaktapur",
      "Chitwan",
      "Dhading",
      "Dolakha",
      "Kathmandu",
      "Kavrepalanchok",
      "Lalitpur",
      "Makwanpur",
      "Nuwakot",
      "Ramechhap",
      "Rasuwa",
      "Sindhuli",
      "Sindhupalchok",
    ],

    Gandaki: [
      "Baglung",
      "Gorkha",
      "Kaski",
      "Lamjung",
      "Manang",
      "Mustang",
      "Myagdi",
      "Nawalpur",
      "Parbat",
      "Syangja",
      "Tanahun",
    ],

    Lumbini: [
      "Arghakhanchi",
      "Banke",
      "Bardiya",
      "Dang",
      "Gulmi",
      "Kapilvastu",
      "Nawalparasi West",
      "Palpa",
      "Pyuthan",
      "Rolpa",
      "Rukum East",
      "Rupandehi",
    ],

    Karnali: [
      "Dailekh",
      "Dolpa",
      "Humla",
      "Jajarkot",
      "Jumla",
      "Kalikot",
      "Mugu",
      "Rukum West",
      "Salyan",
      "Surkhet",
    ],

    Sudurpaschim: [
      "Achham",
      "Baitadi",
      "Bajhang",
      "Bajura",
      "Dadeldhura",
      "Darchula",
      "Doti",
      "Kailali",
      "Kanchanpur",
    ],
  };

  // ============================================
  // FORM DATA
  // ============================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    district: "",
    country: "Nepal",
  });

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({
      ...data,
      [name]: value,

      // Reset district whenever province changes
      ...(name === "province" && {
        district: "",
      }),
    }));
  };

  // ============================================
  // STEP 1
  // VALIDATE CHECKOUT & OPEN AGREEMENT
  // ============================================

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check login
    if (!token) {
      setShowLogin(true);
      return;
    }

    // Check cart
    if (getCartCount() === 0) {
      navigate("/collection");
      toast.error("Please add to cart");
      return;
    }

    // Everything is okay
    // Open Terms & Agreement popup
    setShowAgreement(true);
  };

  // ============================================
  // STEP 2
  // ACTUALLY PLACE ORDER
  // ============================================

  const placeOrder = async () => {
    try {
      let orderItems = [];

      // Build order items
      for (const itemId in cartItem) {
        const product = products.find((p) => p._id === itemId);

        if (!product) {
          continue;
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: cartItem[itemId],
        });
      }

      // Make sure items exist
      if (orderItems.length === 0) {
        toast.error("Unable to create order");
        return;
      }

      // Order data
      const orderData = {
        items: orderItems,
        address: formData,

        // Delivery fee is negotiated separately
        // based on customer's location.
        amount: totalAmount(),
      };

      // ==========================================
      // PAYMENT METHOD
      // ==========================================

      switch (payMethod) {
        // ========================================
        // COD
        // ========================================

        case "COD": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            {
              headers: {
                token,
              },
            },
          );

          if (response.data.success) {
            toast.success(response.data.message);

            // Empty cart
            setCartItem({});

            // Reset agreement state
            setTerms(false);
            setShowAgreement(false);

            // Go to orders
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }

          break;
        }

        // ========================================
        // ESEWA
        // ========================================

        case "esewa": {
          toast.info("eSewa payment is not available yet");
          break;
        }

        // ========================================
        // KHALTI
        // ========================================

        case "khalti": {
          toast.info("Khalti payment is not available yet");
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  // ============================================
  // GET AVAILABLE DISTRICTS
  // ============================================

  const availableDistricts = districtsByProvince[formData.province] || [];

  // ============================================
  // RETURN
  // ============================================

  return (
    <>
      {/* ========================================
          CHECKOUT FORM
      ======================================== */}

      <form onSubmit={onSubmitHandler}>
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* ==================================
                DELIVERY DETAILS
            ================================== */}

            <div className="flex-1 bg-white shadow-lg border border-[#DED7CE] rounded-3xl p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-['Cormorant_Garamond'] text-[#231F1C]">
                  Delivery Details
                </h2>

                <p className="text-sm text-[#6D655D] mt-1">
                  Fill in your shipping information.
                </p>
              </div>

              <div className="space-y-5">
                {/* FIRST & LAST NAME */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    onChange={onChangeHandler}
                    name="firstName"
                    value={formData.firstName}
                    type="text"
                    placeholder="First Name"
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                    required
                  />

                  <input
                    onChange={onChangeHandler}
                    name="lastName"
                    value={formData.lastName}
                    type="text"
                    placeholder="Last Name"
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                    required
                  />
                </div>

                {/* EMAIL & PHONE */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    type="email"
                    placeholder="Email Address"
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                    required
                  />

                  <input
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                    required
                  />
                </div>

                {/* STREET */}

                <input
                  onChange={onChangeHandler}
                  name="street"
                  value={formData.street}
                  type="text"
                  placeholder="Street Address"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                  required
                />

                {/* APARTMENT */}

                <input
                  type="text"
                  placeholder="Apartment, Suite (Optional)"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />

                {/* CITY & PROVINCE */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    onChange={onChangeHandler}
                    name="city"
                    value={formData.city}
                    type="text"
                    placeholder="City"
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                    required
                  />

                  <select
                    onChange={onChangeHandler}
                    name="province"
                    value={formData.province}
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] outline-none focus:border-[#C99658] transition text-[#6D655D]"
                    required
                  >
                    <option value="">Select Province</option>

                    <option value="Koshi">Koshi</option>

                    <option value="Madhesh">Madhesh</option>

                    <option value="Bagmati">Bagmati</option>

                    <option value="Gandaki">Gandaki</option>

                    <option value="Lumbini">Lumbini</option>

                    <option value="Karnali">Karnali</option>

                    <option value="Sudurpaschim">Sudurpashchim</option>
                  </select>
                </div>

                {/* DISTRICT */}

                <select
                  onChange={onChangeHandler}
                  name="district"
                  value={formData.district}
                  disabled={!formData.province}
                  className={`w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4] outline-none focus:border-[#C99658] transition text-[#6D655D] ${
                    !formData.province ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  required
                >
                  <option value="">
                    {formData.province
                      ? "Select District"
                      : "Select Province First"}
                  </option>

                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                {/* COUNTRY */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value="Nepal"
                    readOnly
                    className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#EFEAE3] text-[#6D655D]"
                  />
                </div>
              </div>
            </div>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <div className="w-full lg:w-[360px]">
              <div className="sticky top-24 bg-white border border-[#DED7CE] rounded-3xl p-6">
                {/* CART TOTAL */}

                <CartTotal />

                {/* PAYMENT METHOD */}

                <div className="w-full rounded-xl border border-gray-200 p-4 bg-white flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Payment Method
                  </h3>

                  <div className="flex flex-col gap-4">
                    {/* ESEWA */}

                    <div
                      onClick={() => setPayMethod("esewa")}
                      className={`${
                        payMethod === "esewa" ? "bg-green-100" : ""
                      } flex items-center justify-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition`}
                    >
                      <img
                        src={assets.esewa_logo}
                        alt="eSewa"
                        className="w-20 object-fill"
                      />
                    </div>

                    {/* KHALTI */}

                    <div
                      onClick={() => setPayMethod("khalti")}
                      className={`${
                        payMethod === "khalti" ? "bg-purple-100" : ""
                      } flex items-center justify-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition`}
                    >
                      <img
                        src={assets.khalti_logo}
                        alt="Khalti"
                        className="h-8 object-contain"
                      />
                    </div>

                    {/* COD */}

                    <div
                      onClick={() => setPayMethod("COD")}
                      className={`${
                        payMethod === "COD" ? "bg-orange-100" : ""
                      } flex items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition`}
                    >
                      <span className="font-medium text-gray-700">
                        Cash on Delivery
                      </span>
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="w-full mt-6 py-3 rounded-xl bg-[#231F1C] text-white hover:bg-[#C99658] hover:text-[#231F1C] transition-all duration-300 font-medium"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ========================================
          TERMS & AGREEMENT POPUP
      ======================================== */}

      {showAgreement && (
        <Agreement
          onClose={() => {
            setShowAgreement(false);
          }}
          onAccept={() => {
            // Mark terms as accepted
            setTerms(true);

            // Close popup
            setShowAgreement(false);

            // NOW actually place the order
            placeOrder();
          }}
        />
      )}
    </>
  );
};

export default PlaceOrder;
