"use client";

import { RoomType } from "@/types/room/roomType.type";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
} from "antd";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ReqType } from "@/types/req/reqType.type";
import { createRoomAsync } from "@/services/create-room/createRoom.service";
import { useRouter } from "next/navigation";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import { updateRoomAsync } from "@/services/update-room/updateRoom.service";
import { NotifiType } from "@/types/notifi/notifi.type";
import {
  getCookie,
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { LocationType } from "@/types/location/locationType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";
import { OptionSelectType } from "@/types/option-select/optionSelectType.type";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { useLocale } from "next-intl";

const { TextArea } = Input;

type Props = {
  roomView: RoomType | null;
  modalType: "create" | "view" | "update";
  setModalType: React.Dispatch<
    React.SetStateAction<"create" | "view" | "update">
  >;
  isModalViewRoomsOpen: boolean;
  setIsModalViewRoomsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getData: () => void;
};

const { confirm } = Modal;

const ModalViewRoom: React.FC<Props> = ({
  getData,
  roomView,
  modalType,
  setModalType,
  isModalViewRoomsOpen,
  setIsModalViewRoomsOpen,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const { checkIsLogin } = useCheckLogin();
  const { openNotification } = useNotification();
  const dispatch: AppDispatch = useDispatch();
  const [token, setToken] = useState<string>("");
  const { createNotification } = useNotifiCustome();
  const [location, setLocation] = useState<OptionSelectType[]>([]);
  const [locationData, setLocationData] = useState<LocationType[]>([]);
  const { profile } = useSelector((state: RootState) => state.user);
  const [file, setFile] = useState<any>(null);
  const [isReadingUpload, setIsReadUpload] = useState<boolean>(false);

  const initialValues: RoomType = {
    id: 0,
    tenPhong: "",
    khach: 0,
    phongNgu: 0,
    giuong: 0,
    phongTam: 0,
    moTa: "",
    giaTien: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 0,
    hinhAnh: "",
  };

  const handleChangeUploadFile: UploadProps["onChange"] = ({ file }) => {
    setIsReadUpload(false);
    let isPass: boolean = true;
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        isPass = false;
        openNotification(
          "warning",
          "Thêm phòng",
          "Vui lòng chọn file có định dạng (jpg, jpeg, png, gif)"
        );
        return;
      }

      const maxSizeInBytes = 1 * 1024 * 1024;
      const fileSize = file.size ?? 0;
      if (fileSize > maxSizeInBytes) {
        isPass = false;
        openNotification(
          "warning",
          "Thêm phòng",
          "Dung lượng hình phải dưới 1M"
        );
        return;
      }

      if (isPass) {
        setIsReadUpload(true);
        setFile(file);
      }
    }
  };

  const handleUpload = async (id: number): Promise<boolean> => {
    if (!file) {
      setIsReadUpload(false);
      openNotification("warning", "Thêm phòng", "Vui lòng chọn ảnh phòng");
      return false;
    }

    setIsReadUpload(true);
    const formData = new FormData();
    formData.append("formFile", file);

    try {
      const response = await fetch(
        `https://airbnbnew.cybersoft.edu.vn/api/phong-thue/upload-hinh-phong?maPhong=${id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            tokenCybersoft: process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || "",
            token: token,
          },
        }
      );
      if (response.ok) {
        setFile(null);
        return true;
      } else {
        setFile(null);
        return false;
      }
    } catch (error) {
      setFile(null);
      return false;
    }
  };

  const getLocation = async (): Promise<void> => {
    const res: AxiosResponse = await httpClient.get("/api/vi-tri");

    setLocationData(res.data.content);

    if (res.data.content.length > 0) {
      res.data.content.map((district: LocationType) =>
        setLocation((prevItems) => [
          ...prevItems,
          {
            value: district.id.toString(),
            label: `${district.tenViTri}, ${district.tinhThanh}, ${district.quocGia}`,
          },
        ])
      );
    }
  };

  const handleUpdateRoom = async (roomUpdate: RoomType): Promise<void> => {
    const res: ReqType<RoomType> = await updateRoomAsync(roomUpdate);

    switch (res.statusCode) {
      case 200:
        let isPast = true;
        if (file !== null) {
          const uploadImage: boolean = await handleUpload(roomUpdate.id);

          if (uploadImage) {
            isPast = true;
          } else {
            isPast = false;
          }
        }

        if (isPast) {
          openNotification(
            "success",
            "Cập nhật thông tin",
            "Cập nhật thông tin thành công"
          );

          setIsModalViewRoomsOpen(false);
          getData();

          const newNotification: NotifiType = {
            id: `UpdRo${getFormattedDateTime()}`,
            title: "Quản lý phòng",
            content: "Cập nhật phòng thành công",
            date: `${getCurrentDateTime()}`,
            type: "success",
          };

          createNotification(
            `${process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN}-${profile.id}`,
            newNotification
          );
          const action = setIsLoadingNotification();
          dispatch(action);
        } else {
          openNotification(
            "error",
            "Cập nhật thông tin",
            "Cập nhật thông không tin thành công"
          );
        }
        break;
      default:
        openNotification("error", "Cập nhật thông tin", `${res.content}`);
        break;
    }
  };

  const handleChange = async (newRoom: RoomType): Promise<void> => {
    switch (modalType) {
      case "view":
        setModalType("update");
        break;
      case "create":
        if (isReadingUpload) {
          const res: ReqType<RoomType> = await createRoomAsync(newRoom);

          switch (res.statusCode) {
            case 201:
              if (typeof res.content === "object") {
                const uploadImage: boolean = await handleUpload(res.content.id);

                if (uploadImage) {
                  openNotification(
                    "success",
                    "Thêm phòng",
                    "Thêm phòng thành công"
                  );
                  router.push(`/${locale}/admin/rooms`);
                  setIsModalViewRoomsOpen(false);

                  const newNotification: NotifiType = {
                    id: `CreRo${getFormattedDateTime()}`,
                    title: "Quản lý phòng",
                    content: "Thêm phòng thành công",
                    date: `${getCurrentDateTime()}`,
                    type: "success",
                  };

                  createNotification(
                    `${process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN}-${profile.id}`,
                    newNotification
                  );
                  const action = setIsLoadingNotification();
                  dispatch(action);
                }
              } else {
                openNotification(
                  "error",
                  "Thêm phòng",
                  "Thêm ảnh phòng không thành công"
                );
              }
              break;
            default:
              openNotification("error", "Thêm phòng", `${res.content}`);
              break;
          }
        } else {
          setIsReadUpload(false);
          openNotification("warning", "Thêm phòng", "Vui lòng chọn ảnh phòng");
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
          onCancel() {},
          onOk: () => {
            handleUpdateRoom(newRoom);
          },
        });
        break;
      default:
        break;
    }
  };

  const formRoom = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      tenPhong: Yup.string().required("Tên phòng không được để trống"),
      khach: Yup.number()
        .min(1, "Khách phải lớn hơn 0")
        .required("Số lượng khách không được để trống"),
      phongNgu: Yup.number()
        .min(1, "Phòng ngủ phải lớn hơn 0")
        .required("Số lượng phòng ngủ không được để trống"),
      giuong: Yup.number()
        .min(1, "Giường phải lớn hơn 0")
        .required("Số lượng giường không được để trống"),
      phongTam: Yup.number()
        .min(1, "Phòng tắm phải lớn hơn 0")
        .required("Số lượng phòng tắm không được để trống"),
      moTa: Yup.string().required("Mô tả không được để trống"),
      giaTien: Yup.number()
        .min(1, "Giá tiền phải lớn hơn 0")
        .required("Giá tiền không được để trống"),
      maViTri: Yup.number().required("Vị trí không được để trống"),
    }),
    onSubmit: (values) => {
      handleChange(values);
    },
  });

  const setLocationName = (id: number): string => {
    let name: string = "";

    const checkName: LocationType | undefined = locationData.find(
      (item: LocationType) => item.id === id
    );

    if (checkName) {
      name = `${checkName.tenViTri}, ${checkName.tinhThanh}, ${checkName.quocGia}`;
    } else {
      locationData.map((item: LocationType, index: number) => {
        name = `${item.tenViTri}, ${item.tinhThanh}, ${item.quocGia}`;
        if (index < 1) {
          return;
        }
      });
    }

    return name;
  };

  useEffect(() => {
    getLocation();
    if (modalType === "update" || modalType === "view") {
      if (roomView !== null) {
        formRoom.setValues({
          id: roomView.id,
          tenPhong: roomView.tenPhong,
          khach: roomView.khach,
          phongNgu: roomView.phongNgu,
          giuong: roomView.giuong,
          phongTam: roomView.phongTam,
          moTa: roomView.moTa,
          giaTien: roomView.giaTien,
          mayGiat: roomView.mayGiat,
          banLa: roomView.banLa,
          tivi: roomView.tivi,
          dieuHoa: roomView.dieuHoa,
          wifi: roomView.wifi,
          bep: roomView.bep,
          doXe: roomView.doXe,
          hoBoi: roomView.hoBoi,
          banUi: roomView.banUi,
          maViTri: roomView.maViTri,
          hinhAnh: roomView.hinhAnh,
        });
      }
    }

    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin === true) {
      const getTokent: string | null = getCookie("accessToken");

      if (getTokent) {
        setToken(getTokent);
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
        open={isModalViewRoomsOpen}
        footer={null}
        closable={false}
      >
        <div className="w-full bg-white rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">
              {modalType === "create"
                ? "Thêm phòng"
                : modalType === "update"
                ? "Cập nhật thông tin phòng"
                : "Thông tin phòng"}
            </h1>
          </div>
          <Form layout="vertical" onSubmitCapture={formRoom.handleSubmit}>
            <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-5">
              <div className="w-full">
                {modalType === "view" && (
                  <Form.Item
                    validateStatus={
                      formRoom.touched.id && formRoom.errors.id ? "error" : ""
                    }
                    help={formRoom.touched.id && formRoom.errors.id}
                  >
                    <p className="font-bold uppercase text-xs mb-3">ID</p>
                    {modalType !== "view" ? (
                      <Input
                        allowClear
                        size="large"
                        name="id"
                        value={formRoom.values.id}
                        onChange={formRoom.handleChange}
                        onBlur={formRoom.handleBlur}
                      />
                    ) : (
                      <p>{formRoom.values.id}</p>
                    )}
                  </Form.Item>
                )}

                <Form.Item
                  validateStatus={
                    formRoom.touched.tenPhong && formRoom.errors.tenPhong
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.tenPhong && formRoom.errors.tenPhong}
                >
                  <p className="font-bold uppercase text-xs mb-3">Tên phòng</p>
                  {modalType !== "view" ? (
                    <Input
                      allowClear
                      size="large"
                      name="tenPhong"
                      placeholder="Nhập tên phòng"
                      value={formRoom.values.tenPhong}
                      onChange={formRoom.handleChange}
                      onBlur={formRoom.handleBlur}
                    />
                  ) : (
                    <p>{formRoom.values.tenPhong}</p>
                  )}
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRoom.touched.khach && formRoom.errors.khach
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.khach && formRoom.errors.khach}
                >
                  <p className="font-bold uppercase text-xs mb-3">Khách</p>
                  {modalType !== "view" ? (
                    <Input
                      type="number"
                      allowClear
                      size="large"
                      name="khach"
                      placeholder="Nhập số lượng khách"
                      value={formRoom.values.khach}
                      onChange={formRoom.handleChange}
                      onBlur={formRoom.handleBlur}
                    />
                  ) : (
                    <p>{formRoom.values.khach}</p>
                  )}
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRoom.touched.phongNgu && formRoom.errors.phongNgu
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.phongNgu && formRoom.errors.phongNgu}
                >
                  <p className="font-bold uppercase text-xs mb-3">Phòng ngủ</p>
                  {modalType !== "view" ? (
                    <Input
                      type="number"
                      allowClear
                      size="large"
                      name="phongNgu"
                      placeholder="Nhập số lượng phòng ngủ"
                      value={formRoom.values.phongNgu}
                      onChange={formRoom.handleChange}
                      onBlur={formRoom.handleBlur}
                    />
                  ) : (
                    <p>{formRoom.values.phongNgu}</p>
                  )}
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRoom.touched.giuong && formRoom.errors.giuong
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.giuong && formRoom.errors.giuong}
                >
                  <p className="font-bold uppercase text-xs mb-3">Giường</p>
                  {modalType !== "view" ? (
                    <Input
                      type="number"
                      allowClear
                      size="large"
                      name="giuong"
                      placeholder="Nhập số lượng giường ngủ"
                      value={formRoom.values.giuong}
                      onChange={formRoom.handleChange}
                      onBlur={formRoom.handleBlur}
                    />
                  ) : (
                    <p>{formRoom.values.giuong}</p>
                  )}
                </Form.Item>
              </div>

              <div className="w-full">
                <Form.Item
                  validateStatus={
                    formRoom.touched.phongTam && formRoom.errors.phongTam
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.phongTam && formRoom.errors.phongTam}
                >
                  <p className="font-bold uppercase text-xs mb-3">Phòng tắm</p>
                  {modalType !== "view" ? (
                    <Input
                      type="number"
                      allowClear
                      size="large"
                      name="phongTam"
                      placeholder="Nhập số lượng phòng tắm"
                      value={formRoom.values.phongTam}
                      onChange={formRoom.handleChange}
                      onBlur={formRoom.handleBlur}
                    />
                  ) : (
                    <p>{formRoom.values.phongTam}</p>
                  )}
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRoom.touched.maViTri && formRoom.errors.maViTri
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.maViTri && formRoom.errors.maViTri}
                >
                  <p className="font-bold uppercase text-xs mb-3">Vị trí</p>
                  {modalType !== "view" ? (
                    <Select
                      size="large"
                      showSearch
                      placeholder="Chọn tỉnh thành"
                      optionFilterProp="label"
                      value={setLocationName(formRoom.values.maViTri)}
                      onChange={(
                        data: string,
                        option: OptionSelectType | OptionSelectType[]
                      ): void => {
                        if (option && !Array.isArray(option)) {
                          formRoom.setFieldValue(
                            "maViTri",
                            Number(option.value)
                          );
                        }
                      }}
                      options={location}
                    />
                  ) : (
                    <p>{setLocationName(formRoom.values.maViTri)}</p>
                  )}
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRoom.touched.giaTien && formRoom.errors.giaTien
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.giaTien && formRoom.errors.giaTien}
                >
                  <p className="font-bold uppercase text-xs mb-3">Giá tiền</p>
                  {modalType !== "view" ? (
                    <Input
                      allowClear
                      type="number"
                      size="large"
                      name="giaTien"
                      placeholder="Nhập giá tiền"
                      value={formRoom.values.giaTien}
                      onChange={formRoom.handleChange}
                      onBlur={formRoom.handleBlur}
                    />
                  ) : (
                    <p>{formRoom.values.giaTien}$</p>
                  )}
                </Form.Item>

                <Form.Item
                  validateStatus={
                    formRoom.touched.hinhAnh && formRoom.errors.hinhAnh
                      ? "error"
                      : ""
                  }
                  help={formRoom.touched.hinhAnh && formRoom.errors.hinhAnh}
                >
                  <p className="font-bold uppercase text-xs mb-3">Hình ảnh</p>
                  {modalType !== "view" ? (
                    <Upload
                      listType="picture"
                      maxCount={1} // Giới hạn chỉ chọn 1 file
                      beforeUpload={() => false} // Ngăn tự động tải lên
                      onChange={handleChangeUploadFile}
                      fileList={file ? [file] : []}
                    >
                      <Button type="primary" icon={<UploadOutlined />}>
                        Upload
                      </Button>
                    </Upload>
                  ) : (
                    <div className="w-full h-[100px]">
                      <Image
                        src={formRoom.values.hinhAnh}
                        alt="hinh anh"
                        className="rounded-lg w-full h-full bg-cover object-cover"
                      />
                    </div>
                  )}
                </Form.Item>
              </div>
            </div>

            <Form.Item
              validateStatus={
                formRoom.touched.moTa && formRoom.errors.moTa ? "error" : ""
              }
              help={formRoom.touched.moTa && formRoom.errors.moTa}
            >
              <p className="font-bold uppercase text-xs mb-3">Mô tả</p>
              {modalType !== "view" ? (
                <TextArea
                  allowClear
                  size="large"
                  name="moTa"
                  placeholder="Nhập mô tả"
                  value={formRoom.values.moTa}
                  onChange={formRoom.handleChange}
                  onBlur={formRoom.handleBlur}
                />
              ) : (
                <p>{formRoom.values.moTa}</p>
              )}
            </Form.Item>

            {/* CHECK BOX */}
            <div className="w-full mb-3">
              <p
                className={`font-bold uppercase text-xs mb-3 ${
                  modalType === "view" && "mt-10"
                }`}
              >
                Tiện ích
              </p>
              <div className="flex flex-wrap items-center">
                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="mayGiat"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.mayGiat}
                      >
                        Máy giặt quần áo
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.mayGiat && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M26.29 2a3 3 0 0 1 2.96 2.58c.5 3.56.75 7.37.75 11.42s-.25 7.86-.75 11.42a3 3 0 0 1-2.79 2.57l-.17.01H5.7a3 3 0 0 1-2.96-2.58C2.25 23.86 2 20.05 2 16s.25-7.86.75-11.42a3 3 0 0 1 2.79-2.57L5.7 2zm0 2H5.72a1 1 0 0 0-1 .86A80.6 80.6 0 0 0 4 16c0 3.96.24 7.67.73 11.14a1 1 0 0 0 .87.85l.11.01h20.57a1 1 0 0 0 1-.86c.48-3.47.72-7.18.72-11.14 0-3.96-.24-7.67-.73-11.14A1 1 0 0 0 26.3 4zM16 7a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm-5.84 7.5c-.34 0-.68.02-1.02.07a7 7 0 0 0 13.1 4.58 9.09 9.09 0 0 1-6.9-2.37l-.23-.23a6.97 6.97 0 0 0-4.95-2.05zM16 9a7 7 0 0 0-6.07 3.5h.23c2.26 0 4.44.84 6.12 2.4l.24.24a6.98 6.98 0 0 0 6.4 1.9A7 7 0 0 0 16 9zM7 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                          </svg>
                          <p>Máy giặt quần áo</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="banLa"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.banLa}
                      >
                        Bàn là
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.banLa && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M12 28a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-6-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM16.03 3h.3a12.5 12.5 0 0 1 11.82 9.48l.07.3 1.73 7.79.03.14A2 2 0 0 1 28.15 23H2.1a2 2 0 0 1-1.85-1.84v-7.38a5 5 0 0 1 4.77-4.77L5.25 9h9V5h-14V3zm11.53 16H2.25v2H28zM16.24 5v6H5.07a3 3 0 0 0-2.82 2.82V17H27.1l-.84-3.78-.07-.28a10.5 10.5 0 0 0-9.6-7.92L16.32 5z"></path>
                          </svg>
                          <p>Bàn là</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="tivi"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.tivi}
                      >
                        Tivi
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.tivi && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M9 29v-2h2v-2H6a5 5 0 0 1-5-4.78V8a5 5 0 0 1 4.78-5H26a5 5 0 0 1 5 4.78V20a5 5 0 0 1-4.78 5H21v2h2v2zm10-4h-6v2h6zm7-20H6a3 3 0 0 0-3 2.82V20a3 3 0 0 0 2.82 3H26a3 3 0 0 0 3-2.82V8a3 3 0 0 0-2.82-3z"></path>
                          </svg>
                          <p>Tivi</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="dieuHoa"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.dieuHoa}
                      >
                        Điều hoà nhiệt độ
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.dieuHoa && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M17 1v4.03l4.03-2.32 1 1.73L17 7.34v6.93l6-3.47V5h2v4.65l3.49-2.02 1 1.74L26 11.38l4.03 2.33-1 1.73-5.03-2.9L18 16l6 3.46 5.03-2.9 1 1.73L26 20.62l3.49 2.01-1 1.74L25 22.35V27h-2v-5.8l-6-3.47v6.93l5.03 2.9-1 1.73L17 26.97V31h-2v-4.03l-4.03 2.32-1-1.73 5.03-2.9v-6.93L9 21.2V27H7v-4.65l-3.49 2.02-1-1.74L6 20.62l-4.03-2.33 1-1.73L8 19.46 14 16l-6-3.46-5.03 2.9-1-1.73L6 11.38 2.51 9.37l1-1.74L7 9.65V5h2v5.8l6 3.47V7.34l-5.03-2.9 1-1.73L15 5.03V1z"></path>
                          </svg>
                          <p>Điều hoà nhiệt độ</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="wifi"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.wifi}
                      >
                        Wifi
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.wifi && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M16 20.33a3.67 3.67 0 1 1 0 7.34 3.67 3.67 0 0 1 0-7.34zm0 2a1.67 1.67 0 1 0 0 3.34 1.67 1.67 0 0 0 0-3.34zM16 15a9 9 0 0 1 8.04 4.96l-1.51 1.51a7 7 0 0 0-13.06 0l-1.51-1.51A9 9 0 0 1 16 15zm0-5.33c4.98 0 9.37 2.54 11.94 6.4l-1.45 1.44a12.33 12.33 0 0 0-20.98 0l-1.45-1.45A14.32 14.32 0 0 1 16 9.66zm0-5.34c6.45 0 12.18 3.1 15.76 7.9l-1.43 1.44a17.64 17.64 0 0 0-28.66 0L.24 12.24c3.58-4.8 9.3-7.9 15.76-7.9z"></path>
                          </svg>
                          <p>Wifi</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="bep"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.bep}
                      >
                        Bếp
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.bep && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M26 1a5 5 0 0 1 5 5c0 6.39-1.6 13.19-4 14.7V31h-2V20.7c-2.36-1.48-3.94-8.07-4-14.36v-.56A5 5 0 0 1 26 1zm-9 0v18.12c2.32.55 4 3 4 5.88 0 3.27-2.18 6-5 6s-5-2.73-5-6c0-2.87 1.68-5.33 4-5.88V1zM2 1h1c4.47 0 6.93 6.37 7 18.5V21H4v10H2zm14 20c-1.6 0-3 1.75-3 4s1.4 4 3 4 3-1.75 3-4-1.4-4-3-4zM4 3.24V19h4l-.02-.96-.03-.95C7.67 9.16 6.24 4.62 4.22 3.36L4.1 3.3zm19 2.58v.49c.05 4.32 1.03 9.13 2 11.39V3.17a3 3 0 0 0-2 2.65zm4-2.65V17.7c.99-2.31 2-7.3 2-11.7a3 3 0 0 0-2-2.83z"></path>
                          </svg>
                          <p>Bếp</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="doXe"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.doXe}
                      >
                        Chỗ đỗ xe miễn phí tại nơi ở
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.doXe && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M26 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 18a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm20.7-5 .41 1.12A4.97 4.97 0 0 1 30 18v9a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2H8v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9c0-1.57.75-2.96 1.89-3.88L4.3 13H2v-2h3v.15L6.82 6.3A2 2 0 0 1 8.69 5h14.62c.83 0 1.58.52 1.87 1.3L27 11.15V11h3v2h-2.3zM6 25H4v2h2v-2zm22 0h-2v2h2v-2zm0-2v-5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v5h24zm-3-10h.56L23.3 7H8.69l-2.25 6H25zm-15 7h12v-2H10v2z"></path>
                          </svg>
                          <p>Chỗ đỗ xe miễn phí tại nơi ở</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="hoBoi"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.hoBoi}
                      >
                        Hồ bơi riêng ngoài trời
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.hoBoi && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            viewBox="0 0 35 35"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M24 26c.99 0 1.95.35 2.67 1 .3.29.71.45 1.14.5H28v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 28c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 28c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 28c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 26c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 26c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 26zm0-5c.99 0 1.95.35 2.67 1 .3.29.71.45 1.14.5H28v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 23c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 23c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 23c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 21c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 21c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 21zM20 3a4 4 0 0 1 4 3.8V9h4v2h-4v5a4 4 0 0 1 2.5.86l.17.15c.3.27.71.44 1.14.48l.19.01v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 18c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 18c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 18c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 16c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5a3.96 3.96 0 0 1 2.44-1H16v-5H4V9h12V7a2 2 0 0 0-4-.15V7h-2a4 4 0 0 1 7-2.65A3.98 3.98 0 0 1 20 3zm-2 13.52.46.31.21.18c.35.31.83.49 1.33.49a2 2 0 0 0 1.2-.38l.13-.11c.2-.19.43-.35.67-.49V11h-4zM20 5a2 2 0 0 0-2 1.85V9h4V7a2 2 0 0 0-2-2z"></path>
                          </svg>
                          <p>Hồ bơi riêng ngoài trời</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>

                <Form.Item className="!mb-0 !me-3">
                  {modalType !== "view" ? (
                    <div>
                      <Checkbox
                        name="banUi"
                        onChange={formRoom.handleChange}
                        checked={formRoom.values.banUi}
                      >
                        Bàn ủi
                      </Checkbox>
                    </div>
                  ) : (
                    <>
                      {formRoom.values.banUi && (
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            style={{ fill: "#6a6a6a" }}
                          >
                            <path d="M12 28a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-6-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM16.03 3h.3a12.5 12.5 0 0 1 11.82 9.48l.07.3 1.73 7.79.03.14A2 2 0 0 1 28.15 23H2.1a2 2 0 0 1-1.85-1.84v-7.38a5 5 0 0 1 4.77-4.77L5.25 9h9V5h-14V3zm11.53 16H2.25v2H28zM16.24 5v6H5.07a3 3 0 0 0-2.82 2.82V17H27.1l-.84-3.78-.07-.28a10.5 10.5 0 0 0-9.6-7.92L16.32 5z"></path>
                          </svg>
                          <p>Bàn ủi</p>
                        </div>
                      )}
                    </>
                  )}
                </Form.Item>
              </div>
            </div>

            <Form.Item className="!mb-0">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className=" bg-primary-100 text-white py-2 px-7 rounded-md font-custom"
                >
                  {modalType === "create"
                    ? "Thêm phòng"
                    : modalType === "update"
                    ? "Lưu thông tin"
                    : "Cập nhật thông tin"}
                </button>
                <button
                  onClick={() => {
                    setIsModalViewRoomsOpen(false);
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

export default ModalViewRoom;
