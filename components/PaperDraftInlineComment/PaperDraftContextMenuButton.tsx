import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, SyntheticEvent } from "react";

type Props = {
  label: string;
  onClick: (
    event: SyntheticEvent
  ) => void /* please besure to prevent default */;
};

export default function PaperDraftContextMenuButton({
  label,
  onClick,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(styles.PaperDraftContextMenuButton)}
      onClick={(event) => {
        // event.preventDefault();
        // event.stopPropagation();
        onClick(event);
      }}
      role="none"
    >
      {label}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftContextMenuButton: {
    display: "flex",
    background: "rgb(41, 41, 41)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: "16px",
    padding: "2px",
  },
});
