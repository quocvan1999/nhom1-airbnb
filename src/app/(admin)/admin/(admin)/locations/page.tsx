"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import useGetSearchPrams from "@/custome-hook/useGetSearchPrams/useGetSearchPrams";
import { getLocationsPaginationAsync } from "@/services/locations-pagination/locationsPagination.service";
import { LocationType } from "@/types/location/locationType.type";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
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
  const router = useRouter();
  const { styles } = useStyle();
  const dispatch: AppDispatch = useDispatch();
  const searchInput = useRef<InputRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getParams, searchParams } = useGetSearchPrams();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const { locations } = useSelector((state: RootState) => state.room);

  const handleSearchUsers = async (searchValue: string): Promise<void> => {
    if (searchValue !== "") {
      router.push(`/admin/locations/?page=1&size=10&keyword=${searchValue}`);
    } else {
      router.push(`/admin/locations/?page=1&size=10`);
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
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (hinhAnh: string) => {
        return <img src={hinhAnh} alt="hinhAnh" className="w-5 h-5 bg-cover" />;
      },
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
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
            onClick={() => {}}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86] hover:!text-red-600"
          />
          <EditOutlined
            onClick={() => {}}
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
      <div className="w-full h-full !relative">
        <div className="w-full h-[50px] flex items-center justify-between">
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
              // setIsModalCreateUserOpen(true);
            }}
            size="large"
            className="!bg-primary-100  !text-white !border-none"
          >
            + Thêm vị trí
          </Button>
        </div>
        <div className="w-full h-[calc(100%-50px)] bg-white rounded-lg mt-2">
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
                    router.push(
                      `/admin/locations/?page=${page}&size=${pageSize}`
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
      </div>
      {/* {isModalOpen === true && (
        <ModalViewUser
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          userView={userView}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
        />
      )}

      {isModalCreateUserOpen && (
        <ModalCreateUser
          isModalCreateUserOpen={isModalCreateUserOpen}
          setIsModalCreateUserOpen={setIsModalCreateUserOpen}
        />
      )} */}
    </>
  );
};

export default Locations;
