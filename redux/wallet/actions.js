import * as types from "./types";

export function setW3(w3) {
  return {
    type: types.SET_W3_SUCCESS,
    payload: w3,
  };
}
export function setW3Failure() {
  return {
    type: types.SET_W3_FAILURE,
  };
}
export function setW3Pending() {
  return {
    type: types.SET_W3_PENDING,
  };
}
