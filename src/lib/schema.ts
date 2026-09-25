import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// ─── BetterAuth tables (auto-managed, defined for Drizzle awareness) ────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── ADI-specific tables ────

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  membershipTier: text("membership_tier"),
  membershipStatus: text("membership_status").notNull().default("interest"),
  pathwayStage: text("pathway_stage").notNull().default("entry"),
  joinedAt: timestamp("joined_at"),
  notes: text("notes"),
  userId: text("user_id").references(() => user.id),
  // Stripe, kept up to date by /api/webhooks/stripe on every payment, renewal
  // and cancellation. membershipEndsAt is the member test: paid up until then.
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  membershipEndsAt: timestamp("membership_ends_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  type: text("type").notNull(),
  organisation: text("organisation"),
  role: text("role"),
  message: text("message").notNull(),
  sourcePage: text("source_page"),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  // ─── Event reservations (type = "event") ──────────────────────────────
  // Added Sep 2026 so the reserve -> pay follow-up sequence has real columns
  // to work from instead of parsing the free-text `message` blob.
  phone: text("phone"),
  isMember: boolean("is_member").notNull().default(false),
  /** Set when the ticket is paid (Stripe webhook). Null = still owing. */
  paidAt: timestamp("paid_at"),
  /** The Stripe Checkout Session that paid it: the webhook's dedupe key. */
  stripeSessionId: text("stripe_session_id"),
  /** How many follow-up emails this reservation has had (0 = none yet). */
  followUpStage: integer("follow_up_stage").notNull().default(0),
  followUpLastAt: timestamp("follow_up_last_at"),
  /** Set when they click "stop these reminders". Suppresses all follow-ups. */
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const leadershipApplications = pgTable("leadership_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role"),
  organisation: text("organisation"),
  motivation: text("motivation").notNull(),
  status: text("status").notNull().default("enquiry"),
  cohort: text("cohort"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
