import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-3 uppercase font-manrope max-w-full">
      {/* Left Line */}
      <p className="w-5 sm:w-8 md:w-12 h-[1px] sm:h-[2px] bg-[#775f38] flex-shrink-0"></p>

      {/* Title */}
      <p className="text-[#7A5C45] text-xs sm:text-sm md:text-base whitespace-nowrap">
        {text1} <span className="text-[#B08A58] font-medium">{text2}</span>
      </p>

      {/* Right Line */}
      <p className="w-5 sm:w-8 md:w-12 h-[1px] sm:h-[2px] bg-[#C9A46A] flex-shrink-0"></p>
    </div>
  );
};

export default Title;
