import { css, StyleSheet } from "aphrodite";
import PaperDraftInlineCommentSlideButton from "./PaPerDraftInlineCommentSlideButton";
import React, { ReactChildren, ReactElement } from "react";

type Props = { children: ReactChildren };

export default function PaperDraftInlineCommentPositionWrap({
  children,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.PaperDraftInlineCommentPositionWrap)}>
      <PaperDraftInlineCommentSlideButton />
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentPositionWrap: {
    height: "100%",
    position: "relative",
    width: "100%",
    background: "yellow",
  },
});
