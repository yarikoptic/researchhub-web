import InlineCommentThreadsDisplayBarWithMediaSize from "../InlineCommentDisplay/InlineCommentThreadsDisplayBar";
import InlineCommentUnduxStore from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import PaperDraftUnduxStore from "./undux/PaperDraftUnduxStore";
import React, { ReactNode } from "react";

export default function PaperDraftWithCommentUnduxProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <PaperDraftUnduxStore.Container>
      <InlineCommentUnduxStore.Container>
        <InlineCommentThreadsDisplayBarWithMediaSize />
        {children}
      </InlineCommentUnduxStore.Container>
    </PaperDraftUnduxStore.Container>
  );
}
