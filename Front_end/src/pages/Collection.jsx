import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { FiSliders, FiX, FiChevronDown, FiPlus } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import ProductCard from "../components/ProductCard";
import Search from "../components/Search";

const Collection = () => {
  const { products, search } = useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);

  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [type, setType] = useState("");
  const [style, setStyle] = useState("");
  const [seat, setSeat] = useState("");
  const [size, setSize] = useState("");
  const [mattressType, setMattressType] = useState("");
  const [firmness, setFirmness] = useState("");
  const [thickness, setThickness] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [sortType, setSortType] = useState("Featured");
  const [visibleCount, setVisibleCount] = useState(12);

  const loadMoreRef = useRef(null);

  // Prevent the URL-sync effect from overwriting browser
  // back/forward navigation.
  const applyingUrlRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const normalize = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim().toLowerCase();
  };

  const getValue = (item, ...keys) => {
    for (const key of keys) {
      const directValue = item?.[key];

      if (
        directValue !== undefined &&
        directValue !== null &&
        directValue !== ""
      ) {
        return directValue;
      }

      const attributeValue = item?.attributes?.[key];

      if (
        attributeValue !== undefined &&
        attributeValue !== null &&
        attributeValue !== ""
      ) {
        return attributeValue;
      }
    }

    return "";
  };

  const getCategoryLabel = (value) => {
    if (!value) return "";

    return String(value)
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getProductCategory = (item) =>
    normalize(getValue(item, "category", "productCategory"));

  const getProductMaterial = (item) => getValue(item, "material");

  const getProductType = (item) =>
    getValue(
      item,
      "type",
      "productType",
      "bedType",
      "tableType",
      "almirahType",
      "tvUnitType",
    );

  const getProductStyle = (item) => getValue(item, "style");

  const getProductSeat = (item) => getValue(item, "seating", "seat", "seater");

  const getProductSize = (item) => getValue(item, "size");

  const getProductMattressType = (item) => getValue(item, "mattressType");

  const getProductFirmness = (item) => getValue(item, "firmness");

  const getProductThickness = (item) => getValue(item, "thickness");

  const hasActiveOffer = (item) => {
    const offer = item?.offer;

    const active =
      offer?.isActive === true ||
      offer?.isActive === "true" ||
      offer?.isActive === 1 ||
      offer?.isActive === "1";

    const discountValue = Number(offer?.discountValue || 0);

    const discountType = offer?.discountType;

    return (
      active &&
      discountValue > 0 &&
      (discountType === "percentage" || discountType === "flat")
    );
  };

  const uniqueValues = (items, getter) => {
    const values = [];

    items.forEach((item) => {
      const value = getter(item);

      if (Array.isArray(value)) {
        value.forEach((entry) => {
          if (entry !== undefined && entry !== null && entry !== "") {
            values.push(String(entry));
          }
        });
      } else if (value !== undefined && value !== null && value !== "") {
        values.push(String(value));
      }
    });

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  };

  /* =========================================================
     URL PARAMETER -> STATE
     ========================================================= */

  useEffect(() => {
    applyingUrlRef.current = true;

    const urlCategory = searchParams.get("category") || "";

    const urlBestSeller = searchParams.get("bestSeller") === "true";

    const urlOffers =
      searchParams.get("offers") === "true" ||
      searchParams.get("offer") === "true";

    const urlMaterial = searchParams.get("material") || "";
    const urlType = searchParams.get("type") || "";
    const urlStyle = searchParams.get("style") || "";
    const urlSeat = searchParams.get("seat") || "";
    const urlSize = searchParams.get("size") || "";
    const urlMattressType = searchParams.get("mattressType") || "";
    const urlFirmness = searchParams.get("firmness") || "";
    const urlThickness = searchParams.get("thickness") || "";
    const urlPriceRange =
      searchParams.get("price") || searchParams.get("priceRange") || "";

    const urlSort = searchParams.get("sort") || "Featured";

    setCategory(urlCategory);
    setBestSeller(urlBestSeller);
    setOffersOnly(urlOffers);
    setMaterial(urlMaterial);
    setType(urlType);
    setStyle(urlStyle);
    setSeat(urlSeat);
    setSize(urlSize);
    setMattressType(urlMattressType);
    setFirmness(urlFirmness);
    setThickness(urlThickness);
    setPriceRange(urlPriceRange);

    if (["Featured", "LTH", "HTL", "New"].includes(urlSort)) {
      setSortType(urlSort);
    } else {
      setSortType("Featured");
    }

    // Allow the next state-sync cycle to happen normally.
    setTimeout(() => {
      applyingUrlRef.current = false;
    }, 0);
  }, [searchParams]);

  /* =========================================================
     STATE -> URL PARAMETER
     ========================================================= */

  useEffect(() => {
    if (applyingUrlRef.current) return;

    const params = new URLSearchParams();

    if (category) {
      params.set("category", category);
    }

    if (bestSeller) {
      params.set("bestSeller", "true");
    }

    if (offersOnly) {
      params.set("offers", "true");
    }

    if (material) {
      params.set("material", material);
    }

    if (type) {
      params.set("type", type);
    }

    if (style) {
      params.set("style", style);
    }

    if (seat) {
      params.set("seat", seat);
    }

    if (size) {
      params.set("size", size);
    }

    if (mattressType) {
      params.set("mattressType", mattressType);
    }

    if (firmness) {
      params.set("firmness", firmness);
    }

    if (thickness) {
      params.set("thickness", thickness);
    }

    if (priceRange) {
      params.set("price", priceRange);
    }

    if (sortType && sortType !== "Featured") {
      params.set("sort", sortType);
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    category,
    bestSeller,
    offersOnly,
    material,
    type,
    style,
    seat,
    size,
    mattressType,
    firmness,
    thickness,
    priceRange,
    sortType,
    setSearchParams,
  ]);

  const categories = useMemo(
    () =>
      uniqueValues(products, getProductCategory).map((value) => ({
        value,
        label: getCategoryLabel(value),
      })),
    [products],
  );

  const categoryProducts = useMemo(() => {
    if (!category) return products;

    return products.filter(
      (item) => getProductCategory(item) === normalize(category),
    );
  }, [products, category]);

  const materials = useMemo(
    () => uniqueValues(categoryProducts, getProductMaterial),
    [categoryProducts],
  );

  const types = useMemo(
    () => uniqueValues(categoryProducts, getProductType),
    [categoryProducts],
  );

  const styles = useMemo(
    () => uniqueValues(categoryProducts, getProductStyle),
    [categoryProducts],
  );

  const seats = useMemo(
    () => uniqueValues(categoryProducts, getProductSeat),
    [categoryProducts],
  );

  const sizes = useMemo(
    () => uniqueValues(categoryProducts, getProductSize),
    [categoryProducts],
  );

  const mattressTypes = useMemo(
    () => uniqueValues(categoryProducts, getProductMattressType),
    [categoryProducts],
  );

  const firmnessOptions = useMemo(
    () => uniqueValues(categoryProducts, getProductFirmness),
    [categoryProducts],
  );

  const thicknessOptions = useMemo(
    () => uniqueValues(categoryProducts, getProductThickness),
    [categoryProducts],
  );

  // Supports both "Matteress" and "Mattress"
  const normalizedCategory = normalize(category);

  const isMattressCategory =
    normalizedCategory === "mattress" ||
    normalizedCategory === "matteress" ||
    normalizedCategory === "mattresses";

  const isSofaCategory =
    normalizedCategory === "sofa" || normalizedCategory === "sofas";

  /* =========================================================
     RESET INVALID DEPENDENT FILTERS
     ========================================================= */

  useEffect(() => {
    if (
      material &&
      !materials.some((item) => normalize(item) === normalize(material))
    ) {
      setMaterial("");
    }

    if (type && !types.some((item) => normalize(item) === normalize(type))) {
      setType("");
    }

    if (style && !styles.some((item) => normalize(item) === normalize(style))) {
      setStyle("");
    }

    if (seat && !seats.some((item) => normalize(item) === normalize(seat))) {
      setSeat("");
    }

    if (size && !sizes.some((item) => normalize(item) === normalize(size))) {
      setSize("");
    }

    if (
      mattressType &&
      !mattressTypes.some((item) => normalize(item) === normalize(mattressType))
    ) {
      setMattressType("");
    }

    if (
      firmness &&
      !firmnessOptions.some((item) => normalize(item) === normalize(firmness))
    ) {
      setFirmness("");
    }

    if (
      thickness &&
      !thicknessOptions.some((item) => normalize(item) === normalize(thickness))
    ) {
      setThickness("");
    }
  }, [
    materials,
    types,
    styles,
    seats,
    sizes,
    mattressTypes,
    firmnessOptions,
    thicknessOptions,
    material,
    type,
    style,
    seat,
    size,
    mattressType,
    firmness,
    thickness,
  ]);

  /* =========================================================
     FILTER PRODUCTS
     ========================================================= */

  const filteredProducts = useMemo(() => {
    let productCopy = [...products];

    // Dynamic Best Seller
    if (bestSeller) {
      productCopy = productCopy
        .filter((item) => Number(item.soldCount || 0) > 0)
        .sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0));
    }

    // Active offers
    if (offersOnly) {
      productCopy = productCopy.filter((item) => hasActiveOffer(item));
    }

    // Category
    if (category) {
      productCopy = productCopy.filter(
        (item) => getProductCategory(item) === normalize(category),
      );
    }

    // Material
    if (material) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductMaterial(item)) === normalize(material),
      );
    }

    // Type
    if (type) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductType(item)) === normalize(type),
      );
    }

    // Style
    if (style) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductStyle(item)) === normalize(style),
      );
    }

    // Seating
    if (seat) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductSeat(item)) === normalize(seat),
      );
    }

    // Size
    if (size) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductSize(item)) === normalize(size),
      );
    }

    // Mattress type
    if (mattressType) {
      productCopy = productCopy.filter(
        (item) =>
          normalize(getProductMattressType(item)) === normalize(mattressType),
      );
    }

    // Firmness
    if (firmness) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductFirmness(item)) === normalize(firmness),
      );
    }

    // Thickness
    if (thickness) {
      productCopy = productCopy.filter(
        (item) => normalize(getProductThickness(item)) === normalize(thickness),
      );
    }

    // Price
    if (priceRange) {
      productCopy = productCopy.filter((item) => {
        const price = Number(item.price) || 0;

        switch (priceRange) {
          case "under25":
            return price <= 25000;

          case "25to50":
            return price > 25000 && price <= 50000;

          case "50to100":
            return price > 50000 && price <= 100000;

          case "above100":
            return price > 100000;

          default:
            return true;
        }
      });
    }

    // Search
    if (search) {
      const searchValue = normalize(search);

      productCopy = productCopy.filter((item) => {
        const searchableText = [
          item.name,
          item.description,
          item.category,
          item.material,
          item.type,
          item.style,
          item.seating,
          item.size,
          item.mattressType,
          item.firmness,
          item.thickness,
        ]
          .filter(Boolean)
          .join(" ");

        return normalize(searchableText).includes(searchValue);
      });
    }

    // Sort
    switch (sortType) {
      case "HTL":
        productCopy.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      case "LTH":
        productCopy.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;

      case "New":
        productCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;

      case "Featured":
      default:
        productCopy.sort((a, b) => {
          const soldA = Number(a.soldCount || 0);

          const soldB = Number(b.soldCount || 0);

          if (soldA !== soldB) {
            return soldB - soldA;
          }

          const offerA = hasActiveOffer(a) ? 1 : 0;

          const offerB = hasActiveOffer(b) ? 1 : 0;

          return offerB - offerA;
        });

        break;
    }

    return productCopy;
  }, [
    products,
    bestSeller,
    offersOnly,
    category,
    material,
    type,
    style,
    seat,
    size,
    mattressType,
    firmness,
    thickness,
    priceRange,
    search,
    sortType,
  ]);

  /* =========================================================
     RESET PAGINATION WHEN FILTER CHANGES
     ========================================================= */

  useEffect(() => {
    setVisibleCount(12);
  }, [
    bestSeller,
    offersOnly,
    category,
    material,
    type,
    style,
    seat,
    size,
    mattressType,
    firmness,
    thickness,
    priceRange,
    search,
    sortType,
  ]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  /* =========================================================
     LOAD MORE
     ========================================================= */

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    if (visibleCount >= filteredProducts.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + 8, filteredProducts.length),
          );
        }
      },
      {
        rootMargin: "500px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  /* =========================================================
     CLEAR FILTERS
     ========================================================= */

  const clearFilters = () => {
    setBestSeller(false);
    setOffersOnly(false);
    setCategory("");
    setMaterial("");
    setType("");
    setStyle("");
    setSeat("");
    setSize("");
    setMattressType("");
    setFirmness("");
    setThickness("");
    setPriceRange("");
    setSortType("Featured");

    setSearchParams({}, { replace: true });
  };

  const handleFilterChange = (setter, value) => {
    setter(value);

    if (window.innerWidth < 1024) {
      setShowFilter(false);
    }
  };

  const activeFilterCount = [
    bestSeller,
    offersOnly,
    category,
    material,
    type,
    style,
    seat,
    size,
    mattressType,
    firmness,
    thickness,
    priceRange,
  ].filter(Boolean).length;

  const filterButtonClass = (active) =>
    `
      rounded-full
      border
      px-4
      py-2
      font-beautify
      text-xs
      font-medium
      transition-all
      duration-200
      ${
        active
          ? "border-[#80634B] bg-[#80634B] text-white shadow-sm"
          : "border-[#D5C9BE] bg-white text-[#4E433A] hover:border-[#80634B] hover:bg-[#F1E8DE]"
      }
    `;

  const renderOptionButtons = (options, value, setter) => (
    <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() =>
            handleFilterChange(
              setter,
              normalize(value) === normalize(option) ? "" : option,
            )
          }
          className={filterButtonClass(normalize(value) === normalize(option))}
        >
          {getCategoryLabel(option)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F0] pb-20">
      <div className="pt-5 sm:pt-7">
        <Search />
      </div>

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
          <div>
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
              {category ? getCategoryLabel(category) : "Furniture"}
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
              Discover thoughtfully designed furniture made to bring comfort,
              character, and timeless elegance into your home.
            </p>
          </div>

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

      {/* FILTER PANEL */}
      <section className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">
        <div
          className={`
            overflow-hidden
            transition-all
            duration-500
            ${
              showFilter
                ? "mt-5 max-h-[1800px] opacity-100"
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
                gap-x-8
                gap-y-7
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {/* CATEGORY */}
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
                  Category
                </p>

                {renderOptionButtons(
                  categories.map((item) => item.value),
                  category,
                  setCategory,
                )}
              </div>

              {/* COLLECTION */}
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

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleFilterChange(setBestSeller, !bestSeller)
                    }
                    className={filterButtonClass(bestSeller)}
                  >
                    Best Sellers
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFilterChange(setOffersOnly, !offersOnly)
                    }
                    className={filterButtonClass(offersOnly)}
                  >
                    On Offer
                  </button>
                </div>
              </div>

              {/* MATERIAL */}
              {materials.length > 0 && (
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

                  {renderOptionButtons(materials, material, setMaterial)}
                </div>
              )}

              {/* TYPE */}
              {types.length > 0 && (
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
                    Type
                  </p>

                  {renderOptionButtons(types, type, setType)}
                </div>
              )}

              {/* STYLE */}
              {styles.length > 0 && (
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
                    Style
                  </p>

                  {renderOptionButtons(styles, style, setStyle)}
                </div>
              )}

              {/* SEATING */}
              {seats.length > 0 && isSofaCategory && (
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

                  {renderOptionButtons(seats, seat, setSeat)}
                </div>
              )}

              {/* SIZE */}
              {sizes.length > 0 && (
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
                    Size
                  </p>

                  {renderOptionButtons(sizes, size, setSize)}
                </div>
              )}

              {/* MATTRESS TYPE */}
              {isMattressCategory && mattressTypes.length > 0 && (
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
                    Mattress Type
                  </p>

                  {renderOptionButtons(
                    mattressTypes,
                    mattressType,
                    setMattressType,
                  )}
                </div>
              )}

              {/* FIRMNESS */}
              {isMattressCategory && firmnessOptions.length > 0 && (
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
                    Firmness
                  </p>

                  {renderOptionButtons(firmnessOptions, firmness, setFirmness)}
                </div>
              )}

              {/* THICKNESS */}
              {isMattressCategory && thicknessOptions.length > 0 && (
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
                    Thickness
                  </p>

                  {renderOptionButtons(
                    thicknessOptions,
                    thickness,
                    setThickness,
                  )}
                </div>
              )}

              {/* PRICE */}
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
                    ["25to50", "25K – 50K"],
                    ["50to100", "50K – 1L"],
                    ["above100", "1L+"],
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
                      className={filterButtonClass(priceRange === value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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

      {/* ACTIVE FILTERS */}
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

            {offersOnly && (
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
                On Offer
              </span>
            )}

            {category && (
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
                {getCategoryLabel(category)}
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
                  text-[#55463A]
                "
              >
                {getCategoryLabel(material)}
              </span>
            )}

            {type && (
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
                {getCategoryLabel(type)}
              </span>
            )}

            {style && (
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
                {getCategoryLabel(style)}
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
                {getCategoryLabel(seat)}
              </span>
            )}

            {size && (
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
                {getCategoryLabel(size)}
              </span>
            )}

            {mattressType && (
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
                {getCategoryLabel(mattressType)}
              </span>
            )}

            {firmness && (
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
                {getCategoryLabel(firmness)}
              </span>
            )}

            {thickness && (
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
                {getCategoryLabel(thickness)}
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

                {priceRange === "25to50" && "25K – 50K"}

                {priceRange === "50to100" && "50K – 1L"}

                {priceRange === "above100" && "1L+"}
              </span>
            )}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">
        {visibleProducts.length > 0 ? (
          <>
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
              {visibleProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  name={item.name}
                  id={item._id}
                  image={item.image?.[0]}
                  price={item.price}
                  description={item.description}
                  offer={item.offer}
                  stock={item.stock}
                  bestSeller={Number(item.soldCount || 0) > 0}
                  category={item.category}
                />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div
                ref={loadMoreRef}
                className="
                  flex
                  h-24
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-manrope
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#80634B]
                  "
                >
                  <FiPlus size={14} />
                  Loading more products
                </div>
              </div>
            )}
          </>
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
                No furniture found
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
                  hover:-translate-y-0.5
                  hover:bg-[#80634B]
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
