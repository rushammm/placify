import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `internship-platform_${name}`,
);

// Users table (Next Auth compatible)
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    }),
  image: d.varchar({ length: 255 }),
  role: d.varchar({ length: 50 }).notNull().default("null"), // student, company, university, admin
  isActive: d.boolean().default(true),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date()),
}));

// Universities
export const universities = createTable("university", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 200 }).notNull(),
  email: d.varchar({ length: 255 }),
  phone: d.varchar({ length: 20 }),
  address: d.text(),
  website: d.varchar({ length: 500 }),
  logo: d.varchar({ length: 500 }),
  description: d.text(),
  isVerified: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date()),
}));

// Students
export const students = createTable("student", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: d.varchar({ length: 100 }),
  lastName: d.varchar({ length: 100 }),
  phone: d.varchar({ length: 20 }),
  dateOfBirth: d.date(),
  address: d.text(),
  universityId: d.integer().references(() => universities.id),
  course: d.varchar({ length: 200 }),
  yearOfStudy: d.integer(),
  gpa: d.varchar({ length: 10 }),
  skills: d.text(), // JSON array of skills
  bio: d.text(),
  cvUrl: d.varchar({ length: 500 }),
  portfolioUrl: d.varchar({ length: 500 }),
  linkedinUrl: d.varchar({ length: 500 }),
  githubUrl: d.varchar({ length: 500 }),
  isProfileComplete: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date()),
}), (t) => [
  index("student_user_id_idx").on(t.userId),
  index("student_university_id_idx").on(t.universityId),
]);

// University Users (staff members)
export const universityUsers = createTable("university_user", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  universityId: d
    .integer()
    .notNull()
    .references(() => universities.id, { onDelete: "cascade" }),
  position: d.varchar({ length: 100 }),
  department: d.varchar({ length: 100 }),
  permissions: d.text(), // JSON array of permissions
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("university_user_user_id_idx").on(t.userId),
  index("university_user_university_id_idx").on(t.universityId),
]);

// Companies
export const companies = createTable("company", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 200 }).notNull(),
  email: d.varchar({ length: 255 }),
  phone: d.varchar({ length: 20 }),
  website: d.varchar({ length: 500 }),
  logo: d.varchar({ length: 500 }),
  description: d.text(),
  industry: d.varchar({ length: 100 }),
  size: d.varchar({ length: 50 }),
  address: d.text(),
  city: d.varchar({ length: 100 }),
  country: d.varchar({ length: 100 }),
  isVerified: d.boolean().default(false),
  rating: d.integer().default(0), // Average rating from students
  totalReviews: d.integer().default(0),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date()),
}), (t) => [
  index("company_name_idx").on(t.name),
  index("company_industry_idx").on(t.industry),
]);

// Company Users (employees)
export const companyUsers = createTable("company_user", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: d
    .integer()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  position: d.varchar({ length: 100 }),
  department: d.varchar({ length: 100 }),
  permissions: d.text(), // JSON array of permissions
  isOwner: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("company_user_user_id_idx").on(t.userId),
  index("company_user_company_id_idx").on(t.companyId),
]);

// Internships
export const internships = createTable("internship", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  companyId: d
    .integer()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  title: d.varchar({ length: 200 }).notNull(),
  description: d.text().notNull(),
  requirements: d.text(),
  responsibilities: d.text(),
  skills: d.text(), // JSON array of required skills
  location: d.varchar({ length: 200 }),
  isRemote: d.boolean().default(false),
  duration: d.integer(), // Duration in weeks
  startDate: d.date(),
  endDate: d.date(),
  applicationDeadline: d.date(),
  maxApplicants: d.integer(),
  currentApplicants: d.integer().default(0),
  status: d.varchar({ length: 50 }).default("draft"), // draft, active, closed, archived
  isPaid: d.boolean().default(false),
  salary: d.varchar({ length: 50 }),
  benefits: d.text(),
  category: d.varchar({ length: 100 }),
  experienceLevel: d.varchar({ length: 50 }),
  isFeatured: d.boolean().default(false),
  viewCount: d.integer().default(0),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date()),
}), (t) => [
  index("internship_company_id_idx").on(t.companyId),
  index("internship_status_idx").on(t.status),
  index("internship_category_idx").on(t.category),
  index("internship_deadline_idx").on(t.applicationDeadline),
]);

// Applications
export const applications = createTable("application", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  studentId: d
    .integer()
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  internshipId: d
    .integer()
    .notNull()
    .references(() => internships.id, { onDelete: "cascade" }),
  status: d.varchar({ length: 50 }).default("pending"), // pending, accepted, rejected, withdrawn
  coverLetter: d.text(),
  additionalDocuments: d.text(), // JSON array of document URLs
  notes: d.text(), // Internal notes from company
  appliedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  reviewedAt: d.timestamp({ withTimezone: true }),
  reviewedBy: d.varchar({ length: 255 }).references(() => users.id),
  feedback: d.text(),
}), (t) => [
  index("application_student_id_idx").on(t.studentId),
  index("application_internship_id_idx").on(t.internshipId),
  index("application_status_idx").on(t.status),
]);

// Messages/Chat
export const messages = createTable("message", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  senderId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  applicationId: d.integer().references(() => applications.id),
  content: d.text().notNull(),
  isRead: d.boolean().default(false),
  sentAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("message_sender_id_idx").on(t.senderId),
  index("message_receiver_id_idx").on(t.receiverId),
  index("message_application_id_idx").on(t.applicationId),
]);

