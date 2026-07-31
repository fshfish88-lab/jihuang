# 火堆边百科

面向《饥荒联机版》新手的非官方、非商业攻略网站。它用“当前阶段 → 准备内容 → 操作步骤 → 完成标志 → 下一步”组织攻略，而不是只罗列游戏数据。

## 本地运行

```powershell
$env:npm_config_cache = Join-Path (Get-Location) '.npm-cache'
npm.cmd install
npm.cmd run dev
```

## 验证与导出

```powershell
npm.cmd run validate:content
npm.cmd test
npm.cmd run generate
npm.cmd run export
```

静态成品会导出到 `成品文件/github-pages/`。推送到 `main` 后，GitHub Actions 会自动发布 `.output/public`。

## 目录

- `content/`：攻略 Markdown 与 Front Matter；
- `app/`：Nuxt 页面、组件、状态与样式；
- `成品文件/`：可直接部署的生成结果；
- `过程文件/`：需求、设计、计划和验证报告；
- `素材文件/`：原始素材、来源与字体许可证。

## 版权

本站为玩家制作的非官方、非商业资料站，与 Klei Entertainment 无官方关联。游戏名称、角色、图片及相关素材版权归其权利人所有。

