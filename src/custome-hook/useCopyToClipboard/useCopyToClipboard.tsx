"use client";

import { useState } from "react";

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      setIsCopied(false);
    }
  };

  return { isCopied, copyToClipboard };
};

export default useCopyToClipboard;