// Reviews/Ratings
export const reviews = createTable("review", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  studentId: d
    .integer()
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  companyId: d
    .integer()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  internshipId: d
    .integer()
    .notNull()
    .references(() => internships.id, { onDelete: "cascade" }),
  rating: d.integer().notNull(), // 1-5 stars
  title: d.varchar({ length: 200 }),
  comment: d.text(),
  pros: d.text(),
  cons: d.text(),
  wouldRecommend: d.boolean(),
  isAnonymous: d.boolean().default(false),
  isApproved: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("review_student_id_idx").on(t.studentId),
  index("review_company_id_idx").on(t.companyId),
  index("review_rating_idx").on(t.rating),
]);

// Notifications
export const notifications = createTable("notification", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: d.varchar({ length: 50 }).notNull(), // application, message, status_update, general
  title: d.varchar({ length: 200 }).notNull(),
  message: d.text().notNull(),
  isRead: d.boolean().default(false),
  data: d.text(), // JSON data for additional context
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("notification_user_id_idx").on(t.userId),
  index("notification_type_idx").on(t.type),
  index("notification_is_read_idx").on(t.isRead),
]);

// Contracts
export const contracts = createTable("contract", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  applicationId: d
    .integer()
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  contractUrl: d.varchar({ length: 500 }),
  signedContractUrl: d.varchar({ length: 500 }),
  status: d.varchar({ length: 50 }).default("pending"), // pending, signed, expired
  signedAt: d.timestamp({ withTimezone: true }),
  expiresAt: d.timestamp({ withTimezone: true }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("contract_application_id_idx").on(t.applicationId),
  index("contract_status_idx").on(t.status),
]);

// Training Reports/Feedback
export const trainingReports = createTable("training_report", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  applicationId: d
    .integer()
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  companyUserId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  performance: d.integer(), // 1-10 scale
  punctuality: d.integer(), // 1-10 scale
  communication: d.integer(), // 1-10 scale
  technicalSkills: d.integer(), // 1-10 scale
  overallRating: d.integer(), // 1-10 scale
  feedback: d.text(),
  recommendations: d.text(),
  completedTasks: d.text(),
  areasOfImprovement: d.text(),
  wouldHireFullTime: d.boolean(),
  isCompleted: d.boolean().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date()),
}), (t) => [
  index("training_report_application_id_idx").on(t.applicationId),
  index("training_report_company_user_id_idx").on(t.companyUserId),
]);

// Document Storage
export const documents = createTable("document", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  applicationId: d.integer().references(() => applications.id),
  fileName: d.varchar({ length: 255 }).notNull(),
  fileUrl: d.varchar({ length: 500 }).notNull(),
  fileType: d.varchar({ length: 50 }),
  fileSize: d.integer(),
  documentType: d.varchar({ length: 50 }), // cv, cover_letter, certificate, etc.
  uploadedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}), (t) => [
  index("document_user_id_idx").on(t.userId),
  index("document_application_id_idx").on(t.applicationId),
  index("document_type_idx").on(t.documentType),
]);

// Next Auth tables
export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  student: one(students),
  companyUser: one(companyUsers),
  universityUser: one(universityUsers),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  notifications: many(notifications),
  documents: many(documents),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  university: one(universities, { fields: [students.universityId], references: [universities.id] }),
  applications: many(applications),
  reviews: many(reviews),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  students: many(students),
  universityUsers: many(universityUsers),
}));

export const universityUsersRelations = relations(universityUsers, ({ one }) => ({
  user: one(users, { fields: [universityUsers.userId], references: [users.id] }),
  university: one(universities, { fields: [universityUsers.universityId], references: [universities.id] }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  companyUsers: many(companyUsers),
  internships: many(internships),
  reviews: many(reviews),
}));

export const companyUsersRelations = relations(companyUsers, ({ one }) => ({
  user: one(users, { fields: [companyUsers.userId], references: [users.id] }),
  company: one(companies, { fields: [companyUsers.companyId], references: [companies.id] }),
}));

export const internshipsRelations = relations(internships, ({ one, many }) => ({
  company: one(companies, { fields: [internships.companyId], references: [companies.id] }),
  applications: many(applications),
  reviews: many(reviews),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  student: one(students, { fields: [applications.studentId], references: [students.id] }),
  internship: one(internships, { fields: [applications.internshipId], references: [internships.id] }),
  messages: many(messages),
  contract: one(contracts),
  trainingReport: one(trainingReports),
  documents: many(documents),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receiver" }),
  application: one(applications, { fields: [messages.applicationId], references: [applications.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  student: one(students, { fields: [reviews.studentId], references: [students.id] }),
  company: one(companies, { fields: [reviews.companyId], references: [companies.id] }),
  internship: one(internships, { fields: [reviews.internshipId], references: [internships.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  application: one(applications, { fields: [contracts.applicationId], references: [applications.id] }),
}));

export const trainingReportsRelations = relations(trainingReports, ({ one }) => ({
  application: one(applications, { fields: [trainingReports.applicationId], references: [applications.id] }),
  companyUser: one(users, { fields: [trainingReports.companyUserId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
  application: one(applications, { fields: [documents.applicationId], references: [applications.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
