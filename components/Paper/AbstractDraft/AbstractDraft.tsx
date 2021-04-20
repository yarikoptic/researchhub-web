import React, { useState } from "react";
import PaperDraftUnduxStore from "../../PaperDraft/undux/PaperDraftUnduxStore";

type EditorStatus = "editing" | "loading" | "standby";

type ComponentState = {
  isReadOnly: boolean;
  editorState: null;
  summaryExists: false;
  editorStatus: EditorStatus;
  abstract: "";
  showAbstract: boolean;
  editAbstract: false;
  checked: false;
};

export default function PaperAbtractTab() {
  const paperDraftStore = PaperDraftUnduxStore.useStore();
  const [componentState, setComponentState] = useState({
    isReadOnly: true,
    editorState: null,
    firstLoad: true,
    editing: false,
    finishedLoading: false,
    // abstract
    abstract: "",
    showAbstract: true,
    editAbstract: false,
    checked: false,
  });
  return <div> Hi </div>;
}
