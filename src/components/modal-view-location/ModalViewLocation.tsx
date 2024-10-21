import { AppDispatch } from "@/app/globalRedux/store";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { createLocationAsync } from "@/services/create-location/createLocation.service";
import { getLocationsPaginationAsync } from "@/services/locations-pagination/locationsPagination.service";
import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import React from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ConfigProvider, Form, Input, Modal } from "antd";
import { useRouter } from "next/navigation";

type Props = {
  isModalCreateLocationOpen: boolean;
  setIsModalCreateLocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalViewLocation: React.FC<Props> = ({
  isModalCreateLocationOpen,
  setIsModalCreateLocationOpen,
}) => {
  const router = useRouter();
  const { openNotification } = useNotification();

  const initialValues: LocationType = {
    id: 0,
    tenViTri: "",
    quocGia: "",
    tinhThanh: "",
    hinhAnh: "",
  };

  const handleCancel = (): void => {
    setIsModalCreateLocationOpen(false);
  };

  const handleChangeCreateLocation = async (
    newLocation: LocationType
  ): Promise<void> => {
    const res: ReqType<LocationType> = await createLocationAsync(newLocation);

    switch (res.statusCode) {
      case 201:
        openNotification("success", "Thêm vị trí", "Thêm vị trí thành công");
        router.push("/admin/locations");
        setIsModalCreateLocationOpen(false);
        break;
      default:
        openNotification("error", "Thêm vị trí", `${res.content}`);
        break;
    }
  };

  const formLocation = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      tenViTri: Yup.string().required("Tên vị trí không được để trống"),
      quocGia: Yup.string().required("Quốc gia không được để trống"),
      tinhThanh: Yup.string().required("Tỉnh thành không được để trống"),
      hinhAnh: Yup.string().required("Hình ảnh không được để trống"),
    }),
    onSubmit: (values) => {
      handleChangeCreateLocation(values);
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
        open={isModalCreateLocationOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="w-full bg-white rounded-xl">
          <div className="flex items-center justify-between mb-14">
            <h1 className="text-2xl">Thêm người dùng</h1>
          </div>
          <Form layout="vertical" onSubmitCapture={formLocation.handleSubmit}>
            <div className="w-full">
              <Form.Item
                validateStatus={
                  formLocation.touched.tenViTri && formLocation.errors.tenViTri
                    ? "error"
                    : ""
                }
                help={
                  formLocation.touched.tenViTri && formLocation.errors.tenViTri
                }
              >
                <p className="font-bold uppercase text-xs mb-3">Tên vị trí</p>
                <Input
                  allowClear
                  size="large"
                  name="tenViTri"
                  placeholder="Nhập tên vị trí"
                  value={formLocation.values.tenViTri}
                  onChange={formLocation.handleChange}
                  onBlur={formLocation.handleBlur}
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formLocation.touched.tinhThanh &&
                  formLocation.errors.tinhThanh
                    ? "error"
                    : ""
                }
                help={
                  formLocation.touched.tinhThanh &&
                  formLocation.errors.tinhThanh
                }
              >
                <p className="font-bold uppercase text-xs mb-3">Tỉnh thành</p>
                <Input
                  allowClear
                  size="large"
                  name="tinhThanh"
                  placeholder="Nhập tỉnh thành"
                  value={formLocation.values.tinhThanh}
                  onChange={formLocation.handleChange}
                  onBlur={formLocation.handleBlur}
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formLocation.touched.quocGia && formLocation.errors.quocGia
                    ? "error"
                    : ""
                }
                help={
                  formLocation.touched.quocGia && formLocation.errors.quocGia
                }
              >
                <p className="font-bold uppercase text-xs mb-3">Quốc gia</p>
                <Input
                  allowClear
                  size="large"
                  name="quocGia"
                  placeholder="Nhập quốc gia"
                  value={formLocation.values.quocGia}
                  onChange={formLocation.handleChange}
                  onBlur={formLocation.handleBlur}
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formLocation.touched.hinhAnh && formLocation.errors.hinhAnh
                    ? "error"
                    : ""
                }
                help={
                  formLocation.touched.hinhAnh && formLocation.errors.hinhAnh
                }
              >
                <p className="font-bold uppercase text-xs mb-3">Hình ảnh</p>
                <Input
                  allowClear
                  size="large"
                  name="hinhAnh"
                  placeholder="Nhập hình ảnh"
                  value={formLocation.values.hinhAnh}
                  onChange={formLocation.handleChange}
                  onBlur={formLocation.handleBlur}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <button
                type="submit"
                className="w-full bg-primary-100 text-white py-3 rounded-[7px] transition-all duration-500 ease-in-out hover:bg-primary-200 font-custom"
              >
                Thêm vị trí
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalViewLocation;
