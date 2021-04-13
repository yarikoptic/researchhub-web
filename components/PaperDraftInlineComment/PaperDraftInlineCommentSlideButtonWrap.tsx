import { css, StyleSheet } from "aphrodite";
import PaperDraftInlineCommentSlideButton from "./PaPerDraftInlineCommentSlideButton";
import React, { ReactChildren, ReactElement } from "react";

type Props = { children: ReactChildren };

export default function PaperDraftInlineCommentSlideButtonWrap({
  children,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.PaperDraftInlineCommentSlideButtonWrap)}>
      <PaperDraftInlineCommentSlideButton />
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentSlideButtonWrap: {
    height: "100%",
    position: "relative",
    width: "100%",
    background: "yellow",
  },
});
