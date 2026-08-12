import type { WikiEntry } from '~/types/wiki'
import { acquire, simpleEntry } from './shared'

export const expandedMaterialEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'glow-berry',
    prefab: 'wormlight',
    title: '发光浆果',
    english: 'Glow Berry',
    aliases: ['发光浆果', '发光果', 'Glow Berry'],
    category: '资源',
    stage: '洞穴中后期',
    summary: '发光浆果是洞穴蠕虫的发光诱饵，也是制作与补充鼹鼠帽的重要洞穴资源。',
    acquisition: [
      acquire('掉落', '击败洞穴蠕虫', '在洞穴深处辨认会移动的发光诱饵，并先清出安全走位空间。', '击败现身的洞穴蠕虫后拾取发光浆果。')
    ],
    uses: ['制作鼹鼠帽并为鼹鼠帽补充耐久。', '食用后能在一段时间内提供随身光亮，也可用于沃利的专属料理。'],
    tips: ['蠕虫通常不止一只，开战前准备护甲、武器和撤退照明。', '暂时不用时妥善保鲜，避免在返程途中腐坏。'],
    mistakes: ['把发光浆果和洞穴荧光花附近取得的小发光浆果混为一谈；两者不是同一物品。', '只盯着地面光点靠近，忽略它可能是洞穴蠕虫的诱饵。'],
    related: ['depth-worm', 'moggles', 'light-bulb']
  }),
  simpleEntry({
    slug: 'infused-moon-shard',
    prefab: 'moonglass_charged',
    title: '注能月亮碎片',
    english: 'Infused Moon Shard',
    aliases: ['注能月亮碎片', '充能月亮碎片', 'Infused Moon Shard'],
    category: '资源',
    stage: '月亮风暴与天体裂隙',
    summary: '注能月亮碎片是带有月亮能量的限时资源，用于天体主线装置与亮茄炸弹等后期内容。',
    acquisition: [
      acquire('采集', '开采月亮风暴中的充能玻璃', '推进天体任务并进入月亮风暴区域。', '找到雷击后形成的充能玻璃岩，用镐开采并及时带走碎片。'),
      acquire('掉落', '推进天体或月亮裂隙内容', '击败天体英雄后收集战利品。', '月亮裂隙开启后，也可在月亮冰雹期间清理附着在世界物体上的月亮玻璃来尝试取得。')
    ],
    uses: ['升级天体主线中的月亮虹吸器。', '制作亮茄炸弹等月亮阵营物品。'],
    tips: ['取得后尽快完成需要它的制作或装置升级，因为它会随时间失去能量。', '月亮风暴会影响视野与移动，先准备护目和补给再集中采集。'],
    mistakes: ['把它当成普通月亮碎片长期囤放；失去能量后会变成普通月亮碎片。', '把普通月亮碎片和注能月亮碎片视为同一配方材料；配方要求注能版本时不能混用。'],
    related: ['moon-shard', 'moon-storm', 'celestial-champion', 'brightshade-bomb', 'pure-brilliance']
  }),
  simpleEntry({
    slug: 'pure-horror',
    prefab: 'horrorfuel',
    title: '纯粹恐惧',
    english: 'Pure Horror',
    aliases: ['纯粹恐惧', '纯粹恐怖', 'Pure Horror'],
    category: '资源',
    stage: '暗影裂隙',
    summary: '纯粹恐惧是高浓度暗影资源，是绝望石装备和暗影制作站物品的关键材料。',
    acquisition: [
      acquire('掉落', '挑战高阶暗影生物', '暗影裂隙开启前可挑战梦魇疯猪取得。', '暗影裂隙开启后，击败融合暗影和墨荒等裂隙生物继续收集。')
    ],
    uses: ['制作绝望石头盔、绝望石盔甲和暗影制作台座。', '在暗影制作台座制作虚空装备与暗影收割者等物品。', '可为使用噩梦燃料充能的部分暗影物品补充能量。'],
    tips: ['先规划要做的暗影装备，再决定是否把它用于充能。', '裂隙生物带有高阶暗影威胁，准备位面防御与稳定恢复后再刷取。'],
    mistakes: ['把纯粹恐惧当成噩梦燃料的别名；它们是两个独立物品，配方材料不能随意互换。', '在没有明确制作目标时把稀缺材料全部用于日常充能。'],
    related: ['nightmare-fuel', 'dreadstone', 'dreadstone-helm', 'dreadstone-armour', 'shadow-reaper']
  }),
  simpleEntry({
    slug: 'dark-tatters',
    prefab: 'voidcloth',
    title: '暗影碎布',
    english: 'Dark Tatters',
    aliases: ['暗影碎布', '黑暗碎布', 'Dark Tatters'],
    category: '资源',
    stage: '暗影裂隙',
    summary: '暗影碎布是墨荒留下的裂隙材料，主要投入虚空防具和暗影武器。',
    acquisition: [
      acquire('掉落', '击败墨荒', '开启暗影裂隙并寻找从裂隙出现的墨荒。', '识破其伏击后完成战斗，拾取掉落的暗影碎布。')
    ],
    uses: ['制作虚空风帽、虚空长袍和暗影收割者。', '作为暗影制作台座中多种虚空装备的核心材料。'],
    tips: ['墨荒会伏击并快速接近，范围伤害或能反击的同伴有助于逼它现身。', '按防具与武器的优先级预留碎布，避免做完单件后材料断档。'],
    mistakes: ['把暗影碎布当成蜘蛛丝或普通布料；它只能从对应暗影裂隙敌人处取得。', '没有开启暗影裂隙就漫无目的寻找墨荒。'],
    related: ['shadow-rift', 'void-cowl', 'void-robe', 'shadow-reaper', 'pure-horror']
  }),
  simpleEntry({
    slug: 'jet-feather',
    prefab: 'feather_crow',
    title: '黑色羽毛',
    english: 'Jet Feather',
    aliases: ['黑色羽毛', '乌鸦羽毛', 'Jet Feather'],
    category: '资源',
    stage: '第一周',
    summary: '黑色羽毛主要来自乌鸦，是催眠吹箭、羽毛帽和鞍具脱卸器使用的基础鸟类材料。',
    acquisition: [
      acquire('掉落', '捕捉或猎取乌鸦', '在地面放置捕鸟器，可用种子提高引鸟效率。', '处理捕获的乌鸦，或用远程手段猎取落地乌鸦，反复收集羽毛。')
    ],
    uses: ['制作催眠吹箭和鞍具脱卸器。', '与红色羽毛等材料一起制作羽毛帽。'],
    tips: ['捕鸟器比追着落地鸟近战更稳定，基地附近留一处不受干扰的诱捕区。', '需要批量制作吹箭时同步储备芦苇和蜂刺。'],
    mistakes: ['认为每只乌鸦都一定给羽毛；处理鸟类也可能得到小肉。', '为取羽毛清空鸟笼中的长期换蛋用鸟。'],
    related: ['birdcage', 'cut-reeds', 'stinger']
  }),
  simpleEntry({
    slug: 'azure-feather',
    prefab: 'feather_robin_winter',
    title: '蓝色羽毛',
    english: 'Azure Feather',
    aliases: ['蓝色羽毛', '雪雀羽毛', 'Azure Feather'],
    category: '资源',
    stage: '冬季',
    summary: '蓝色羽毛主要来自冬季出现的雪雀，是制作攻击吹箭的季节性材料。',
    acquisition: [
      acquire('掉落', '冬季捕捉或猎取雪雀', '冬季在地面布置捕鸟器，并用种子吸引雪雀。', '处理捕获的雪雀，或用远程手段猎取，持续收集蓝色羽毛。')
    ],
    uses: ['与芦苇和犬牙一起制作攻击吹箭。'],
    tips: ['它的常规鸟类来源具有季节性，冬季结束前为后续吹箭预留库存。', '批量制作攻击吹箭时同步准备芦苇和犬牙。'],
    mistakes: ['错过冬季后才开始依赖雪雀来源收集。', '把名称中的“蓝色”理解成蓝宝石材料；它是鸟类羽毛。'],
    related: ['birdcage', 'cut-reeds', 'hound-tooth']
  }),
  simpleEntry({
    slug: 'crimson-feather',
    prefab: 'feather_robin',
    title: '红色羽毛',
    english: 'Crimson Feather',
    aliases: ['红色羽毛', '红雀羽毛', 'Crimson Feather'],
    category: '资源',
    stage: '前期非冬季',
    summary: '红色羽毛主要来自红雀，是火焰吹箭和羽毛帽所需的鸟类材料。',
    acquisition: [
      acquire('掉落', '捕捉或猎取红雀', '在红雀活动的季节放置捕鸟器，并用种子吸引。', '处理捕获的红雀，或用远程手段猎取落地红雀，收集红色羽毛。')
    ],
    uses: ['制作火焰吹箭。', '与黑色羽毛等材料一起制作羽毛帽。'],
    tips: ['冬季红雀来源会受限，入冬前留出计划用量。', '制作火焰吹箭前同时储备芦苇和木炭。'],
    mistakes: ['把红雀当作全年都同样容易获得的鸟类来源。', '在基地可燃物附近试射火焰吹箭。'],
    related: ['birdcage', 'cut-reeds', 'charcoal']
  }),
  simpleEntry({
    slug: 'saffron-feather',
    prefab: 'feather_canary',
    title: '黄色羽毛',
    english: 'Saffron Feather',
    aliases: ['黄色羽毛', '金丝雀羽毛', 'Saffron Feather'],
    category: '资源',
    stage: '前中期捕鸟',
    summary: '黄色羽毛主要来自金丝雀，是制作电击吹箭所需的鸟类材料。',
    acquisition: [
      acquire('掉落', '在友好稻草人附近捕捉金丝雀', '建造并放置友好稻草人；它附近落地的乌鸦会由金丝雀替代。', '在稻草人附近放置捕鸟器并用种子引鸟。', '处理捕获的金丝雀，或用安全的远程手段猎取落地金丝雀，反复收集黄色羽毛。')
    ],
    uses: ['与芦苇和金块一起制作电击吹箭。'],
    tips: ['把友好稻草人与捕鸟器布置在安全空地，形成可反复使用的金丝雀来源。', '洞穴中的中毒金丝雀也与黄色羽毛有关，但流程风险更高，不适合作为前期稳定获取路线。', '准备批量制作电击吹箭时，同步储备芦苇和金块。'],
    mistakes: ['把黄色羽毛与蓝色羽毛混用；电击吹箭要求黄色羽毛，攻击吹箭要求蓝色羽毛。', '没有放置友好稻草人就在普通地面等待金丝雀，忽略了稳定替换乌鸦的机制。', '认为每只金丝雀都一定给羽毛；处理鸟类也可能得到小肉。'],
    related: ['birdcage', 'cut-reeds', 'gold-nugget']
  }),
  simpleEntry({
    slug: 'steel-wool',
    prefab: 'steelwool',
    title: '钢羊毛',
    english: 'Steel Wool',
    aliases: ['钢羊毛', '钢丝绒', 'Steel Wool'],
    category: '资源',
    stage: '前中期追踪狩猎',
    summary: '钢羊毛是钢羊留下的坚韧材料，主要用于刷子和战争牛鞍。',
    acquisition: [
      acquire('掉落', '追踪并击败钢羊', '沿可疑的土堆连续追踪脚印，途中准备远程攻击或盟友协助。', '若终点出现钢羊，避开其黏液控制并击败它，拾取钢羊毛。')
    ],
    uses: ['制作刷子，用于驯牛管理。', '制作战争牛鞍。', '在岩石巢穴领养小钢羊。'],
    tips: ['钢羊的远程黏液会限制行动，单人近战前准备坐骑、远程武器或可协战生物。', '追踪终点不一定是钢羊，需要多次狩猎路线才能稳定积累。'],
    mistakes: ['把钢羊毛当成可用剃刀从普通皮弗娄牛获得的牛毛。', '没有控制手段就正面追击钢羊，反复被黏液定住。'],
    related: ['koalefant', 'walrus-tusk', 'living-log', 'gold-nugget']
  }),
  simpleEntry({
    slug: 'volt-goat-horn',
    prefab: 'lightninggoathorn',
    title: '伏特羊角',
    english: 'Volt Goat Horn',
    aliases: ['伏特羊角', '电羊角', 'Volt Goat Horn'],
    category: '资源',
    stage: '沙漠探索',
    summary: '伏特羊角是伏特羊的稀有战利品，用于晨星锤、天气风向标和沃利专属料理。',
    acquisition: [
      acquire('掉落', '狩猎伏特羊', '在沙漠找到伏特羊群，先把目标与羊群活动区域分开。', '击败伏特羊后检查战利品；羊角不是每次都能取得，需要保留羊群继续繁殖。')
    ],
    uses: ['制作晨星锤和天气风向标。', '作为沃利专属伏特羊肉冻的关键食材。'],
    tips: ['至少保留一只伏特羊维持羊群来源，不要为刷角灭群。', '带电伏特羊近战有额外风险；只取羊角时不必刻意让它带电。'],
    mistakes: ['把羊角掉落和带电状态绑定；带电状态主要关联电羊奶，并会增加战斗危险。', '一次清空整群，导致后续羊角与电羊奶来源中断。'],
    related: ['weather-pain', 'electric-milk', 'electrical-doodad']
  })
]
