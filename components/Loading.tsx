import { FC } from "react";

export const Loading: FC = () => {
  return (
    <div className="flex items-center justify-center pt-64 sm:pt-72 flex-col">
      <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <div className="mt-8 text-2xl">Getting answer...</div>
    </div>
  );
};
