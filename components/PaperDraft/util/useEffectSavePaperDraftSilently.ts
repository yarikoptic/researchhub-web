import { EditorState } from "draft-js";
import { emptyFncWithMsg, nullthrows } from "../../../config/utils/nullchecks";
import { getShouldSavePaperSilently } from "./PaperDraftUtils";
import { PaperDraftStore } from "../undux/PaperDraftUnduxStore";
import { savePaperSilentlyHook } from "../api/PaperDraftSilentSave";
import { useEffect } from "react";

type Args = {
  isDraftInEditMode: boolean;
  paperDraftSections: any;
  paperDraftStore: PaperDraftStore;
  setInitEditorState: (editorState: EditorState) => void;
};

export function useEffectSavePaperDraftSilently({
  isDraftInEditMode,
  paperDraftStore,
  setInitEditorState,
  paperDraftSections,
}: Args): void {
  const editorState = nullthrows(
    paperDraftStore.get("editorState"),
    "editorState must be present to save paper"
  );
  const shouldSavePaperSilently = getShouldSavePaperSilently({
    isDraftInEditMode,
    paperDraftStore,
  });
  useEffect(() => {
    if (shouldSavePaperSilently) {
      savePaperSilentlyHook({
        editorState,
        onError: (error: Error): void => emptyFncWithMsg(error),
        onSuccess: (): void => {
          paperDraftStore.set("lastSavePaperTime")(Date.now());
          paperDraftStore.set("shouldSavePaper")(false);
          setInitEditorState(editorState);
        },
        paperDraftSections,
        paperId: nullthrows(
          paperDraftStore.get("paperID"),
          "paperID must be present to save paper"
        ),
      });
    }
  }, [shouldSavePaperSilently]);
}
