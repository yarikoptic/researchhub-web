import { Helpers } from "@quantfive/js-web-config";
import { FLAG_REASON } from "~/components/Flag/config/constants";
import API from "~/config/api";
import { ID, KeyOf } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

type APIParams = {
  flagIds: Array<ID>;
  verdictChoice?: KeyOf<typeof FLAG_REASON>,
};

type Args = {
  apiParams: APIParams;
  onSuccess: Function;
  onError: Function;  
}

export default function dismissFlaggedContent({
  apiParams,
  onSuccess,
  onError,
}: Args): void {
  const config = {
    flag_ids: apiParams.flagIds,
    ...(apiParams.verdictChoice && {"verdict_choice": apiParams.verdictChoice}),
  }
  fetch(
    API.DISMISS_FLAGGED_CONTENT(),
    API.POST_CONFIG(config)
  )
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to dismiss flag",
        data: { apiParams },
      });
      onError(error)
    });
}