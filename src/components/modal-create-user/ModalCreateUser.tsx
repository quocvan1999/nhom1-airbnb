"use client";

import { User } from "@/types/user/userType.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { ConfigProvider, DatePicker, Form, Input, Modal, Select } from "antd";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getUsersAsync } from "@/services/users/getUsers.service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/globalRedux/store";
import { createUserAsync } from "@/services/create-user/createUser.service";
import { ReqType } from "@/types/req/reqType.type";

type Props = {
  isModalCreateUserOpen: boolean;
  setIsModalCreateUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalCreateUser: React.FC<Props> = ({
  isModalCreateUserOpen,
  setIsModalCreateUserOpen,
}) => {
  const dispatch: AppDispatch = useDispatch();
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

  const handleCancel = (): void => {
    setIsModalCreateUserOpen(false);
  };

  const getData = (): void => {
    const action = getUsersAsync("1", "10", "");
    dispatch(action);
  };

  const handleChangeRegister = async (newUser: User): Promise<void> => {
    const res: ReqType<User> = await createUserAsync(newUser);

    switch (res.statusCode) {
      case 200:
        openNotification(
          "success",
          "Thêm người dùng",
          "Thêm người dùng thành công"
        );
        getData();
        setIsModalCreateUserOpen(false);
        break;
      default:
        openNotification("error", "Thêm người dùng", `${res.content}`);
        break;
    }
  };

  const formRegister = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Tên không được để trống"),
      email: Yup.string()
        .required("Email không được để trống")
        .email("Email không đúng định dạng"),
      password: Yup.string().required("Mật khẩu không được để trống"),
      phone: Yup.string().required("Số điện thoại không được để trống"),
      birthday: Yup.string().required("Ngày sinh không được để trống"),
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
      }}
    >
      <Modal
        width={750}
        open={isModalCreateUserOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="w-full bg-white rounded-xl">
          <div className="flex items-center justify-between mb-14">
            <h1 className="text-2xl">Thêm người dùng</h1>
          </div>
          <Form layout="vertical" onSubmitCapture={formRegister.handleSubmit}>
            <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-5">
              <div className="w-full">
                <Form.Item
                  validateStatus={
                    formRegister.touched.name && formRegister.errors.name
                      ? "error"
                      : ""
                  }
                  help={formRegister.touched.name && formRegister.errors.name}
                >
                  <p className="font-bold uppercase text-xs mb-3">Tên</p>
                  <Input
                    allowClear
                    size="large"
                    name="name"
                    placeholder="Nhập tên"
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
                    allowClear
                    size="large"
                    name="email"
                    placeholder="Nhập email"
                    value={formRegister.values.email}
                    onChange={formRegister.handleChange}
                    onBlur={formRegister.handleBlur}
                  />
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRegister.touched.password &&
                    formRegister.errors.password
                      ? "error"
                      : ""
                  }
                  help={
                    formRegister.touched.password &&
                    formRegister.errors.password
                  }
                >
                  <p className="font-bold uppercase text-xs mb-3">Mật khẩu</p>
                  <Input.Password
                    allowClear
                    size="large"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formRegister.values.password}
                    onChange={formRegister.handleChange}
                    onBlur={formRegister.handleBlur}
                  />
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRegister.touched.phone && formRegister.errors.phone
                      ? "error"
                      : ""
                  }
                  help={formRegister.touched.phone && formRegister.errors.phone}
                >
                  <p className="font-bold uppercase text-xs mb-3">
                    Số điện thoại
                  </p>
                  <Input
                    allowClear
                    size="large"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={formRegister.values.phone}
                    onChange={formRegister.handleChange}
                    onBlur={formRegister.handleBlur}
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <Form.Item
                  validateStatus={
                    formRegister.touched.birthday &&
                    formRegister.errors.birthday
                      ? "error"
                      : ""
                  }
                  help={
                    formRegister.touched.birthday &&
                    formRegister.errors.birthday
                  }
                >
                  <p className="font-bold uppercase text-xs mb-3">Ngày sinh</p>
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
                  <p className="font-bold uppercase text-xs mb-3">Giới tính</p>
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

                <Form.Item>
                  <p className="font-bold uppercase text-xs mb-3">
                    Loại tài khoản
                  </p>
                  <Select
                    size="large"
                    defaultValue={formRegister.values.role}
                    onChange={(value: string) =>
                      formRegister.setFieldValue("role", value)
                    }
                    options={[
                      { value: "ADMIN", label: "ADMIN" },
                      { value: "USER", label: "USER" },
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
                Thêm người dùng
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalCreateUser;
