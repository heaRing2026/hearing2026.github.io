# HeaRing 项目网站

面向公众的 HeaRing 言戒项目展示网站，部署于 GitHub Pages。

在线地址：https://hearing2026.github.io/

模型仓库：https://github.com/BellaLee2007/HeaRing_Model/tree/v2 （当前私有，需要授权访问）

## 网站内容

项目愿景、头部锚点算法的尺度归一化演示、场景文字与浏览器语音交互、论文和 v2 模型实验记录、研究方向、团队介绍与 PDF 资料入口。

## 实现与部署

原生 HTML、CSS 和 JavaScript，无打包步骤、后端或付费服务。图片、字体及 PDF 随网站托管，浏览页面不依赖第三方 CDN。

GitHub Pages 设置为从 `main` 分支根目录 `/` 发布。更新该分支后，GitHub 自动重新构建网站。网站部署记录可在仓库的 Actions / Deployments 与 Settings → Pages 查看。

网站是公开的静态项目展示；不会在线运行私有 PyTorch 模型。场景演示的句子是预设示例，语音由设备浏览器合成。公开的网站仓库与私有模型仓库独立。

## 修改入口

- `index.html`：正文、导航、链接和首屏实验表格。
- `styles.css`：基础布局与响应式样式。
- `warm-theme.css`：橙黄绿暖色、圆润字体、卡通贴纸及温馨风格。
- `app.js`：骨架滑块、场景切换、语音播放、复制和实验表格切换。
- `resources/`：论文与三折页 PDF。
- `assets/`：图片、字体、图标和社交分享图。
- `design-sources.html`：内容、图片和设计来源。

若更新实验数字，应同时修改 `index.html` 首屏表格及 `app.js` 的 `results` 对象，核对实验设置，保留按片段划分和泛化限制。若模型仓库变为公开，请更新资源卡片和设计来源页的访问说明。

## 来源与许可

参考 DexZane/awesome-web-prompts 的 Wellness Devicex、TechForward，以及 Gold Standard prompt 和 HTML；第三方 MIT 许可保留在 `THIRD_PARTY_LICENSE.txt`。当前字体采用 Fredoka 与站酷快乐体，许可证见 `assets/fredoka-OFL.txt` 和 `assets/zcool-kuaile-OFL.txt`。标识直接使用用户提供的彩色图片。

内容与图片来自用户提供的讲稿、研究稿和科技作品三折页。实验摘要核对于 2026-10-10。网站不将历史实验表述为独立用户泛化、不宣称研究稿已经发表、不将概念戒指表述为已量产设备。项目素材及研究内容不自动适用参考设计的 MIT 许可。

## 发布地址

网站发布于 `heaRing2026` 组织的 `hearing2026.github.io` 仓库，公网地址为 https://hearing2026.github.io/ 。旧网站入口跳转至新域名。
