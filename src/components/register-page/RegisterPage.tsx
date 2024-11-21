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
import { useLocale } from "next-intl";

type Props = {};

const RegisterPage: React.FC<Props> = ({}) => {
  const locale = useLocale();
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
          "Đăng ký",
          "Đăng ký tài khoản mới thành công"
        );
        setTimeout(() => {
          router.push(`/${locale}/auth/login`);
        }, 300);
        break;
      default:
        openNotification(
          "warning",
          "Đăng ký",
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
      phone: Yup.string()
        .matches(/^(0[3|5|7|8|9][0-9]{8})$/, "Số điện thoại không hợp lệ.")
        .required("Phone không được để trống"),
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
          <h1 className="text-2xl">Đăng ký</h1>
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
                  format={{
                    format: "YYYY-MM-DD",
                    type: "mask",
                  }}
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
            href={`/${locale}`}
            className="text-custome-gray-200 underline transition-all duration-500 ease-in-out hover:underline hover:text-primary-100 text-[14px]"
          >
            Quay về trang chủ
          </Link>
          <Link
            href={`/${locale}/auth/login`}
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
