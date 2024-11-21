"use client";

import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import ModalViewLocation from "@/components/modal-view-location/ModalViewLocation";
import useGetSearchPrams from "@/custome-hook/useGetSearchPrams/useGetSearchPrams";
import useNotification from "@/custome-hook/useNotification/useNotification";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { deleteLocationAsync } from "@/services/delete-location/deleteLocation.service";
import { getLocationsPaginationAsync } from "@/services/locations-pagination/locationsPagination.service";
import { LocationType } from "@/types/location/locationType.type";
import { NotifiType } from "@/types/notifi/notifi.type";
import {
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Image,
  Input,
  InputRef,
  Modal,
  Pagination,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableColumnType,
} from "antd";
import { createStyles } from "antd-style";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

type DataIndex = keyof LocationType;

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-container {
        .ant-table-body,
        .ant-table-content {
          scrollbar-width: thin;
          scrollbar-color: unset;
        }
      }
    `,
  };
});

const { confirm } = Modal;

const Locations: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const { styles } = useStyle();
  const dispatch: AppDispatch = useDispatch();
  const searchInput = useRef<InputRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const { getParams, searchParams } = useGetSearchPrams();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const { locations } = useSelector((state: RootState) => state.room);
  const { openNotification } = useNotification();
  const [isModalCreateLocationOpen, setIsModalCreateLocationOpen] =
    useState<boolean>(false);
  const [locationId, setLocationId] = useState<number | null>(null);
  const { createNotification } = useNotifiCustome();
  const { profile } = useSelector((state: RootState) => state.user);

  const handleDeleteLocation = (id: number): void => {
    confirm({
      title: "Xoá vị trí",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn xoá vị trí này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk: async (): Promise<void> => {
        const res = await deleteLocationAsync(id);
        switch (res.statusCode) {
          case 200:
            openNotification("success", "Xoá vị trí", `${res.message}`);
            setIsLoading(!isLoading);

            const newNotification: NotifiType = {
              id: `DelLo${getFormattedDateTime()}`,
              title: "Quản lý vị trí",
              content: "Xoá vị trí thành công",
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
            openNotification("error", "Xoá vị trí", `${res.content}`);
            break;
        }
      },
    });
  };

  const handleSearchUsers = async (searchValue: string): Promise<void> => {
    if (searchValue !== "") {
      router.push(
        `/${locale}/admin/locations/?page=1&size=10&keyword=${searchValue.replace(
          /\s+/g,
          ""
        )}`
      );
    } else {
      router.push(`/${locale}/admin/locations/?page=1&size=10`);
    }
  };

  const getData = (): void => {
    const { size, page, keyword } = getParams();

    const action = getLocationsPaginationAsync(page, size, keyword || "");
    dispatch(action);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<LocationType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#FF385C" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<LocationType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (hinhAnh) => (
        <div className="w-7 h-7 rounded-full border border-primary-100 flex items-center justify-center overflow-hidden">
          <Image src={hinhAnh} alt="hinh anh" className="w-full h-full" />
        </div>
      ),
    },
    {
      title: "Tên vị trí",
      dataIndex: "tenViTri",
      key: "tenViTri",
      ...getColumnSearchProps("tenViTri"),
      sorter: (a: LocationType, b: LocationType) =>
        a.tenViTri.localeCompare(b.tenViTri),
    },
    {
      title: "Tỉnh thành",
      dataIndex: "tinhThanh",
      key: "tinhThanh",
      ...getColumnSearchProps("tinhThanh"),
      sorter: (a: LocationType, b: LocationType) =>
        a.tinhThanh.localeCompare(b.tinhThanh),
    },
    {
      title: "Quốc gia",
      dataIndex: "quocGia",
      key: "quocGia",
      ...getColumnSearchProps("quocGia"),
      sorter: (a: LocationType, b: LocationType) =>
        a.quocGia.localeCompare(b.quocGia),
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "actions",
      render: (record: LocationType) => (
        <div className="flex items-center justify-start gap-5">
          <DeleteOutlined
            onClick={() => {
              handleDeleteLocation(record.id);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86] hover:!text-red-600"
          />
          <EditOutlined
            onClick={() => {
              setIsModalCreateLocationOpen(true);
              setIsUpdate(true);
              setLocationId(record.id);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86]"
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [searchParams, isLoading]);

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full h-[50px] flex items-center gap-2 md:gap-0 justify-between">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Nhập tìm kiếm"
            className="!w-[450px]"
            onChange={(e) => {
              handleSearchUsers(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              setIsModalCreateLocationOpen(true);
              setIsUpdate(false);
            }}
            size="large"
            className="!bg-primary-100 !text-white !border-none"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="!hidden md:!inline-block">Thêm vị trí</span>
          </Button>
        </div>
        <div className="hidden md:block w-full h-[calc(100%-50px)] bg-white rounded-lg mt-2">
          {locations && locations.data ? (
            <Table
              className={styles.customTable}
              dataSource={locations.data.map((item, index) => ({
                ...item,
                key: index,
              }))}
              columns={columns}
              pagination={false}
              footer={() => (
                <Pagination
                  align="end"
                  defaultCurrent={1}
                  current={locations?.pageIndex}
                  defaultPageSize={10}
                  pageSize={locations?.pageSize}
                  total={locations?.totalRow}
                  onChange={(page: number, pageSize: number): void => {
                    const { keyword } = getParams();
                    router.push(
                      `/${locale}/admin/locations/?page=${page}&size=${pageSize}&keyword=${keyword}`
                    );
                  }}
                />
              )}
            />
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center">
              <Spin />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-wrap gap-2 md:hidden mt-3">
          {locations && locations.data.length > 0 ? (
            <>
              {locations.data.map((item: LocationType, index: number) => (
                <div
                  className="w-full flex gap-3 p-3 rounded-lg bg-white shadow-md"
                  key={index}
                >
                  <div className="w-16 h-16 rounded-full border border-primary-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={
                        item.hinhAnh !== "" ? item.hinhAnh : "/images/logo.jpg"
                      }
                      alt="hinh anh"
                      height="100%"
                      width="100%"
                      className="!object-cover"
                    />
                  </div>
                  <div className="w-[calc(100% - 64px)] flex flex-col justify-between">
                    <div>
                      <h1 className="font-semibold italic">ID: {item.id}</h1>
                      <p className="font-bold">
                        {item.tenViTri} - {item.tinhThanh} - {item.quocGia}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p
                        onClick={() => {
                          handleDeleteLocation(item.id);
                        }}
                        className="text-primary-100 hover:underline pt-3"
                      >
                        Xoá
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Pagination
                align="end"
                defaultCurrent={1}
                current={locations?.pageIndex}
                defaultPageSize={10}
                pageSize={locations?.pageSize}
                total={locations?.totalRow}
                onChange={(page: number, pageSize: number): void => {
                  const { keyword } = getParams();
                  router.push(
                    `/${locale}/admin/locations/?page=${page}&size=${pageSize}&keyword=${keyword}`
                  );
                }}
              />
            </>
          ) : (
            <Spin />
          )}
        </div>
      </div>
      {isModalCreateLocationOpen && (
        <ModalViewLocation
          locationId={locationId}
          isUpdate={isUpdate}
          isModalCreateLocationOpen={isModalCreateLocationOpen}
          setIsModalCreateLocationOpen={setIsModalCreateLocationOpen}
        />
      )}
    </>
  );
};

export default Locations;
