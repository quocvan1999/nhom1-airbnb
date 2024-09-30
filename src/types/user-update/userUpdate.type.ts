import { User } from "@/types/user/userType.type";

export type UserUpdate = Pick<
  User,
  "id" | "name" | "email" | "phone" | "birthday" | "gender" | "role"
>;
