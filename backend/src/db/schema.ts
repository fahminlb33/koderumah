import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const Session = sqliteTable('sessions', {
	id: text('id').notNull().primaryKey(),
	title: text('title').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: text('last_modified_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const Chat = sqliteTable('chats', {
	id: text('id').notNull().primaryKey(),
	session_id: text('session_id').references(() => Session.id),
	role: text('role'),
	content: text('prompt'),
	imageUrl: text('image_url'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const ChatCitation = sqliteTable('chat_citations', {
	id: text('id').notNull().primaryKey(),
	chat_id: text('chat_id').references(() => Chat.id),
	house_id: text('house_id').references(() => House.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const House = sqliteTable('houses', {
	id: text('id').notNull().primaryKey(),
	price: integer('price').notNull(),
	address: text('address').notNull(),
	content: text('content').notNull(),
	url: text('url').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const HouseImage = sqliteTable('house_images', {
	id: text('id').notNull().primaryKey(),
	house_id: text('house_id').references(() => House.id),
	url: text('url').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});
