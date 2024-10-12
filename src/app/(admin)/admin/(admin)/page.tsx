"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import { getUsersAsync } from "@/services/users/getUsers.service";
import { Button, Pagination, Table } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  searchParams: {
    page: string | number;
    size: string | number;
  };
};

const AdminPage: React.FC<Props> = ({ searchParams }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.user);

  const getData = (): void => {
    const action = getUsersAsync(searchParams.page, searchParams.size);
    dispatch(action);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  useEffect(() => {
    getData();
  }, [searchParams.page, searchParams.size]);

  return (
    <>
      <Button>Thêm người dùng</Button>
      {users && users.data && (
        <Table dataSource={users.data} columns={columns} pagination={false} />
      )}

      <div className="mt-10">
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
      </div>
    </>
  );
};

export default AdminPage;
