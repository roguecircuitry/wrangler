// import { escape } from "querystring";
import { MessageType } from "./api.js";
let apiEndpointUrl = "https://localhost:10209";
export function setEndpointUrl(url) {
  apiEndpointUrl = url;
  return;
}
export const WebAPIImpl = {
  genMessageId() {
    return window.crypto.randomUUID();
  },

  createMessage: function (type, content) {
    throw new Error("Function not implemented.");
  },
  createResponse: function (msg, content) {
    throw new Error("Function not implemented.");
  },

  handleMessage(msg) {
    return WebAPIImpl.createResponse(msg, {});
  },

  handleError(msg, err) {
    console.warn(err);
    return WebAPIImpl.createResponse(msg, {
      type: MessageType.ERROR_CLIENT,
      description: escape(err)
    });
  },

  send(msg) {
    let body = JSON.stringify(msg);
    fetch(apiEndpointUrl, {
      credentials: "same-origin",
      mode: "same-origin",
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body
    }).then(resp => {
      if (resp.status === 200) {
        return resp.json();
      } else {
        console.log("Status: " + resp.status);
        return Promise.reject("server");
      }
    }).then(dataJson => {
      WebAPIImpl.handleMessage(JSON.parse(dataJson));
    }).catch(err => {
      console.warn(err);
    });
  }

};