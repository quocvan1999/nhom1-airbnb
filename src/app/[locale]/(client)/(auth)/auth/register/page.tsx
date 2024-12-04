import RegisterPage from "@/components/register-page/RegisterPage";

type Props = {
  params: {
    locale: string;
  };
};

export const generateMetadata = async ({ params }: Props) => {
  const { locale } = params;
  return {
    title: "Đăng Ký - Ứng Dụng Của Chúng Tôi",
    description:
      "Tạo tài khoản mới để bắt đầu trải nghiệm các dịch vụ và tính năng của chúng tôi.",
    openGraph: {
      title: "Đăng Ký - Ứng Dụng Của Chúng Tôi",
      description:
        "Đăng ký tài khoản mới để không bỏ lỡ bất kỳ điều gì thú vị.",
      url: `https://nhom1-airbnb.vercel.app/${locale}/auth/register`,
      type: "website",
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Đăng Ký - Ứng Dụng Của Chúng Tôi",
      description:
        "Tạo tài khoản mới để bắt đầu trải nghiệm các dịch vụ và tính năng của chúng tôi.",
      url: `https://nhom1-airbnb.vercel.app/${locale}/auth/register`,
    },
  };
};

const Register: React.FC<Props> = ({}) => {
  return <RegisterPage />;
};

export default Register;
