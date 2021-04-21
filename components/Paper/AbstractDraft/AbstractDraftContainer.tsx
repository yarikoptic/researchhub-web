import React, { ReactElement } from "react";
import PaperDraftInlineCommentRelativeWrap from "../../PaperDraftInlineComment/PaperDraftInlineCommentRelativeWrap";
import InlineCommentUnduxStore from "../../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

import PaperDraft from "../../PaperDraft/PaperDraft";

export default function PaperAbstractContainer(): ReactElement<
  typeof PaperDraftInlineCommentRelativeWrap
> {
  // const inlineCommentStore = InlineCommentUnduxStore.useStore();
  return (
    <PaperDraftInlineCommentRelativeWrap keyName="abstract-container">
      <div>{"HIHIHIHI"}</div>
    </PaperDraftInlineCommentRelativeWrap>
  );
}
