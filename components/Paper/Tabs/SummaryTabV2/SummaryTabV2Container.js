import React, { useState } from "react";

function SummaryTabV2Container() {
  const [] = useState({
    isReadOnly,
    editorState,
    editorValue: null,
    menuOpen: false,
    transition: false,
    firstLoad: true,
    summaryExists: false,
    editing: false,
    finishedLoading: false,
    // abstract
    abstract: "",
    showAbstract: true,
    editAbstract: false,
    checked: false,
  });
}
