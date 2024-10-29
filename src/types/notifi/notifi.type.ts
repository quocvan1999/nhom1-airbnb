export type NotifiType = {
  id: string;
  title: string;
  content: string;
  type: "success" | "error" | "info" | "warning";
  date: string;
};
