import { CommentType } from "@/types/comment/comment.type";
import { httpClient } from "@/utils/setting/setting";

export const getCommentToRoomAsync: (
  id: number | string
) => Promise<CommentType[]> = async (id) => {
  const res = await httpClient.get(
    `/api/binh-luan/lay-binh-luan-theo-phong/${id}`
  );
  return res.data.content;
};
