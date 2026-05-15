import { CURRENCY_API_KEY } from "./currencyApiKey";
import { currencies } from "@/lists/currencies";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getTourByIdApiEndpoint = (id) => `${BASE_URL}/tour/get/${id}`;

export const getBookingsByClientIdApiEndpoint = (id) =>
  `${BASE_URL}/booking/get/${id}`;

export const CREATE_BOOKING_API_ENDPOINT = `${BASE_URL}/booking/create`;
export const GET_BOOKINGS_BY_PARAMS_API_ENDPOINT = `${BASE_URL}/booking/getByParams`;

export const takeBookingApiEndpoint = (id) => `${BASE_URL}/booking/take/${id}`;

export const AUTH_API_ENDPOINT = `${BASE_URL}/user/auth`;
export const GOOGLE_AUTH_ENDPOINT = `${BASE_URL}/user/google`;
export const COMPLETE_PROFILE_ENDPOINT = `${BASE_URL}/user/completeProfile`;

export const getResortsByCountryApiEndpoint = (country) =>
  `${BASE_URL}/resort/get/${country}`;
export const getHotelsByCountryEndpoint = (country) =>
  `${BASE_URL}/hotel/get/${country}`;
export const getHotelsByParamsEndpoint = (params) =>
  `${BASE_URL}/hotel/get?${params}`;

export const getHotelByIdApiEndpoint = (id) => `${BASE_URL}/hotel/${id}`;

export const CREATE_HOTEL_API_ENDPOINT = `${BASE_URL}/hotel/create`;

export const CREATE_RESORT_API_ENDPOINT = `${BASE_URL}/resort/create`;

export const CREATE_REVIEW_API_ENDPOINT = `${BASE_URL}/review/create`;
export const UPDATE_REVIEW_API_ENDPOINT = `${BASE_URL}/review/update`;

export const getReviewsByTourIdApiEndpoint = (id) =>
  `${BASE_URL}/review/get/${id}`;
export const getAvgMarkByTourIdApiEndpoint = (id) =>
  `${BASE_URL}/review/get/${id}/avg`;

export const SIGN_IN_API_ENDPOINT = `${BASE_URL}/user/signIn`;
export const SIGN_UP_API_ENDPOINT = `${BASE_URL}/user/signUp`;

export const changeBookingStatusApiEndpoint = (id, approve) =>
  `${BASE_URL}/booking/changeStatus/${id}/${approve ? "approve" : "reject"}`;

export const CREATE_TOUR_API_ENDPOINT = `${BASE_URL}/tour/create`;
export const UPDATE_TOUR_API_ENDPOINT = `${BASE_URL}/tour/update`;
export const GET_TOURS_API_ENDPOINT = `${BASE_URL}/tour/getTours`;

export const archiveTourApiEndpoint = (id) => `${BASE_URL}/tour/archive/${id}`;
export const restoreTourApiEndpoint = (id) => `${BASE_URL}/tour/restore/${id}`;
export const deleteTourApiEndpoint = (id) => `${BASE_URL}/tour/delete/${id}`;

export const getBookingCostsApiEndpoint = (params) =>
  `${BASE_URL}/booking/charts/costs?${params}`;
export const getBookingAmountsApiEndpoint = (params) =>
  `${BASE_URL}/booking/charts/amounts?${params}`;
export const getBookingSummaryApiEndpoint = (params) =>
  `${BASE_URL}/booking/summary?${params}`;

export const GET_TOUR_STATS_API_ENDPOINT = `${BASE_URL}/tour/stats`;
export const GET_TOURS_ADMIN_API_ENDPOINT = `${BASE_URL}/tour/get/admin`;

export const GET_HOTELS_ADMIN_API_ENDPOINT = `${BASE_URL}/hotel/get/admin`;
export const deleteHotelApiEndpoint = (id) => `${BASE_URL}/hotel/delete/${id}`;

export const getCurrencyApiEndpoint = (currency) =>
  `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/pair/${currencies[0]}/${currency}`;
