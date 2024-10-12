"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import { getUsersAsync } from "@/services/users/getUsers.service";
import type { InputRef, TableColumnType, TableColumnsType } from "antd";
import { Avatar, Button, Input, Pagination, Space, Table, Tag } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles } from "antd-style";
import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PassComponent from "@/components/pass-component/PassComponent";
import { User } from "@/types/user/userType.type";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

type Props = {
  searchParams: {
    page: string | number;
    size: string | number;
  };
};

type DataIndex = keyof User;

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

const AdminPage: React.FC<Props> = ({ searchParams }) => {
  const router = useRouter();
  const { styles } = useStyle();
  const dispatch: AppDispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.user);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
  ): TableColumnType<User> => ({
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

  const getData = (): void => {
    const action = getUsersAsync(searchParams.page, searchParams.size);
    dispatch(action);
  };

  const columns: TableColumnsType<User> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: "Loại tài khoản",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <div>
          {role === "ADMIN" ? (
            <Tag color="red">{role}</Tag>
          ) : (
            <Tag color="green">{role}</Tag>
          )}
        </div>
      ),
      filters: [
        { text: "Admin", value: "ADMIN" },
        { text: "User", value: "USER" },
      ],
      onFilter: (value: any, record: User) =>
        record.role.includes(value as string),
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "actions",
      render: () => (
        <div className="flex items-center justify-start gap-5">
          <DeleteOutlined className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86] hover:!text-red-600" />
          <EditOutlined className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86]" />
          <EyeFilled className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86]" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [searchParams.page, searchParams.size]);

  return (
    <>
      {users && users.data && (
        <Table
          className={styles.customTable}
          dataSource={users.data.map((item, index) => ({
            ...item,
            key: index,
          }))}
          columns={columns}
          pagination={false}
          title={() => (
            <div className="flex items-center justify-between">
              <Button className="!bg-primary-100 !text-white !border-none">
                + Thêm người dùng
              </Button>
              <Input
                prefix={<SearchOutlined />}
                className="!w-[400px]"
                placeholder="Nhập tìm kiếm"
              />
            </div>
          )}
          footer={() => (
            <Pagination
              align="end"
              defaultCurrent={1}
              current={users?.pageIndex}
              defaultPageSize={10}
              pageSize={users?.pageSize}
              total={users?.totalRow}
              onChange={(page: number, pageSize: number): void => {
                router.push(`/admin/?page=${page}&size=${pageSize}`);
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default AdminPage;
