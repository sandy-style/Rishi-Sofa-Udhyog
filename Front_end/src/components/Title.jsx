import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3 uppercase font-manrope">
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#775f38]"></p>
      <p className="text-[#7A5C45] ">
        {text1} <span className="text-[#B08A58] font-medium">{text2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#C9A46A]"></p>
    </div>
  );
};

export default Title;
