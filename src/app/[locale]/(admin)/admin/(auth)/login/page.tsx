"use client";

import { LoginType } from "@/types/login/loginType.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "@/utils/method/method";
import { Checkbox, ConfigProvider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReqType } from "@/types/req/reqType.type";
import { User } from "@/types/user/userType.type";
import { LoginAsync } from "@/services/login/login.service";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { getProfileAsync } from "@/services/profile/profile.service";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import { useLocale } from "next-intl";

type Props = {};

const AdminLoginPage: React.FC<Props> = ({}) => {
  const locale = useLocale();
  const dispatch: AppDispatch = useDispatch();
  const router: AppRouterInstance = useRouter();
  const { openNotification } = useNotification();
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const { profile } = useSelector((state: RootState) => state.user);
  const [isRemember, setIsRemember] = useState<boolean>(false);

  const initialValues: LoginType = {
    email: "",
    password: "",
  };

  const handleLogin: (userLogin: LoginType) => Promise<void> = async (
    userLogin
  ) => {
    const res: ReqType<{ user: User; token: string }> = await LoginAsync(
      userLogin
    );

    switch (res.statusCode) {
      case 200:
        if (typeof res.content === "object") {
          if (res.content.user.role === "ADMIN") {
            openNotification("success", "Đăng nhập", "Đăng nhập thành công");
            setTimeout(() => {
              router.push(`/${locale}/admin`);
            }, 300);

            const action = getProfileAsync(res.content.user.id);
            dispatch(action);

            if (isRemember === true) {
              setCookie("m_a", userLogin.email, 7);
              setCookie("p_a", userLogin.password, 7);
            }

            setCookie("accessToken", res.content.token, 7);
            setCookie("i_d", res.content.user.id.toString(), 7);
          } else {
            openNotification(
              "error",
              "Đăng nhập",
              "Tài khoản không có quyền truy cập"
            );
          }
        }
        break;
      default:
        if (typeof res.content === "string") {
          openNotification("error", "Đăng nhập", res.content);
        }
        break;
    }
  };

  const formLogin = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email không được để trống")
        .email("Email không đúng định dạng"),
      password: Yup.string().required("Password không được để trống"),
    }),
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  useEffect(() => {
    const login: boolean | undefined = checkIsLogin();

    if (login === true) {
      getProfile();
    } else {
      formLogin.setFieldValue("email", getCookie("m_a"));
      formLogin.setFieldValue("password", getCookie("p_a"));
    }
  }, []);

  useEffect(() => {
    if (profile.role !== "" && checkIsLogin() === true) {
      if (profile.role === "ADMIN") {
        router.push(`/${locale}/admin`);
      } else {
        deleteCookie("accessToken");
        deleteCookie("i_d");
        formLogin.setFieldValue("email", getCookie("m_a"));
        formLogin.setFieldValue("password", getCookie("p_a"));
      }
    }
  }, [profile]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            borderRadiusLG: 7,
            colorBgContainer: "#f7f7f7",
            lineType: "none",
            paddingInlineLG: 20,
            paddingBlockLG: 10,
            activeShadow: "none",
          },
          Checkbox: {
            colorText: "#6a6a6a",
            colorPrimary: "#FF385C",
            colorPrimaryHover: "#FF385C",
            fontSize: 14,
            fontFamily: "/src/app/fonts/AirbnbCerealVF.woff2",
          },
        },
      }}
    >
      <div className="w-[350px] md:w-[400px] bg-white rounded-xl px-5 md:px-7 py-7 shadow-lg border mx-2">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-2xl font-bold">Đăng Nhập</h1>
        </div>
        <Form layout="vertical" onSubmitCapture={formLogin.handleSubmit}>
          <Form.Item
            validateStatus={
              formLogin.touched.email && formLogin.errors.email ? "error" : ""
            }
            help={formLogin.touched.email && formLogin.errors.email}
          >
            <p className="font-bold uppercase text-xs mb-3">Email</p>
            <Input
              allowClear
              size="large"
              name="email"
              placeholder="Nhập email"
              value={formLogin.values.email}
              onChange={formLogin.handleChange}
              onBlur={formLogin.handleBlur}
            />
          </Form.Item>
          <Form.Item
            validateStatus={
              formLogin.touched.password && formLogin.errors.password
                ? "error"
                : ""
            }
            help={formLogin.touched.password && formLogin.errors.password}
          >
            <p className="font-bold uppercase text-xs mb-3">Mật khẩu</p>
            <Input.Password
              allowClear
              size="large"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formLogin.values.password}
              onChange={formLogin.handleChange}
              onBlur={formLogin.handleBlur}
            />
          </Form.Item>
          <div className="flex items-center justify-between">
            <Checkbox
              onChange={() => setIsRemember(!isRemember)}
              checked={isRemember}
              className="text-[#fff] "
            >
              Nhớ mật khẩu
            </Checkbox>
          </div>
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-primary-100 text-white py-3 rounded-[7px] transition-all duration-500 ease-in-out hover:bg-primary-200 font-custom mt-5"
            >
              Đăng nhập
            </button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default AdminLoginPage;
