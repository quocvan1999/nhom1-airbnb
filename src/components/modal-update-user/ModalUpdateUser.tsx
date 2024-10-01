"use client";

import React, { useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/globalRedux/store";
import dayjs from "dayjs";
import { updateUserAsync } from "@/services/update-user/updateUser.service";
import { UserUpdate } from "@/types/user-update/userUpdate.type";
import { ReqType } from "@/types/req-login/reqLoginType.type";
import { User } from "@/types/user/userType.type";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getProfileAsync } from "@/services/profile/profile.service";

type Props = {};

const ModalUpdateUser: React.FC<Props> = ({}) => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { openNotification } = useNotification();
  const { profile } = useSelector((state: RootState) => state.user);

  const initialValues: UserUpdate = {
    id: profile.id || 0,
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    birthday: profile.birthday || "",
    gender: profile.gender,
    role: profile.role || "",
  };

  const handleUpdateUser = async (userUpdate: UserUpdate): Promise<void> => {
    const res: ReqType<User> = await updateUserAsync(userUpdate);

    switch (res.statusCode) {
      case 200:
        openNotification("success", "Profile", "Cập nhật thông tin thành công");
        setOpen(false);
        if (typeof res.content === "object") {
          dispatch(getProfileAsync(res.content.id));
        }
        break;
      default:
        openNotification(
          "warning",
          "Profile",
          "Cập nhật thông tin không thành công"
        );
        break;
    }
  };

  const formUpdate = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name không được để trống"),
      email: Yup.string()
        .required("Email không được để trống")
        .email("Email không đúng định dạng"),
      phone: Yup.string().required("Phone không được để trống"),
      birthday: Yup.date().nullable().required("Birthday không được để trống"),
    }),
    onSubmit: (values) => {
      handleUpdateUser(values);
    },
  });

  const showModal = (): void => {
    setOpen(true);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: "#FF385C",
            activeShadow: "#FF385C",
            activeBorderColor: "#FF385C",
          },
          Button: {
            dangerColor: "#FF385C",
          },
          DatePicker: {
            activeBorderColor: "#FF385C",
            hoverBorderColor: "#FF385C",
            activeShadow: "#FF385C",
          },
          Select: {
            colorPrimary: "#FF385C",
            colorFillSecondary: "#FF385C",
            colorPrimaryHover: "#FF385C",
          },
        },
      }}
    >
      <p
        onClick={showModal}
        className="!border-none !shadow-none !outline-none underline hover:!text-black !bg-transparent !text-custome-black-100 cursor-pointer mt-4"
      >
        Chỉnh sửa hồ sơ
      </p>
      <Modal
        title="Chỉnh sửa hồ sơ"
        open={open}
        onCancel={() => setOpen(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Form layout="vertical" onSubmitCapture={formUpdate.handleSubmit}>
          <Form.Item label="ID">
            <Input
              disabled
              size="large"
              name="id"
              placeholder="Enter id"
              value={formUpdate.values.id}
            />
          </Form.Item>

          <Form.Item
            label="Name"
            validateStatus={
              formUpdate.touched.name && formUpdate.errors.name ? "error" : ""
            }
            help={formUpdate.touched.name && formUpdate.errors.name}
          >
            <Input
              size="large"
              name="name"
              placeholder="Enter name"
              value={formUpdate.values.name}
              onChange={formUpdate.handleChange}
              onBlur={formUpdate.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={
              formUpdate.touched.email && formUpdate.errors.email ? "error" : ""
            }
            help={formUpdate.touched.email && formUpdate.errors.email}
          >
            <Input
              size="large"
              name="email"
              placeholder="Enter email"
              value={formUpdate.values.email}
              onChange={formUpdate.handleChange}
              onBlur={formUpdate.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            validateStatus={
              formUpdate.touched.phone && formUpdate.errors.phone ? "error" : ""
            }
            help={formUpdate.touched.phone && formUpdate.errors.phone}
          >
            <Input
              size="large"
              name="phone"
              placeholder="Enter phone"
              value={formUpdate.values.phone}
              onChange={formUpdate.handleChange}
              onBlur={formUpdate.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Birthday"
            validateStatus={
              formUpdate.touched.birthday && formUpdate.errors.birthday
                ? "error"
                : ""
            }
            help={formUpdate.touched.birthday && formUpdate.errors.birthday}
          >
            <DatePicker
              name="birthday"
              value={
                formUpdate.values.birthday
                  ? dayjs(formUpdate.values.birthday)
                  : null
              }
              onChange={(date: dayjs.Dayjs | null) =>
                formUpdate.setFieldValue(
                  "birthday",
                  date ? date.toISOString() : null
                )
              }
              size="large"
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Gender">
            <Select
              size="large"
              defaultValue={formUpdate.values.gender}
              onChange={(value: boolean) =>
                formUpdate.setFieldValue("gender", value)
              }
              options={[
                { value: true, label: "Nam" },
                { value: false, label: "Nữ" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Role">
            <Select
              size="large"
              defaultValue={formUpdate.values.role}
              onChange={(value: string) =>
                formUpdate.setFieldValue("role", value)
              }
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "USER", label: "User" },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="end">
              <button
                type="submit"
                className="bg-primary-100 rounded-lg text-white px-5 py-2"
              >
                Cập nhật
              </button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalUpdateUser;
