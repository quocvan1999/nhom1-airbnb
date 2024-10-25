"use client";

import useNotification from "@/custome-hook/useNotification/useNotification";
import { User } from "@/types/user/userType.type";
import { useFormik } from "formik";
import { ConfigProvider, DatePicker, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { registerAsync } from "@/services/register/register.service";
import React from "react";
import Link from "next/link";
import * as Yup from "yup";

type Props = {};

const RegisterPage: React.FC<Props> = ({}) => {
  const router: AppRouterInstance = useRouter();
  const { openNotification } = useNotification();

  const initialValues: User = {
    id: 0,
    name: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
    gender: true,
    role: "USER",
    avatar: "",
  };

  const handleChangeRegister = async (newUser: User): Promise<void> => {
    const res = await registerAsync(newUser);
    switch (res.statusCode) {
      case 200:
        openNotification(
          "success",
          "Signup",
          "Đăng ký tài khoản mới thành công"
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 300);
        break;
      default:
        openNotification(
          "warning",
          "Signup",
          "Đăng ký tài khoản không thành công"
        );
        break;
    }
  };

  const formRegister = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name không được để trống"),
      email: Yup.string()
        .required("Email không được để trống")
        .email("Email không đúng định dạng"),
      password: Yup.string().required("Password không được để trống"),
      phone: Yup.string().required("Phone không được để trống"),
      birthday: Yup.string().required("Birthday không được để trống"),
    }),
    onSubmit: (values) => {
      handleChangeRegister(values);
    },
  });

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
          DatePicker: {
            lineWidth: 0,
            activeShadow: "transparent",
            colorBgContainer: "#f7f7f7",
            paddingInline: 20,
          },
          Dropdown: {
            borderRadiusLG: 0,
            borderRadius: 0,
            borderRadiusOuter: 0,
            borderRadiusSM: 0,
            borderRadiusXS: 0,
          },
          Select: {
            colorBorder: "transparent",
            colorBgContainer: "#f7f7f7",
            borderRadiusLG: 7,
          },
        },
        token: {
          colorPrimary: "#FF385C",
          colorLink: "#FF385C",
        },
      }}
    >
      <div className="w-full bg-white rounded-xl px-5 py-7 lg:px-10 lg:py-14">
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
        <Form layout="vertical" onSubmitCapture={formRegister.handleSubmit}>
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-5">
            <div className="w-full">
              <Form.Item
                validateStatus={
                  formRegister.touched.name && formRegister.errors.name
                    ? "error"
                    : ""
                }
                help={formRegister.touched.name && formRegister.errors.name}
              >
                <p className="font-bold uppercase text-xs mb-3">Name</p>
                <Input
                  size="large"
                  name="name"
                  placeholder="Enter name"
                  value={formRegister.values.name}
                  onChange={formRegister.handleChange}
                  onBlur={formRegister.handleBlur}
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formRegister.touched.email && formRegister.errors.email
                    ? "error"
                    : ""
                }
                help={formRegister.touched.email && formRegister.errors.email}
              >
                <p className="font-bold uppercase text-xs mb-3">Email</p>
                <Input
                  size="large"
                  name="email"
                  placeholder="Enter email"
                  value={formRegister.values.email}
                  onChange={formRegister.handleChange}
                  onBlur={formRegister.handleBlur}
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formRegister.touched.password && formRegister.errors.password
                    ? "error"
                    : ""
                }
                help={
                  formRegister.touched.password && formRegister.errors.password
                }
              >
                <p className="font-bold uppercase text-xs mb-3">Password</p>
                <Input.Password
                  size="large"
                  name="password"
                  placeholder="Enter password"
                  value={formRegister.values.password}
                  onChange={formRegister.handleChange}
                  onBlur={formRegister.handleBlur}
                />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                validateStatus={
                  formRegister.touched.phone && formRegister.errors.phone
                    ? "error"
                    : ""
                }
                help={formRegister.touched.phone && formRegister.errors.phone}
              >
                <p className="font-bold uppercase text-xs mb-3">Phone</p>
                <Input
                  size="large"
                  name="phone"
                  placeholder="Enter phone"
                  value={formRegister.values.phone}
                  onChange={formRegister.handleChange}
                  onBlur={formRegister.handleBlur}
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formRegister.touched.birthday && formRegister.errors.birthday
                    ? "error"
                    : ""
                }
                help={
                  formRegister.touched.birthday && formRegister.errors.birthday
                }
              >
                <p className="font-bold uppercase text-xs mb-3">birthday</p>
                <DatePicker
                  name="birthday"
                  size="large"
                  className="w-full !rounded-[7px] !py-[10px]"
                  defaultValue={formRegister.values.birthday}
                  onChange={(_date: string, dateString: string | string[]) =>
                    formRegister.setFieldValue("birthday", dateString)
                  }
                  onBlur={formRegister.handleBlur}
                />
              </Form.Item>

              <Form.Item>
                <p className="font-bold uppercase text-xs mb-3">Gender</p>
                <Select
                  size="large"
                  defaultValue={formRegister.values.gender}
                  onChange={(value: boolean) =>
                    formRegister.setFieldValue("gender", value)
                  }
                  options={[
                    { value: true, label: "Nam" },
                    { value: false, label: "Nữ" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <button
              type="submit"
              className="w-full bg-primary-100 text-white py-3 rounded-[7px] transition-all duration-500 ease-in-out hover:bg-primary-200 font-custom"
            >
              Đăng ký
            </button>
          </Form.Item>
        </Form>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-custome-gray-200 underline transition-all duration-500 ease-in-out hover:underline hover:text-primary-100 text-[14px]"
          >
            Quay về trang chủ
          </Link>
          <Link
            href="/auth/login"
            className="text-custome-gray-200 underline transition-all duration-500 ease-in-out hover:underline hover:text-primary-100 text-[14px]"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RegisterPage;
