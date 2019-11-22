import React, { Component } from "react";
import { connect } from "react-redux";

import { configureW3 } from "../ethereum/configureProvider";
import WalletActions from "../redux/wallet";

class Wallet extends Component {
  async componentDidMount() {
    // TODO: Instead of having this in component did mount wait for the user to
    // select an option (metamask|local) and pass it in
    const w3 = await configureW3("local", { userPassword: "hello, cipher" });
    this.props.dispatch(WalletActions.setW3(w3));
  }

  render() {
    return <div>wallet</div>;
  }
}

export default connect()(Wallet);
