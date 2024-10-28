"use client";

import { RootState } from "@/app/globalRedux/store";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { Button, Form, Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ReqType } from "@/types/req/reqType.type";
import { NewCommentType } from "@/types/new-comment/newCommentType.type";
import { commentAsync } from "@/services/comment/comment.service";
import { getCurrentDateTime } from "@/utils/method/method";
import { BookingType } from "@/types/booking/bookingType.type";

type Props = {
  isModalViewRatingOpen: boolean;
  setIsModalViewRatingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  booking: BookingType;
};

const ModalRating: React.FC<Props> = ({
  isModalViewRatingOpen,
  setIsModalViewRatingOpen,
  booking,
}) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { openNotification } = useNotification();

  const initialValues: { comment: string } = {
    comment: "",
  };

  const handleComment = async (value: string): Promise<void> => {
    const newComment: NewCommentType = {
      id: 0,
      maNguoiBinhLuan: profile.id,
      ngayBinhLuan: getCurrentDateTime(),
      noiDung: value,
      saoBinhLuan: 5,
      maPhong: booking.maPhong,
    };

    const res: ReqType<NewCommentType> = await commentAsync(newComment);

    if (res) {
      console.log("CHECK RES", res);

      switch (res.statusCode) {
        case 201:
          openNotification("success", "Đánh giá", "Thêm đánh giá thành công");
          setIsModalViewRatingOpen(false);
          formComment.resetForm();
          break;
        default:
          openNotification(
            "error",
            "Đánh giá",
            "Thêm đánh giá không thành công"
          );
          break;
      }
    }
  };

  const formComment = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      comment: Yup.string().required("Đánh giá không được để trống"),
    }),
    onSubmit: (values) => {
      handleComment(values.comment);
    },
  });

  return (
    <Modal
      onCancel={() => {
        setIsModalViewRatingOpen(false);
      }}
      width={550}
      footer={null}
      open={isModalViewRatingOpen}
      closable={false}
    >
      <Form onSubmitCapture={formComment.handleSubmit} className="w-full">
        <div className="flex flex-col">
          <Form.Item
            validateStatus={
              formComment.touched.comment && formComment.errors.comment
                ? "error"
                : ""
            }
            help={formComment.touched.comment && formComment.errors.comment}
            className="w-full !mb-0"
          >
            <textarea
              name="comment"
              placeholder="Nhập vào đánh giá của bạn..."
              onChange={formComment.handleChange}
              value={formComment.values.comment}
              className="border rounded-xl min-h-[100px] md:min-h-[150px] w-[100%] p-3 focus:outline-none"
            />
          </Form.Item>

          <Form.Item className="!mb-0">
            <div className="w-full flex items-center justify-end gap-3">
              <Button
                onClick={() => {
                  setIsModalViewRatingOpen(false);
                }}
                size="large"
                className="bg-primary-100 px-3 py-2 text-white font-medium rounded-lg transition-all duration-500 ease-in-out hover:bg-primary-200"
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="bg-primary-100 px-3 py-2 text-white font-medium rounded-lg transition-all duration-500 ease-in-out hover:bg-primary-200"
              >
                Thêm đánh giá
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalRating;
