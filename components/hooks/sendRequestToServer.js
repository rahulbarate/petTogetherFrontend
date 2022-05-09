// import { localhostBaseURL } from "./baseURLs";

import { localhostBaseURL } from "../common/baseURLs";


export default sendUpdateRequestToServer = async (route, payload) => {
  try {
    const response = await localhostBaseURL.post(route, { userData: payload });

    return response.data;
  } catch (err) {
    alert(err);
  }
};
