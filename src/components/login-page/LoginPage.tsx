"use client";

import { Checkbox, ConfigProvider, Form, Input } from "antd";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { LoginType } from "@/types/login/loginType.type";
import { LoginAsync } from "@/services/login/login.service";
import { ReqType } from "@/types/req/reqType.type";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/utils/method/method";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/globalRedux/store";
import { getProfileAsync } from "@/services/profile/profile.service";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { User } from "@/types/user/userType.type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Props = {};

const LoginPage: React.FC<Props> = ({}) => {
  const router: AppRouterInstance = useRouter();
  const [isRemember, setIsRemember] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { checkIsLogin } = useCheckLogin();

  const initialValues: LoginType = {
    email: "",
    password: "",
  };

  const handleChangeLogin = async (user: LoginType): Promise<void> => {
    const res: ReqType<{ user: User; token: string }> = await LoginAsync(user);

    switch (res.statusCode) {
      case 200:
        openNotification("success", "Đăng nhập", "Đăng nhập thành công");

        setTimeout(() => {
          router.push("/");
        }, 300);

        if (typeof res.content !== "string") {
          const action = getProfileAsync(res.content.user.id);
          dispatch(action);

          if (isRemember === true) {
            setCookie("m", user.email, 7);
            setCookie("p", user.password, 7);
          }

          setCookie("accessToken", res.content.token, 7);
          if (res.content.user.id !== undefined) {
            setCookie("i_d", res.content.user.id.toString(), 7);
          }
        }
        break;
      case 400:
        openNotification("error", "Đăng nhập", "Đăng nhập không thành công");
        break;
      default:
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
      handleChangeLogin(values);
    },
  });

  useEffect(() => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin === true) {
      router.push("/");
    }

    formLogin.setFieldValue("email", getCookie("m"));
    formLogin.setFieldValue("password", getCookie("p"));
  }, []);

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
      <div className="w-full lg:w-[55%] bg-white rounded-xl px-5 py-7 lg:p-10">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-2xl">Đăng Nhập</h1>
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
              placeholder="Enter email"
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
            <p className="font-bold uppercase text-xs mb-3">Password</p>
            <Input.Password
              allowClear
              size="large"
              name="password"
              placeholder="Enter password"
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
            <Link
              href="/"
              className="text-custome-gray-200 transition-all duration-500 ease-in-out underline hover:underline hover:text-primary-100 text-[14px]"
            >
              Quay về trang chủ
            </Link>
          </div>
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-primary-100 text-white py-3 rounded-[7px] transition-all duration-500 ease-in-out hover:bg-primary-200 font-custom mt-5"
            >
              Đăng nhập
            </button>
          </Form.Item>
          <div className="text-center lg:hidden">
            <p>Bạn chưa có tài khoản?</p>
            <Link
              href="/auth/register"
              className="text-custome-black-100 underline hover:underline transition-all duration-500 ease-in-out hover:text-primary-100"
            >
              Đăng ký
            </Link>
          </div>
        </Form>
      </div>
      <div className="hidden lg:flex w-[45%] rounded-r-2xl text-white items-center justify-center flex-col px-10 gap-4 text-center">
        <h1 className="font-bold text-3xl">Chào mừng trở lại</h1>
        <p>Bạn chưa có tài khoản?</p>
        <Link
          href="/auth/register"
          className="border border-[#fff] px-10 py-2 rounded-[7px] cursor-pointer transition-all duration-500 ease-in-out hover:shadow-lg"
        >
          Đăng ký
        </Link>
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;
