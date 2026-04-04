import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const changelogs = sqliteTable('changelogs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  repo: text('repo').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`(current_timestamp)`),
})
