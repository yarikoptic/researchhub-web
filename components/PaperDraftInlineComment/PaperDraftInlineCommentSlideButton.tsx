import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "../../config/themes/colors";

export default function PaperDraftInlineCommentSlideButton(): ReactElement<
  "div"
> {
  return (
    <div className={css(styles.PaperDraftInlineCommentSlideButton)}>
      Hi this is BUTTON
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentSlideButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: `1px solid ${colors.GREY(0.8)}`,
    borderRadius: 5,
    cursor: "pointer",
    display: "flex",
    height: 24,
    justifyContent: "center",
    padding: 8,
    position: "absolute",
    right: -55 /* arbitrary css decision based on look */,
    width: 24,
    ":hover": {
      backgroundColor: colors.GREY(0.8),
    },
  },
});
