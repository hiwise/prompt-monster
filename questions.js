// 技能卡：id -> 名称 + 图标。所有题目共用这一套卡，方便以后做「技能图鉴」。
window.PM_SKILLS = {
  source:   { name: '给材料要出处', icon: 'book' },
  idk:      { name: '允许说不知道', icon: 'shield' },
  example:  { name: '给示例', icon: 'bulb' },
  summary:  { name: '总结开新对话', icon: 'refresh' },
  split:    { name: '拆小任务', icon: 'grid' },
  quote:    { name: '先摘录再回答', icon: 'quote' },
  test:     { name: '先写测试', icon: 'flask' },
  run:      { name: '要运行输出', icon: 'terminal' },
  diff:     { name: '要求给 diff', icon: 'diff' },
  steps:    { name: '一步步思考', icon: 'stairs' },
  role:     { name: '设定角色', icon: 'user' },
  louder:   { name: '加重语气', icon: 'horn' },
  repeat:   { name: '反复强调', icon: 'loop' },
  longer:   { name: '要求更详细', icon: 'lines' },
  table:    { name: '换成表格', icon: 'table' },
  creative: { name: '放飞创意', icon: 'spark' },
  remind:   { name: '口头提醒', icon: 'bell' },
  praise:   { name: '夸一夸', icon: 'thumb' },
  sorry:    { name: '让它道歉', icon: 'heart' },
  newchat:  { name: '开新对话', icon: 'bubble' },
  sure:     { name: '反问确定吗', icon: 'ask' },
  retract:  { name: '查不到就撤回', icon: 'undo' },
  fresh:    { name: '给最新资料', icon: 'clock' },
  checklist:{ name: '列清单逐条做', icon: 'checks' },
  tags:     { name: '用标签分隔', icon: 'brackets' },
  last:     { name: '问题放最后', icon: 'down' },
  accept:   { name: '说清验收标准', icon: 'target' },
  root:     { name: '先找根因', icon: 'search' },
  review:   { name: '对照需求自查', icon: 'eye' },
  retry:    { name: '重新生成', icon: 'dice' },
  tip:      { name: '许诺小费', icon: 'coin' }
};

// 图标：24x24 线条图标，只写内部路径
window.PM_ICONS = {
  book: '<path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12"/><path d="M9 8h6M9 11h4"/>',
  shield: '<path d="M12 3l8 3v6c0 4.6-3.2 7.8-8 9-4.8-1.2-8-4.4-8-9V6z"/><path d="M9.8 9.6a2.3 2.3 0 1 1 3.5 2c-.8.5-1.3 1-1.3 1.9"/><path d="M12 16.6v.1"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.4 6.4"/><path d="M20 4v7h-7"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  quote: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M9 15.5l2 2 4-4"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/>',
  diff: '<path d="M12 3v8M8 7h8"/><path d="M8 17h8"/><rect x="3" y="13.5" width="18" height="7" rx="2" stroke-dasharray="2 2.5"/>',
  stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  horn: '<path d="M4 10v4h3l7 4V6l-7 4z"/><path d="M17.5 9a4 4 0 0 1 0 6"/><path d="M19.8 6.5a7.5 7.5 0 0 1 0 11"/>',
  loop: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  lines: '<path d="M4 6h16M4 10h16M4 14h16M4 18h10"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M10 4v16"/>',
  spark: '<path d="M11 3l1.9 5.6L18.5 10.5l-5.6 1.9L11 18l-1.9-5.6L3.5 10.5l5.6-1.9z"/><path d="M19 15.5v5M16.5 18h5"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  thumb: '<path d="M7 11v9H4v-9z"/><path d="M7 11l4-8c1.5 0 2.5 1 2.5 2.5V9H19a2 2 0 0 1 2 2.3l-1.2 7a2 2 0 0 1-2 1.7H7"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  bubble: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M12 8v5M9.5 10.5h5"/>',
  ask: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.4 1-1.4 1.9"/><path d="M12 17v.1"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  checks: '<path d="M3.5 6.5L5 8l2.5-3"/><path d="M3.5 12.5L5 14l2.5-3"/><path d="M3.5 18.5L5 20l2.5-3"/><path d="M11 6.5h9.5M11 12.5h9.5M11 18.5h9.5"/>',
  brackets: '<path d="M8 6l-5 6 5 6"/><path d="M16 6l5 6-5 6"/><path d="M13.5 5l-3 14"/>',
  down: '<path d="M5 4.5h14M5 8.5h9"/><path d="M12 12.5V20"/><path d="M8.5 16.5L12 20l3.5-3.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r=".7"/><circle cx="15.5" cy="8.5" r=".7"/><circle cx="12" cy="12" r=".7"/><circle cx="8.5" cy="15.5" r=".7"/><circle cx="15.5" cy="15.5" r=".7"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11"/><path d="M15 9.5c-.5-.9-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.6-3-1.5"/>'
};

