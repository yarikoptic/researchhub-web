import { css, StyleSheet } from "aphrodite";
import { EditorState, Modifier, SelectionState } from "draft-js";
import InlineCommentUnduxStore, {
  findTargetInlineComment,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";
import Popover from "react-popover";
import React, { useEffect, useMemo, useState } from "react";

export const getUnmountStrategy = ({ editorState, setEditorState }) => (
  targetEntityContentState
) => {
  /* Most likely this will trigger only once. There may be instances where they have nested comments*/
  targetEntityContentState.getBlockMap().forEach((block) => {
    const blockKey = block.getKey();
    const blockText = block.getText();
    const selection = SelectionState.createEmpty(blockKey);
    const updatedSelection = selection.merge({
      anchorOffset: 0,
      focusOffset: blockText.length,
    });
    const emptyEntEditorState = EditorState.set(editorState, {
      currentContent: Modifier.applyEntity(
        targetEntityContentState,
        updatedSelection,
        null
      ),
    });
    setEditorState(emptyEntEditorState);
  });
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
  const doesCommentExistInStore = targetInlineComment != null;

  useEffect(() => {
    if (!doesCommentExistInStore) {
      setShowPopover(true);
    }
    return function() {
      console.warn("cleaning up");
    };
  }, [doesCommentExistInStore]);

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

  const dismountAndRemoveThisEntity = (event) => {
    event.stopPropagation();
    console.warn("Clicked OUT");
    setShowPopover(false);
    unmountStrategy(contentState);
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
            doesCommentExistInStore ? styles.commentTextHighLight : null
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
