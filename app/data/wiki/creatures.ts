import type { WikiEntry } from '~/types/wiki'
import { acquire, noCraft, simpleEntry } from './shared'

export const creatureEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'beefalo', title: '皮弗娄牛', english: 'Beefalo', aliases: ['牛', '皮弗娄牛'], category: '生物', stage: '探索期',
    summary: '草原群居生物，提供粪肥、牛毛和牛角；发情期会主动攻击。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('世界生成', '寻找牛群', '在草原群系寻找成群皮弗娄牛。', '地图上标记牛群位置。', '夜间刮毛，击杀取肉和牛角时保留繁殖数量。')],
    facts: [{ label: '生命', value: '1000' }, { label: '伤害', value: '34' }], uses: ['牛毛、粪肥、牛角、大肉和骑乘。']
  }),
  simpleEntry({
    slug: 'pigman', title: '猪人', english: 'Pigman', aliases: ['猪人', '二师兄'], category: '生物', stage: '探索期',
    summary: '可用肉类招募的中立生物，能协助砍树和战斗。',
    crafting: noCraft('生物不可制作；可由猪屋刷新。'),
    acquisition: [acquire('世界生成', '猪屋与猪王村', '寻找猪屋或猪王村。', '白天猪人会离开猪屋。', '喂肉可短暂招募；喂 4 块怪物肉会变疯猪。')],
    facts: [{ label: '生命', value: '250' }, { label: '伤害', value: '33' }], uses: ['劳动力、猪皮和大肉来源。']
  }),
  simpleEntry({
    slug: 'spider', title: '蜘蛛', english: 'Spider', aliases: ['蜘蛛', '小蜘蛛'], category: '生物', stage: '第一周',
    summary: '常见敌对生物，是怪物肉、蜘蛛丝和蜘蛛腺的稳定来源。',
    crafting: noCraft('生物不可制作；从蜘蛛巢生成。'),
    acquisition: [acquire('世界生成', '蜘蛛巢', '黄昏或夜间靠近蜘蛛巢会刷出蜘蛛。', '用陷阱或单只引出处理。', '三级蜘蛛巢拆除后会掉落可移植的蜘蛛卵。')],
    facts: [{ label: '生命', value: '100' }, { label: '伤害', value: '20' }], uses: ['怪物肉、蜘蛛丝和蜘蛛腺。']
  }),
  simpleEntry({
    slug: 'hound', title: '猎犬', english: 'Hound', aliases: ['狗', '猎犬', '狗群'], category: '生物', stage: '周期事件',
    summary: '周期性袭击玩家的敌对生物，后期数量增加并出现元素猎犬。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('世界生成', '猎犬袭击与猎犬丘', '听到角色预警后离开易燃基地。', '穿好护甲并利用牛群、猪人或陷阱处理。', '击杀后收集犬牙。')],
    facts: [{ label: '生命', value: '150' }, { label: '伤害', value: '20' }], uses: ['犬牙来源和周期战斗事件。']
  }),
  simpleEntry({
    slug: 'frog', title: '青蛙', english: 'Frog', aliases: ['青蛙', '蛤蟆'], category: '生物', stage: '池塘/春季',
    summary: '池塘附近的敌对生物，攻击会打落玩家物品；春季可能发生青蛙雨。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('世界生成', '池塘与青蛙雨', '白天池塘会生成青蛙。', '穿甲逐只引开处理；青蛙雨时远离基地并利用其他生物群。')],
    facts: [{ label: '生命', value: '100' }, { label: '伤害', value: '10' }], uses: ['蛙腿来源。']
  }),
  simpleEntry({
    slug: 'rabbit', title: '兔子', english: 'Rabbit', aliases: ['兔子', '小兔子'], category: '生物', stage: '前期',
    summary: '草原兔洞生成的小型生物，可用陷阱无伤捕获。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('采集', '陷阱捕兔', '在草原找到兔洞。', '把陷阱放在兔洞正上方或兔子逃跑路线。', '捕获后可直接处理或活体携带。')],
    facts: [{ label: '生命', value: '25' }], uses: ['小肉和胡须相关资源。']
  }),
  simpleEntry({
    slug: 'moleworm', prefab: 'mole', title: '鼹鼠', english: 'Moleworm', aliases: ['鼹鼠', '地鼠'], category: '生物', stage: '探索期',
    summary: '会偷取地面矿物的小型生物，可用锤子击晕后活捉。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('采集', '用矿物引诱并活捉', '在落叶林、岩石地等区域寻找鼹鼠洞。', '把燧石或石头放在地上引它靠近。', '鼹鼠露出地面时用锤子击晕并捡起。')],
    facts: [{ label: '生命', value: '30' }], uses: ['雨帽、鳄梨酱和鼹鼠农场。']
  }),
  simpleEntry({
    slug: 'clockwork-knight', prefab: 'knight', title: '发条骑士', english: 'Clockwork Knight', aliases: ['发条骑士', '机械马'], category: '生物', stage: '探索期',
    summary: '守护棋盘区的发条生物，是前期齿轮来源之一。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('世界生成', '棋盘地形与特定遗迹', '在地表棋盘区或雕像区域寻找。', '穿甲靠近，观察抬头攻击前摇后走位。', '击杀后收集齿轮。')],
    facts: [{ label: '生命', value: '300' }, { label: '伤害', value: '40' }], uses: ['齿轮来源。']
  }),
  simpleEntry({
    slug: 'pig-king', prefab: 'pigking', title: '猪王', english: 'Pig King', aliases: ['猪王', '换金子'], category: '生物', stage: '探索期',
    summary: '不可攻击的重要交易资源点，可用特定肉类和玩具换取金块。',
    crafting: noCraft('世界唯一资源点，不可制作。'),
    acquisition: [acquire('世界生成', '寻找猪王村', '在落叶林群系寻找大片桦栗树、猪屋和猪王铺装区域。', '在地图上标记。', '白天把可交易肉类或墓地玩具交给猪王换金。')],
    facts: [{ label: '交易', value: '肉类/玩具 → 金块' }], uses: ['可再生金块来源。']
  }),
  simpleEntry({
    slug: 'koalefant', prefab: 'koalefant_summer', title: '考拉象', english: 'Koalefant', aliases: ['考拉象', '象'], category: '生物', stage: '探索期',
    summary: '沿可疑土堆追踪出现的大型中立生物，提供大肉和象鼻。',
    crafting: noCraft('生物不可制作。'),
    acquisition: [acquire('世界生成', '追踪可疑土堆', '调查可疑土堆并沿脚印方向继续寻找。', '连续调查终点可能出现考拉象或其他猎物。', '用远程攻击或食物逼近后拉住仇恨。')],
    facts: [{ label: '生命', value: '1000' }, { label: '伤害', value: '50' }], uses: ['大肉、象鼻和保暖背心。']
  })
]
