import { css, StyleSheet } from "aphrodite";
import PaperDraftContextMenuMutton from "./PaperDraftContextMenuButton";
import React, {
  useState,
  useEffect,
  MouseEventHandler,
  ReactChildren,
  ReactElement,
} from "react";

type Props = {
  children: ReactChildren;
  menuButtons: Array<ReactElement<typeof PaperDraftContextMenuMutton>>;
  shouldShowMenu: boolean;
};
type PagePosition = number | null;
type State = {
  componentEl: HTMLElement | null;
  endX: PagePosition;
  endY: PagePosition;
  isMouseWithinComponent: boolean;
  startX: PagePosition;
  startY: PagePosition;
};

const WRAPPER_ID = "RESEARCH_HUB_CONTEXT_MENU_WRAP";
const ARBITRARY_Y_OFFSET = 150;

export default function PaperDraftContextMenuWrap({
  children,
  menuButtons,
  shouldShowMenu = false,
}: Props) {
  const [state, setState] = useState<State>({
    componentEl: null,
    endX: null,
    endY: null,
    isMouseWithinComponent: false,
    startX: null,
    startY: null,
  });

  useEffect(() => {
    const componentEl = document.getElementById(WRAPPER_ID);
    setState({ ...state, componentEl });
  }, []);

  const { componentEl, endX, endY, isMouseWithinComponent, startX } = state;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (event): void => {
    const rect = event.target.getBoundingClientRect();
    const offsetTop = componentEl != null ? componentEl.offsetTop || 0 : 0;
    setState({
      ...state,
      startX: event.clientX - rect.left,
      startY: event.pageY - offsetTop - ARBITRARY_Y_OFFSET,
    });
  };

  const onMouseUp: MouseEventHandler<HTMLDivElement> = (event): void => {
    const rect = event.target.getBoundingClientRect();
    const offsetTop = componentEl != null ? componentEl.offsetTop || 0 : 0;
    setState({
      ...state,
      endX: event.clientX - rect.left,
      endY: event.pageY - offsetTop - ARBITRARY_Y_OFFSET,
    });
  };

  const buttonsWrapTop = endY || 0;
  const buttonsWrapLeft = ((startX || 0) + (endX || 0)) / 2;
  return (
    <div
      className={css(styles.PaperDraftContextMenuWrap)}
      id={WRAPPER_ID}
      onMouseEnter={(): void =>
        setState({ ...state, isMouseWithinComponent: true })
      }
      onMouseLeave={(): void =>
        setState({ ...state, isMouseWithinComponent: false })
      }
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={(event) => {}}
    >
      {isMouseWithinComponent && shouldShowMenu ? (
        <div
          className={css(styles.MenuButtonsWrap)}
          style={{ left: buttonsWrapLeft, top: buttonsWrapTop }}
        >
          {menuButtons}
        </div>
      ) : null}
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftContextMenuWrap: {
    height: "100%",
    position: "relative",
    width: "100%",
  },
  MenuButtonsWrap: {
    background: "rgb(41, 41, 41)",
    border: "solid 1px #ccc",
    borderRadius: "5%",
    display: "flex",
    flexDirection: "column",
    margin: 5,
    padding: 4,
    position: "absolute",
    zIndex: 100,
  },
});
