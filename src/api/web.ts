
// import { escape } from "querystring";
import { APIImpl, MessageContent, MessageJson, MessageType } from "./api.js";

let apiEndpointUrl = "https://localhost:10209";

export function setEndpointUrl(url: string): void {
  apiEndpointUrl = url;
  return;
}

export const WebAPIImpl: APIImpl = {
  genMessageId() {
    return window.crypto.randomUUID();
  },
  createMessage: function (type: MessageType, content?: MessageContent): MessageJson {
    throw new Error("Function not implemented.");
  },
  createResponse: function (msg: MessageJson, content?: MessageContent): MessageJson {
    throw new Error("Function not implemented.");
  },
  handleMessage (msg: MessageJson): MessageJson {
    
    return WebAPIImpl.createResponse(msg, {

    });
  },
  handleError(msg: MessageJson, err: any): MessageJson {
    console.warn(err);

    return WebAPIImpl.createResponse(msg, {
      type: MessageType.ERROR_CLIENT,
      description: escape(err)
    });

  },
  send(msg: MessageJson): void {
    let body = JSON.stringify(msg);

    fetch(apiEndpointUrl, {
      credentials: "same-origin",
      mode: "same-origin",
      method: "post",
      headers: { "Content-Type": "application/json" },
      body
    }).then(resp => {
      if (resp.status === 200) {
          return resp.json()
      } else {
        console.log("Status: " + resp.status);
        return Promise.reject("server");
      }
    })
    .then(dataJson => {
      WebAPIImpl.handleMessage(JSON.parse(dataJson));
    })
    .catch(err => {
      console.warn(err);
    })
  }
};

