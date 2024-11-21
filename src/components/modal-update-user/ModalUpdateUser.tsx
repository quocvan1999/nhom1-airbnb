"use client";

import React from "react";
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
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
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
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { useTranslations } from "next-intl";

const { confirm } = Modal;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalUpdateUser: React.FC<Props> = ({ open, setOpen }) => {
  const tModalUpdateUser = useTranslations("ModalUpdateUser");
  const tNotification = useTranslations("Notification");
  const tLocalNotifi = useTranslations("LocalNotifi");
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { profile } = useSelector((state: RootState) => state.user);
  const { createNotification } = useNotifiCustome();

  const showPropsConfirm = (userUpdate: UserUpdate): void => {
    confirm({
      title: `${tModalUpdateUser("ConfirmUpdate.title")}`,
      icon: <ExclamationCircleFilled />,
      content: `${tModalUpdateUser("ConfirmUpdate.content")}`,
      okText: `${tModalUpdateUser("ConfirmUpdate.okTetx")}`,
      okType: "danger",
      cancelText: `${tModalUpdateUser("ConfirmUpdate.cancelText")}`,
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
        openNotification(
          "success",
          `${tNotification("ModalUpdateUser.UpdateSuccess.title")}`,
          `${tNotification("ModalUpdateUser.UpdateSuccess.content")}`
        );
        setOpen(false);
        if (typeof res.content === "object") {
          dispatch(getProfileAsync(res.content.id));
        }

        const newNotification: NotifiType = {
          id: `Pro${getFormattedDateTime()}`,
          title: `${tLocalNotifi("ModalUpdateUser.UpdateSuccess.title")}`,
          content: `${tLocalNotifi("ModalUpdateUser.UpdateSuccess.content")}`,
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
          `${tNotification("ModalUpdateUser.UpdateError.title")}`,
          `${tNotification("ModalUpdateUser.UpdateError.content")}`
        );
        break;
    }
  };

  const formUpdate = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required(
        `${tModalUpdateUser("FormUpdateUser.name.required")}`
      ),
      email: Yup.string()
        .required(`${tModalUpdateUser("FormUpdateUser.email.required")}`)
        .email(`${tModalUpdateUser("FormUpdateUser.email.format")}`),
      phone: Yup.string()
        .matches(
          /^(0[3|5|7|8|9][0-9]{8})$/,
          `${tModalUpdateUser("FormUpdateUser.phone.matches")}`
        )
        .required(`${tModalUpdateUser("FormUpdateUser.phone.required")}`),
      birthday: Yup.date()
        .nullable()
        .required(`${tModalUpdateUser("FormUpdateUser.birthday.required")}`),
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
        title={tModalUpdateUser("title")}
        open={open}
        onCancel={() => setOpen(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Form layout="vertical" onSubmitCapture={formUpdate.handleSubmit}>
          <Form.Item
            label={tModalUpdateUser("FormLabel.name")}
            validateStatus={
              formUpdate.touched.name && formUpdate.errors.name ? "error" : ""
            }
            help={formUpdate.touched.name && formUpdate.errors.name}
          >
            <Input
              size="large"
              name="name"
              placeholder={tModalUpdateUser("FormPlaceholder.name")}
              value={formUpdate.values.name}
              onChange={formUpdate.handleChange}
              onBlur={formUpdate.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={tModalUpdateUser("FormLabel.email")}
            validateStatus={
              formUpdate.touched.email && formUpdate.errors.email ? "error" : ""
            }
            help={formUpdate.touched.email && formUpdate.errors.email}
          >
            <Input
              size="large"
              name="email"
              placeholder={tModalUpdateUser("FormPlaceholder.email")}
              value={formUpdate.values.email}
              onChange={formUpdate.handleChange}
              onBlur={formUpdate.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={tModalUpdateUser("FormLabel.phone")}
            validateStatus={
              formUpdate.touched.phone && formUpdate.errors.phone ? "error" : ""
            }
            help={formUpdate.touched.phone && formUpdate.errors.phone}
          >
            <Input
              size="large"
              name="phone"
              placeholder={tModalUpdateUser("FormPlaceholder.phone")}
              value={formUpdate.values.phone}
              onChange={formUpdate.handleChange}
              onBlur={formUpdate.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={tModalUpdateUser("FormLabel.birthday")}
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

          <Form.Item label={tModalUpdateUser("FormLabel.gender")}>
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
                {tModalUpdateUser("buttonUpdateTitle")}
              </button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalUpdateUser;
