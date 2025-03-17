export interface Recipe {
  id: string;          // UUID v4生成
  name: string;        // 必填，最大30字符
  description: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  notes?: string;      // 可选，支持换行
  createdAt: string;   // ISO 8601格式时间戳
}

export interface StorageSchema {
  recipes: Recipe[];
  meta: {
    initialized: boolean;     // 是否完成初始化
    lastBackupTime?: string;  // 最后备份时间
  }
}

// 常量定义
export const STORAGE_KEY = '@recipe_app';
export const IMAGE_DIR = 'recipe-images';
export const MAX_NAME_LENGTH = 30;
export const MAX_NOTES_LENGTH = 500;
export const THUMBNAIL_SIZE = 200;
export const FULL_IMAGE_SIZE = 800;
export const IMAGE_QUALITY = 0.6; 