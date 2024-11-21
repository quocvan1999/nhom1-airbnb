"use client";

import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import ModalViewRoom from "@/components/modal-view-room/ModalViewRoom";
import useGetSearchPrams from "@/custome-hook/useGetSearchPrams/useGetSearchPrams";
import useNotification from "@/custome-hook/useNotification/useNotification";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { deleteRoomAsync } from "@/services/delete-room/deleteRoom.service";
import { getRoomsPaginationAsync } from "@/services/rooms-pagination/roomsPagination.service";
import { NotifiType } from "@/types/notifi/notifi.type";
import { RoomType } from "@/types/room/roomType.type";
import {
  convertUSDToVND,
  getCurrentDateTime,
  getFormattedDateTime,
  truncateString,
} from "@/utils/method/method";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeFilled,
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
  Tooltip,
} from "antd";
import { createStyles } from "antd-style";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

type DataIndex = keyof RoomType;

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

const Rooms: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const { styles } = useStyle();
  const dispatch: AppDispatch = useDispatch();
  const searchInput = useRef<InputRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getParams, searchParams } = useGetSearchPrams();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const { openNotification } = useNotification();
  const { rooms } = useSelector((state: RootState) => state.room);
  const [roomView, setRoomView] = useState<RoomType | null>(null);
  const [modalType, setModalType] = useState<"create" | "view" | "update">(
    "create"
  );
  const [isModalViewRoomsOpen, setIsModalViewRoomsOpen] =
    useState<boolean>(false);
  const { createNotification } = useNotifiCustome();
  const { profile } = useSelector((state: RootState) => state.user);

  const handleDeleteRoom = (id: number): void => {
    confirm({
      title: "Xoá phòng",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn xoá phòng này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk: async (): Promise<void> => {
        const res = await deleteRoomAsync(id);

        switch (res.statusCode) {
          case 200:
            openNotification("success", "Xoá phòng", `${res.message}`);
            setIsLoading(!isLoading);

            const newNotification: NotifiType = {
              id: `DelRo${getFormattedDateTime()}`,
              title: "Quản lý phòng",
              content: "Xoá phòng thành công",
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
            openNotification("error", "Xoá phòng", `${res.content}`);
            break;
        }
      },
    });
  };

  const handleSearchUsers = async (searchValue: string): Promise<void> => {
    if (searchValue !== "") {
      router.push(
        `/${locale}/admin/rooms/?page=1&size=10&keyword=${searchValue.replace(
          /\s+/g,
          ""
        )}`
      );
    } else {
      router.push(`/${locale}/admin/rooms/?page=1&size=10`);
    }
  };

  const getData = (): void => {
    const { size, page, keyword } = getParams();

    const action = getRoomsPaginationAsync(page, size, keyword || "");
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
  ): TableColumnType<RoomType> => ({
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

  const columns: TableColumnsType<RoomType> = [
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
      render: (hinhAnh: string) => (
        <div className="w-12 h-9 rounded-lg border border-primary-100 flex items-center justify-center overflow-hidden">
          <Image
            src={hinhAnh === "" ? "/images/logo.jpg" : hinhAnh}
            alt="hinh anh"
            height="100%"
            width="100%"
            className="!object-cover"
          />
        </div>
      ),
    },
    {
      title: "Tên phòng",
      dataIndex: "tenPhong",
      key: "tenPhong",
      ...getColumnSearchProps("tenPhong"),
      sorter: (a: RoomType, b: RoomType) =>
        a.tenPhong.localeCompare(b.tenPhong),
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "actions",
      render: (record: RoomType) => (
        <div className="flex items-center justify-start gap-5">
          <DeleteOutlined
            onClick={() => {
              handleDeleteRoom(record.id);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86] hover:!text-red-600"
          />
          <EditOutlined
            onClick={() => {
              setModalType("update");
              setIsModalViewRoomsOpen(true);
              setRoomView(record);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86]"
          />
          <EyeFilled
            onClick={() => {
              setModalType("view");
              setIsModalViewRoomsOpen(true);
              setRoomView(record);
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
              setIsModalViewRoomsOpen(true);
            }}
            size="large"
            className="!bg-primary-100 !text-white !border-none"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="!hidden md:!inline-block">Thêm phòng</span>
          </Button>
        </div>
        <div className="hidden md:block w-full h-[calc(100%-50px)] bg-white rounded-lg mt-2">
          {rooms && rooms.data ? (
            <Table
              className={styles.customTable}
              dataSource={rooms.data.map((item, index) => ({
                ...item,
                key: index,
              }))}
              columns={columns}
              pagination={false}
              footer={() => (
                <Pagination
                  align="end"
                  defaultCurrent={1}
                  current={rooms?.pageIndex}
                  defaultPageSize={10}
                  pageSize={rooms?.pageSize}
                  total={rooms?.totalRow}
                  onChange={(page: number, pageSize: number): void => {
                    const { keyword } = getParams();
                    router.push(
                      `/${locale}/admin/rooms/?page=${page}&size=${pageSize}&keyword=${keyword}`
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
          {rooms && rooms.data.length > 0 ? (
            <>
              {rooms.data.map((item: RoomType, index: number) => (
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
                      <h1 className="font-bold">
                        <Tooltip title={item.tenPhong}>
                          {truncateString(item.tenPhong, 30)}
                        </Tooltip>
                      </h1>
                      <p>{convertUSDToVND(item.giaTien)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p
                        onClick={() => {
                          setModalType("view");
                          setIsModalViewRoomsOpen(true);
                          setRoomView(item);
                        }}
                        className="text-primary-100 hover:underline pt-3"
                      >
                        Xem chi tiết
                      </p>
                      <p
                        onClick={() => {
                          handleDeleteRoom(item.id);
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
                current={rooms?.pageIndex}
                defaultPageSize={10}
                pageSize={rooms?.pageSize}
                total={rooms?.totalRow}
                onChange={(page: number, pageSize: number): void => {
                  const { keyword } = getParams();
                  router.push(
                    `/${locale}/admin/rooms/?page=${page}&size=${pageSize}&keyword=${keyword}`
                  );
                }}
              />
            </>
          ) : (
            <Spin />
          )}
        </div>
      </div>
      {isModalViewRoomsOpen && (
        <ModalViewRoom
          getData={getData}
          roomView={roomView}
          modalType={modalType}
          setModalType={setModalType}
          isModalViewRoomsOpen={isModalViewRoomsOpen}
          setIsModalViewRoomsOpen={setIsModalViewRoomsOpen}
        />
      )}
    </>
  );
};

export default Rooms;
