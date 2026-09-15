import React, { useEffect } from "react";
import { FiCheckCircle, FiFileText, FiX } from "react-icons/fi";

const Agreement = ({ onClose, onAccept }) => {
  // Prevent background scrolling while popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close with ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Close when clicking outside modal
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        py-6
        backdrop-blur-[3px]
      "
    >
      {/* Modal */}
      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#E5DDD3]
          bg-[#F8F5F0]
          shadow-[0_25px_80px_rgba(59,43,32,0.25)]
          sm:rounded-3xl
        "
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close agreement"
          className="
            absolute
            right-4
            top-4
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#E5DDD3]
            bg-white
            text-[#7E746D]
            shadow-sm
            transition-all
            duration-200
            hover:border-[#B07B45]
            hover:bg-[#F0EBE5]
            hover:text-[#3B2B20]
          "
        >
          <FiX className="text-lg" />
        </button>

        {/* HEADER */}
        <div
          className="
            shrink-0
            border-b
            border-[#E5DDD3]
            bg-[#FBF8F4]
            px-5
            pb-5
            pt-7
            text-center
            sm:px-8
            sm:pb-6
            sm:pt-8
          "
        >
          {/* Icon */}
          <div
            className="
              mx-auto
              mb-3
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[#F0EBE5]
              text-xl
              text-[#B07B45]
              sm:h-14
              sm:w-14
              sm:text-2xl
            "
          >
            <FiFileText />
          </div>

          {/* Brand */}
          <p
            className="
              mb-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#B07B45]
            "
          >
            RSU Furniture
          </p>

          {/* Title */}
          <h1
            className="
              font-serif
              text-2xl
              font-semibold
              text-[#3B2B20]
              sm:text-3xl
            "
          >
            Terms & Agreement
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-xs
              leading-5
              text-[#7E746D]
              sm:text-sm
              sm:leading-6
            "
          >
            Please read the following terms carefully before creating an account
            or placing an order with RSU.
          </p>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            bg-white
          "
        >
          {/* INTRO */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <h2 className="text-base font-semibold text-[#3B2B20] sm:text-lg">
              Agreement to Our Terms
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#7E746D] sm:leading-7">
              By creating an account, placing an order, or purchasing products
              from RSU, you acknowledge that you have read, understood, and
              agreed to the terms and conditions described on this page.
            </p>
          </section>

          {/* 01 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="01" title="Orders & Product Information" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Customers are responsible for reviewing product information,
              including product name, description, dimensions, material, color,
              quantity, price, and other available specifications before placing
              an order.
            </p>

            <p className="mt-3 text-sm leading-6 text-[#7E746D] sm:leading-7">
              An order is considered successfully placed only after RSU receives
              and confirms the order.
            </p>
          </section>

          {/* 02 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="02" title="Delivery Charges" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Delivery charges are not included in the product price unless
              specifically stated. The delivery charge will be determined based
              on the customer's location and delivery requirements.
            </p>

            <p className="mt-3 text-sm leading-6 text-[#7E746D] sm:leading-7">
              After an order is placed, an RSU customer service representative
              may contact the customer to confirm the delivery location and
              applicable delivery charge.
            </p>
          </section>

          {/* 03 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="03" title="Payment" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Available payment methods will be displayed during checkout.
              Customers are responsible for completing payment according to the
              selected payment method and the instructions provided by RSU.
            </p>
          </section>

          {/* 04 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="04" title="Order Cancellation" />

            <div className="mt-4 rounded-xl border border-[#E5DDD3] bg-[#FBF8F4] p-4">
              <p className="text-sm font-semibold leading-6 text-[#3B2B20]">
                Customers cannot directly cancel orders through the website.
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              If you need to request a cancellation, please contact RSU customer
              service as soon as possible. Cancellation requests are subject to
              order status and approval by RSU.
            </p>
          </section>

          {/* 05 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="05" title="Delivery & Order Status" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Orders may progress through different stages, including Order
              Placed, Processing, Shipped, Out for Delivery, and Delivered.
            </p>

            <p className="mt-3 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Delivery times may vary depending on product availability,
              customer location, transportation, and other circumstances.
            </p>
          </section>

          {/* 06 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="06" title="Returns & Refunds" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Return and refund requests are subject to RSU's applicable return
              and refund policies. Customers should contact customer service
              regarding damaged, incorrect, or defective products as soon as
              possible after delivery.
            </p>
          </section>

          {/* 07 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="07" title="Product Reviews" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Customers may be allowed to review products they have purchased
              and received. Reviews should be honest, relevant, and respectful.
            </p>

            <p className="mt-3 text-sm leading-6 text-[#7E746D] sm:leading-7">
              RSU reserves the right to remove reviews that contain abusive,
              misleading, inappropriate, or unrelated content.
            </p>
          </section>

          {/* 08 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="08" title="Account Responsibility" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Customers are responsible for providing accurate information when
              creating an account and placing an order. Customers should also
              keep their account credentials secure.
            </p>
          </section>

          {/* 09 */}
          <section className="border-b border-[#E5DDD3] p-5 sm:p-7">
            <SectionTitle number="09" title="Privacy" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              Information provided by customers may be used to process orders,
              communicate about purchases, provide customer support, and operate
              RSU's services.
            </p>
          </section>

          {/* 10 */}
          <section className="p-5 sm:p-7">
            <SectionTitle number="10" title="Agreement & Acceptance" />

            <p className="mt-4 text-sm leading-6 text-[#7E746D] sm:leading-7">
              By continuing to use the RSU website, creating an account, or
              placing an order, you confirm that you have read and understood
              these terms and agree to follow them.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FBF8F4] p-4">
              <FiCheckCircle
                className="
                  mt-0.5
                  flex-shrink-0
                  text-lg
                  text-[#B07B45]
                "
              />

              <p className="text-sm leading-6 text-[#3B2B20]">
                By accepting this agreement, you acknowledge that you have read
                and agreed to the RSU Terms & Conditions.
              </p>
            </div>
          </section>
        </div>

        {/* BOTTOM ACTIONS */}
        <div
          className="
            shrink-0
            border-t
            border-[#E5DDD3]
            bg-[#FBF8F4]
            p-4
            sm:p-5
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-xl
                border
                border-[#D8C9B8]
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-[#6A4E3B]
                transition-all
                duration-200
                hover:border-[#6A4E3B]
                hover:bg-[#F2E5D6]
                sm:w-auto
              "
            >
              Close
            </button>

            {/* ACCEPT */}
            <button
              type="button"
              onClick={onAccept}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#6A4E3B]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#4F392B]
                hover:shadow-md
                sm:w-auto
              "
            >
              <FiCheckCircle />I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================
// SECTION TITLE
// =========================================

const SectionTitle = ({ number, title }) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[#F0EBE5]
          text-[10px]
          font-bold
          text-[#B07B45]
        "
      >
        {number}
      </span>

      <h2
        className="
          text-base
          font-semibold
          text-[#3B2B20]
          sm:text-lg
        "
      >
        {title}
      </h2>
    </div>
  );
};

export default Agreement;
