"use client";

import { NotifiType } from "@/types/notifi/notifi.type";

const useNotifiCustome = () => {
  const createNotification = (key: string, value: NotifiType): void => {
    const notifications: NotifiType[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    // Kiểm tra nếu mảng đã có 5 phần tử thì xoá phần tử cuối cùng
    if (notifications.length >= 5) {
      notifications.pop();
    }

    // Thêm phần tử mới vào đầu mảng
    notifications.unshift(value);

    // Lưu mảng cập nhật lại vào localStorage
    localStorage.setItem(key, JSON.stringify(notifications));
  };

  const removeNotification = (key: string, id: string): void => {
    const notifications: NotifiType[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    const updateNotification = notifications.filter(
      (value: NotifiType) => value.id !== id
    );

    if (updateNotification) {
      localStorage.setItem(key, JSON.stringify(updateNotification));
    }
  };

  const cleanNotification = (key: string): void => {
    localStorage.setItem(key, JSON.stringify([]));
  };

  return { createNotification, removeNotification, cleanNotification };
};

export default useNotifiCustome;
