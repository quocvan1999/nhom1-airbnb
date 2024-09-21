import { useWindowScroll } from "@uidotdev/usehooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useStatusHeader = (): {
  isScroll: boolean;
  setIsScroll: Dispatch<SetStateAction<boolean>>;
  y: number | null;
  isShowSearch: boolean;
  setIsShowSearch: Dispatch<SetStateAction<boolean>>;
  typeSearch: boolean;
  setTypeSearch: Dispatch<SetStateAction<boolean>>;
} => {
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [typeSearch, setTypeSearch] = useState<boolean>(false);
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false);
  const [{ y }]: [
    {
      x: number | null;
      y: number | null;
    },
    (args: unknown) => void
  ] = useWindowScroll();

  useEffect(() => {
    if (y && y > 150) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  }, [y]);

  return {
    isScroll,
    setIsScroll,
    y,
    isShowSearch,
    setIsShowSearch,
    typeSearch,
    setTypeSearch,
  };
};

export default useStatusHeader;
