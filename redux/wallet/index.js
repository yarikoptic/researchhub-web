import * as actions from "./actions";
// import * as shims from "./shims";
// import API from "~/config/api";
// import * as utils from "../utils";

export function setW3(w3) {
  return (dispatch) => {
    return dispatch(actions.setW3(w3));
  };
}

const WalletActions = {
  setW3: (w3) => actions.setW3(w3),
  setW3Pending: () => actions.setW3Pending(),
  setW3Failure: () => actions.setW3Failure(),
};

export default WalletActions;
