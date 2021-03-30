import { CompositeDecorator, EditorState } from "draft-js";
import React, { useEffect, useMemo, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import InlineCommentUnduxStore from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { fetchPaperDraft } from "~/config/fetch";
import {
  getBlockStyleFn,
  getHandleKeyCommand,
} from "./util/PaperDraftTextEditorUtil";
import {
  findInlineCommentEntity,
  findWayPointEntity,
} from "./util/PaperDraftDecoratorFinders";
import {
  formatBase64ToEditorState,
  formatRawJsonToEditorState,
} from "./util/PaperDraftUtils";
import PaperDraft from "./PaperDraft";
import PaperDraftContextMenuWrap from "../PaperDraftInlineComment/PaperDraftContextMenuWrap";
import PaperDraftContextMenuButton from "../PaperDraftInlineComment/PaperDraftContextMenuButton";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "./WaypointSection";

function getDecorator({ seenEntityKeys, setActiveSection, setSeenEntityKeys }) {
  return new CompositeDecorator([
    {
      component: (props) => (
        <WaypointSection {...props} onSectionEnter={setActiveSection} />
      ),
      strategy: findWayPointEntity(seenEntityKeys, setSeenEntityKeys),
    },
    {
      component: (props) => <PaperDraftInlineCommentTextWrap {...props} />,
      strategy: findInlineCommentEntity,
    },
  ]);
}

function paperFetchHook({
  decorator,
  paperId,
  setEditorState,
  setInitEditorState,
  setIsFetching,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const handleFetchSuccess = (data) => {
    const onFormatSuccess = ({ sections }) => {
      /* logical ordering */
      setPaperDraftSections(sections);
      setPaperDraftExists(true);
      setIsFetching(false);
    };
    let digestibleFormat = null;
    if (typeof data !== "string") {
      digestibleFormat = formatRawJsonToEditorState({
        rawJson: data,
        decorator,
        onSuccess: onFormatSuccess,
      });
    } else {
      digestibleFormat = formatBase64ToEditorState({
        base64: data,
        decorator,
        onSuccess: onFormatSuccess,
      });
    }
    setInitEditorState(digestibleFormat);
    setEditorState(digestibleFormat);
  };

  const handleFetchError = (_err) => {
    setPaperDraftExists(false);
    setPaperDraftSections([]);
    setIsFetching(false);
  };

  fetchPaperDraft({ paperId })
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(handleFetchSuccess)
    .catch(handleFetchError);
}

function getShouldShowContextMenu(editorState) {
  const selection = editorState.getSelection();
  const result = selection != null && !selection.isCollapsed();
  console.warn("selection: ", selection);
  console.warn("selection.isCollapsed(): ", selection.isCollapsed());
  return selection != null && !selection.isCollapsed();
}

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
export default function PaperDraftContainer({
  isViewerAllowedToEdit,
  paperDraftExists,
  paperDraftSections,
  paperId,
  setActiveSection,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const [isDraftInEditMode, setIsDraftInEditMode] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [initEditorState, setInitEditorState] = useState(
    EditorState.createEmpty()
  );
  const [isFetching, setIsFetching] = useState(true);
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  const decorator = useMemo(
    () => getDecorator({ seenEntityKeys, setSeenEntityKeys, setActiveSection }),
    [seenEntityKeys, setSeenEntityKeys, setActiveSection]
  );

  useEffect(
    () => {
      inlineCommentStore.set("paperID")(paperId);
      paperFetchHook({
        decorator,
        paperId,
        setEditorState,
        setInitEditorState,
        setIsFetching,
        setPaperDraftExists,
        setPaperDraftSections,
      });
    },
    [paperId] /* intentionally hard enforcing only on paperID. */
  );

  const shouldShowContextMenu = getShouldShowContextMenu(editorState);
  return (
    <PaperDraftContextMenuWrap
      menuButtons={[
        <PaperDraftContextMenuButton
          key="comment"
          label="comment"
          onClick={() => {}}
        />,
      ]}
      shouldShowMenu={shouldShowContextMenu}
    >
      <PaperDraft
        textEditorProps={{
          blockStyleFn: getBlockStyleFn,
          editorState,
          handleKeyCommand: () => {
            isDraftInEditMode
              ? getHandleKeyCommand({
                  editorState,
                  setEditorState,
                })
              : null;
          },
          initEditorState,
          isInEditMode: isDraftInEditMode,
          setIsInEditMode: setIsDraftInEditMode,
          onChange: (editorState) => {
            isDraftInEditMode ? setIsDraftInEditMode(editorState) : null;
          },
          setInitEditorState,
          spellCheck: true,
        }}
        inlineCommentStore={inlineCommentStore}
        isFetching={isFetching}
        isViewerAllowedToEdit={isViewerAllowedToEdit}
        paperDraftExists={paperDraftExists}
        paperDraftSections={paperDraftSections}
        paperId={paperId}
      />
    </PaperDraftContextMenuWrap>
  );
}
