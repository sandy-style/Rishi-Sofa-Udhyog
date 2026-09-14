import React from "react";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { assets } from "../assets/assets.js";

const CustomerReviews = () => {
  const reviews = [
    {
      image: assets.customer3,
      name: "Aarav Sharma",
      location: "Kathmandu",
      rating: 5,
      review:
        "Absolutely loved the quality. The sofa looks even better in person and has completely transformed our living room. The finish and comfort are outstanding.",
      product: "Luxe Comfort Sofa",
    },
    {
      image: assets.customer1,
      name: "Saanvi Thapa",
      location: "Pokhara",
      rating: 5,
      review:
        "The craftsmanship is beautiful. Everything feels premium, from the material to the smallest details. It fits perfectly into our home.",
      product: "Regal Haven Bed",
    },
    {
      image: assets.customer4,
      name: "Rohan Adhikari",
      location: "Lalitpur",
      rating: 5,
      review:
        "Really impressed with the design and quality. The furniture feels solid, elegant, and exactly like what I was looking for.",
      product: "Oakline TV Unit",
    },
    {
      image: assets.customer2,
      name: "Prakriti Shrestha",
      location: "Bhaktapur",
      rating: 5,
      review:
        "From the beautiful finish to the comfort, everything exceeded my expectations. RSU has definitely become one of my favorite furniture brands.",
      product: "Walnut Luxe Wardrobe",
    },
  ];

  return (
    <section className="w-full bg-[#F8F5F0] py-20 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B07B45]">
              Loved by Our Customers
            </p>

            <h2 className="font-serif text-3xl font-medium tracking-tight text-[#3B2B20] sm:text-4xl lg:text-5xl">
              Spaces Made Beautiful
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#7E746D] sm:text-[15px]">
              Discover what our customers have to say about bringing RSU
              furniture into their homes.
            </p>
          </div>

          <button className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3B2B20]">
            View All Reviews
            <FiArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex min-h-[390px] flex-col justify-between border border-[#E5DDD3] bg-[#FBF8F4] p-6 sm:p-7"
            >
              <div>
                <div className="mb-6 flex items-center gap-1 text-[#B07B45]">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <FiStar key={starIndex} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="font-serif text-[19px] leading-8 text-[#3B2B20]">
                  “{review.review}”
                </p>
              </div>

              <div className="mt-8 border-t border-[#E5DDD3] pt-5">
                <div className="flex items-center gap-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-[#E5DDD3]"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#3B2B20]">
                      {review.name}
                    </p>

                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[#9A9088]">
                      {review.location}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B07B45]">
                  {review.product}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-[#E5DDD3] pt-7 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {reviews.map((review, index) => (
                <img
                  key={index}
                  src={review.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-8 rounded-full border-2 border-[#F8F5F0] object-cover"
                />
              ))}
            </div>

            <p className="text-xs text-[#7E746D]">
              Trusted by furniture lovers across Nepal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-[#3B2B20]">4.9</span>

            <div className="flex gap-0.5 text-[#B07B45]">
              {Array.from({ length: 5 }).map((_, index) => (
                <FiStar key={index} size={13} fill="currentColor" />
              ))}
            </div>

            <span className="text-xs text-[#9A9088]">Customer Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
