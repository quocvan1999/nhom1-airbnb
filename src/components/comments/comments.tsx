"use client";

import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import CommentItem from "@/components/comment-item/CommentItem";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";
import { CommentType } from "@/types/comment/comment.type";
import { roundToDecimal } from "@/utils/method/method";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  id: string | number;
};

const Comments: React.FC<Props> = ({ id }) => {
  const tOptionBooking = useTranslations("OptionBooking");
  const tComments = useTranslations("Comments");
  const dispatch: AppDispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const { comments } = useSelector((state: RootState) => state.room);
  const [data, setData] = useState<CommentType[] | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [countRate, setCountRate] = useState<number>(0);
  const [selectButtonRate, setSelectButtonRate] = useState<number>(0);
  const [countData, setCountData] = useState<number>(0);

  const handleChangePageIndex = (page: number) => {
    setPageIndex(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const setRatingRoom = (): number => {
    let rating: number = 0;
    if (commentCount && countRate) {
      rating = roundToDecimal(countRate / commentCount, 1);
    }

    return rating;
  };

  useEffect(() => {
    const action = getCommentToRoomAsync(id);
    dispatch(action);
  }, []);

  useEffect(() => {
    if (comments.length > 0) {
      let newData: CommentType[] = comments;

      if (selectButtonRate !== 0) {
        newData = [];
        comments.map((comment: CommentType) => {
          comment.saoBinhLuan === selectButtonRate && newData.push(comment);
        });
      }

      const paginatedData = newData.slice(
        (pageIndex - 1) * pageSize,
        pageIndex * pageSize
      );

      setData(paginatedData);
      setCountData(newData.length);

      setCommentCount(comments.length);

      setCountRate(0);
      comments.map((item: CommentType) => {
        setCountRate((prev: number) => (prev += item.saoBinhLuan));
      });
    }
  }, [comments, pageIndex, pageSize, selectButtonRate]);

  return (
    <>
      <div>
        <h3 className="font-bold text-xl">{tComments("titleH1")}</h3>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon className="text-primary-100" icon={faStar} />
          <p className="font-bold text-custome-black-100">
            {setRatingRoom()}
            <span className="font-normal text-custome-gray-200">
              {` (${commentCount} ${tOptionBooking("evaluate")})`}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 py-5">
        <button
          onClick={() => setSelectButtonRate(0)}
          className={`px-7 py-1 border transition-all duration-500 ease-in-out hover:border-primary-100 ${
            selectButtonRate === 0 &&
            "border-primary-100 bg-primary-100 text-white"
          }`}
        >
          Tất cả
        </button>
        {[...Array(5)].map((_, index) => (
          <button
            onClick={() => setSelectButtonRate(index + 1)}
            key={index}
            className={`px-7 py-1 border transition-all duration-500 ease-in-out hover:border-primary-100 ${
              selectButtonRate === index + 1 &&
              "border-primary-100 bg-primary-100 text-white"
            }`}
          >
            {index + 1} {tComments("titleH2")}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {data && data.length > 0 ? (
          data.map((comment: CommentType, index: number) => (
            <CommentItem key={index} comment={comment} />
          ))
        ) : (
          <div className="w-full flex items-center justify-center">
            {tComments("titleNot")}
          </div>
        )}
      </div>
      {countData && countData > 5 ? (
        <div className="mt-5">
          <Pagination
            align="end"
            current={pageIndex}
            defaultPageSize={pageSize}
            total={countData}
            onChange={handleChangePageIndex}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Comments;
