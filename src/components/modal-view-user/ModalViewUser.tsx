"use client";

import { Button, DatePicker, Flex, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { User } from "@/types/user/userType.type";
import { ExclamationCircleFilled, UserOutlined } from "@ant-design/icons";
import { UserUpdate } from "@/types/user-update/userUpdate.type";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { updateUserAsync } from "@/services/update-user/updateUser.service";
import { ReqType } from "@/types/req/reqType.type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/globalRedux/store";
import { getUsersAsync } from "@/services/users/getUsers.service";

const { confirm } = Modal;

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userView: User | null;
  searchParams: {
    page: string | number;
    size: string | number;
  };
};

const ModalViewUser: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  userView,
  searchParams,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
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

  const getData = (): void => {
    const action = getUsersAsync(searchParams.page, searchParams.size);
    dispatch(action);
  };

  const handleUpdateUser = async (userUpdate: UserUpdate): Promise<void> => {
    const res: ReqType<User> = await updateUserAsync(userUpdate);

    switch (res.statusCode) {
      case 200:
        openNotification("success", "Profile", "Cập nhật thông tin thành công");
        setIsUpdate(false);
        getData();
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

  const showPropsConfirm = (userUpdate: UserUpdate): void => {
    confirm({
      title: "Cập nhật thông tin",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn cập nhật lại thông tin",
      okText: "Cập nhật",
      okType: "danger",
      cancelText: "Huỷ",
      onCancel() {},
      onOk: () => {
        handleUpdateUser(userUpdate);
      },
    });
  };

  const formUser = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name không được để trống"),
      email: Yup.string()
        .required("Email không được để trống")
        .email("Email không đúng định dạng"),
      phone: Yup.string().required("Phone không được để trống"),
      birthday: Yup.string().required("Birthday không được để trống"),
    }),
    onSubmit: (values) => {
      switch (isUpdate) {
        case true:
          showPropsConfirm(values);
          break;
        case false:
          setIsUpdate(true);
          break;
        default:
          break;
      }
    },
  });

  useEffect(() => {
    if (userView !== null) {
      formUser.setValues({
        avatar: userView.avatar,
        birthday: userView.birthday,
        email: userView.email,
        gender: userView.gender,
        id: userView.id,
        name: userView.name,
        password: userView.password,
        phone: userView.phone,
        role: userView.role,
      });
    }
  }, []);

  return (
    <Modal
      title="Thông tin người dùng"
      width={750}
      open={isModalOpen}
      closable={false}
      footer={null}
    >
      <div className="w-full flex items-center justify-center py-7">
        <div className="w-[70px] h-[70px] rounded-full border border-primary-100 flex items-center justify-center">
          {formUser.values.avatar === "" ? (
            <UserOutlined className="text-[30px] !text-primary-100" />
          ) : (
            <img
              src={formUser.values.avatar}
              alt="image"
              className="w-full h-full bg-cover rounded-full"
            />
          )}
        </div>
      </div>
      <Form layout="vertical" onSubmitCapture={formUser.handleSubmit}>
        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-5">
          <div className="w-full">
            <Form.Item
              validateStatus={
                formUser.touched.id && formUser.errors.id ? "error" : ""
              }
              help={formUser.touched.id && formUser.errors.id}
            >
              <p className="font-bold uppercase text-xs mb-3">ID</p>
              {isUpdate ? (
                <Input
                  disabled
                  size="large"
                  name="id"
                  placeholder="Enter id"
                  value={formUser.values.id}
                  onChange={formUser.handleChange}
                  onBlur={formUser.handleBlur}
                />
              ) : (
                <p>{formUser.values.id}</p>
              )}
            </Form.Item>

            <Form.Item
              validateStatus={
                formUser.touched.name && formUser.errors.name ? "error" : ""
              }
              help={formUser.touched.name && formUser.errors.name}
            >
              <p className="font-bold uppercase text-xs mb-3">Tên</p>
              {isUpdate ? (
                <Input
                  size="large"
                  name="name"
                  placeholder="Enter name"
                  value={formUser.values.name}
                  onChange={formUser.handleChange}
                  onBlur={formUser.handleBlur}
                />
              ) : (
                <p>{formUser.values.name}</p>
              )}
            </Form.Item>

            <Form.Item
              validateStatus={
                formUser.touched.email && formUser.errors.email ? "error" : ""
              }
              help={formUser.touched.email && formUser.errors.email}
            >
              <p className="font-bold uppercase text-xs mb-3">Email</p>
              {isUpdate ? (
                <Input
                  size="large"
                  name="email"
                  placeholder="Enter email"
                  value={formUser.values.email}
                  onChange={formUser.handleChange}
                  onBlur={formUser.handleBlur}
                />
              ) : (
                <p>{formUser.values.email}</p>
              )}
            </Form.Item>

            <Form.Item
              validateStatus={
                formUser.touched.phone && formUser.errors.phone ? "error" : ""
              }
              help={formUser.touched.phone && formUser.errors.phone}
            >
              <p className="font-bold uppercase text-xs mb-3">Số điện thoại</p>
              {isUpdate ? (
                <Input
                  size="large"
                  name="phone"
                  placeholder="Enter phone"
                  value={formUser.values.phone}
                  onChange={formUser.handleChange}
                  onBlur={formUser.handleBlur}
                />
              ) : (
                <p>{formUser.values.phone}</p>
              )}
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              validateStatus={
                formUser.touched.birthday && formUser.errors.birthday
                  ? "error"
                  : ""
              }
              help={formUser.touched.birthday && formUser.errors.birthday}
            >
              <p className="font-bold uppercase text-xs mb-3">Ngày sinh</p>
              {isUpdate ? (
                <DatePicker
                  name="birthday"
                  value={
                    formUser.values.birthday
                      ? dayjs(formUser.values.birthday)
                      : null
                  }
                  onChange={(date: dayjs.Dayjs | null) =>
                    formUser.setFieldValue(
                      "birthday",
                      date ? date.toISOString() : null
                    )
                  }
                  size="large"
                  className="w-full"
                />
              ) : (
                <p>{formUser.values.birthday}</p>
              )}
            </Form.Item>

            <Form.Item>
              <p className="font-bold uppercase text-xs mb-3">Giới tính</p>
              {isUpdate ? (
                <Select
                  size="large"
                  defaultValue={formUser.values.gender}
                  onChange={(value: boolean) =>
                    formUser.setFieldValue("gender", value)
                  }
                  options={[
                    { value: true, label: "Nam" },
                    { value: false, label: "Nữ" },
                  ]}
                />
              ) : (
                <p>{formUser.values.gender ? "Nam" : "Nữ"}</p>
              )}
            </Form.Item>

            <Form.Item>
              <p className="font-bold uppercase text-xs mb-3">Loại tài khoản</p>
              {isUpdate ? (
                <Select
                  size="large"
                  defaultValue={formUser.values.role}
                  onChange={(value: string) =>
                    formUser.setFieldValue("role", value)
                  }
                  options={[
                    { value: "ADMIN", label: "ADMIN" },
                    { value: "USER", label: "USER" },
                  ]}
                />
              ) : (
                <p>{formUser.values.role}</p>
              )}
            </Form.Item>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Form.Item className="!mb-0">
            <Flex align="center" justify="end" gap={5}>
              <button
                type="submit"
                className="w-full text-primary-100 py-1 px-4 rounded-md font-custom border border-primary-100"
              >
                {isUpdate ? "Lưu thông tin" : "Cập nhật thông tin"}
              </button>
              <Button
                onClick={() => {
                  switch (isUpdate) {
                    case false:
                      setIsModalOpen(false);
                      break;
                    case true:
                      setIsUpdate(false);
                      break;
                    default:
                      break;
                  }
                }}
                className="!bg-primary-100 !text-white !border-primary-100"
              >
                {isUpdate ? "Huỷ" : "Đóng"}
              </Button>
            </Flex>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalViewUser;
