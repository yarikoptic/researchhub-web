import React, { Component } from "react";
import { configureWeb3 } from "../ethereum/configureProvider";

export default class Wallet extends Component {
  async componentDidMount() {
    // TODO: Instead of having this in component did mount wait for the user to
    // select an option (metamask|local) and pass it in
    await configureWeb3("metamask");
  }

  render() {
    return <div>wallet</div>;
  }
}
