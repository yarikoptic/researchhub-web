import { css, StyleSheet } from "aphrodite";
import PaperDraftInlineCommentSlideButton from "./PaperDraftInlineCommentSlideButton";
import React, { ReactElement, ReactNode } from "react";

type Props = { children: ReactNode };

export default function PaperDraftInlineCommentRelativeWrap({
  children,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.PaperDraftInlineCommentRelativeWrap)}>
      <PaperDraftInlineCommentSlideButton />
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentRelativeWrap: {
    height: "100%",
    position: "relative",
    width: "100%",
  },
});
