"use client";

import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { commentAsync } from "@/services/comment/comment.service";
import { NewCommentType } from "@/types/new-comment/newCommentType.type";
import { RoomType } from "@/types/room/roomType.type";
import { ReqType } from "@/types/req-login/reqLoginType.type";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Props = {
  data: RoomType;
};

const Comment: React.FC<Props> = ({ data }) => {
  const router: AppRouterInstance = useRouter();
  const { profile } = useSelector((state: RootState) => state.user);
  const [login, setLogin] = useState<boolean>(false);
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const { openNotification } = useNotification();

  const initialValues: { comment: string } = {
    comment: "",
  };

  const handleComment = async (value: string): Promise<void> => {
    const newComment: NewCommentType = {
      maNguoiBinhLuan: profile.id,
      ngayBinhLuan: Date.now().toString(),
      noiDung: value,
      saoBinhLuan: 5,
      maPhong: data.id,
    };

    const res: ReqType<NewCommentType> = await commentAsync(newComment);

    switch (res.statusCode) {
      case 201:
        openNotification("success", "Comment", "Thêm mới bình luận thành công");
        router.push(`/room/${data.id}`);
        break;
      default:
        break;
    }
  };

  const formComment = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      comment: Yup.string().required(
        `${
          login === true
            ? "Comment không được để trống"
            : "Bạn phải đăng nhập để comment"
        }`
      ),
    }),
    onSubmit: (values) => {
      handleComment(values.comment);
    },
  });

  useEffect(() => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin === true) {
      setLogin(true);
      getProfile();
    } else {
      setLogin(false);
    }
  }, []);

  return (
    <Form onSubmitCapture={formComment.handleSubmit}>
      <div className="flex gap-3">
        <div
          className="w-[50px] h-[50px] rounded-full flex items-center justify-center border"
          style={{
            backgroundImage: login === true ? `url("${profile.avatar}")` : "",
            backgroundSize: "cover",
          }}
        >
          {login === false && (
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
        <Form.Item
          validateStatus={
            formComment.touched.comment && formComment.errors.comment
              ? "error"
              : ""
          }
          help={formComment.touched.comment && formComment.errors.comment}
          className="w-[95%]"
        >
          <textarea
            name="comment"
            placeholder="Enter comment..."
            onChange={formComment.handleChange}
            value={formComment.values.comment}
            className="border rounded-xl min-h-[150px] w-[100%] p-3 focus:outline-none"
          />
        </Form.Item>
      </div>
      <div className="flex justify-end">
        <Form.Item>
          <button
            type="submit"
            className="bg-primary-100 px-3 py-2 text-white font-medium rounded-lg mt-3 transition-all duration-500 ease-in-out hover:bg-primary-200"
          >
            Add comment
          </button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default Comment;
