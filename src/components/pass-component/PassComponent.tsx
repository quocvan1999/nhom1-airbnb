"use client";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import React, { useState } from "react";

type Props = {
  password: string;
};

const PassComponent: React.FC<Props> = ({ password }) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  return (
    <div className="flex items-center gap-3">
      <p className="leading-5">
        {showPass === true ? password : "*".repeat(password.length)}{" "}
      </p>
      <div className="text-gray-400">
        {showPass === true ? (
          <EyeInvisibleFilled onClick={() => setShowPass(!showPass)} />
        ) : (
          <EyeFilled onClick={() => setShowPass(!showPass)} />
        )}
      </div>
    </div>
  );
};

export default PassComponent;
