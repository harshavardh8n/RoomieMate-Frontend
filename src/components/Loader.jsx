import React from "react";

const Loader = ({text}) => {
  return (
    <div class="text-center">
  <div
    class="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"
  ></div>
  <h2 class="text-zinc-900 dark:text-black mt-4">Loading...</h2>
  <p class="text-zinc-600 dark:text-black ">
    {text}
  </p>
</div>
  );
};

export default Loader;
