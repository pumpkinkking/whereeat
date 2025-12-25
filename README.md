# WhereEat 项目

## 项目简介
这是一个基于 React Native 和 Expo 构建的移动应用项目。

## 环境要求
- Node.js (推荐 LTS 版本)
- npm 或 yarn

## 安装和运行

### 1. 安装 Node.js
如果尚未安装 Node.js，请访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新 LTS 版本。

### 2. 安装项目依赖
```bash
npm install
```

### 3. 运行项目
项目提供了多种运行方式：

- 启动开发服务器（推荐）：
  ```bash
  npm start
  ```
  这将打开 Expo 开发工具，你可以通过二维码在移动设备上预览，或在模拟器中运行。

- 直接在 Android 设备/模拟器上运行：
  ```bash
  npm run android
  ```

- 直接在 iOS 设备/模拟器上运行（仅限 macOS）：
  ```bash
  npm run ios
  ```

- 在 Web 浏览器中运行：
  ```bash
  npm run web
  ```

## 项目结构
```
src/
├── components/     # 可复用的UI组件
├── navigation/     # 导航配置
├── screens/        # 页面组件
├── services/       # API服务
└── stores/         # 状态管理 (Zustand)
```

## 技术栈
- React Native
- Expo
- TypeScript
- Zustand (状态管理)
- React Navigation