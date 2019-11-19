const FETCH_ERROR_MESSAGE = "Fetch error caught in promise";

export function handleCatch(err) {
  console.log(FETCH_ERROR_MESSAGE, err);
  return err;
}

export function logFetchError(fetchResponse) {
  const message = `Error fetching ${fetchResponse.url}:`;
  console.log(message, fetchResponse.status, fetchResponse.statusText);
}
