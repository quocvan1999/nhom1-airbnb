export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-gray-100 h-[100vh] flex items-center justify-center">
      {children}
    </div>
  );
}
