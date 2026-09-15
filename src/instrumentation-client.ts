import { initBotId } from "botid/client/core";

// Vercel BotID (free Basic mode): an invisible check that a real browser
// loaded the page before a form was sent. Added 15 Sep 2026 after bots filled
// the contact and leadership forms with made-up names and strangers' emails.
//
// This list and the checkBotId() calls must match BOTH ways. A route missing
// from here that still calls checkBotId() rejects every visitor, human or not.
// The event reservation form is deliberately not listed: it was not being hit,
// and it is the one form the paid campaign runs through.
initBotId({
  protect: [
    { path: "/api/enquiry", method: "POST" },
    { path: "/api/leadership-enquiry", method: "POST" },
  ],
});
