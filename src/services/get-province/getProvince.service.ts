import { OptionLocationtype } from "@/types/option-location/optionLocationType.type";
import axios, { AxiosResponse } from "axios";

export const getProvinceAysnc = async (): Promise<OptionLocationtype[]> => {
  const res: AxiosResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCATION_URL}/1/0.htm`
  );
  return res.data.data;
};
