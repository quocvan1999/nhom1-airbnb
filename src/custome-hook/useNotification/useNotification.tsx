import { notification } from "antd";
import { NotificationType } from "@/types/notification/notificationType.type";

const useNotification = () => {
  const openNotification = (
    type: "success" | "error" | "info" | "warning",
    message: string,
    description: string
  ): void => {
    const config: NotificationType = {
      message,
      description,
      showProgress: true,
      pauseOnHover: true,
      placement: "bottomRight",
      duration: 2.5,
      key: Date.now(),
    };

    switch (type) {
      case "success":
        notification.success(config);
        break;
      case "error":
        notification.error(config);
        break;
      case "info":
        notification.info(config);
        break;
      case "warning":
        notification.warning(config);
        break;
      default:
        break;
    }
  };

  return { openNotification };
};

export default useNotification;
