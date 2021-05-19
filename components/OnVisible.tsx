import React, { ReactElement, useRef, useEffect, RefObject } from "react";
import { isNullOrUndefined, nullthrows } from "../config/utils/nullchecks";

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
  if (isNullOrUndefined(element)) {
    return;
  }
  var rect = nullthrows(
    nullthrows(element).current,
    "OnVisibleRefCurrent is null"
  ).getBoundingClientRect();
  const isElWithinViewPort = rect.top + topOffset >= 0 && rect.left >= 0;
  useEffect((): void => {
    if (isElWithinViewPort) {
      onVisible();
    }
  });
};

export default function OnVisible({
  height,
  onVisible,
  topOffset,
  width,
}: Props): ReactElement<"div"> {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffectOnVisible({ element: elementRef, onVisible, topOffset });
  return <div ref={elementRef} style={{ height, width }} />;
}
