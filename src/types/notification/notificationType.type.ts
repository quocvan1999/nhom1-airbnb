export type NotificationType = {
  message: string;
  description: string;
  showProgress: boolean;
  pauseOnHover: boolean;
  placement:
    | "bottomRight"
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | undefined;
  duration: number;
  key: number;
};
