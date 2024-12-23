### 下一步

- 实现ai聊天
  - ai模型需要可选
  - 进行角色扮演聊天
  - dnd游戏室

* 代码整理
  - 减少重复代码

- 文档渲染

  - 支持渲染code
  - 将ai的响应进一步格式化，达到以适配系统

- 文档库
- 智能助手
  - 后续集成 GPT-Sovits 技术，提供智能问答和自动化任务处理

- 数据分析与可视化
  - 使用 Milvus 进行数据存储与检索

---

- 国际化

* UI美化

  - 侧边栏改成圆角
  - 各种图标样式美化

### idea

- ai 聊天
  - 使用一个ai聊天室 一个模型，不使用混合模型，各自功能分开

### 关于DND，可行性分析

- 使用graphrag进行回答限制，flux.1或者sd进行图片生成
- 所以需要一个中间过程进行文本到图片的转换
- 图片生成可以考虑使用comfyui流引擎进行构建
- 对于文本生成，使用graphrag之后文本对话基本是可以秒出的，再加上使用流式响应,文本生成用户这边是体验因该是非常好的
- 对于图片生成，这个毕竟是需要将文本转提示词再转图片，用户体验将会相当差
- 可以把文本进行语音转化，图片让用户去想象，这一部分体验受用户和语音模型的影响
- 综上，采用将DM当作背景，使文本进行语音转换是最好选择
```angular2html
yjs
@hocuspocus/provider

"@fontsource/inter": "^5.1.0",
"@svgr/webpack": "^8.1.0",
"@tippyjs/react": "^4.2.6",
"@tiptap-pro/extension-details": "^2.16.0",
"@tiptap-pro/extension-details-content": "^2.16.0",
"@tiptap-pro/extension-details-summary": "^2.16.0",
"@tiptap-pro/extension-drag-handle": "^2.16.0",
"@tiptap-pro/extension-drag-handle-react": "^2.16.0",
"@tiptap-pro/extension-emoji": "^2.16.0",
"@tiptap-pro/extension-file-handler": "^2.16.0",
"@tiptap-pro/extension-mathematics": "^2.16.0",
"@tiptap-pro/extension-node-range": "^2.16.0",
"@tiptap-pro/extension-table-of-contents": "^2.16.0",
"@tiptap-pro/extension-unique-id": "^2.16.0",
"@tiptap/core": "^2.10.2",
"@tiptap/extension-bullet-list": "^2.10.2",
"@tiptap/extension-character-count": "^2.10.2",
"@tiptap/extension-code-block": "^2.10.2",
"@tiptap/extension-code-block-lowlight": "^2.10.2",
"@tiptap/extension-collaboration": "^2.10.2",
"@tiptap/extension-collaboration-cursor": "^2.10.2",
"@tiptap/extension-color": "^2.10.2",
"@tiptap/extension-document": "^2.10.2",
"@tiptap/extension-dropcursor": "^2.10.2",
"@tiptap/extension-focus": "^2.10.2",
"@tiptap/extension-font-family": "^2.10.2",
"@tiptap/extension-heading": "^2.10.2",
"@tiptap/extension-highlight": "^2.10.2",
"@tiptap/extension-horizontal-rule": "^2.10.2",
"@tiptap/extension-image": "^2.10.2",
"@tiptap/extension-link": "^2.10.2",
"@tiptap/extension-ordered-list": "^2.10.2",
"@tiptap/extension-paragraph": "^2.10.2",
"@tiptap/extension-placeholder": "^2.10.2",
"@tiptap/extension-subscript": "^2.10.2",
"@tiptap/extension-superscript": "^2.10.2",
"@tiptap/extension-table": "^2.10.2",
"@tiptap/extension-table-header": "^2.10.2",
"@tiptap/extension-table-row": "^2.10.2",
"@tiptap/extension-task-item": "^2.10.2",
"@tiptap/extension-task-list": "^2.10.2",
"@tiptap/extension-text-align": "^2.10.2",
"@tiptap/extension-text-style": "^2.10.2",
"@tiptap/extension-typography": "^2.10.2",
"@tiptap/extension-underline": "^2.10.2",
"@tiptap/pm": "^2.10.2",
"@tiptap/react": "^2.10.2",
"@tiptap/starter-kit": "^2.10.2",
"@tiptap/suggestion": "^2.10.2",
"autoprefixer": "10.4.14",
"cal-sans": "^1.0.1",
"jsonwebtoken": "^9.0.2",
"lowlight": "^3.1.0",
"nanoid": "^4.0.2",
"postcss": "8.4.27",
"react-colorful": "^5.6.1",
"react-hot-toast": "^2.4.1",
"tailwindcss": "3.3.3",
"tippy.js": "^6.3.7",
"uuid": "^9.0.1",
"y-prosemirror": "^1.2.13"
```