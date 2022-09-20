
import type { ComponentJson } from "./component.js";

export enum MessageType {
  /**something doesn't look right*/
  ERROR_INVALID,

  /**unauthorized procedure, gtfo*/
  ERROR_UNAUTHORIZED,

  /**server has an error*/
  ERROR_SERVER,

  /**client has an error*/
  ERROR_CLIENT,

  /**server gets an image from a client*/
  SUBMIT_IMAGE,

  /**server gets a component from a client*/
  SUBMIT_COMPONENT,
  
  /**Acknowledgement, yay*/
  ACK
}

export interface MessageJson {
  /**Format of this message predicted by type*/
  type: MessageType;
  /**Unique ID for handling double-send/etc*/
  id: string;
  /**How many times this message (id) has been seen by this machine*/
  index: number;

  content: MessageContent;
}

export interface MessageContent {
  type?: MessageType;
  description?: string;
}

export interface MCSubmitImageAck extends MessageContent {
  url: string;
}

export interface MCSubmitImage extends MessageContent {
  imageDataUri: string;
}

export interface MCSubmitComponent extends MessageContent, ComponentJson {
  
}

export interface APIImpl {
  genMessageId(): string;
  createMessage(type: MessageType, content?: MessageContent): MessageJson;
  createResponse (msg: MessageJson, content?: MessageContent): MessageJson;
  send(msg: MessageJson): void;
  handleMessage (msg: MessageJson): MessageJson;
  handleError (msg: MessageJson, err: any): MessageJson;
}
