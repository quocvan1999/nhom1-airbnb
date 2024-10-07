"use client";

import { LoginType } from "@/types/login/loginType.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { getCookie } from "@/utils/method/method";
import { Checkbox, ConfigProvider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";

type Props = {};

const AdminLoginPage: React.FC<Props> = ({}) => {
  const router: AppRouterInstance = useRouter();
  const [isRemember, setIsRemember] = useState<boolean>(false);
  const initialValues: LoginType = {
    email: "",
    password: "",
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
      console.log(values);
    },
  });

  useEffect(() => {
    formLogin.setFieldValue("email", getCookie("m_a"));
    formLogin.setFieldValue("password", getCookie("p_a"));
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
      <div className="w-[350px] md:w-[400px] bg-white rounded-xl px-5 md:px-7 py-7 shadow-lg border mx-2">
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
          <div className="flex items-center justify-between">
            <Checkbox
              onChange={() => setIsRemember(!isRemember)}
              checked={isRemember}
              className="text-[#fff] "
            >
              Nhớ mật khẩu
            </Checkbox>
            <Link
              href="/admin"
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
    </ConfigProvider>
  );
};

export default AdminLoginPage;
