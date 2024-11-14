"use client"

import React from 'react'
import { LiveChatWidget, EventHandlerPayload } from "@livechat/widget-react";

type Props = {}



function App() {

}

const LiveChat: React.FC<Props> = ({ }) => {
    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         (window as any).__lc = (window as any).__lc || {};
    //         (window as any).__lc.license = 18843741;
    //         (window as any).__lc.integration_name = "manual_onboarding";
    //         (window as any).__lc.product_name = "livechat";

    //         type LiveChatWidgetType = {
    //             _q: any[];
    //             _h: ((...args: any[]) => any) | null;
    //             _v: string;
    //             on: (...args: any[]) => void;
    //             once: (...args: any[]) => void;
    //             off: (...args: any[]) => void;
    //             get: (...args: any[]) => void;
    //             call: (...args: any[]) => void;
    //             init: () => void;
    //         };

    //         (function (n: any, t: Document, c: Function) {
    //             function i(n: any) {
    //                 return e._h ? e._h.apply(null, n) : e._q.push(n);
    //             }

    //             const e: LiveChatWidgetType = {
    //                 _q: [],
    //                 _h: null,
    //                 _v: "2.0",
    //                 on: function (...args: any[]) {
    //                     i(["on", c.call(args)]);
    //                 },
    //                 once: function (...args: any[]) {
    //                     i(["once", c.call(args)]);
    //                 },
    //                 off: function (...args: any[]) {
    //                     i(["off", c.call(args)]);
    //                 },
    //                 get: function (...args: any[]) {
    //                     if (!e._h)
    //                         throw new Error(
    //                             "[LiveChatWidget] You can't use getters before load."
    //                         );
    //                     return i(["get", c.call(args)]);
    //                 },
    //                 call: function (...args: any[]) {
    //                     i(["call", c.call(args)]);
    //                 },
    //                 init: function () {
    //                     const script = t.createElement("script");
    //                     script.async = true;
    //                     script.type = "text/javascript";
    //                     script.src = "https://cdn.livechatinc.com/tracking.js";
    //                     t.head.appendChild(script);
    //                 },
    //             };

    //             if (!(n.__lc.asyncInit)) e.init();
    //             n.LiveChatWidget = n.LiveChatWidget || e;
    //         })(window, document, [].slice);
    //     }
    // }, []);

    // return (
    //     <noscript>
    //         <a href="https://www.livechat.com/chat-with/18843741/" rel="nofollow">
    //             Chat with us
    //         </a>
    //         , powered by{" "}
    //         <a
    //             href="https://www.livechat.com/?welcome"
    //             rel="noopener noreferrer"
    //             target="_blank"
    //         >
    //             LiveChat
    //         </a>
    //     </noscript>
    // );

    function handleNewEvent(event: EventHandlerPayload<"onNewEvent">) {
        console.log("LiveChatWidget.onNewEvent", event);
    }

    return (
        <LiveChatWidget
            license="18843741"
            visibility="maximized"
            onNewEvent={handleNewEvent}
        />
    );
}

export default LiveChat