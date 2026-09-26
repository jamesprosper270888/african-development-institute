/**
 * The choices on the "You Are Not Alone" feedback form. The form renders these
 * and /api/event-feedback validates against them, so the wording people agreed
 * to is exactly the wording stored in the enquiry row and emailed to Pam and
 * Marcia. Change a label here and both ends change together.
 *
 * The keys are what is sent over the wire; the labels are what people read.
 * Never reword a label to mean something broader than it did: rows already
 * stored hold the consent that was given against the old words.
 */
export const PUBLISH_PERMISSION = {
  "full-name": "Yes, use my full name",
  "first-initial": "Yes, first name and initial only",
  anonymous: "Yes, but anonymously",
  private: "No, this is just for Pam and Marcia",
} as const;

export const PHOTO_PERMISSION = {
  yes: "Yes, you can use photos from the day that include me on ADI's website and social media",
  no: "Please don't use photos that include me",
} as const;

export type PublishPermission = keyof typeof PUBLISH_PERMISSION;
export type PhotoPermission = keyof typeof PHOTO_PERMISSION;

export const FEEDBACK_QUESTIONS = {
  valuable: "What was the most valuable part of the day for you?",
  adviceToOthers: "What would you say to someone thinking of coming to the next one?",
  improve: "Anything we could do better?",
} as const;
