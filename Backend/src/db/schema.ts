import { pgTable, text, varchar, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// specify the different models for our db 
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", {mode:"date"}).notNull().defaultNow(),
    updatedAt: timestamp("modified_at", {mode: "date"}).notNull().$onUpdate(() => new Date())
});

export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at", {mode:"date"}).notNull().defaultNow(),
    updatedAt: timestamp("modified_at", {mode: "date"}).notNull().$onUpdate(() => new Date()), 
});

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow()
});

// now specify the relations bw different tables of our database
// a user can have many comments and products
export const userRelations = relations(users, ({many}) => ({
    products: many(products),   // user -> many(products)
    comments: many(comments)    // user -> many(comments)
}));

// a product can many comments and one user
export const productsRelation = relations(products, ({ many, one }) => ({
    comments: many(comments),   // product -> many(comments)
    user: one(users, {fields: [products.userId], references: [users.id]}),    // product -> one(user)
}));

// a comment can have one product can have one product and user
export const commentsRelation = relations(comments, ({one}) => ({
    user: one(users, {fields: [comments.userId], references: [users.id]}),  // comment -> one(user)
    product: one(products, {fields: [comments.productId], references: [products.id]}) // comment->one(prod)
}));

// defining the type interferences for the all the model to ensure the type safety for TS
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;    // creating new user (insert) would have somethings 
// optional but select wouldn't

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
