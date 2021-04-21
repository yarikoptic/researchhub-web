import colors from "../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import icons from "../../config/themes/icons";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import React, { ReactElement } from "react";
import { slide as SlideMenu, menu as Menu } from "@quantfive/react-burger-menu";
import { isNullOrUndefined } from "../../config/utils/nullchecks";

type Props = { shouldShowContextTitle?: boolean };

const MEDIA_WIDTH_LIMIT = 1023; /* arbitary iPad size */

export default function InlineCommentThreadsDisplayBarWithMediaSize(
  props: Props
): ReactElement<"div"> | null {
  const inlineCommentUnduxStore = InlineCommentUnduxStore.useStore();
  const shouldRender =
    inlineCommentUnduxStore.get("displayableInlineComments").length > 0;

  if (
    isNullOrUndefined(typeof window) ||
    isNullOrUndefined(typeof document) ||
    !shouldRender
  ) {
    return null;
  }

  const currMediaWidth =
    document.documentElement.clientWidth || document.body.clientWidth;
  const shouldRenderAsOverlay =
    shouldRender && currMediaWidth <= MEDIA_WIDTH_LIMIT;

  return (
    <SlideMenu
      right
      width={"100%"}
      styles={
        shouldRenderAsOverlay ? burgerMenuAsOverlayStyle : burgerMenuStyle
      }
      customBurgerIcon={false}
    >
      <InlineCommentThreadsDisplayBar
        {...props}
        shouldShowContextTitle={true}
      />
    </SlideMenu>
  );
}

function InlineCommentThreadsDisplayBar({
  shouldShowContextTitle = true,
}: Props): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );

  const commentThreadCards = displayableInlineComments.map(
    (
      inlineComment: InlineComment
    ): ReactElement<typeof InlineCommentThreadCard> => (
      <InlineCommentThreadCard
        key={inlineComment.entityKey}
        shouldShowContextTitle={shouldShowContextTitle}
        unduxInlineComment={inlineComment}
      />
    )
  );

  return (
    <div className={css(styles.inlineCommentThreadsDisplayBar)}>
      <div className={css(styles.header)}>
        <div
          className={css(styles.backButton)}
          onClick={(): void =>
            cleanupStoreAndCloseDisplay({ inlineCommentStore })
          }
        >
          {icons.arrowRight}
          <span className={css(styles.marginLeft8)}>Hide</span>
        </div>
      </div>
      {commentThreadCards}
    </div>
  );
}

const burgerMenuStyle = {
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    color: "#FFF",
    display: "none",
    height: "26px",
    visibility: "hidden",
    width: "26px",
  },
  bmCross: {
    background: "#bdc3c7",
    display: "none",
    visibility: "hidden",
  },
  bmMenuWrap: {
    overflowY: "auto",
    position: "fixed",
    top: 0,
    width: "34%",
    maxWidth: "530px",
    zIndex: 10,
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
    overflowY: "auto",
    width: "100%",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    alignItems: "flex-start",
    borderTop: "1px solid rgba(255,255,255,.2)",
    color: "#b8b7ad",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "auto",
    ":focus": {
      outline: "none",
    },
  },
  bmItem: {
    color: "#FFF",
    display: "inline-block",
    margin: "15px 0 15px 0",
    ":focus": {
      outline: "none",
    },
  },
  bmOverlay: {
    background: "transparent",
    bottom: 0,
    left: 0,
    right: 0,
    top: 40,
    width: "100%",
    zIndex: 9,
  },
};

const burgerMenuAsOverlayStyle = {
  ...burgerMenuStyle,
  bmMenuWrap: {
    overflowY: "auto",
    position: "fixed",
    top: 0,
    width: "85%",
    zIndex: 10,
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9,
  },
};

const styles = StyleSheet.create({
  displaybarOverlay: {
    backgroundColor: "yellow",
    bottom: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: 470,
    zIndex: 12,
    minHeight: "100vh",
  },
  displaybarRelative: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "100vh",
  },
  backButton: {
    alignItems: "center",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    display: "flex",
    textDecoration: "none",
    "@media only screen and (max-width: 1023px)": {
      paddingLeft: 8,
      width: "100%",
      height: "100%",
    },
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  header: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    positioin: "relative",
    "@media only screen and (max-width: 1023px)": {
      height: 50,
    },
  },
  inlineCommentThreadsDisplayBar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: 1000,
    width: 400,
    ":focus": {
      outline: "none",
    },
    "@media only screen and (max-width: 1023px)": {
      width: "100%",
    },
  },
  marginLeft8: {
    marginLeft: 8,
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 1023px)": {
      display: "block",
    },
  },
});
