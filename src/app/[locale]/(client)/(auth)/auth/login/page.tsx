import LoginPage from "@/components/login-page/LoginPage";

type Props = {params: {
  locale: string;
};};
export const generateMetadata = async ({ params }: Props) => {
  const { locale } = params;
  return {
    title: "Đăng Nhập - Ứng Dụng Của Chúng Tôi",
    description:
      "Đăng nhập vào tài khoản của bạn để truy cập vào các tính năng và dịch vụ của chúng tôi.",
    openGraph: {
      title: "Đăng Nhập - Ứng Dụng Của Chúng Tôi",
      description:
        "Đăng nhập để khám phá các tính năng độc quyền và quản lý tài khoản của bạn.",
      url: `https://nhom1-airbnb.vercel.app/${locale}/auth/login`,
      type: "website",
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Đăng Nhập - Ứng Dụng Của Chúng Tôi",
      description:
        "Đăng nhập vào tài khoản của bạn để truy cập vào các tính năng và dịch vụ của chúng tôi.",
      url: `https://nhom1-airbnb.vercel.app/${locale}/auth/login`,
    },
  };
};

const Login: React.FC<Props> = ({}) => {
  return <LoginPage />;
};

export default Login;
