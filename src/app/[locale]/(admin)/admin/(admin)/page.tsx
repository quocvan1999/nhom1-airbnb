"use client";

import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { getUsersPaginationAsync } from "@/services/users-pagination/getUsersPagination.service";
import type { InputRef, TableColumnType, TableColumnsType } from "antd";
import {
  Button,
  Image,
  Input,
  Modal,
  Pagination,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles } from "antd-style";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { User } from "@/types/user/userType.type";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { deleteUserAsync } from "@/services/delete-user/deleteUser.service";
import useNotification from "@/custome-hook/useNotification/useNotification";
import useGetSearchPrams from "@/custome-hook/useGetSearchPrams/useGetSearchPrams";
import ModalViewUser from "@/components/modal-view-user/ModalViewUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { NotifiType } from "@/types/notifi/notifi.type";
import {
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import { useLocale } from "next-intl";

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

const { confirm } = Modal;

const AdminPage: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const { styles } = useStyle();
  const { getParams, searchParams } = useGetSearchPrams();
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { users } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [userView, setUserView] = useState<User | null>(null);
  const { createNotification } = useNotifiCustome();
  const { profile } = useSelector((state: RootState) => state.user);
  const [modalType, setModalType] = useState<"create" | "view" | "update">(
    "create"
  );
  const [isModalViewUserOpen, setIsModalViewUserOpen] =
    useState<boolean>(false);

  const handleSearchUsers = async (searchValue: string): Promise<void> => {
    if (searchValue !== "") {
      router.push(
        `/${locale}/admin/?page=1&size=10&keyword=${searchValue.replace(
          /\s+/g,
          ""
        )}`
      );
    } else {
      router.push(`/${locale}/admin/?page=1&size=10`);
    }
  };

  const handleDeleteUser = (id: number): void => {
    confirm({
      title: "Xoá người dùng",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn xoá người dùng này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk: async (): Promise<void> => {
        const res = await deleteUserAsync(id);
        switch (res.statusCode) {
          case 200:
            openNotification("success", "Xoá người dùng", `${res.message}`);
            setIsLoading(!isLoading);

            const newNotification: NotifiType = {
              id: `DelUs${getFormattedDateTime()}`,
              title: "Quản lý người dùng",
              content: "Xoá người dùng thành công",
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
            openNotification("error", "Xoá người dùng", `${res.content}`);
            break;
        }
      },
    });
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
    const { size, page, keyword } = getParams();

    const action = getUsersPaginationAsync(page, size, keyword || "");
    dispatch(action);
  };

  const columns: TableColumnsType<User> = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <div className="w-7 h-7 rounded-full border border-primary-100 flex items-center justify-center overflow-hidden">
          <Image
            src={avatar === "" ? "/images/logo.jpg" : avatar}
            alt="hinh anh"
            className="w-full h-full"
          />
        </div>
      ),
    },
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
      render: (record: User) => (
        <div className="flex items-center justify-start gap-5">
          <DeleteOutlined
            onClick={() => {
              handleDeleteUser(record.id);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86] hover:!text-red-600"
          />
          <EditOutlined
            onClick={() => {
              setUserView(record);
              setModalType("update");
              setIsModalViewUserOpen(true);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86]"
          />
          <EyeFilled
            onClick={() => {
              setUserView(record);
              setModalType("view");
              setIsModalViewUserOpen(true);
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
              setModalType("create");
              setIsModalViewUserOpen(true);
            }}
            size="large"
            className="!bg-primary-100 !text-white !border-none"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="!hidden md:!inline-block">Thêm người dùng</span>
          </Button>
        </div>
        <div className="hidden md:block w-full h-[calc(100%-50px)] bg-white rounded-lg mt-2">
          {users && users.data ? (
            <Table
              className={styles.customTable}
              dataSource={users.data.map((item, index) => ({
                ...item,
                key: index,
              }))}
              columns={columns}
              pagination={false}
              footer={() => (
                <Pagination
                  align="end"
                  defaultCurrent={1}
                  current={users?.pageIndex}
                  defaultPageSize={10}
                  pageSize={users?.pageSize}
                  total={users?.totalRow}
                  onChange={(page: number, pageSize: number): void => {
                    const { keyword } = getParams();
                    router.push(
                      `/${locale}/admin/?page=${page}&size=${pageSize}&keyword=${keyword}`
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
          {users && users.data.length > 0 ? (
            <>
              {users.data.map((item: User, index: number) => (
                <div
                  className="w-full flex gap-3 p-3 rounded-lg bg-white shadow-md"
                  key={index}
                >
                  <div className="w-16 h-16 rounded-full border border-primary-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={
                        item.avatar !== "" ? item.avatar : "/images/logo.jpg"
                      }
                      alt="hinh anh"
                      height="100%"
                      width="100%"
                      className="!object-cover"
                    />
                  </div>
                  <div className="w-[calc(100% - 64px)] flex flex-col justify-between">
                    <div>
                      <h1 className="font-bold">{item.name}</h1>
                      <p>{item.email}</p>
                      <p>
                        {item.role === "ADMIN" ? (
                          <Tag color="red">{item.role}</Tag>
                        ) : (
                          <Tag color="green">{item.role}</Tag>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p
                        onClick={() => {
                          setUserView(item);
                          setModalType("view");
                          setIsModalViewUserOpen(true);
                        }}
                        className="text-primary-100 hover:underline pt-3"
                      >
                        Xem chi tiết
                      </p>
                      <p
                        onClick={() => {
                          handleDeleteUser(item.id);
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
                current={users?.pageIndex}
                defaultPageSize={10}
                pageSize={users?.pageSize}
                total={users?.totalRow}
                onChange={(page: number, pageSize: number): void => {
                  const { keyword } = getParams();
                  router.push(
                    `/${locale}/admin/?page=${page}&size=${pageSize}&keyword=${keyword}`
                  );
                }}
              />
            </>
          ) : (
            <Spin />
          )}
        </div>
      </div>
      {isModalViewUserOpen && (
        <ModalViewUser
          getData={getData}
          userView={userView}
          setModalType={setModalType}
          modalType={modalType}
          isModalViewUserOpen={isModalViewUserOpen}
          setIsModalViewUserOpen={setIsModalViewUserOpen}
        />
      )}
    </>
  );
};

export default AdminPage;
