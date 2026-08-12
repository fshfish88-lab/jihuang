import type { WikiEntry } from '~/types/wiki'
import { acquire, simpleEntry } from './shared'

export const expandedMaterialEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'eel',
    prefab: 'pondeel',
    title: '鳗鱼',
    english: 'Live Eel',
    aliases: ['鳗鱼', '活鳗鱼', '洞穴鳗鱼', 'Live Eel'],
    category: '资源',
    stage: '洞穴探索',
    summary: '鳗鱼是洞穴池塘中的鱼类食材，是制作鳗鱼寿司的必需原料。',
    acquisition: [acquire('采集', '在洞穴池塘钓取', '携带钓竿进入洞穴，找到遗迹附近会产出鳗鱼的池塘。', '确认周围光照与敌情安全后垂钓，及时把鳗鱼带回保鲜。')],
    uses: ['与苔藓或海带叶制作鳗鱼寿司，也可提供鱼度和肉度。'],
    tips: ['洞穴池塘周围先布置稳定照明，再连续垂钓。'],
    mistakes: ['把普通淡水鱼当成鳗鱼；鳗鱼寿司要求鳗鱼预制体。'],
    related: ['unagi', 'kelp-fronds', 'freshwater-fish']
  }),
  simpleEntry({
    slug: 'banana',
    prefab: 'cave_banana',
    title: '香蕉',
    english: 'Banana',
    aliases: ['香蕉', '洞穴香蕉', 'Cave Banana', 'Banana'],
    category: '资源',
    stage: '洞穴探索',
    summary: '香蕉来自洞穴香蕉树，是香蕉冰棒和冰香蕉鸡尾酒的核心水果。',
    acquisition: [acquire('采集', '采摘洞穴香蕉树', '在洞穴寻找香蕉树并清理附近威胁。', '果实成熟后直接采摘，带回基地冷藏。')],
    uses: ['制作香蕉冰棒、冰香蕉鸡尾酒和香蕉奶昔。'],
    tips: ['香蕉会腐坏，探索时按计划采摘并尽快烹饪。'],
    mistakes: ['制作香蕉冰棒时漏放树枝；制作冰香蕉鸡尾酒时又误放树枝而变成香蕉冰棒。'],
    related: ['banana-pop', 'frozen-banana-daiquiri', 'ice']
  }),
  simpleEntry({
    slug: 'asparagus',
    prefab: 'asparagus',
    title: '芦笋',
    english: 'Asparagus',
    aliases: ['芦笋', 'Asparagus'],
    category: '资源',
    stage: '农耕后',
    summary: '芦笋是可种植蔬菜，能用于芦笋汤和多种农耕料理。',
    acquisition: [acquire('采集', '耕种芦笋', '种植普通种子取得第一批芦笋。', '把成熟芦笋喂给鸟笼中的鸟换取专属种子，再进行定向种植。')],
    uses: ['制作芦笋汤，也可作为蔬菜鸡尾酒等料理的蔬菜度。'],
    tips: ['想稳定做芦笋汤时，至少保留一批芦笋种子循环。'],
    mistakes: ['只放一根芦笋却没有把总蔬菜度补到大于 2。'],
    related: ['asparagus-soup', 'vegetable-stinger', 'birdcage']
  }),
  simpleEntry({
    slug: 'wobster',
    prefab: 'wobster_sheller_land',
    title: '龙虾',
    english: 'Wobster',
    aliases: ['龙虾', '活龙虾', '沃布斯特龙虾', 'Wobster'],
    category: '资源',
    stage: '航海后',
    summary: '龙虾是海上捕获的活体鱼类食材，可制作龙虾汤和龙虾正餐。',
    acquisition: [acquire('采集', '用海钓竿钓取活龙虾', '黄昏或夜间乘船寻找龙虾窝附近出现的龙虾。', '使用海钓竿与鱼饵把它钓起，保持活体形态后直接放入烹饪锅。')],
    uses: ['配冰制作龙虾汤；配黄油制作龙虾正餐。'],
    tips: ['这两道料理要求可入锅的活龙虾，捕获后优先安排烹饪。'],
    mistakes: ['把死亡或已加工的龙虾形态当作可直接入锅的活龙虾。'],
    related: ['lobster-bisque', 'lobster-dinner', 'butter', 'ice']
  }),
  simpleEntry({
    slug: 'leafy-meat',
    prefab: 'plantmeat',
    title: '叶肉',
    english: 'Leafy Meat',
    aliases: ['叶肉', '植物肉', 'Leafy Meat'],
    category: '资源',
    stage: '中期探索',
    summary: '叶肉是食人花成熟后产出的特殊肉类食材，可制作高饱食或高理智料理。',
    acquisition: [acquire('采集', '从食人花采收', '找到食人花并处理周围眼球草，避免重要物品被吞。', '在叶肉成熟时采收；若要长期利用，保留并安全安置食人花球茎。')],
    uses: ['制作叶肉糕、牛肉绿叶菜和果冻沙拉。'],
    tips: ['把食人花种在眼球草难以生成的地面附近，方便安全采收。'],
    mistakes: ['在基地物资区放任眼球草扩张，导致地面物品被吞食。'],
    related: ['leafy-meatloaf', 'beefy-greens', 'jelly-salad']
  }),
  simpleEntry({
    slug: 'fig',
    prefab: 'fig',
    title: '无花果',
    english: 'Fig',
    aliases: ['无花果', 'Fig'],
    category: '资源',
    stage: '航海后',
    summary: '无花果来自水中木大树树冠垂下的苔藓藤条，是多种专属锅料理的水果食材。',
    acquisition: [acquire('采集', '采摘苔藓藤条', '乘船前往水中木生态群系，寻找大树干或普通大树干树冠垂下的苔藓藤条。', '靠船采摘成熟无花果，并留意采摘动作会惊动附近海黾巢。')],
    uses: ['制作无花果意面、无花果烤肉串和无花果酿象鼻等料理。'],
    tips: ['在地图标记带苔藓藤条的大树干；采摘后约 2.5 天会重新结果。'],
    mistakes: ['把无花果只当普通填充水果，忽略它能锁定多种专属料理。'],
    related: ['kelp-fronds']
  }),
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
  }),
  simpleEntry({
    slug: 'berry-bush',
    prefab: 'dug_berrybush',
    title: '浆果丛',
    english: 'Berry Bush',
    aliases: ['浆果丛', '挖起的浆果丛', 'Dug Berry Bush'],
    category: '资源',
    stage: '前期移植',
    summary: '浆果丛可用铲子挖起并移植，是浆果来源，也是灌木丛帽的制作材料。',
    acquisition: [acquire('采集', '挖取浆果丛', '制作并装备铲子，找到普通浆果丛。', '挖起后拾取浆果丛；重新种下时需要施肥才会恢复结果。')],
    facts: [{ label: '预制体', value: 'dug_berrybush' }],
    uses: ['移植到基地建立浆果来源。', '制作灌木丛帽。'],
    tips: ['先采摘再挖取，避免浪费当前一轮浆果。'],
    mistakes: ['移植后不施肥就等待结果；枯萎的移植浆果丛需要先施肥。'],
    related: ['berries', 'shovel', 'bush-hat']
  }),
  simpleEntry({
    slug: 'petals',
    prefab: 'petals',
    title: '花瓣',
    english: 'Petals',
    aliases: ['花瓣', 'Petals'],
    category: '资源',
    stage: '第 1 天',
    summary: '花瓣来自采摘花朵，是花环和早期少量理智管理的基础材料。',
    acquisition: [acquire('采集', '采摘花朵', '在草地等地形寻找花朵。', '直接采摘获得花瓣；需要大量花瓣时保留部分花朵供蝴蝶活动。')],
    facts: [{ label: '主要配方', value: '花环' }],
    uses: ['制作花环。', '可作为少量应急食物或腐烂物来源。'],
    tips: ['开局沿路收集即可，不必为花环一次性清空基地周围所有花朵。'],
    mistakes: ['把花瓣当作高效食物长期依赖，忽略它更适合制作和应急。'],
    related: ['garland', 'butterfly-wings']
  }),
  simpleEntry({
    slug: 'bunny-puff',
    prefab: 'manrabbit_tail',
    title: '兔绒',
    english: 'Bunny Puff',
    aliases: ['兔绒', '兔毛球', 'Bunny Puff'],
    category: '资源',
    stage: '洞穴中期',
    summary: '兔绒是兔人的掉落材料，主要用于把草席卷升级为可重复使用的毛皮铺盖。',
    acquisition: [acquire('掉落', '击败兔人', '进入洞穴并找到兔人村落，携带肉类时不要接近兔人。', '安全处理兔人后拾取概率掉落的兔绒。')],
    facts: [{ label: '主要配方', value: '毛皮铺盖' }],
    uses: ['制作毛皮铺盖。'],
    tips: ['可利用胡萝卜结交兔人并让其互相协战，降低直接围攻风险。'],
    mistakes: ['背包中带肉靠近兔人，导致原本中立的兔人集体敌对。'],
    related: ['bunnyman', 'fur-roll', 'straw-roll']
  }),
  simpleEntry({
    slug: 'tentacle-spots',
    prefab: 'tentaclespots',
    title: '触手皮',
    english: 'Tentacle Spots',
    aliases: ['触手皮', '触手斑点', 'Tentacle Spots'],
    category: '资源',
    stage: '沼泽探索',
    summary: '触手皮是沼泽触手的稀有掉落物，可用于羽毛帽等装备。',
    acquisition: [acquire('掉落', '击败触手', '在沼泽通过地面波纹判断触手位置，准备护甲并保持走位空间。', '击败触手后检查掉落物，触手皮并非每次都会出现。')],
    facts: [{ label: '主要配方', value: '羽毛帽' }],
    uses: ['制作羽毛帽。'],
    tips: ['可利用鱼人、蜘蛛等生物与触手混战后再安全拾取。'],
    mistakes: ['为捡取掉落物直接冲进未探明的沼泽区域，遭到另一根触手伏击。'],
    related: ['feather-hat', 'cut-reeds']
  })
]
