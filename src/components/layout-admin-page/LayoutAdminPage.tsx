"use client";

import React, { useEffect, useState } from "react";
import {
  EnvironmentOutlined,
  ExclamationCircleFilled,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  StockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  Menu,
  Modal,
  theme,
} from "antd";
import Link from "next/link";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { useSelector } from "react-redux";
import { RootState } from "@/app/globalRedux/store";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteCookie, getCookie, setCookie } from "@/utils/method/method";
import useNotification from "@/custome-hook/useNotification/useNotification";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

type Props = {
  children: React.ReactNode;
};

const LayoutAdminPage: React.FC<Props> = ({ children }) => {
  const router: AppRouterInstance = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { checkIsLogin } = useCheckLogin();
  const { openNotification } = useNotification();
  const { getProfile } = useGetProfile();
  const { profile } = useSelector((state: RootState) => state.user);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const showPropsConfirm = (): void => {
    confirm({
      title: "Đăng xuất",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn đăng xuất?",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        router.push("/admin/login");
        openNotification("success", "Đăng xuất", "Đăng xuất thành công");
        deleteCookie("accessToken");
        deleteCookie("i_d");
        setIsLogin(false);
      },
    });
  };

  const handleLogout: () => void = () => {
    showPropsConfirm();
  };

  useEffect(() => {
    const login = checkIsLogin();
    if (login === true) {
      getProfile();
    } else {
      setIsLogin(false);
      router.push("/admin/login");
    }
  }, []);

  useEffect(() => {
    if (profile.id !== 0) {
      if (profile.role.toUpperCase() !== "ADMIN") {
        setIsLogin(false);
        router.push("/admin/login");
        deleteCookie("accessToken");
        deleteCookie("i_d");
      } else {
        getProfile();
        setIsLogin(true);
      }
    }
  }, [profile]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: "#fff",
          },
          Menu: {
            darkItemBg: "#fff",
            darkItemColor: "#222",
            darkItemSelectedBg: "#FF385C",
            darkItemHoverColor: "#FF385C",
          },
        },
      }}
    >
      <Layout className="w-full h-full">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="w-full flex items-center justify-center py-3">
            {collapsed === true ? (
              <svg
                fill="none"
                height="32"
                viewBox="0 0 32 32"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m16 2c-7.72188 0-14 6.27812-14 14 0 7.7219 6.27812 14 14 14 7.7219 0 14-6.2781 14-14 0-7.72188-6.2781-14-14-14z"
                  fill="#ff5a5f"
                />
                <path
                  d="m16.0003 19.6867c-.9178-1.1545-1.4577-2.1666-1.6377-3.0325-.18-.7036-.108-1.2628.1979-1.6777.324-.4871.8099-.7216 1.4398-.7216s1.1159.2345 1.4398.7216c.306.4149.3779.9741.198 1.6777-.198.884-.7379 1.8942-1.6378 3.0325zm5.0248 2.6699c-1.5297.6675-3.0433-.3969-4.3391-1.8401 2.1435-2.6897 2.5394-4.7823 1.6198-6.1371-.5399-.7757-1.3138-1.1546-2.3055-1.1546-1.9977 0-3.0973 1.6958-2.6654 3.6639.252 1.0644.9179 2.2749 1.9797 3.6278-.7964.8847-1.8413 1.8882-3.0955 2.0025-1.8177.2706-3.24129-1.4973-2.59339-3.3212l4.60909-9.56473c.3934-.71904.8789-1.33495 1.7637-1.33495.6479 0 1.1518.37884 1.3678.68551l5.005 10.21417c.4904 1.2342-.1315 2.633-1.3462 3.1588zm2.3217-3.5196-4.2851-8.93333c-.8099-1.65967-1.3858-2.65367-3.0614-2.65367-1.6557 0-2.3594 1.15455-3.0793 2.65367l-4.26714 8.93333c-.91785 2.5274.97185 4.7463 3.25934 4.7463.144 0 .2869-.018.4319-.018 1.1878-.1443 2.4134-.902 3.6552-2.2568 1.2418 1.353 2.4674 2.1125 3.6553 2.2568.145 0 .2879.018.4319.018 2.2874.0018 4.1771-2.2189 3.2593-4.7463z"
                  fill="#fff"
                />
              </svg>
            ) : (
              <img
                src="/images/Airbnb_Logo.png"
                alt="logo"
                className="w-[50%]"
              />
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: <Link href="/admin">Quản lý người dùng</Link>,
              },
              {
                key: "2",
                icon: <EnvironmentOutlined />,
                label: <Link href="/admin/locations">Quản lý vị trí</Link>,
              },
              {
                key: "3",
                icon: <HomeOutlined />,
                label: <Link href="/admin/rooms">Quản lý phòng</Link>,
              },
              {
                key: "4",
                icon: <StockOutlined />,
                label: <Link href="/admin/bookings">Quản lý đặt phòng</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex items-center justify-between"
            style={{ padding: 0, background: colorBgContainer }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Dropdown
              dropdownRender={() => (
                <div className="bg-white shadow-lg rounded-lg">
                  <div className="flex flex-col">
                    <Link
                      href="/admin/login"
                      className="transition-all duration-500 ease-in-out text-custome-black-100 hover:bg-custome-gray-100 hover:text-custome-black-100 px-5 py-2 rounded-t-lg"
                    >
                      Xem hồ sơ
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
                    >
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              )}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <div className="w-[45px] h-[45px] border me-3 rounded-full border-primary-100 flex items-center justify-center cursor-pointer">
                {isLogin === true ? (
                  <img
                    src={profile && profile.avatar}
                    alt="image"
                    className="w-[45px] h-[45px] rounded-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    style={{ fill: "#222" }}
                  >
                    <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"></path>
                  </svg>
                )}
              </div>
            </Dropdown>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutAdminPage;
