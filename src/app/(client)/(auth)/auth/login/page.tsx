"use client";

import { Checkbox, ConfigProvider, Form, Input } from "antd";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { LoginType } from "@/types/login/loginType.type";
import { LoginAsync } from "@/services/login/login.service";
import { ReqType } from "@/types/req-login/reqLoginType.type";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/utils/method/method";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/globalRedux/store";
import { getProfileAsync } from "@/services/profile/profile.service";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { User } from "@/types/user/userType.type";

type Props = {};

const Login: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [isRemember, setIsRemember] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { checkIsLogin } = useCheckLogin();

  const initialValues: LoginType = {
    email: getCookie("m") || "",
    password: getCookie("p") || "",
  };

  const handleChangeLogin: (user: LoginType) => void = async (user) => {
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
          setCookie("i_d", res.content.user.id.toString(), 7);
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
    const isLogin = checkIsLogin();

    if (isLogin === true) {
      router.push("/");
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            borderRadiusLG: 100,
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
      <div className="w-[55%] bg-white rounded-2xl p-10">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-2xl">Đăng Nhập</h1>
          <div className="flex items-center gap-3">
            <div className="w-[35px] h-[35px] flex items-center justify-center border rounded-full transition-all duration-500 ease-in-out hover:shadow-lg cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ fill: "#6a6a6a" }}
              >
                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
              </svg>
            </div>
            <div className="w-[35px] h-[35px] flex items-center justify-center border rounded-full transition-all duration-500 ease-in-out hover:shadow-lg cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ fill: "#6a6a6a" }}
              >
                <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
              </svg>
            </div>
          </div>
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
              size="large"
              name="password"
              placeholder="Enter password"
              value={formLogin.values.password}
              onChange={formLogin.handleChange}
              onBlur={formLogin.handleBlur}
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-primary-100 text-white py-3 rounded-full transition-all duration-500 ease-in-out hover:bg-primary-200 font-custom"
            >
              Đăng nhập
            </button>
          </Form.Item>
        </Form>
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
            className="text-custome-gray-200 transition-all duration-500 ease-in-out hover:underline text-[14px]"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
      <div className="w-[45%] h-full rounded-r-2xl text-white flex items-center justify-center flex-col px-10 gap-4 text-center">
        <h1 className="font-bold text-3xl">Chào mừng trở lại</h1>
        <p>Bạn chưa có tài khoản?</p>
        <Link
          href="/auth/register"
          className="border border-[#fff] px-10 py-2 rounded-full cursor-pointer transition-all duration-500 ease-in-out hover:shadow-lg"
        >
          Đăng ký
        </Link>
      </div>
    </ConfigProvider>
  );
};

export default Login;
