import { css, StyleSheet } from "aphrodite";
import React, {
  ReactElement,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  SyntheticEvent,
} from "react";
import Popover from "react-popover";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  findTargetInlineComment,
  getSavedInlineCommentsGivenBlockKey,
} from "./undux/InlineCommentUnduxStore";
import PaperDraftStore from "../PaperDraft/undux/PaperDraftUnduxStore";
import { formatTextWrapID } from "./util/PaperDraftInlineCommentUtil";

type useClickOutSideEffectArgs = {
  isBeingPrompted: boolean;
  isSilenced: boolean;
  onClickOutside: (event: SyntheticEvent) => void;
  textWrapRef: MutableRefObject<"span" | null>;
};

function useClickOutSideEffect({
  isBeingPrompted,
  isSilenced,
  onClickOutside,
  textWrapRef,
}: useClickOutSideEffectArgs) {
  useEffect(() => {
    if (isBeingPrompted && !isSilenced) {
      function handleClickOutside(event) {
        const refCurrent =
          textWrapRef != null &&
          textWrapRef.current != null &&
          typeof textWrapRef.current === "object"
            ? textWrapRef.current
            : null;
        // @ts-ignore
        if (refCurrent != null && !refCurrent.contains(event.target)) {
          onClickOutside(event);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isBeingPrompted, isSilenced, onClickOutside, textWrapRef]);
}

export default function PaperDraftInlineCommentTextWrapWithSlideButton(
  props /* prop comes in from draft-js */
): ReactElement<"span"> {
  const { blockKey, children, contentState, decoratedText, entityKey } = props;
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftStore.useStore();
  const animatedEntityKey = inlineCommentStore.get("animatedEntityKey");
  const animatedTextCommentID = inlineCommentStore.get("animatedTextCommentID");
  const silencedPromptKeys = inlineCommentStore.get("silencedPromptKeys");
  const { commentThreadID } = contentState.getEntity(entityKey).getData();
  const isCommentSavedInBackend = commentThreadID != null;
  const doesCommentExistInStore =
    findTargetInlineComment({
      blockKey,
      commentThreadID,
      entityKey,
      store: inlineCommentStore,
    }) != null;

  const shouldTextBeHighlighted = useMemo(
    () => doesCommentExistInStore || isCommentSavedInBackend,
    [doesCommentExistInStore, isCommentSavedInBackend]
  );
  const isCurrentCommentTextActive = useMemo(
    () =>
      shouldTextBeHighlighted &&
      (animatedTextCommentID === commentThreadID ||
        animatedEntityKey === entityKey),
    [
      animatedEntityKey,
      animatedTextCommentID,
      commentThreadID,
      entityKey,
      shouldTextBeHighlighted,
    ]
  );

  const textWrapRef = useRef(null);
  const isBeingPrompted =
    inlineCommentStore.get("promptedEntityKey") === entityKey;

  const hidePrompterAndSilence = (event: SyntheticEvent) => {
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    paperDraftStore.set("editorState")(
      inlineCommentStore.get("prePromptEditorState")
    );
  };

  useClickOutSideEffect({
    isBeingPrompted,
    isSilenced: silencedPromptKeys.has(entityKey),
    onClickOutside: hidePrompterAndSilence,
    textWrapRef,
  });

  const openCommentThreadDisplay = (event) => {
    event.stopPropagation();
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    inlineCommentStore.set("displayableInlineComments")(
      getSavedInlineCommentsGivenBlockKey({
        blockKey,
        editorState: paperDraftStore.get("editorState"),
      })
    );
    inlineCommentStore.set("animatedTextCommentID")(commentThreadID);
  };

  return (
    <span
      className={css(
        shouldTextBeHighlighted
          ? styles.commentTextHighLight
          : styles.textNonHighLight,
        isCurrentCommentTextActive ? styles.commentActiveHighlight : null
      )}
      id={
        commentThreadID != null
          ? formatTextWrapID(commentThreadID)
          : formatTextWrapID(entityKey)
      }
      key={`InlineCommentTextWrap-${entityKey}`}
      onClick={openCommentThreadDisplay}
      ref={textWrapRef}
      role="none"
    >
      {children}
    </span>
  );
}

const styles = StyleSheet.create({
  commentActiveHighlight: {
    backgroundColor: "rgb(140 230 180)",
    cursor: "pointer",
  },
  commentTextHighLight: {
    backgroundColor: "rgb(204 243 221)",
    cursor: "pointer",
  },
  popoverBodyStyle: {
    background: "rgb(0,0,0)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: 14,
    padding: "8px 16px",
    borderRadius: 5,
  },
  textNonHighLight: {
    backgroundColor: "transparent",
  },
});
