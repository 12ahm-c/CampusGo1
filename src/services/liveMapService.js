import axios from "axios";

// هذا يأخذ الرابط مباشرة من environment variables
const API_URL = import.meta.env.VITE_API_URL_AUTH.replace("/auth", "");

export const getAllBuses = async () => {
  try {
    const res = await axios.get(`${API_URL}/buses`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getETA = async (busId) => {
  try {
    const res = await axios.get(`${API_URL}/bus/${busId}/eta`);
    return res.data.eta;
  } catch (err) {
    console.error(err);
    return null;
  }
};