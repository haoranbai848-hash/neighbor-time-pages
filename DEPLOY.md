# 邻里时光 · GitHub + Cloudflare Pages 中文部署说明

本说明针对独立的 `cloudflare-demo`，不是父目录的 Rails 项目。准备日期：2026-10-29。本次只完成本地准备，没有上传 GitHub，也没有线上部署。

## 1. 你应该使用哪个文件夹

部署项目位置：

```text
D:\Users\Lenovo\Desktop\Codex活动区\20261025_社区系统化设计\timeoverflow-course\cloudflare-demo
```

将这个文件夹**内部的内容作为新 GitHub 仓库的根目录**。在 GitHub 仓库首页应直接看到 `package.json`、`package-lock.json`、`src`、`public`、`DEPLOY.md`、`LICENSE`。

不要上传整个 `timeoverflow-course`，不要上传 backups，也不要把原 Rails 仓库的 `.git`、`.env`、`config`、`db`、数据库备份或旧 Git 历史带入新仓库。`cloudflare-demo` 当前位于原 Git 仓库内，但没有单独初始化 Git；下文用复制到新位置的方式避免误操作父仓库。

## 2. 在 Windows 电脑上预览

### 最方便：双击启动

1. 在资源管理器进入上述 `cloudflare-demo` 文件夹。
2. 双击 **preview.cmd**。
3. 会打开命令窗口与浏览器，地址是 **http://127.0.0.1:5173**。
4. 预览期间保留命令窗口。关闭预览时，在窗口按 `Ctrl+C`。

