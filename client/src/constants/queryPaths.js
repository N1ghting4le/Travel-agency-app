export const BASE_URL = "http://localhost:8080";

export const getTourByIdApiEndpoint = (id) => `${BASE_URL}/tour/get/${id}`;

export const getTakenBookingsByEmployeeIdApiEndpoint = (id) =>
  `${BASE_URL}/booking/getTaken/${id}`;

export const getBookingsByClientIdApiEndpoint = (id) =>
  `${BASE_URL}/booking/get/${id}`;

export const CREATE_BOOKING_API_ENDPOINT = `${BASE_URL}/booking/create`;
export const GET_BOOKINGS_BY_DATE_RANGE_API_ENDPOINT = `${BASE_URL}/booking/getByDateRange`;

export const takeBookingApiEndpoint = (id) => `${BASE_URL}/booking/take/${id}`;

export const AUTH_API_ENDPOINT = `${BASE_URL}/user/auth`;

export const getResortsByCountryApiEndpoint = (country) =>
  `${BASE_URL}/resort/get/${country}`;
export const getHotelsByCountryEndpoint = (country) =>
  `${BASE_URL}/hotel/getHotels/${country}`;
export const getHotelsByParamsEndpoint = (params) =>
  `${BASE_URL}/hotel/getHotels?${params}`;

export const CREATE_HOTEL_API_ENDPOINT = `${BASE_URL}/hotel/create`;

export const CREATE_RESORT_API_ENDPOINT = `${BASE_URL}/resort/create`;

export const CREATE_REVIEW_API_ENDPOINT = `${BASE_URL}/review/create`;
export const UPDATE_REVIEW_API_ENDPOINT = `${BASE_URL}/review/update`;

export const getReviewsByTourIdApiEndpoint = (id) =>
  `${BASE_URL}/review/get/${id}`;

export const SIGN_IN_API_ENDPOINT = `${BASE_URL}/user/signIn`;
export const SIGN_UP_API_ENDPOINT = `${BASE_URL}/user/signUp`;

export const changeBookingStatusApiEndpoint = (id, approve) =>
  `${BASE_URL}/booking/changeStatus/${id}/${approve ? "approve" : "reject"}`;

export const CREATE_TOUR_API_ENDPOINT = `${BASE_URL}/tour/create`;
export const UPDATE_TOUR_API_ENDPOINT = `${BASE_URL}/tour/update`;
export const GET_TOURS_API_ENDPOINT = `${BASE_URL}/tour/getTours`;

export const deleteTourApiEndpoint = (id) => `${BASE_URL}/tour/delete/${id}`;

export const getBookingCostsApiEndpoint = (params) =>
  `${BASE_URL}/booking/charts/costs?${params}`;
export const getBookingAmountsApiEndpoint = (params) =>
  `${BASE_URL}/booking/charts/amounts?${params}`;
export const getBookingSummaryApiEndpoint = (params) =>
  `${BASE_URL}/booking/summary?${params}`;

export const getTourStatsApiEndpoint = (params) =>
  `${BASE_URL}/tour/stats?${params}`;
