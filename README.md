# 我的菜谱 App

一个基于 React Native + Expo 的菜谱管理应用，支持离线存储、图片管理和数据备份功能。

## 功能特点

- 📱 支持拍照和相册选择图片
- 💾 离线优先，本地数据存储
- 🔄 支持数据备份和恢复
- 🖼️ 图片自动压缩和缓存
- 🔍 图片支持双指缩放查看
- 📝 支持添加菜谱备注
- 🎨 现代化 UI 设计

## 技术栈

- **框架**: React Native + Expo (TypeScript)
- **状态管理**: React Context API
- **本地存储**: 
  - `@react-native-async-storage/async-storage`（核心数据）
  - `expo-file-system`（图片文件管理）
- **图片处理**: 
  - `expo-image-picker`（图片选择）
  - `expo-image-manipulator`（图片压缩）
  - `expo-image`（图片显示）
- **UI 组件**:
  - `react-native-gesture-handler`（手势处理）
  - `react-native-reanimated`（动画效果）

## 开始使用

1. 克隆项目
```bash
git clone [你的仓库URL]
cd RecipeApp
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npx expo start
```

4. 在模拟器或真机上运行
- 使用 Expo Go app 扫描二维码
- 或在模拟器中运行

## 构建应用

使用 EAS Build 构建应用：

```bash
# 开发版本
eas build -p android --profile development

# 预览版本
eas build -p android --profile preview

# 生产版本
eas build -p android --profile production
```

## 许可证

MIT 