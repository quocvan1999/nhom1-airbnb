"use client";

import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { Button, Form, Modal, Rate } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ReqType } from "@/types/req/reqType.type";
import { NewCommentType } from "@/types/new-comment/newCommentType.type";
import { commentAsync } from "@/services/comment/comment.service";
import {
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import { BookingType } from "@/types/booking/bookingType.type";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { NotifiType } from "@/types/notifi/notifi.type";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { useTranslations } from "next-intl";

type Props = {
  isModalViewRatingOpen: boolean;
  setIsModalViewRatingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  booking: BookingType;
  isRating: boolean;
  setIsRating: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalRating: React.FC<Props> = ({
  isModalViewRatingOpen,
  setIsModalViewRatingOpen,
  booking,
  isRating,
  setIsRating,
}) => {
  const tNotification = useTranslations("Notification");
  const tLocalNotifi = useTranslations("LocalNotifi");
  const tModalRating = useTranslations("ModalRating");
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { createNotification } = useNotifiCustome();

  const initialValues: { comment: string; rating: number } = {
    comment: "",
    rating: 0,
  };

  const setRatingLocal = (idBooking: number): void => {
    const ratingBooking: number[] = JSON.parse(
      localStorage.getItem("ratingList") || "[]"
    );

    const pushRating = ratingBooking.push(idBooking);

    if (pushRating) {
      localStorage.setItem("ratingList", JSON.stringify(ratingBooking));
      setIsRating(true);
    }
  };

  const handleComment = async (values: {
    comment: string;
    rating: number;
  }): Promise<void> => {
    const newComment: NewCommentType = {
      id: 0,
      maNguoiBinhLuan: profile.id,
      ngayBinhLuan: getCurrentDateTime(),
      noiDung: values.comment,
      saoBinhLuan: values.rating,
      maPhong: booking.maPhong,
    };

    const res: ReqType<NewCommentType> = await commentAsync(newComment);

    if (res) {
      switch (res.statusCode) {
        case 201:
          openNotification(
            "success",
            `${tNotification("ModalRating.ratingSuccess.title")}`,
            `${tNotification("ModalRating.ratingSuccess.content")}`
          );
          setIsModalViewRatingOpen(false);
          formComment.resetForm();
          setRatingLocal(booking.id);

          const newNotification: NotifiType = {
            id: `Rt${getFormattedDateTime()}`,
            title: `${tLocalNotifi("ModalRating.ratingSuccess.title")}`,
            content: `${tLocalNotifi("ModalRating.ratingSuccess.content")}`,
            date: `${getCurrentDateTime()}`,
            type: "success",
          };
          createNotification(
            `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`,
            newNotification
          );

          const action = setIsLoadingNotification();
          dispatch(action);
          break;
        default:
          openNotification(
            "error",
            `${tNotification("ModalRating.ratingError.title")}`,
            `${tNotification("ModalRating.ratingError.content")}`
          );
          break;
      }
    }
  };

  const formComment = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      comment: Yup.string().required(
        `${tModalRating("FormRating.comment.required")}`
      ),
    }),
    onSubmit: (values) => {
      handleComment(values);
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
            <Rate
              className="!mb-3 !text-2xl"
              onChange={(count: number) =>
                formComment.setFieldValue("rating", count)
              }
            />
            <textarea
              name="comment"
              placeholder={tModalRating("FormRating.placeholder")}
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
                {tModalRating("buttonCancelTitle")}
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="bg-primary-100 px-3 py-2 text-white font-medium rounded-lg transition-all duration-500 ease-in-out hover:bg-primary-200"
              >
                {tModalRating("buttonRatingTitle")}
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalRating;