// 题库：scene = 怪物出的招（翻车场景）；cards = 四张技能卡 [技能 id, 这一题里的具体做法]；
// answer = 正确卡的下标（从 0 开始）。加题只需要往数组里追加。
// monster 取值：hallucination / overflow / fakefix
window.QUESTIONS = [
  {
    monster: 'hallucination',
    scene: '你问 AI 某个库怎么做分页，它自信地给了一个函数 paginate_all()，可这个函数根本不存在。',
    cards: [
      ['source', '贴上官方文档，要求只依据文档回答并标出处'],
      ['louder', '用更严厉的语气再问一遍'],
      ['longer', '让它把回答写得更详细'],
      ['split', '把问题拆成更小的步骤']
    ],
    answer: 0,
    explain: '让它基于你给的真实材料回答并标出处，它就没有空间凭印象编造。'
  },
  {
    monster: 'hallucination',
    scene: '你问了一个 AI 不可能知道的公司内部规定，它编出一套听起来很合理的流程。',
    cards: [
      ['role', '告诉它「你是资深 HR」'],
      ['idk', '明确允许说「不知道」，并区分事实和推测'],
      ['steps', '让它一步一步思考'],
      ['table', '要求用表格输出']
    ],
    answer: 1,
    explain: '不给退路时它倾向于硬答。明确允许「不知道」，并让它标出哪些是推测，编造会明显减少。'
  },
  {
    monster: 'hallucination',
    scene: '你让 AI 从发票里提取字段，原文没有的信息它也经常自己「补」上一个值。',
    cards: [
      ['remind', '提醒它「请务必认真」'],
      ['test', '让它先写测试'],
      ['example', '给 2~3 个示例，包含「缺失就填 null」'],
      ['creative', '让它发挥得更有创意']
    ],
    answer: 2,
    explain: '示例比口头要求更有效。把「缺失就填 null」直接演示给它看，它就会照着做。'
  },
  {
    monster: 'overflow',
    scene: '一个对话聊了三小时，AI 开始忘记你最初定下的命名规范。',
    cards: [
      ['repeat', '在这个对话里把规范再强调几遍'],
      ['summary', '让它总结关键决定，开新对话并贴上总结'],
      ['louder', '换更严厉的语气'],
      ['test', '让它先写测试']
    ],
    answer: 1,
    explain: '对话太长，早期内容会被挤掉或被稀释。带着一份精简总结重新开始，比在旧对话里反复强调更可靠。'
  },
  {
    monster: 'overflow',
    scene: '你把 5000 行的整个项目一次贴进去说「重构一下」，结果改得乱七八糟，还漏了一半。',
    cards: [
      ['remind', '加一句「请仔细阅读所有代码」'],
      ['example', '给它一个重构示例'],
      ['longer', '让它输出更长的回答'],
      ['split', '一次只给相关文件，只改一个模块']
    ],
    answer: 3,
    explain: '一次塞太多，它顾不过来。把任务拆小、每次只给相关内容，每一步都能做对，也方便你检查。'
  },
  {
    monster: 'overflow',
    scene: '你贴了一份很长的会议记录再提问，AI 的回答漏掉了中间部分的关键信息。',
    cards: [
      ['quote', '先摘出相关原文片段，再基于片段回答'],
      ['idk', '允许它说「不知道」'],
      ['repeat', '把同一个问题连问三遍'],
      ['role', '让它扮演会议主持人']
    ],
    answer: 0,
    explain: '长文中间的内容最容易被忽略。先摘录相关原文，等于强迫它把关键信息找出来再作答。'
  },
  {
    monster: 'fakefix',
    scene: 'AI 说「登录 bug 已修复，没问题了」，你一跑，还是原来的报错。',
    cards: [
      ['sure', '回一句「你确定吗？」'],
      ['test', '先写能复现 bug 的测试，测试通过才算修好'],
      ['sorry', '让它道歉并重新保证'],
      ['example', '多给它几个示例']
    ],
    answer: 1,
    explain: '「修好了」需要可验证的标准。先有一个会失败的测试，修复后测试变绿，才是真的修好。'
  },
  {
    monster: 'fakefix',
    scene: 'AI 回复「我已经运行过，全部正常」，但它其实没有真正执行过代码。',
    cards: [
      ['steps', '让它一步一步思考'],
      ['praise', '夸它做得好，让它继续'],
      ['run', '要求实际运行，贴出命令和原始输出'],
      ['newchat', '开一个新对话重来']
    ],
    answer: 2,
    explain: '口头的「跑过了」不算数。要求贴出命令和原始输出，没跑过就拿不出来。'
  },
  {
    monster: 'fakefix',
    scene: 'AI 说「只改了一行」，结果你发现它悄悄动了三个不相关的文件。',
    cards: [
      ['summary', '让它总结一下对话'],
      ['remind', '提醒它下次小心'],
      ['role', '告诉它「你是严谨的工程师」'],
      ['diff', '要求给出 diff，逐条说明改了什么、为什么']
    ],
    answer: 3,
    explain: '看 diff 而不是看它的描述。逐条说明改动，多余的修改会当场暴露。'
  },

  // ---- 幻觉幽灵：补充题 ----
  {
    monster: 'hallucination',
    scene: '你让 AI 写一段带参考文献的综述，它列出的三篇论文格式漂亮，可一搜全都查不到。',
    cards: [
      ['retract', '每个说法配原文引句，找不到依据就撤回'],
      ['longer', '让它把参考文献列得更长'],
      ['tip', '告诉它「写得好有奖励」'],
      ['table', '让它把文献整理成表格']
    ],
    answer: 0,
    explain: '它会按「像文献的样子」造出文献。要求每个说法都配得上原文引句，配不上的就撤回，假引用自然留不下来。'
  },
  {
    monster: 'hallucination',
    scene: '你问 AI 某个框架的最新版本号，它斩钉截铁地报了一个，其实那是一年多前的旧版本。',
    cards: [
      ['sure', '追问一句「你确定吗？」'],
      ['role', '告诉它「你是这个框架的专家」'],
      ['fresh', '贴上官方发布页，让它只依据这份资料回答'],
      ['retry', '点「重新生成」再来一次']
    ],
    answer: 2,
    explain: '它的知识停在训练的那一刻，之后的事它不知道，却不一定会说。问最新的东西，就把最新资料直接给它。'
  },
  {
    monster: 'hallucination',
    scene: '你让 AI 按五条规则判断一张报销单是否合规，它直接回了「合规」，其实第三条就不满足。',
    cards: [
      ['louder', '强调「这很重要，别出错」'],
      ['steps', '先逐条对照规则写出判断，再给结论'],
      ['creative', '让它换个角度自由发挥'],
      ['praise', '先夸它一句再问一遍']
    ],
    answer: 1,
    explain: '直接要结论时，它容易凭感觉下判断。让它先逐条写出依据再下结论，哪一条不满足会在过程里暴露出来。'
  },

  // ---- 上下文溢出史莱姆：补充题 ----
  {
    monster: 'overflow',
    scene: '你在一条消息里提了八个要求，AI 认真做完前三个，后面五个提都没提。',
    cards: [
      ['louder', '全部用加粗和感叹号重写一遍'],
      ['longer', '让它把回答写长一点'],
      ['tip', '许诺「全做完有奖励」'],
      ['checklist', '把要求列成编号清单，让它逐条完成并回报']
    ],
    answer: 3,
    explain: '挤在一段话里的要求很容易被漏掉。列成编号清单并要求逐条回报，漏了哪一条一眼就能看出来。'
  },
  {
    monster: 'overflow',
    scene: '你把需求、参考文档、聊天记录混在一起贴过去，AI 把文档里的一句话当成了你的指令。',
    cards: [
      ['tags', '用标题或标签把指令、资料、示例分开'],
      ['repeat', '把真正的需求再复制粘贴三遍'],
      ['role', '告诉它「你是细心的助理」'],
      ['retry', '点「重新生成」碰碰运气']
    ],
    answer: 0,
    explain: '内容一多，它分不清哪句是要求、哪句是资料。用标签把各部分隔开，它才知道该执行哪一段、只参考哪一段。'
  },
  {
    monster: 'overflow',
    scene: '你先写了问题，再贴上两万字的文档。AI 读完长文后答非所问，像是忘了你问的是什么。',
    cards: [
      ['remind', '加一句「请记住我的问题」'],
      ['creative', '让它自由总结一下文档'],
      ['last', '长文档放前面，问题和要求放到最后'],
      ['sorry', '让它先为答错道歉']
    ],
    answer: 2,
    explain: '问题被两万字压在最上面，很容易被冲淡。把长材料放前面、问题放在末尾，它读完材料紧接着就看到要做什么。'
  },

  // ---- 「已修复」机器人：补充题 ----
  {
    monster: 'fakefix',
    scene: '你说「测试挂了，帮我修」。AI 把断言改成了永远成立，测试是绿了，bug 还在。',
    cards: [
      ['praise', '夸它「测试通过了，真棒」'],
      ['accept', '说清什么算完成：不许改测试，只能改实现'],
      ['newchat', '开一个新对话再让它修'],
      ['longer', '让它把修复说明写详细些']
    ],
    answer: 1,
    explain: '只说「让测试通过」，它会走最短的路。把验收标准讲清楚：哪些不许动、怎样才算真的修好，它才没有捷径可抄。'
  },
  {
    monster: 'fakefix',
    scene: 'AI 说报错解决了。你一看，它只是把异常包起来吞掉，错误不再提示，问题原封不动。',
    cards: [
      ['sorry', '让它承认错误并保证不再犯'],
      ['repeat', '把「要修好」再说三遍'],
      ['table', '让它用表格列出改动'],
      ['root', '先让它解释根本原因，确认后再动手改']
    ],
    answer: 3,
    explain: '让报错消失不等于解决问题。要求它先讲清根本原因，你确认说得通再改，它就没法只把症状盖住。'
  },
  {
    monster: 'fakefix',
    scene: 'AI 写完功能说「已完成」，你发现里面留着三处 TODO，还有一段写死的假数据。',
    cards: [
      ['review', '对照需求逐条自查，列出没做完和不确定的'],
      ['sure', '回一句「真的完成了吗？」'],
      ['tip', '许诺「真做完有奖励」'],
      ['creative', '让它顺便加点新功能']
    ],
    answer: 0,
    explain: '「已完成」是它的自我感觉。让它对照需求一条条核对，并主动列出没做完和不确定的地方，半成品就藏不住。'
  }
];
