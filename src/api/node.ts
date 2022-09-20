
import { escape } from "querystring";
import { APIImpl, MCSubmitImage, MCSubmitImageAck, MessageContent, MessageJson, MessageType } from "./api.js";
import { createHash } from "crypto";
import { writeFile } from "fs";
import { join as pathJoin } from "path";
import { NodeGlobals } from "../nodeglobals.js";


let imageBufferMaxSize = 4*1024*1024; //4 MegaBytes

export const NodeAPIImpl: APIImpl = {
  genMessageId(): string {
    return "";
  },
  createMessage(type: MessageType, content: MessageContent) {
    let msg: MessageJson = {
      type,
      id: NodeAPIImpl.genMessageId(),
      index: 0,
      content
    };
    return msg;
  },
  createResponse(msg: MessageJson, content?: MessageContent): MessageJson {
    let nmsg: MessageJson = {
      type: msg.type,
      id: msg.id,
      index: msg.index + 1,
      content
    };

    return nmsg;
  },
  send(msg: MessageJson): void {

  },
  handleMessage (msg: MessageJson): MessageJson {
    switch(msg.type) {
      case MessageType.SUBMIT_IMAGE:
        let mcsi = msg.content as MCSubmitImage;
        let startText = "data:image/png;base64,";
        if (!mcsi.imageDataUri.startsWith(startText)) {
          throw `Invalid image data uri, ignoring.`;
          return;
        }
        let sb64 = mcsi.imageDataUri.substring(startText.length);
        
        let buffer: Buffer;
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

        let fname: string;

        try {
          let h = createHash("sha256");
          h.update(buffer);
          fname = h.digest("hex");

          writeFile(pathJoin(NodeGlobals.imagedbDir, fname) + ".bin", buffer, (err)=>{
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
        } as MCSubmitImageAck);

      default:
        throw `Unknown msg type, ignoring.`;
        break;
    }
  },
  handleError(msg: MessageJson, err): MessageJson {
    console.warn(err);
    return NodeAPIImpl.createResponse(msg, {
      type: MessageType.ERROR_SERVER,
      description: escape(err)
    });
  },
};
