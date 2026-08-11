import React, { useContext, useEffect, useState } from "react";
import Search from "../components/Search";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import ProductCard from "../components/ProductCard";

const Collection = () => {
  const { products, search } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  const [material, setMaterial] = useState([]);
  const [seat, setSeat] = useState([]);
  const [color, setColor] = useState([]);

  const [sortType, setSortType] = useState("Featured");

  const toggleMaterial = (e) => {
    if (material.includes(e.target.value)) {
      setMaterial((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setMaterial((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSeats = (e) => {
    if (seat.includes(e.target.value)) {
      setSeat((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSeat((prev) => [...prev, e.target.value]);
    }
  };

  const toggleColor = (e) => {
    if (color.includes(e.target.value)) {
      setColor((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setColor((prev) => [...prev, e.target.value]);
    }
  };

  useEffect(() => {
    let productCopy = [...products];

    // Material Filter
    if (material.length > 0) {
      productCopy = productCopy.filter((item) =>
        material.includes(item.material),
      );
    }

    // Seating Filter
    if (seat.length > 0) {
      productCopy = productCopy.filter((item) => seat.includes(item.seating));
    }

    // Color Filter
    if (color.length > 0) {
      productCopy = productCopy.filter((item) =>
        item.color.some((c) => color.includes(c)),
      );
    }

    // Search Filter
    if (search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sorting
    switch (sortType) {
      case "HTL":
        productCopy.sort((a, b) => b.price - a.price);
        break;

      case "LTH":
        productCopy.sort((a, b) => a.price - b.price);
        break;

      case "New":
        productCopy.sort((a, b) => b.date - a.date);
        break;

      default:
        break;
    }

    setFilterProducts(productCopy);
  }, [products, material, seat, color, search, sortType]);
  return (
    <div>
      <Search />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* FILTER SECTION */}
        <div className="w-full lg:w-72">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wide"
            >
              Filters
              <span className={`${showFilter ? "rotate-0" : "rotate-270"} `}>
                ▼
              </span>
            </button>
          </div>

          {/* Filter Panel */}
          <div
            className={` ${showFilter ? "block" : "hidden"}  lg:block border border-gray-200 p-6   space-y-8`}
          >
            {/* Material */}
            <div>
              <h3 className="font-semibold uppercase text-sm tracking-wider mb-4">
                Material
              </h3>

              <div className="space-y-3 text-gray-700">
                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleMaterial}
                    value={"fabric"}
                    type="checkbox"
                  />
                  Fabric
                </label>

                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleMaterial}
                    value={"leather"}
                    type="checkbox"
                  />
                  Leather
                </label>

                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleMaterial}
                    value={"velvet"}
                    type="checkbox"
                  />
                  Velvet
                </label>

                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleMaterial}
                    value={"wood"}
                    type="checkbox"
                  />
                  Wooden
                </label>
              </div>
            </div>

            {/* Seating Capacity */}
            <div>
              <h3 className="font-semibold uppercase text-sm tracking-wider mb-4">
                Seating
              </h3>

              <div className="space-y-3 text-gray-700">
                <label className="flex items-center gap-3">
                  <input
                    value={"1 Seater"}
                    onChange={toggleSeats}
                    type="checkbox"
                  />
                  1 Seater
                </label>

                <label className="flex items-center gap-3">
                  <input
                    value={"2 Seater"}
                    onChange={toggleSeats}
                    type="checkbox"
                  />
                  2 Seater
                </label>

                <label className="flex items-center gap-3">
                  <input
                    value={"3 Seater"}
                    onChange={toggleSeats}
                    type="checkbox"
                  />
                  3 Seater
                </label>

                <label className="flex items-center gap-3">
                  <input
                    value={"L Shape"}
                    onChange={toggleSeats}
                    type="checkbox"
                  />
                  L Shape
                </label>
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="font-semibold uppercase text-sm tracking-wider mb-4">
                Color
              </h3>

              <div className="space-y-3 text-gray-700">
                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleColor}
                    value={"Beige"}
                    type="checkbox"
                  />
                  Beige
                </label>

                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleColor}
                    value={"Grey"}
                    type="checkbox"
                  />
                  Grey
                </label>

                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleColor}
                    value={"Black"}
                    type="checkbox"
                  />
                  Black
                </label>

                <label className="flex items-center gap-3">
                  <input
                    onChange={toggleColor}
                    value={"Brown"}
                    type="checkbox"
                  />
                  Brown
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Panel */}
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3 text-2xl font-heading">
              <Title text1={"ALl"} text2={"SOfas"} />
            </div>

            <select
              onChange={(e) => setSortType(e.target.value)}
              className="
        border
        border-gray-300
        px-4
        py-2
        outline-none
        text-sm
        "
            >
              <option value={"Featured"}>Featured</option>
              <option value={"LTH"}>Price: Low to High</option>
              <option value={"HTL"}>Price: High to Low</option>
              <option value={"New"}>Newest</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3  gap-6">
            {filterProducts.map((item) => (
              <ProductCard
                key={item._id}
                name={item.name}
                id={item._id}
                image={item.image[0]}
                price={item.price}
              />
            ))}
          </div>

          {/* Product Grid Here */}
        </div>
      </div>
    </div>
  );
};

export default Collection;
