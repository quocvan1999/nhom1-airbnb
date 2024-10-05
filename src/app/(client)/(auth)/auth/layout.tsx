import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[100vh] bg-gray-100 flex items-center justify-center">
      <div
        className="w-full my-5 md:my-0 md:max-w-[70%] lg:max-w-[900px] mx-3 md:mx-0 bg-white rounded-xl shadow-xl flex"
        style={{
          backgroundImage:
            "linear-gradient(to left bottom, #ff385c, #fd3559, #fb3255, #f82e52, #f62b4f)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
