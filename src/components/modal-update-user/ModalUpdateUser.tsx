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
import { ReqType } from "@/types/req/reqType.type";
import { User } from "@/types/user/userType.type";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getProfileAsync } from "@/services/profile/profile.service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { NotifiType } from "@/types/notifi/notifi.type";
import {
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import { setIsLoadingNotification } from "@/app/globalRedux/features/statusAppSlice";

const { confirm } = Modal;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalUpdateUser: React.FC<Props> = ({ open, setOpen }) => {
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { profile } = useSelector((state: RootState) => state.user);
  const { createNotification } = useNotifiCustome();

  const showPropsConfirm = (userUpdate: UserUpdate): void => {
    confirm({
      title: "Cập nhật thông tin",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn cập nhật lại thông tin",
      okText: "Cập nhật",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onCancel() {},
      onOk: () => {
        handleUpdateUser(userUpdate);
      },
    });
  };

  const initialValues: UserUpdate = {
    id: profile.id || 0,
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    birthday: profile.birthday || "",
    gender: profile.gender,
    role: profile.role || "USER",
  };

  const handleUpdateUser = async (userUpdate: UserUpdate): Promise<void> => {
    const res: ReqType<User> = await updateUserAsync(userUpdate);

    switch (res.statusCode) {
      case 200:
        openNotification("success", "Hồ sơ", "Cập nhật thông tin thành công");
        setOpen(false);
        if (typeof res.content === "object") {
          dispatch(getProfileAsync(res.content.id));
        }

        const newNotification: NotifiType = {
          id: `Pro${getFormattedDateTime()}`,
          title: "Hồ sơ",
          content: "Cập nhật thông tin thành công",
          date: `${getCurrentDateTime()}`,
          type: "success",
        };
        createNotification(
          `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`,
          newNotification
        );

        const action = setIsLoadingNotification();
        dispatch(action);
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
      phone: Yup.string()
        .matches(/^(0[3|5|7|8|9][0-9]{8})$/, "Số điện thoại không hợp lệ.")
        .required("Phone không được để trống"),
      birthday: Yup.date().nullable().required("Birthday không được để trống"),
    }),
    onSubmit: (values) => {
      showPropsConfirm(values);
    },
  });

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
              format={{
                format: "YYYY-MM-DD",
                type: "mask",
              }}
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

          <Form.Item>
            <Flex justify="end">
              <button
                type="submit"
                className="bg-primary-100 rounded-lg text-white px-5 py-2 font-[600]"
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
