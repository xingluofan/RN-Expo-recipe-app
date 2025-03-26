export interface Recipe {
  id: string          // UUID v4生成
  name: string        // 必填，最大30字符
  image: string       // 文件路径（格式：recipe-images/{uuid}.jpg）
  notes?: string      // 可选，支持换行
  createdAt: string   // ISO 8601格式时间戳
}

export interface StorageSchema {
  recipes: Recipe[]
  meta: {
    initialized: boolean     // 是否完成初始化
    lastBackupTime?: string  // 最后备份时间
  }
} 