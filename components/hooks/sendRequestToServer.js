// import { localhostBaseURL } from "./baseURLs";

import { localhostBaseURL } from "../common/baseURLs";

export default sendRequestToServer = async (route, payload) => {
  try {
    const response = await localhostBaseURL.post(route, { payload: payload });

    return response.data;
  } catch (err) {
    alert(err);
  }
};
