"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import CommentItem from "@/components/comment-item/CommentItem";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";
import { CommentType } from "@/types/comment/comment.type";
import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  id: string | number;
};

const Comments: React.FC<Props> = ({ id }) => {
  const dispatch: AppDispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const { comments } = useSelector((state: RootState) => state.room);
  const [data, setData] = useState<CommentType[] | null>(null)

  const handleChangePageIndex = (page: number) => {
    setPageIndex(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  useEffect(() => {
    const action = getCommentToRoomAsync(id);
    dispatch(action);
  }, []);

  useEffect(() => {
    if (comments.length > 0) {
      const paginatedData = comments.slice(
        (pageIndex - 1) * pageSize,
        pageIndex * pageSize
      );

      setData(paginatedData)

    }
  }, [comments, pageIndex, pageSize])

  return (
    <>
      <h3 className="font-bold text-xl">Đánh giá</h3>
      <div className="flex flex-wrap gap-3 mt-3">
        {data &&
          data.length > 0 &&
          data.map((comment: CommentType, index: number) => (
            <CommentItem key={index} comment={comment} />
          ))}
      </div>
      {comments && comments.length > 5 && (
        <div className="mt-5">
          <Pagination
            align="end"
            current={pageIndex}
            defaultPageSize={pageSize}
            total={comments.length}
            onChange={handleChangePageIndex}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
          />
        </div>
      )}
    </>

  );
};

export default Comments;
