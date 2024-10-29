import { CommentType } from "@/types/comment/comment.type";
import { formatDate } from "@/utils/method/method";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rate } from "antd";
import React from "react";

type Props = {
  comment: CommentType;
};

const CommentItem: React.FC<Props> = ({ comment }) => {
  return (
    <div className="w-full md:w-[calc((100%-12px)/2)] mb-5">
      <Rate disabled className="!text-xs" value={comment.saoBinhLuan} />
      <div className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] rounded-full border flex items-center justify-center">
          {comment.avatar != "" ? (
            <img
              src={comment.avatar}
              alt="avata"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <FontAwesomeIcon
              className="text-custome-gray-200 "
              size="xl"
              icon={faUser}
            />
          )}
        </div>
        <div>
          <h1 className="text-custome-black-100 font-medium">
            {comment.tenNguoiBinhLuan}
          </h1>
          <p className="text-custome-gray-200">
            {formatDate(comment.ngayBinhLuan)}
          </p>
        </div>
      </div>
      <p className="text-custome-black-100 mt-2">{comment.noiDung}</p>
    </div>
  );
};

export default CommentItem;
