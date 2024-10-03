import ProfilePage from "@/components/profile-page/ProfilePage";

type Props = {};

export const generateMetadata = async () => {
  return {
    title: "Trang cá nhân",
    description: "Xem thông tin cá nhân và các phòng đã thuê của bạn.",
    keywords: "profile, người dùng, thông tin cá nhân, phòng đã thuê",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
      description:
        "Tìm kiếm cho thuê kỳ nghỉ, nhà gỗ, nhà bãi biển, nhà độc đáo và những trải nghiệm trên toàn cầu trên Airbnb.",
      url: "https://nhom1-airbnb.vercel.app",
    },
  };
};

const Profile: React.FC<Props> = ({}) => {
  return <ProfilePage />;
};

export default Profile;
