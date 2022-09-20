export let MessageType;

(function (MessageType) {
  MessageType[MessageType["ERROR_INVALID"] = 0] = "ERROR_INVALID";
  MessageType[MessageType["ERROR_UNAUTHORIZED"] = 1] = "ERROR_UNAUTHORIZED";
  MessageType[MessageType["ERROR_SERVER"] = 2] = "ERROR_SERVER";
  MessageType[MessageType["ERROR_CLIENT"] = 3] = "ERROR_CLIENT";
  MessageType[MessageType["SUBMIT_IMAGE"] = 4] = "SUBMIT_IMAGE";
  MessageType[MessageType["SUBMIT_COMPONENT"] = 5] = "SUBMIT_COMPONENT";
  MessageType[MessageType["ACK"] = 6] = "ACK";
})(MessageType || (MessageType = {}));