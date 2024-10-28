import { CommentType } from "@/types/comment/comment.type";
import { formatDate } from "@/utils/method/method";
import React from "react";

type Props = {
  comment: CommentType;
};

const CommentItem: React.FC<Props> = ({ comment }) => {
  return (
    // w-[calc((100%-12px)/2)]
    <div className="w-full md:w-[calc((100%-12px)/2)] mb-5">
      <div className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] rounded-full border flex items-center justify-center">
          {comment.avatar != "" ? (
            <img
              src={comment.avatar}
              alt="avata"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "#6a6a6a" }}
            >
              <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
            </svg>
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
