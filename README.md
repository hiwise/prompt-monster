# Prompt 打怪（3D 学习小游戏）

纯静态网页：双击 `index.html` 就能玩，不需要构建，也不需要联网。

## 玩法

走到怪物面前，从四张技能卡里打出对症的那一张才能命中；打错会被反击扣血。
连续答对有连击加分，通关后按打错的次数给 1–3 星。

- 移动：WASD / 方向键，或点击（手机上点按）地面
- 出牌：点击卡牌，或按 1–4；回车继续

## 文件

```
index.html      页面结构
style.css       界面样式（技能卡、血条、手机竖屏布局）
questions.js    题库和技能卡（改内容只动这一个文件）
js/kit.js       材质、描边、音效等工具
js/models.js    主角和三只怪物的模型
js/world.js     场景：三段主题地图、石板路、传送门、战斗镜头
js/game.js      游戏流程：移动、战斗、特效、结算
lib/three.min.js  Three.js r157 本地副本（MIT 许可）
```

## 加题

`questions.js` 里有三样东西：

- `PM_SKILLS`：技能卡表，`id: { name: '卡名', icon: '图标名' }`
- `PM_ICONS`：图标表，24x24 的 SVG 线条路径
- `QUESTIONS`：题目数组，每题格式如下

```js
{
  monster: 'hallucination',        // hallucination / overflow / fakefix
  scene: '一句话描述遇到的状况',
  cards: [                          // 固定四张：[技能 id, 卡面说明]
    ['source', '……'],
    ['louder', '……'],
    ['idk', '……'],
    ['role', '……']
  ],
  answer: 0,                        // 正确那张在 cards 里的下标
  explain: '答完后显示的讲解'
}
```

目前题库共 18 道，每只怪物 6 道。每只怪物有 3 格血，所以每局从它的题里随机抽 3 道（打错的题会回到队尾再出一次）。
每只怪物至少要有 3 道题。新增技能卡时，记得在 `PM_SKILLS` 里登记，并保证它的图标名在 `PM_ICONS` 里存在。

## 部署

Cloudflare Pages：把整个文件夹推到一个 GitHub 仓库，在 Pages 里连接该仓库，
构建命令留空，输出目录填 `/`。也可以在 Pages 控制台直接上传这个文件夹。

GitHub Pages：仓库 Settings → Pages → 选择分支和根目录。
