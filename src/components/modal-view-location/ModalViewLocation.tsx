import useNotification from "@/custome-hook/useNotification/useNotification";
import { createLocationAsync } from "@/services/create-location/createLocation.service";
import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ConfigProvider, Form, Input, Modal, Select } from "antd";
import { useRouter } from "next/navigation";
import { getProvinceAysnc } from "@/services/get-province/getProvince.service";
import { getDistrictAysnc } from "@/services/get-district/getDistrict.service";
import { OptionLocationtype } from "@/types/option-location/optionLocationType.type";
import { OptionSelectType } from "@/types/option-select/optionSelectType.type";
import { getLocationIdAsync } from "@/services/get-locationId/getLocationId.service";
import { updateLocationAsync } from "@/services/update-location/updateLocation.service";
import { NotifiType } from "@/types/notifi/notifi.type";
import {
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { useDispatch, useSelector } from "react-redux";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { useLocale } from "next-intl";

type Props = {
  locationId: number | null;
  isUpdate: boolean;
  isModalCreateLocationOpen: boolean;
  setIsModalCreateLocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalViewLocation: React.FC<Props> = ({
  locationId,
  isUpdate,
  isModalCreateLocationOpen,
  setIsModalCreateLocationOpen,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const [province, setProvince] = useState<OptionSelectType[]>([]);
  const [district, setDistrict] = useState<OptionSelectType[]>([]);
  const { openNotification } = useNotification();
  const dispatch: AppDispatch = useDispatch();
  const { createNotification } = useNotifiCustome();
  const { profile } = useSelector((state: RootState) => state.user);

  const initialValues: LocationType = {
    id: 0,
    tenViTri: "",
    quocGia: "",
    tinhThanh: "",
    hinhAnh: "",
  };

  const getDistrict = async (id: string): Promise<void> => {
    const res: OptionLocationtype[] = await getDistrictAysnc(id);
    if (res.length > 0) {
      res.map((district: OptionLocationtype) =>
        setDistrict((prevItems) => [
          ...prevItems,
          { value: district.id, label: district.full_name },
        ])
      );
    }
  };

  const getProvince = async (): Promise<void> => {
    const res: OptionLocationtype[] = await getProvinceAysnc();

    if (res.length > 0) {
      res.map((province: OptionLocationtype) =>
        setProvince((prevItems) => [
          ...prevItems,
          { value: province.id, label: province.name },
        ])
      );
    }
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
        router.push(`/${locale}/admin/locations`);
        setIsModalCreateLocationOpen(false);

        const newNotification: NotifiType = {
          id: `CreLo${getFormattedDateTime()}`,
          title: "Quản lý ví trí",
          content: "Thêm vị trí thành công",
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
        openNotification("error", "Thêm vị trí", `${res.content}`);
        break;
    }
  };

  const handleChangeUpdateLocation = async (
    newLocation: LocationType
  ): Promise<void> => {
    const res: ReqType<LocationType> = await updateLocationAsync(
      newLocation.id,
      newLocation
    );

    switch (res.statusCode) {
      case 200:
        openNotification(
          "success",
          "Cập nhật vị trí",
          "Cập nhật thông tin vị trí thành công"
        );
        router.push(`/${locale}/admin/locations`);
        setIsModalCreateLocationOpen(false);

        const newNotification: NotifiType = {
          id: `UpdLo${getFormattedDateTime()}`,
          title: "Quản lý ví trí",
          content: "Cập nhật vị trí thành công",
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
        openNotification("error", "Cập nhật vị trí", `${res.content}`);
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
      if (isUpdate) {
        handleChangeUpdateLocation(values);
      } else {
        handleChangeCreateLocation(values);
      }
    },
  });

  const getLocation = async (id: number): Promise<void> => {
    const res: ReqType<LocationType> = await getLocationIdAsync(id);

    if (typeof res.content === "object") {
      formLocation.setValues({
        id: res.content.id,
        tenViTri: res.content.tenViTri,
        tinhThanh: res.content.tinhThanh,
        quocGia: res.content.quocGia,
        hinhAnh: res.content.hinhAnh,
      });
    }
  };

  useEffect(() => {
    getProvince();
    if (isUpdate) {
      if (locationId !== null) {
        getLocation(locationId);
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
            <h1 className="text-2xl font-bold">
              {isUpdate ? "Cập nhật thông tin vị trí" : "Thêm vị trí"}
            </h1>
          </div>
          <Form layout="vertical" onSubmitCapture={formLocation.handleSubmit}>
            <div className="w-full">
              {isUpdate && (
                <Form.Item
                  validateStatus={
                    formLocation.touched.id && formLocation.errors.id
                      ? "error"
                      : ""
                  }
                  help={formLocation.touched.id && formLocation.errors.id}
                >
                  <p className="font-bold uppercase text-xs mb-3">Id</p>
                  <Input
                    disabled
                    size="large"
                    name="id"
                    value={formLocation.values.id}
                  />
                </Form.Item>
              )}

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
                <Select
                  size="large"
                  showSearch
                  placeholder="Chọn tỉnh thành"
                  optionFilterProp="label"
                  value={formLocation.values.quocGia}
                  onChange={(value: string) => {
                    formLocation.setFieldValue("quocGia", value);
                  }}
                  options={[
                    {
                      value: "Việt Nam",
                      label: "Việt Nam",
                    },
                  ]}
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
                <Select
                  size="large"
                  showSearch
                  placeholder="Chọn tỉnh thành"
                  optionFilterProp="label"
                  value={formLocation.values.tinhThanh}
                  onChange={(
                    data: string,
                    option: OptionSelectType | OptionSelectType[]
                  ): void => {
                    if (option && !Array.isArray(option)) {
                      formLocation.setFieldValue("tinhThanh", option.label);
                      getDistrict(option.value);
                    }
                  }}
                  options={province}
                />
              </Form.Item>

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
                <Select
                  size="large"
                  showSearch
                  placeholder="Chọn vị trí"
                  optionFilterProp="label"
                  value={formLocation.values.tenViTri}
                  onChange={(
                    data: string,
                    option: OptionSelectType | OptionSelectType[]
                  ): void => {
                    if (option && !Array.isArray(option)) {
                      formLocation.setFieldValue("tenViTri", option.label);
                    }
                  }}
                  options={district}
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
                {isUpdate ? "Lưu thông tin" : "Thêm vị trí"}
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalViewLocation;
