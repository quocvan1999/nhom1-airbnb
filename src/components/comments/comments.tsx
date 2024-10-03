"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import CommentItem from "@/components/comment-item/CommentItem";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";
import { CommentType } from "@/types/comment/comment.type";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  id: string | number;
};

const Comments: React.FC<Props> = ({ id }) => {
  const dispatch: AppDispatch = useDispatch();
  const { comments } = useSelector((state: RootState) => state.room);

  useEffect(() => {
    const action = getCommentToRoomAsync(id);
    dispatch(action);
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mt-5">
      {comments &&
        comments.length > 0 &&
        comments.map((comment: CommentType, index: number) => (
          <CommentItem key={index} comment={comment} />
        ))}
    </div>
  );
};

export default Comments;
