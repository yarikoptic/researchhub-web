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
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: "0",
    width: 40,
    ":hover": {
      backgroundColor: colors.GREY(0.8),
    },
  },
});
