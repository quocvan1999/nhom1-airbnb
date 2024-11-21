"use client";

import { User } from "@/types/user/userType.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import {
  ConfigProvider,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
} from "antd";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { createUserAsync } from "@/services/create-user/createUser.service";
import { ReqType } from "@/types/req/reqType.type";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { updateUserAsync } from "@/services/update-user/updateUser.service";
import { UserUpdate } from "@/types/user-update/userUpdate.type";
import {
  formatDate,
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { NotifiType } from "@/types/notifi/notifi.type";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { useLocale } from "next-intl";

type Props = {
  setModalType: React.Dispatch<
    React.SetStateAction<"create" | "view" | "update">
  >;
  userView: User | null;
  isModalViewUserOpen: boolean;
  setIsModalViewUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: "create" | "view" | "update";
  getData: () => void;
};

const { confirm } = Modal;

const ModalViewUser: React.FC<Props> = ({
  setModalType,
  userView,
  isModalViewUserOpen,
  setIsModalViewUserOpen,
  modalType,
  getData,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const { openNotification } = useNotification();
  const dispatch: AppDispatch = useDispatch();
  const { createNotification } = useNotifiCustome();
  const { profile } = useSelector((state: RootState) => state.user);

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

  const handleUpdateUser = async (userUpdate: UserUpdate): Promise<void> => {
    const res: ReqType<User> = await updateUserAsync(userUpdate);

    switch (res.statusCode) {
      case 200:
        openNotification(
          "success",
          "Cập nhật thông tin",
          "Cập nhật thông tin thành công"
        );
        setModalType("view");
        if (getData) {
          getData();
        }

        const newNotification: NotifiType = {
          id: `UpdUs${getFormattedDateTime()}`,
          title: "Quản lý người dùng",
          content: "Cập nhật thông tin thành công",
          date: `${getCurrentDateTime()}`,
          type: "success",
        };

        createNotification(
          `${process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN}-${profile.id}`,
          newNotification
        );
        const action = setIsLoadingNotification();
        dispatch(action);
        break;
      default:
        openNotification("error", "Cập nhật thông tin", `${res.content}`);
        break;
    }
  };

  const handleChange = async (newUser: User): Promise<void> => {
    switch (modalType) {
      case "create":
        const res: ReqType<User> = await createUserAsync(newUser);
        switch (res.statusCode) {
          case 200:
            openNotification(
              "success",
              "Thêm người dùng",
              "Thêm người dùng thành công"
            );
            router.push(`/${locale}/admin`);
            setIsModalViewUserOpen(false);

            const newNotification: NotifiType = {
              id: `CreUs${getFormattedDateTime()}`,
              title: "Quản lý người dùng",
              content: "Thêm người dùng thành công",
              date: `${getCurrentDateTime()}`,
              type: "success",
            };

            createNotification(
              `${process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN}-${profile.id}`,
              newNotification
            );
            const action = setIsLoadingNotification();
            dispatch(action);
            break;
          default:
            openNotification("error", "Thêm người dùng", `${res.content}`);
            break;
        }
        break;
      case "update":
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
            handleUpdateUser(newUser);
          },
        });
        break;
      default:
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
      password:
        modalType === "create"
          ? Yup.string().required("Mật khẩu không được để trống")
          : Yup.string(),
      phone: Yup.string()
        .matches(/^(0[3|5|7|8|9][0-9]{8})$/, "Số điện thoại không hợp lệ.")
        .required("Số điện thoại không được để trống"),
      birthday: Yup.string().required("Ngày sinh không được để trống"),
    }),
    onSubmit: async (values) => {
      await handleChange(values);
    },
  });

  useEffect(() => {
    if (modalType === "update" || modalType === "view") {
      if (userView !== null) {
        formRegister.setValues({
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
    }
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
            paddingBlockLG: 8,
            activeShadow: "none",
          },
          DatePicker: {
            lineWidth: 0,
            activeShadow: "transparent",
            colorBgContainer: "#f7f7f7",
            paddingInline: 10,
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
        open={isModalViewUserOpen}
        footer={null}
        closable={false}
      >
        <div className="w-full bg-white rounded-xl">
          <div
            className={`flex items-center justify-between ${
              modalType !== "view" && "mb-14"
            }`}
          >
            <h1 className="text-2xl font-bold">
              {modalType === "create"
                ? "Thêm người dùng"
                : modalType === "update"
                ? "Cập nhật thông tin người dùng"
                : "Thông tin người dùng"}
            </h1>
          </div>

          {modalType === "view" && (
            <div className="w-full flex items-center justify-center py-7">
              <div className="w-[70px] h-[70px] rounded-full border border-primary-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={
                    formRegister.values.avatar === ""
                      ? "/images/logo.jpg"
                      : formRegister.values.avatar
                  }
                  alt="hinh anh"
                  height="100%"
                  width="100%"
                  className="!object-cover"
                />
              </div>
            </div>
          )}

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
                  {modalType !== "view" ? (
                    <Input
                      allowClear
                      size="large"
                      name="name"
                      placeholder="Nhập tên"
                      value={formRegister.values.name}
                      onChange={formRegister.handleChange}
                      onBlur={formRegister.handleBlur}
                    />
                  ) : (
                    <p>{formRegister.values.name}</p>
                  )}
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
                  {modalType !== "view" ? (
                    <Input
                      allowClear
                      size="large"
                      name="email"
                      placeholder="Nhập email"
                      value={formRegister.values.email}
                      onChange={formRegister.handleChange}
                      onBlur={formRegister.handleBlur}
                    />
                  ) : (
                    <p>{formRegister.values.email}</p>
                  )}
                </Form.Item>

                {modalType === "create" && (
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
                )}

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
                  {modalType !== "view" ? (
                    <Input
                      allowClear
                      size="large"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={formRegister.values.phone}
                      onChange={formRegister.handleChange}
                      onBlur={formRegister.handleBlur}
                    />
                  ) : (
                    <p>{formRegister.values.phone}</p>
                  )}
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
                  {modalType !== "view" ? (
                    <DatePicker
                      name="birthday"
                      value={
                        formRegister.values.birthday
                          ? dayjs(formRegister.values.birthday)
                          : null
                      }
                      onChange={(date: dayjs.Dayjs | null) =>
                        formRegister.setFieldValue(
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
                  ) : (
                    <p>{formatDate(formRegister.values.birthday)}</p>
                  )}
                </Form.Item>

                <Form.Item>
                  <p className="font-bold uppercase text-xs mb-3">Giới tính</p>
                  {modalType !== "view" ? (
                    <Select
                      size="large"
                      defaultValue={formRegister.values.gender}
                      value={formRegister.values.gender}
                      onChange={(value: boolean) =>
                        formRegister.setFieldValue("gender", value)
                      }
                      options={[
                        { value: true, label: "Nam" },
                        { value: false, label: "Nữ" },
                      ]}
                    />
                  ) : (
                    <p>{formRegister.values.gender ? "Nam" : "Nữ"}</p>
                  )}
                </Form.Item>

                <Form.Item>
                  <p className="font-bold uppercase text-xs mb-3">
                    Loại tài khoản
                  </p>
                  {modalType !== "view" ? (
                    <Select
                      size="large"
                      defaultValue={formRegister.values.role}
                      value={formRegister.values.role}
                      onChange={(value: string) =>
                        formRegister.setFieldValue("role", value)
                      }
                      options={[
                        { value: "ADMIN", label: "ADMIN" },
                        { value: "USER", label: "USER" },
                      ]}
                    />
                  ) : (
                    <p>{formRegister.values.role}</p>
                  )}
                </Form.Item>
              </div>
            </div>

            <Form.Item className="!mb-0">
              <div className="flex items-center justify-end gap-3">
                {modalType !== "view" && (
                  <button
                    type="submit"
                    className=" bg-primary-100 text-white py-2 px-7 rounded-md font-custom"
                  >
                    {modalType === "create"
                      ? "Thêm người dùng"
                      : "Lưu thông tin"}
                  </button>
                )}
                {modalType === "view" && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalType("update");
                    }}
                    className=" bg-primary-100 text-white py-2 px-7 rounded-md font-custom"
                  >
                    Cập nhật thông tin
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsModalViewUserOpen(false);
                  }}
                  className="text-primary-100 py-2 px-7 rounded-md font-custom border border-primary-100"
                >
                  {modalType === "create"
                    ? "Đóng"
                    : modalType === "update"
                    ? "Huỷ"
                    : "Đóng"}
                </button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalViewUser;
