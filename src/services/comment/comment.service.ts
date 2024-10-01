import { NewCommentType } from "@/types/new-comment/newCommentType.type";
import { ReqType } from "@/types/req-login/reqLoginType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const commentAsync: (
  newComment: NewCommentType
) => Promise<ReqType<NewCommentType>> = async (newComment) => {
  const token = getCookie("accessToken");
  const res: AxiosResponse = await httpClient.post(
    "/api/binh-luan",
    newComment,
    {
      headers: {
        token: token,
      },
    }
  );
  return res.data;
};
