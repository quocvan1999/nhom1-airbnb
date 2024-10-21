"use client";

import { useSearchParams } from "next/navigation";

const useGetSearchPrams = () => {
  const searchParams = useSearchParams();

  const getParams = () => {
    const page: string | null = searchParams.get("page") || "1";
    const size: string | null = searchParams.get("size") || "10";
    const keyword: string | null = searchParams.get("keyword") || "";

    return {
      page,
      size,
      keyword,
    };
  };

  return { getParams, searchParams };
};

export default useGetSearchPrams;
