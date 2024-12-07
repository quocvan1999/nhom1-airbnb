"use client";

import React from "react";
import { LiveChatWidget, EventHandlerPayload } from "@livechat/widget-react";

type Props = {};

const LiveChat: React.FC<Props> = ({}) => {
  function handleNewEvent(event: EventHandlerPayload<"onNewEvent">) {
    console.log("LiveChatWidget.onNewEvent", event);
  }

  return (
    <LiveChatWidget
      license="18930432"
      visibility="maximized"
      onNewEvent={handleNewEvent}
    />
  );
};

export default LiveChat;
