---
abbrlink: ''
categories:
- - 技术交流
cover: https://haowallpaper.com/link/common/file/previewFileImg/15624832803574080
date: '2025-02-03T22:14:39.006699+08:00'
tags:
- 技术
title: Actions踩坑
updated: '2025-02-03T22:15:39.238+08:00'
---
踩坑了，结合我踩得和搜的，汇总下。

## 容易踩坑的点

### 1. 工作流文件路径和命名

GitHub Actions 的工作流文件需要存放在仓库的 `.github/workflows` 目录下，并且文件名必须以 `.yml` 或 `.yaml` 结尾。很多新手可能会把文件放错位置或者命名错误，导致工作流无法正常触发。

### 2. 事件触发配置

GitHub Actions 可以通过各种事件来触发，如 `push`、`pull_request` 等。但在配置事件触发时，很容易出现错误。例如，如果你只想在 `main` 分支有 `push` 操作时触发工作流，却没有正确指定分支，就可能会导致工作流在其他分支的 `push` 操作时也被触发。

收起

yaml

```y
on:
  push:
    branches:
      - main
```

### 3. 环境变量的使用

在工作流中使用环境变量时，要注意变量的作用域和引用方式。有时候，我们可能会错误地引用了不存在的环境变量，或者在错误的上下文中使用了环境变量，导致任务失败。

收起

yaml

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      MY_VARIABLE: "Hello, World!"
    steps:
      - name: Print variable
        run: echo $MY_VARIABLE
```

### 4. 缓存问题

为了提高工作流的执行效率，我们可能会使用缓存来存储一些依赖项。但如果缓存配置不当，可能会导致缓存失效或者使用到过期的缓存，从而影响任务的正常执行。

收起

yaml

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Cache dependencies
        uses: actions/cache@v2
        with:
          path: |
            node_modules
            ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
```

### 5. 权限问题

在执行一些需要特定权限的操作时，如部署到服务器，可能会因为权限不足而失败。要确保工作流有足够的权限来执行这些操作，例如使用合适的密钥或令牌。

## 典型自动化任务实例代码

下面是一个典型的自动化任务实例，当我们向 `main` 分支推送代码时，自动拉取依赖、构建项目并部署到服务器。

收起

yaml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 14

      - name: Cache dependencies
        uses: actions/cache@v2
        with:
          path: |
            node_modules
            ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/your/project
            git pull origin main
            npm install
            npm run build
            pm2 restart your-app-name
```

### 代码说明

1. **事件触发**：当向 `main` 分支推送代码时，触发工作流。
2. **拉取代码**：使用 `actions/checkout@v2` 拉取仓库代码。
3. **设置 Node.js 环境**：使用 `actions/setup-node@v2` 设置 Node.js 版本为 14。
4. **缓存依赖**：使用 `actions/cache@v2` 缓存 `node_modules` 目录，提高后续构建的效率。
5. **安装依赖**：执行 `npm install` 安装项目依赖。
6. **构建项目**：执行 `npm run build` 构建项目。
7. **部署到服务器**：使用 `appleboy/ssh-action@master` 通过 SSH 连接到服务器，拉取最新代码、安装依赖、构建项目并重启应用。
