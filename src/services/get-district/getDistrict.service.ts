import { OptionLocationtype } from "@/types/option-location/optionLocationType.type";
import axios, { AxiosResponse } from "axios";

export const getDistrictAysnc = async (
  id: string
): Promise<OptionLocationtype[]> => {
  const res: AxiosResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCATION_URL}/2/${id}.htm`
  );
  return res.data.data;
};
