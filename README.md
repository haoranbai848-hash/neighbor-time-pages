# 邻里时光 · Cloudflare Pages 课程演示版

独立 Vite + React 静态站点，保留当前本地 V1 视觉。没有 Rails、数据库、真实登录、后台 API、真实发布或时间交易。

Windows：双击 `preview.cmd`，浏览器打开 http://127.0.0.1:5173 。生产版本预览请双击 `preview-production.cmd`。

首次安装需要联网及 Node.js 22.12 以上。已安装依赖时可离线预览。命令行：

```powershell
npm ci
npm test
npm run check:security
npm run build
npm run preview
```

GitHub 上传、Cloudflare Pages 配置、手机预览及排错见 [DEPLOY.md](DEPLOY.md)。架构检查见 [docs/PROJECT_AUDIT.md](docs/PROJECT_AUDIT.md)。

只将本文件夹作为新 GitHub 仓库的根目录。不要上传父级 Rails 仓库、`.env`、数据库备份、node_modules 或 dist。构建输出目录为 `dist`。

基于 [TimeOverflow](https://github.com/coopdevs/timeoverflow) 改编，保留 AGPL v3 许可及署名，见 [NOTICE.md](NOTICE.md) 和 [LICENSE](LICENSE)。