首次安装需要联网；本机已完成依赖安装。复制到新电脑后，启动脚本会自动运行 `npm ci`。需要 Node.js 22.12 以上；如果未安装，从 [Node.js 官网](https://nodejs.org/) 安装当前 LTS，关闭旧命令窗口后再启动。

想检查最终发布效果，双击 **preview-production.cmd**。它会先生产构建，然后打开 **http://127.0.0.1:4173**。生产预览包含源码下载与第三方许可证文件；开发预览中这两个构建生成文件尚不存在，请用生产预览检查下载。

不要直接双击 `index.html`，也不要用 `file:///` 打开 `dist/index.html`，否则模块和路径无法正常工作。

### 使用 PowerShell 的方法

在此文件夹地址栏输入 `powershell` 并回车，然后依次运行：

```powershell
npm.cmd ci --cache "$env:TEMP\neighbor-demo-npm-cache" --registry https://registry.npmjs.org
npm.cmd run dev
```

浏览器打开 http://127.0.0.1:5173 。使用 `npm.cmd` 可避免 Windows 的 npm.ps1 执行策略问题，无需修改系统安全设置。

生产测试：

```powershell
npm.cmd test
npm.cmd run check:security
npm.cmd run build
npm.cmd run preview
```

如果提示端口已占用，先关闭之前的预览窗口。或者运行 `npm.cmd run dev -- --port 5174`，按输出地址访问。

### 用自己的手机预览（可选）

电脑与手机连接同一个可信 Wi-Fi。在项目文件夹运行：

```powershell
npm.cmd run dev -- --host 0.0.0.0
```

按终端打印的 `Network` 地址在手机浏览器打开，例如 `http://192.168.1.23:5173`。数字以你的实际输出为准。如果 Windows 防火墙询问网络访问，只需允许你自己的专用网络。默认双击启动仅监听本机，手机不能直接打开 `127.0.0.1`。

## 3. 上传到 GitHub（由你执行）

推荐使用 GitHub Desktop。以下步骤**尚未代你执行**。

### A. 先复制一个干净的独立文件夹

先在资源管理器把 `cloudflare-demo` 整个复制到一个**原 Rails 项目以外**的位置，例如：

```text
D:\Users\Lenovo\Desktop\neighbor-time-demo
```

复制后删去副本里的 `node_modules` 和 `dist`（它们只是依赖和构建输出，之后可重新生成；不要删除原 Rails 项目里的任何文件）。也可先正常复制，GitHub Desktop 会按 `.gitignore` 排除它们。

### B. 使用 GitHub Desktop 发布

1. 安装 [GitHub Desktop](https://desktop.github.com/) 并登录自己的 GitHub。
2. 选择 **File → Add local repository**，选择刚复制的 `neighbor-time-demo`。
3. 它会提示这不是 Git 仓库，点击 **create a repository here**；检查 Local path / 最终目录指向这个副本，不要多套一层空文件夹。
4. 使用已有的 `.gitignore`、`LICENSE` 和 `README.md`，不要选择另一个许可证来覆盖 AGPL。
5. 在 Changes 中确认文件来自独立演示版。应包含 `src`、`public`、`scripts`、`tests`、文档、package.json 与 package-lock.json；不应出现 `.env`、Rails 文件、node_modules、dist 或备份。
6. 如有待提交文件，填写提交说明，例如“邻里时光课程展示静态版”，点击 **Commit to main**。
7. 点击 **Publish repository**，名字可用 `neighbor-time-demo`。可选择 Public，方便课程分享与阅读源码；也可使用 Private 仓库连接 Pages，但发布后的站点仍可能公开可访问。
8. 这一步才会真正上传。完成后在 GitHub 仓库首页确认 `package.json` 直接位于根目录。

不要在原 `timeoverflow-course` 上点击“Push origin”，该仓库还有你之前的 V1 修改和旧历史。

### C. 如果想使用 GitHub 网页上传

新建一个仓库后选择上传现有文件。上传的是 `cloudflare-demo` **里面的源文件与子文件夹**，不是仅上传一个 ZIP，也不是只上传 `dist`。网页上传容易漏掉 `.gitignore`、`.node-version` 等隐藏文件，建议优先用 GitHub Desktop。

## 4. Cloudflare Pages 配置（由你执行）

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 打开 **Workers & Pages → Create application → Pages → Import an existing Git repository**。页面语言不同可能显示“创建应用 / Pages / 连接 Git”。选择 **Pages** 的 Git 集成。
3. 连接 GitHub，只授权访问你刚建立的演示仓库。
4. 选择该仓库，填写：

| 配置项 | 要填写的内容 |
| --- | --- |
| Project name / 项目名称 | 例如 `neighbor-time-demo`，按可用名称填写 |
| Production branch / 生产分支 | `main`（与 GitHub 实际分支一致） |
| Framework preset / 框架预设 | `React (Vite)`；没有此选项时选 `None` 并手填以下两项 |
| Build command / 构建命令 | `npm run build` |
| Build output directory / 输出目录 | `dist` |
| Root directory / 根目录 | **留空**（前提是独立仓库根目录直接包含 package.json） |
| NODE_VERSION / 环境变量 | `22.16.0`；本项目也提供 `.node-version` |
| 数据库、API 密钥、其他 Secrets | **不需要填写** |

如果你自行保留了 GitHub 仓库内外层 `cloudflare-demo` 文件夹，则 Root directory 应填 `cloudflare-demo`。两种结构不要混用。推荐按上一节让它成为仓库根目录，根目录留空最容易。

5. 自己核对配置后点击 **Save and Deploy**，这一步才会实际部署。
6. 等待依赖安装与构建结束。成功后得到 `https://你的项目名.pages.dev`。课程展示可以使用此地址，无需另购域名。
7. 此后向连接分支推送新提交会触发自动构建部署。只想做本地修改时，不要在 GitHub Desktop 中推送。

本配置依据 [Cloudflare React 部署指南](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) 与 [构建配置文档](https://developers.cloudflare.com/pages/configuration/build-configuration/) 核对。免费计划当前有构建次数、文件数与文件大小限制，详见 [Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)；本地检查确认本包每个文件小于 25 MiB。未使用 Functions、付费数据库或其他云服务绑定。

## 5. 路径、刷新与资源是怎样处理的

- 图片和 favicon 都在本地 `public` 中，不依赖旧 Rails 的 `/assets` 指纹地址或本机文件路径。
- 继续使用现有 V1 的系统中文字体栈，不需要下载外部字体。V1 图标为原来的内联 SVG；未用到的 Rails glyphicons 字体没有带入部署包。
- `public/_redirects` 包含 `/* /index.html 200`，构建会复制到 dist；Pages 也会在没有根级 404.html 时使用默认 SPA 回退。
- 首页、列表、服务详情、居民页等通过浏览器路径选择静态演示页面，刷新深层地址也可加载。
- 不要添加根级 `404.html` 或把输出目录误设为 `public`。
- 本地 Vite 生产预览验证了页面刷新；Cloudflare 的 `_headers`、`_redirects` 实际执行效果需上线后再按下节检查，本次没有访问线上站点。

参见 [Cloudflare SPA 路由说明](https://developers.cloudflare.com/pages/configuration/serving-pages/)。

## 6. 部署后自己检查这几项

1. 用电脑与手机打开首页，确认原有插画、绿色按钮和导航完整。
2. 在互助广场搜索“手机”，选择“数字生活”，应看到 2 项提供帮助。
3. 切换“看看谁需要帮助”、分类、标签和分页，确认能跳转；没有结果时有空状态和重置入口。
4. 打开某条详情，例如 `/offers/digital-help`，按 F5 刷新；再直接输入 `/members/student` 检查资料与账本。
5. 演示登录、发布、时间记录：页面应明确提示没有保存和真实交易，账本余额保持不变。
6. 打开参与指南的线下登记卡，打印预览中应显示登记卡。
7. 点击页脚“下载本版完整源码”和“许可证”，确认能下载和阅读。

## 7. 演示范围与数据边界

保留：首页、互助广场（提供/需求）、三类服务、服务详情、居民列表与资料、时间银行账本、参与指南与打印卡、登录/加入入口、发布技能/需要表单、时间记录表单、资料编辑入口、社区页、服务条款及开源说明。

可实际演示：页面跳转、搜索、组合分类/标签筛选、分页、角色选择、表单校验、反馈弹窗、打印。

不会真实运行：身份认证、会员审批、联系方式请求、发布保存、资料修改、时间转账、邮件通知、后台管理和数据库统计。没有连接现有 PostgreSQL，也没有读取数据库内容。所有数据为单独编写的固定虚构示例，输入仅在当前页面内存中存在。

## 8. 许可证与源码

保留上游 TimeOverflow 的 AGPL v3 许可证、署名与链接，详情见 `NOTICE.md`。生产构建会自动生成本版 `source-code.zip`，让站点访问者可以获取对应修改版源码；React / React DOM / Bootstrap 的许可写入 `THIRD_PARTY_NOTICES.txt`。

不要删掉 LICENSE、NOTICE.md 或页脚的源码与署名链接。源码下载包含源文件、素材、构建配置、锁文件和说明，不包含 node_modules、父项目、数据库、密钥或 Git 历史。

## 9. 常见问题

- **构建找不到 package.json**：GitHub 上传目录或 Pages 根目录设置有误。仓库根目录直接有 package.json 时，Root directory 留空。
- **构建提示 Node 版本过低**：将 NODE_VERSION 设为 `22.16.0`，并检查 `.node-version` 已上传。
- **图片不显示**：确认 public/images 已上传，文件名大小写没有改变，输出目录是 dist。
- **刷新详情出现 404**：检查 dist/_redirects 存在、没有额外 404.html，并确认使用的是 Pages 静态站点配置。
- **第一次依赖安装失败**：检查网络，重新运行 `npm.cmd ci --cache "$env:TEMP\neighbor-demo-npm-cache" --registry https://registry.npmjs.org`。无需管理员运行，也不需要输入任何数据库密码。
- **源码下载提示不存在**：用 `preview-production.cmd`；该 ZIP 是 `npm run build` 自动生成的生产资源。
- **以为发布/转账没有成功**：本版是课程演示，未保存正是预期行为。真实业务需要单独部署 Rails 与数据库，不能把完整 Rails 项目直接放进 Pages。

GitHub 操作参考：[GitHub 官方导入本地代码说明](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)。
