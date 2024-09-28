import { httpClient } from "@/utils/setting/setting";

export const uploadAvatarAsync = async (formData: any) => {
  const res = await httpClient.post("/api/users/upload-avatar", formData);
  return res.data;
};
