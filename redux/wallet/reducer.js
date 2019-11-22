import * as types from "./types";

export const initialState = {
  pending: null,
  success: null,
  w3: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_W3_FAILURE:
      return {
        ...state,
        pending: false,
        success: false,
      };
    case types.SET_W3_PENDING:
      return {
        ...state,
        pending: true,
        success: null,
      };
    case types.SET_W3_SUCCESS:
      return {
        ...state,
        pending: false,
        success: true,
        w3: action.payload,
      };

    default:
      return state;
  }
}
