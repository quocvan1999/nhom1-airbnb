import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[100vh] bg-gray-100 flex items-center justify-center py-14">
      <div
        className="w-[900px] h-[80%] bg-white rounded-2xl shadow-xl flex"
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
