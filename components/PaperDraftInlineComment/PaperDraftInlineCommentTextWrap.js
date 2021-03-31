import { css, StyleSheet } from "aphrodite";
import { EditorState, Modifier, SelectionState } from "draft-js";
import InlineCommentUnduxStore, {
  findTargetInlineComment,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";
import Popover from "react-popover";
import React, { useEffect, useMemo, useState } from "react";

export const getUnmountStrategy = ({ editorState, setEditorState }) => (
  blockKey,
  targetEntityContentState
) => {
  /* Most likely this will trigger only once. There may be instances where they have nested comments*/
  const currSelection = editorState.getSelection();
  const emptySelection = SelectionState.createEmpty(blockKey);
  const updatedEmptySelection = emptySelection.merge({
    anchorKey: currSelection.anchorKey,
    anchorOffset: currSelection.anchorOffset,
    focusOffset: currSelection.focusOffset,
  });
  const emptyEntEditorState = EditorState.set(editorState, {
    currentContent: Modifier.applyEntity(
      targetEntityContentState,
      updatedEmptySelection,
      null
    ),
  });
  setEditorState(emptyEntEditorState);
};

function PaperDraftInlineCommentTextWrap(
  props /* prop comes in from draft-js */
) {
  const {
    blockKey,
    commentThreadID,
    contentState,
    entityKey,
    unmountStrategy,
  } = props ?? {};
  const [showPopover, setShowPopover] = useState(false);
  const unduxStore = InlineCommentUnduxStore.useStore();
  const isBeingPrompted =
    unduxStore.get("newInlinePrompter").entityKey === entityKey;
  const targetInlineComment = useMemo(
    () =>
      findTargetInlineComment({
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      }),
    [blockKey, commentThreadID, entityKey, unduxStore]
  );
  console.warn("EntityKEy: ", entityKey);
  console.warn("isBeingPrompted: ", isBeingPrompted);

  useEffect(() => {
    if (isBeingPrompted) {
      setShowPopover(true);
    }
    return function cleanup() {
      console.warn("UN-MOUNTED");
    };
  }, []);

  const hidePopoverAndInsertToStore = (event) => {
    event.stopPropagation();
    updateInlineComment({
      store: unduxStore,
      updatedInlineComment: {
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      },
    });
    setShowPopover(false);
  };

  const inlineCommentExists = !isBeingPrompted && targetInlineComment != null;
  const dismountAndRemoveThisEntity = (event) => {
    if (inlineCommentExists) {
      try {
        unduxStore.set("newInlinePrompter")({ entityKey: null });
        console.warn("Clicked OUT");
        unmountStrategy(blockKey, entityKey, contentState);
      } catch {}
      setShowPopover(false);
    }
  };
  return (
    <Popover
      onOuterAction={dismountAndRemoveThisEntity}
      above
      body={
        <span
          className={css(styles.popoverBodyStyle)}
          role="none"
          onClick={hidePopoverAndInsertToStore}
        >
          {"Add Comment"}
        </span>
      }
      children={
        <span
          className={css(
            inlineCommentExists ? styles.commentTextHighLight : null
          )}
        >
          {props.children}
        </span>
      }
      isOpen={showPopover}
    />
  );
}

const styles = StyleSheet.create({
  commentTextHighLight: {
    backgroundColor: "rgb(204 243 221)",
  },
  popoverBodyStyle: {
    background: "rgb(41, 41, 41)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px",
    borderRadius: 5,
  },
});

export default PaperDraftInlineCommentTextWrap;
