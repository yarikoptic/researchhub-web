import React, { ReactElement, useRef, useEffect, RefObject } from "react";
import { isNullOrUndefined, nullthrows } from "../config/utils/nullchecks";
import dynamic from "next/dynamic";

type Props = {
  height: number | string;
  onVisible: () => void;
  topOffset: number /* px */;
  width: number | string;
};

const useEffectOnVisible = ({
  element,
  onVisible,
  topOffset,
}: {
  element: RefObject<HTMLDivElement> | null;
  onVisible: Function;
  topOffset: number;
}): void => {
  let document: Document | null = null,
    currElement: HTMLDivElement | null = null,
    pageYOffset: number = 1000;
  const isReady = !(
    isNullOrUndefined(element) || isNullOrUndefined((element || {}).current)
  );
  if (isReady) {
    currElement = nullthrows(
      nullthrows(element).current,
      "OnVisibleRefCurrent is null"
    );
    document = currElement.ownerDocument;
    pageYOffset = document.defaultView.pageYOffset;
  }
  useEffect((): void => {
    if (!isReady) {
      return;
    }
    var rect = nullthrows(currElement).getBoundingClientRect();
    console.warn("TOP: ", rect.top - topOffset);
    console.warn("client: ", pageYOffset);
    const isElWithinViewPort = rect.top + topOffset <= pageYOffset;
    if (isElWithinViewPort) {
      onVisible();
    }
  }, [pageYOffset, isReady]);
};

export default function OnVisible({
  height,
  onVisible,
  topOffset,
  width,
}: Props): ReactElement<"div"> {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffectOnVisible({ element: elementRef, onVisible, topOffset });
  return (
    <div ref={elementRef} style={{ height, width, backgroundColor: "red" }} />
  );
}
