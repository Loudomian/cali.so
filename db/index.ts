import { Pool } from 'pg'  // 👈 从 'pg' 导入
import { drizzle } from 'drizzle-orm/node-postgres'  // 👈 使用 node-postgres 适配器
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'  // 👈 正确的类型

import { env } from '~/env.mjs'

// 如果你有 schema，导入它
// import * as schema from './schema'

// 创建连接池
const pool = new Pool({ 
  connectionString: env.DATABASE_URL,
  ssl: false,  // 你的服务器不需要 SSL
  max: 20,     // 可选：设置最大连接数
})

// 错误处理
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err)
})

// 导出 db 实例，类型正确
export const db: NodePgDatabase = drizzle(pool)

// 如果你有 schema，使用这个版本：
// export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema })
