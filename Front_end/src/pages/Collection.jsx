import React, { useEffect, useState, useContext } from "react";
import { FiSliders, FiX, FiChevronDown } from "react-icons/fi";
import { ShopContext } from "../context/shopContext";
import ProductCard from "../components/ProductCard";
import Search from "../components/Search";

const Collection = () => {
  const { products, search } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  const [bestSeller, setBestSeller] = useState(false);
  const [material, setMaterial] = useState("");
  const [seat, setSeat] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [sortType, setSortType] = useState("Featured");

  // =========================================================
  // SCROLL TO TOP
  // =========================================================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // FILTER + SORT PRODUCTS
  // =========================================================

  useEffect(() => {
    let productCopy = [...products];

    // Best Seller
    if (bestSeller) {
      productCopy = productCopy.filter((item) => item.bestSeller === true);
    }

    // Material
    if (material) {
      productCopy = productCopy.filter(
        (item) => item.material?.toLowerCase() === material.toLowerCase(),
      );
    }

    // Seating
    if (seat) {
      productCopy = productCopy.filter((item) => item.seating === seat);
    }

    // Price
    if (priceRange) {
      productCopy = productCopy.filter((item) => {
        const price = Number(item.price);

        switch (priceRange) {
          case "under25":
            return price <= 25000;

          case "25to35":
            return price > 25000 && price <= 35000;

          case "35to50":
            return price > 35000 && price <= 50000;

          case "above50":
            return price > 50000;

          default:
            return true;
        }
      });
    }

    // Search
    if (search) {
      productCopy = productCopy.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sorting
    switch (sortType) {
      case "HTL":
        productCopy.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "LTH":
        productCopy.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "New":
        productCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;

      default:
        break;
    }

    setFilterProducts(productCopy);
  }, [products, bestSeller, material, seat, priceRange, search, sortType]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setBestSeller(false);
    setMaterial("");
    setSeat("");
    setPriceRange("");
  };

  // =========================================================
  // FILTER HANDLER
  // =========================================================

  const handleFilterChange = (setter, value) => {
    setter(value);

    if (window.innerWidth < 1024) {
      setShowFilter(false);
    }
  };

  // =========================================================
  // ACTIVE FILTER COUNT
  // =========================================================

  const activeFilterCount = [bestSeller, material, seat, priceRange].filter(
    Boolean,
  ).length;

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F8F5F0] pb-20">
      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="pt-5 sm:pt-7">
        <Search />
      </div>

      {/* =====================================================
          COLLECTION HEADER
      ===================================================== */}

      <section className="mx-auto max-w-[1500px] px-3 pt-8 sm:px-5 sm:pt-10 lg:px-8">
        <div
          className="
            flex
            flex-col
            gap-6
            border-b
            border-[#DCD2C8]
            pb-6

            sm:gap-7
            sm:pb-7

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* ================= LEFT TITLE ================= */}

          <div>
            {/* Small eyebrow */}

            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="h-px w-8 bg-[#80634B] sm:w-10" />

              <span
                className="
                  font-manrope
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.25em]
                  text-[#80634B]

                  sm:text-xs
                "
              >
                Furniture Collection
              </span>
            </div>

            {/* Main heading */}

            <h1
              className="
                font-heading
                text-[42px]
                font-semibold
                leading-none
                tracking-[-0.035em]
                text-[#29231F]

                sm:text-5xl
                md:text-6xl
              "
            >
              Sofas
            </h1>

            <p
              className="
                mt-3
                max-w-lg
                font-manrope
                text-xs
                font-medium
                leading-5
                text-[#74685E]

                sm:mt-4
                sm:text-sm
                sm:leading-6
              "
            >
              Discover sofas designed to bring comfort, character, and timeless
              elegance into your home.
            </p>
          </div>

          {/* ================= RIGHT CONTROLS ================= */}

          <div
            className="
              flex
              w-full
              items-center
              gap-2

              sm:gap-3

              lg:w-auto
            "
          >
            {/* FILTER BUTTON */}

            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#D5C9BE]
                bg-[#FBF8F4]
                px-4
                py-3

                font-manrope
                text-xs
                font-extrabold
                uppercase
                tracking-[0.08em]
                text-[#40362F]

                shadow-sm
                transition-all
                duration-300

                hover:border-[#80634B]
                hover:bg-[#F0E7DE]

                sm:flex-none
                sm:px-5
                sm:text-sm
              "
            >
              {showFilter ? (
                <FiX size={17} strokeWidth={2.5} />
              ) : (
                <FiSliders size={17} strokeWidth={2.5} />
              )}

              <span>{showFilter ? "Close" : "Filters"}</span>

              {activeFilterCount > 0 && (
                <span
                  className="
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#80634B]
                    px-1.5

                    font-manrope
                    text-[10px]
                    font-extrabold
                    text-white
                  "
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* SORT */}

            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="
                  appearance-none
                  rounded-xl
                  border
                  border-[#D5C9BE]
                  bg-[#FBF8F4]
                  py-3
                  pl-4
                  pr-10

                  font-manrope
                  text-xs
                  font-extrabold
                  text-[#40362F]

                  outline-none
                  shadow-sm
                  transition-all

                  focus:border-[#80634B]
                  focus:ring-1
                  focus:ring-[#80634B]/20

                  sm:text-sm
                "
              >
                <option value="Featured">Featured</option>

                <option value="LTH">Price: Low to High</option>

                <option value="HTL">Price: High to Low</option>

                <option value="New">Newest</option>
              </select>

              <FiChevronDown
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#80634B]
                "
                size={15}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTER PANEL
      ===================================================== */}

      <section className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">
        <div
          className={`
            overflow-hidden
            transition-all
            duration-500

            ${
              showFilter
                ? "mt-5 max-h-[1200px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              rounded-2xl
              border
              border-[#DED4CA]
              bg-[#FBF8F4]
              p-5

              shadow-[0_10px_30px_rgba(74,55,40,0.06)]

              sm:p-6
              lg:p-7
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-7

                sm:grid-cols-2

                lg:grid-cols-4
              "
            >
              {/* =================================================
                  BEST SELLER
              ================================================= */}

              <div>
                <p
                  className="
                    mb-4
                    font-manrope
                    text-xs
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-[#80634B]
                  "
                >
                  Collection
                </p>

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
                    checked={bestSeller}
                    onChange={(e) =>
                      handleFilterChange(setBestSeller, e.target.checked)
                    }
                    className="
                      h-5
                      w-5
                      cursor-pointer
                      accent-[#80634B]
                    "
                  />

                  <span
                    className="
                      font-manrope
                      text-sm
                      font-extrabold
                      text-[#3F352E]

                      sm:text-base
                    "
                  >
                    Best Sellers
                  </span>
                </label>
              </div>

              {/* =================================================
                  MATERIAL
              ================================================= */}

              <div>
                <p
                  className="
                    mb-4
                    font-manrope
                    text-xs
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-[#80634B]
                  "
                >
                  Material
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    ["fabric", "Fabric"],
                    ["leather", "Leather"],
                    ["velvet", "Velvet"],
                    ["linen", "Linen"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          setMaterial,
                          material === value ? "" : value,
                        )
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2

                        font-manrope
                        text-xs
                        font-bold

                        transition-all
                        duration-200

                        ${
                          material === value
                            ? "border-[#80634B] bg-[#80634B] text-white shadow-sm"
                            : "border-[#D5C9BE] bg-white text-[#4E433A] hover:border-[#80634B] hover:bg-[#F1E8DE]"
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* =================================================
                  SEATING
              ================================================= */}

              <div>
                <p
                  className="
                    mb-4
                    font-manrope
                    text-xs
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-[#80634B]
                  "
                >
                  Seating
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "1 Seater",
                    "2 Seater",
                    "3 Seater",
                    "4 Seater",
                    "5 Seater",
                    "6 Seater",
                    "L Shape",
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          setSeat,
                          seat === option ? "" : option,
                        )
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2

                        font-manrope
                        text-xs
                        font-bold

                        transition-all
                        duration-200

                        ${
                          seat === option
                            ? "border-[#80634B] bg-[#80634B] text-white shadow-sm"
                            : "border-[#D5C9BE] bg-white text-[#4E433A] hover:border-[#80634B] hover:bg-[#F1E8DE]"
                        }
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div>
                <p
                  className="
                    mb-4
                    font-manrope
                    text-xs
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-[#80634B]
                  "
                >
                  Price Range
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    ["under25", "Under 25K"],
                    ["25to35", "25K – 35K"],
                    ["35to50", "35K – 50K"],
                    ["above50", "50K+"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          setPriceRange,
                          priceRange === value ? "" : value,
                        )
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2

                        font-manrope
                        text-xs
                        font-bold

                        transition-all
                        duration-200

                        ${
                          priceRange === value
                            ? "border-[#80634B] bg-[#80634B] text-white shadow-sm"
                            : "border-[#D5C9BE] bg-white text-[#4E433A] hover:border-[#80634B] hover:bg-[#F1E8DE]"
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CLEAR FILTERS */}

            {activeFilterCount > 0 && (
              <div
                className="
                  mt-7
                  flex
                  justify-end
                  border-t
                  border-[#E3D9D0]
                  pt-5
                "
              >
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    font-manrope
                    text-xs
                    font-extrabold
                    uppercase
                    tracking-[0.12em]
                    text-[#80634B]
                    underline
                    underline-offset-4

                    transition

                    hover:text-[#3F3025]
                  "
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ACTIVE FILTERS
      ===================================================== */}

      {activeFilterCount > 0 && (
        <section className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span
              className="
                mr-1
                font-manrope
                text-xs
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-[#76685D]
              "
            >
              Active
            </span>

            {bestSeller && (
              <span
                className="
                  rounded-full
                  bg-[#E9DED2]
                  px-4
                  py-2
                  font-manrope
                  text-xs
                  font-bold
                  text-[#55463A]
                "
              >
                Best Seller
              </span>
            )}

            {material && (
              <span
                className="
                  rounded-full
                  bg-[#E9DED2]
                  px-4
                  py-2
                  font-manrope
                  text-xs
                  font-bold
                  capitalize
                  text-[#55463A]
                "
              >
                {material}
              </span>
            )}

            {seat && (
              <span
                className="
                  rounded-full
                  bg-[#E9DED2]
                  px-4
                  py-2
                  font-manrope
                  text-xs
                  font-bold
                  text-[#55463A]
                "
              >
                {seat}
              </span>
            )}

            {priceRange && (
              <span
                className="
                  rounded-full
                  bg-[#E9DED2]
                  px-4
                  py-2
                  font-manrope
                  text-xs
                  font-bold
                  text-[#55463A]
                "
              >
                {priceRange === "under25" && "Under 25K"}
                {priceRange === "25to35" && "25K – 35K"}
                {priceRange === "35to50" && "35K – 50K"}
                {priceRange === "above50" && "50K+"}
              </span>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">
        {filterProducts.length > 0 ? (
          <div
            className="
              mt-8
              grid
              grid-cols-2
              gap-x-3
              gap-y-7

              sm:mt-10
              sm:gap-x-5
              sm:gap-y-10

              md:grid-cols-3

              lg:grid-cols-3
              lg:gap-x-6
              lg:gap-y-12

              xl:grid-cols-4
            "
          >
            {filterProducts.map((item) => (
              <ProductCard
                key={item._id}
                name={item.name}
                id={item._id}
                image={item.image?.[0]}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              mt-10
              flex
              min-h-[320px]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-[#D8CEC3]
              bg-[#FBF8F4]
            "
          >
            <div className="px-5 text-center">
              <p
                className="
                  font-heading
                  text-3xl
                  font-semibold
                  text-[#3B2B20]
                "
              >
                No sofas found
              </p>

              <p
                className="
                  mt-2
                  font-manrope
                  text-sm
                  font-medium
                  text-[#81746A]
                "
              >
                Try changing or clearing your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  mt-5
                  rounded-xl
                  bg-[#332A24]
                  px-6
                  py-3

                  font-manrope
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-[0.1em]
                  text-white

                  transition-all
                  duration-300

                  hover:bg-[#80634B]
                  hover:-translate-y-0.5
                "
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Collection;
