import { escape } from "querystring";
import { MessageType } from "./api.js";
import { createHash } from "crypto";
import { writeFile } from "fs";
import { join as pathJoin } from "path";
import { NodeGlobals } from "../nodeglobals.js";
let imageBufferMaxSize = 4 * 1024 * 1024; //4 MegaBytes

export const NodeAPIImpl = {
  genMessageId() {
    return "";
  },

  createMessage(type, content) {
    let msg = {
      type,
      id: NodeAPIImpl.genMessageId(),
      index: 0,
      content
    };
    return msg;
  },

  createResponse(msg, content) {
    let nmsg = {
      type: msg.type,
      id: msg.id,
      index: msg.index + 1,
      content
    };
    return nmsg;
  },

  send(msg) {},

  handleMessage(msg) {
    switch (msg.type) {
      case MessageType.SUBMIT_IMAGE:
        let mcsi = msg.content;
        let startText = "data:image/png;base64,";

        if (!mcsi.imageDataUri.startsWith(startText)) {
          throw `Invalid image data uri, ignoring.`;
          return;
        }

        let sb64 = mcsi.imageDataUri.substring(startText.length);
        let buffer;

        try {
          buffer = Buffer.from(sb64, "base64");
        } catch (ex) {
          throw `Invalid image data uri, ignoring.`;
          return;
        }

        if (buffer.byteLength > imageBufferMaxSize) {
          throw `Buffer too large. Must be under ${imageBufferMaxSize} bytes in total size.`;
          return;
        }

        let fname;

        try {
          let h = createHash("sha256");
          h.update(buffer);
          fname = h.digest("hex");
          writeFile(pathJoin(NodeGlobals.imagedbDir, fname) + ".bin", buffer, err => {
            console.warn("Could not write file to db", err);
          });
        } catch (ex) {
          let eex = escape(ex);
          throw `Cannot write image to database ${eex}`;
          return;
        }

        return NodeAPIImpl.createResponse(msg, {
          type: MessageType.ACK,
          url: fname
        });

      default:
        throw `Unknown msg type, ignoring.`;
        break;
    }
  },

  handleError(msg, err) {
    console.warn(err);
    return NodeAPIImpl.createResponse(msg, {
      type: MessageType.ERROR_SERVER,
      description: escape(err)
    });
  }

};