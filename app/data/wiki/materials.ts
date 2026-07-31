import type { WikiEntry } from '~/types/wiki'
import { acquire, amount, craft, simpleEntry } from './shared'

interface ResourceSeed {
  slug: string
  prefab?: string
  title: string
  english: string
  stage: string
  where: string
  how: string
  use: string
  aliases?: string[]
}

const gathered: ResourceSeed[] = [
  { slug: 'cut-grass', prefab: 'cutgrass', title: '草', english: 'Cut Grass', stage: '第 1 天', where: '草原与多数地表群系', how: '采集草簇获得；移植草簇后需要用粪肥、腐烂物等施肥才会重新生长。', use: '火把、绳子、陷阱和大量基础物品。' },
  { slug: 'twigs', title: '树枝', english: 'Twigs', stage: '第 1 天', where: '树苗、尖刺灌木与风滚草', how: '采集树苗最稳定；树苗可以铲起移植，移植后无需施肥。', use: '工具、武器、建筑和大量锅料理填充。' },
  { slug: 'flint', title: '燧石', english: 'Flint', stage: '第 1 天', where: '地表散落、矿石和风滚草', how: '开局优先捡地面燧石；随后可挖掘岩石或在沙漠开风滚草补充。', use: '斧头、镐、长矛和多种基础工具。' },
  { slug: 'log', title: '木头', english: 'Log', stage: '第 1 天', where: '常青树、桦栗树与其他可砍伐树木', how: '装备斧头砍树；连续砍伐前准备备用斧，并注意树精守卫。', use: '营火、木板、木甲、科技建筑和燃料。' },
  { slug: 'rocks', title: '石头', english: 'Rocks', stage: '第 1 天', where: '矿区、石笋、地震掉落', how: '用镐开采普通岩石和矿脉；洞穴地震也会掉落少量石头。', use: '石砖、火坑、暖石和多种建筑。' },
  { slug: 'gold-nugget', prefab: 'goldnugget', title: '金块', english: 'Gold Nugget', aliases: ['金子', '金块', 'Gold'], stage: '第 1—3 天', where: '含金矿脉、猪王交易与洞穴', how: '前期挖带金纹的矿石；找到猪王后可用肉类玩具等可交易物稳定换金。', use: '科学机器、电器元件、工具和魔法科技。' },
  { slug: 'nitre', title: '硝石', english: 'Nitre', stage: '前期', where: '普通岩石与石化树', how: '用镐开采岩石时伴随石头掉落；大量采矿时顺手储存。', use: '强心针、火药、恒温营火等。' },
  { slug: 'charcoal', title: '木炭', english: 'Charcoal', stage: '第一周', where: '燃烧后的树木', how: '用火把点燃成片树木，火熄灭后用斧砍伐焦木；远离基地和可燃资源操作。', use: '烹饪锅、晾肉架、火药和燃料。' },
  { slug: 'cut-reeds', prefab: 'cutreeds', title: '芦苇', english: 'Cut Reeds', stage: '第一周', where: '沼泽芦苇丛', how: '进入沼泽采集，观察触手攻击和鱼人仇恨；不要停在触手旁整理背包。', use: '莎草纸、吹箭和鸟笼。' },
  { slug: 'silk', title: '蜘蛛丝', english: 'Silk', stage: '第一周', where: '蜘蛛、蜘蛛巢和风滚草', how: '击杀蜘蛛或拆除三级蜘蛛巢；用陷阱处理蜘蛛能显著降低战斗风险。', use: '高礼帽、捕虫网、帐篷和多种远程物品。' },
  { slug: 'spider-gland', prefab: 'spidergland', title: '蜘蛛腺', english: 'Spider Gland', stage: '第一周', where: '蜘蛛掉落', how: '击杀普通蜘蛛、蜘蛛战士等概率掉落；可用陷阱安全收集。', use: '治疗药膏、告密的心和直接应急回血。' },
  { slug: 'pig-skin', prefab: 'pigskin', title: '猪皮', english: 'Pig Skin', stage: '第一周', where: '猪人、猪头柱和猪屋', how: '击杀猪人、敲毁猪头柱或拆猪屋获得；喂猪人四块怪物肉可令其变疯猪并固定掉落两块猪皮。', use: '橄榄球头盔、火腿棒、雨伞和猪屋。' },
  { slug: 'beefalo-wool', prefab: 'beefalowool', title: '牛毛', english: 'Beefalo Wool', stage: '冬季前', where: '皮弗娄牛群', how: '夜间牛睡着后用剃刀刮毛；也会从击杀的牛身上掉落。发情期靠近牛群有危险。', use: '牛帽、冬帽、牛鞍和燃料。' },
  { slug: 'beefalo-horn', prefab: 'horn', title: '牛角', english: 'Beefalo Horn', stage: '冬季前', where: '皮弗娄牛掉落', how: '击杀皮弗娄牛有概率掉落；不要为了一个牛角清空整群，保留繁殖数量。', use: '牛帽和召集牛群。' },
  { slug: 'gears', title: '齿轮', english: 'Gears', stage: '第一周', where: '发条生物、坟墓与特定世界资源', how: '击杀发条骑士、主教或战车最稳定；前期齿轮有限时优先制作冰箱。', use: '冰箱、雪球发射器、WX-78 升级相关内容。' },
  { slug: 'ice', title: '冰', english: 'Ice', stage: '冬季', where: '冬季迷你冰川与冰矿', how: '冬季用镐开采迷你冰川；冰放入冰箱不会腐烂，可作为多种料理的低成本填充。', use: '锅料理、雪球发射器和降温。' },
  { slug: 'light-bulb', prefab: 'lightbulb', title: '荧光果', english: 'Light Bulb', aliases: ['灯泡', '荧光果'], stage: '洞穴准备', where: '洞穴荧光花', how: '洞穴入口附近即可找到，直接采集；携带回地表前规划保鲜和提灯充能。', use: '提灯、矿工帽和蘑菇灯燃料。' },
  { slug: 'nightmare-fuel', prefab: 'nightmarefuel', title: '噩梦燃料', english: 'Nightmare Fuel', stage: '中期', where: '暗影生物、恶魔花瓣与遗迹', how: '低理智时击杀爬行梦魇等暗影生物；也可用四个恶魔花瓣精炼。', use: '暗影剑、暗夜甲、魔法物品和遗迹科技。' },
  { slug: 'living-log', prefab: 'livinglog', title: '活木', english: 'Living Log', stage: '中期', where: '树精守卫、完全正常的树和特定生物', how: '击杀树精守卫最常见；砍伐完全正常的树也能获得。', use: '暗影剑、魔法科技和后期装备。' },
  { slug: 'marble', title: '大理石', english: 'Marble', stage: '前中期', where: '大理石雕像与大理石灌木', how: '用镐开采地图生成的大理石资源；精炼大理石豆种植可建立可再生来源。', use: '大理石甲、棋盘地皮和雕塑。' },
  { slug: 'moon-rock', prefab: 'moonrocknugget', title: '月岩', english: 'Moon Rock', stage: '中后期', where: '月岩矿、月石事件与月岛', how: '开采月岩矿或完成月石相关事件；月岛可提供稳定来源。', use: '月石墙、月眼和天体路线。' },
  { slug: 'moon-shard', prefab: 'moonglass', title: '月亮碎片', english: 'Moon Shard', stage: '月岛', where: '月岛月玻璃矿', how: '用镐开采月岛上的月玻璃矿；开采时注意锋利地形与敌对生物。', use: '月岛工具、玻璃刀和天体科技。' },
  { slug: 'thulecite-fragments', prefab: 'thulecite_pieces', title: '铥矿碎片', english: 'Thulecite Fragments', stage: '遗迹', where: '遗迹雕像、废墟和地震', how: '在远古遗迹开采雕像或捡取散落碎片；地震也可能掉落。', use: '精炼铥矿和远古科技。' },
  { slug: 'thulecite', title: '铥矿', english: 'Thulecite', stage: '遗迹', where: '遗迹与远古伪科学站', how: '在远古伪科学站附近用六个铥矿碎片精炼，或开采部分遗迹资源。', use: '铥矿皇冠、铥矿甲和远古装备。' },
  { slug: 'hound-tooth', prefab: 'houndstooth', title: '犬牙', english: "Hound's Tooth", stage: '前中期', where: '猎犬与猎犬丘', how: '击杀猎犬有概率掉落；猎犬来袭是最稳定的长期来源。', use: '缝纫包、犬牙陷阱和背心。' },
  { slug: 'walrus-tusk', prefab: 'walrus_tusk', title: '海象牙', english: 'Walrus Tusk', stage: '冬季', where: '海象营地', how: '冬季击杀海象爸爸有概率掉落；营地会定期刷新，可反复挑战。', use: '步行手杖和刷子。' },
  { slug: 'blue-gem', prefab: 'bluegem', title: '蓝宝石', english: 'Blue Gem', stage: '冬季/洞穴', where: '蓝猎犬、坟墓与遗迹', how: '冬季击杀蓝猎犬较稳定；也可挖坟或探索遗迹。', use: '冰魔杖、寒冰护符和紫宝石。' },
  { slug: 'red-gem', prefab: 'redgem', title: '红宝石', english: 'Red Gem', stage: '夏季/洞穴', where: '红猎犬、坟墓与遗迹', how: '夏季击杀红猎犬较稳定；也可挖坟或探索遗迹。', use: '火魔杖、生命护符和紫宝石。' },
  { slug: 'purple-gem', prefab: 'purplegem', title: '紫宝石', english: 'Purple Gem', stage: '中后期', where: '精炼、发条主教与遗迹', how: '在魔法科技旁用一颗红宝石和一颗蓝宝石合成，也可能从特定敌人和宝箱获得。', use: '暗影操控器、传送相关物品和魔法装备。' },
  { slug: 'manure', prefab: 'poop', title: '粪肥', english: 'Manure', stage: '第一周', where: '皮弗娄牛、猪人与穴居猴', how: '牛群附近定期生成；给猪人喂蔬菜也会产出。', use: '给移植作物施肥、农场肥料和燃料。' },
  { slug: 'ash', title: '灰烬', english: 'Ashes', stage: '前期', where: '燃烧物品后的残留', how: '把可燃物放在安全空地后点燃，燃尽会留下灰烬；雨水会使地面灰烬很快消失。', use: '治疗药膏和部分特殊制作。' },
  { slug: 'rot', prefab: 'spoiled_food', title: '腐烂物', english: 'Rot', stage: '第一周', where: '食物完全腐败', how: '让浆果、花瓣等低价值食物腐败；放在地上或普通箱子里会比冰箱更快。', use: '施肥、制作强心针和燃料。' },
  { slug: 'seeds', title: '种子', english: 'Seeds', stage: '第 1 天', where: '鸟类掉落与作物', how: '地表鸟会随机留下普通种子；成熟农作物可通过喂鸟获得对应作物种子。', use: '农耕、喂鸟和部分料理。' },
  { slug: 'berries', title: '浆果', english: 'Berries', stage: '第 1 天', where: '浆果丛', how: '直接采摘；移植浆果丛后必须施肥才能继续结果。', use: '前期食物和大量锅料理填充。' },
  { slug: 'carrot', title: '胡萝卜', english: 'Carrot', stage: '第 1 天', where: '地表生成与农耕', how: '开局可直接从地面拔取；长期来源依靠耕种和巨型作物循环。', use: '直接食用、喂猪和蔬菜料理。' },
  { slug: 'monster-meat', prefab: 'monstermeat', title: '怪物肉', english: 'Monster Meat', stage: '第一周', where: '蜘蛛、猎犬和多种怪物', how: '击杀蜘蛛最稳定；单块可用于多数料理，但锅中怪物度达到 2 通常会变成怪物千层饼。', use: '肉丸、换蛋、喂猪和多种料理。' },
  { slug: 'meat', title: '大肉', english: 'Meat', stage: '第一周', where: '大型生物掉落', how: '击杀皮弗娄牛、猪人、高脚鸟等大型生物获得；先准备护甲与撤退路线。', use: '火腿棒、肉汤、晾晒和高饱食料理。' },
  { slug: 'morsel', prefab: 'smallmeat', title: '小肉', english: 'Morsel', stage: '第一周', where: '兔子、鼹鼠、鸟类等小型生物', how: '使用陷阱或合适武器捕猎；兔子陷阱是前期安全来源。', use: '肉丸、蜜汁卤肉和多种基础料理。' },
  { slug: 'egg', prefab: 'bird_egg', title: '鸟蛋', english: 'Egg', aliases: ['蛋', '鸡蛋', '鸟蛋'], stage: '第一周', where: '鸟笼换取', how: '把肉类喂给鸟笼中的鸟即可换蛋；怪物肉换蛋能把危险食材转成稳定料理材料。', use: '波兰水饺、培根煎蛋和多种料理。' },
  { slug: 'honey', title: '蜂蜜', english: 'Honey', stage: '基地稳定后', where: '蜂箱、杀人蜂与蜂巢', how: '建造蜂箱后定期收取最稳定；采蜜前清理附近蜜蜂并准备防护。', use: '蜜汁火腿、太妃糖、蜂蜜药膏和保鲜料理。' },
  { slug: 'potato', title: '土豆', english: 'Potato', stage: '农耕后', where: '耕种', how: '种下普通种子随机获得，获得土豆种子后可定向种植；照顾作物可提高产量。', use: '奶油土豆泥、龙虾正餐和蔬菜填充。' },
  { slug: 'onion', title: '洋葱', english: 'Onion', stage: '农耕后', where: '耕种', how: '通过耕种普通种子获得，再用鸟笼把成熟洋葱换成专属种子。', use: '莎莎酱、奶油土豆泥和沃利料理。' },
  { slug: 'garlic', title: '大蒜', english: 'Garlic', stage: '农耕后', where: '耕种', how: '通过耕种普通种子获得，再用鸟笼建立专属种子循环。', use: '奶油土豆泥、调味料和多种蔬菜料理。' },
  { slug: 'pepper', title: '辣椒', english: 'Pepper', stage: '农耕后', where: '耕种', how: '通过耕种获得，成熟后喂鸟换取辣椒种子。', use: '辣椒炖肉、酿辣椒和沃利调味料。' },
  { slug: 'corn', title: '玉米', english: 'Corn', stage: '农耕后', where: '耕种', how: '通过耕种普通种子获得，之后可用专属种子稳定种植。', use: '鱼肉玉米卷、粉末蛋糕和蔬菜料理。' },
  { slug: 'pumpkin', title: '南瓜', english: 'Pumpkin', stage: '农耕后', where: '耕种', how: '耕种获得；成熟南瓜喂鸟可换专属种子。', use: '南瓜饼干和高饱食基础食物。' },
  { slug: 'dragon-fruit', prefab: 'dragonfruit', title: '火龙果', english: 'Dragon Fruit', stage: '农耕后', where: '耕种', how: '普通种子低概率长成，首次获得后用鸟笼换专属种子扩大种植。', use: '火龙果派。' },
  { slug: 'eggplant', title: '茄子', english: 'Eggplant', stage: '农耕后', where: '耕种', how: '耕种获得并用鸟笼建立专属种子循环。', use: '酿茄子和蔬菜料理。' },
  { slug: 'tomato', title: '番茄', english: 'Toma Root', aliases: ['番茄', '西红柿', 'Toma Root'], stage: '农耕后', where: '耕种', how: '耕种获得，成熟后可换专属种子。', use: '莎莎酱、蔬菜鸡尾酒和填充。' },
  { slug: 'watermelon', title: '西瓜', english: 'Watermelon', stage: '农耕后', where: '耕种', how: '耕种获得，成熟后可换专属种子。', use: '西瓜冰和降温食物。' },
  { slug: 'butter', title: '黄油', english: 'Butter', stage: '中期', where: '蝴蝶稀有掉落', how: '击杀蝴蝶有较低概率掉落；大量种花并持续捕猎可提高获取效率。', use: '华夫饼、龙虾正餐和沃利料理。' },
  { slug: 'frog-legs', prefab: 'froglegs', title: '蛙腿', english: 'Frog Legs', stage: '雨季/池塘', where: '青蛙掉落', how: '击杀青蛙获得；下雨时青蛙雨数量很大，应穿甲并避免在基地内交战。', use: '蛙腿三明治、沃利料理和肉度填充。' },
  { slug: 'freshwater-fish', prefab: 'pondfish', title: '淡水鱼', english: 'Freshwater Fish', stage: '第一周', where: '池塘垂钓', how: '装备钓竿在池塘钓取；白天池塘可钓，洞穴鳗鱼池机制不同。', use: '鱼排、海鲜浓汤和鱼度料理。' },
  { slug: 'kelp-fronds', prefab: 'kelp', title: '海带叶', english: 'Kelp Fronds', stage: '航海后', where: '海洋海带与月岛', how: '乘船采集海上的海带；把海带茎移植到近岸可建立基地食物来源。', use: '加州卷、鳗鱼料理、晾晒和蔬菜度。' },
  { slug: 'barnacles', prefab: 'barnacle', title: '藤壶', english: 'Barnacles', stage: '航海后', where: '海上藤壶群落', how: '乘船靠近海上藤壶并采集；注意船体碰撞和海上敌对生物。', use: '藤壶意面、藤壶寿司和海鲜料理。' },
  { slug: 'cactus-flesh', prefab: 'cactus_meat', title: '仙人掌肉', english: 'Cactus Flesh', stage: '探索期', where: '沙漠仙人掌', how: '采摘会受伤，穿护甲可降低损失；烤熟后可恢复理智。', use: '廉价蔬菜度、鳄梨酱和回理智食物。' },
  { slug: 'cactus-flower', prefab: 'cactus_flower', title: '仙人掌花', english: 'Cactus Flower', stage: '夏季', where: '夏季开花的仙人掌', how: '仅在夏季仙人掌开花时随采摘获得；穿甲减少刺伤。', use: '花沙拉和夏季降温装备。' },
  { slug: 'birchnut', prefab: 'acorn', title: '桦栗果', english: 'Birchnut', stage: '秋季/探索', where: '成熟桦栗树', how: '秋季砍伐成熟桦栗树掉落；可重新种植形成可再生树林。', use: '什锦干果和种树。' },
  { slug: 'mandrake', title: '曼德拉草', english: 'Mandrake', stage: '探索期', where: '少量特定地表区域', how: '白天采摘会立即获得；黄昏或夜间采摘会让它跟随并在天亮重新种下。数量极少，不要浪费。', use: '曼德拉草汤、排箫等稀有物品。' },
  { slug: 'bone-shards', prefab: 'boneshard', title: '骨片', english: 'Bone Shards', stage: '探索期', where: '敲毁骨架、猎犬丘与多种骨骼资源', how: '用锤子敲毁地表骨架最直接；猎犬丘和部分洞穴生物也会掉落。', use: '雨帽、强心针和骨骼类制作。' },
  { slug: 'stinger', title: '蜂刺', english: 'Stinger', stage: '第一周', where: '蜜蜂和杀人蜂掉落', how: '击杀蜜蜂或杀人蜂获得；制作养蜂帽后再大规模处理蜂群更安全。', use: '强心针、吹箭和海上装备。' },
  { slug: 'fireflies', title: '萤火虫', english: 'Fireflies', stage: '第一周', where: '夜间地表发光点', how: '夜间用捕虫网捕捉；靠近时会短暂消失，停留片刻后重新出现。', use: '矿工帽和充能光源。' },
  { slug: 'honeycomb', title: '蜂巢', english: 'Honeycomb', stage: '第一周', where: '拆除野生蜂巢和杀人蜂巢', how: '摧毁野生蜂巢固定获得；先穿护甲并处理守卫蜜蜂。', use: '蜂箱和蜂蜡。' },
  { slug: 'bee', title: '蜜蜂', english: 'Bee', stage: '第一周', where: '花朵和野生蜂巢周围', how: '白天用捕虫网捕捉普通蜜蜂；不要在杀人蜂群中原地挥网。', use: '建造蜂箱和制造蜜蜂地雷。' },
  { slug: 'butterfly-wings', prefab: 'butterflywings', title: '蝴蝶翅膀', english: 'Butterfly Wings', stage: '前期', where: '花朵附近的蝴蝶', how: '白天在花附近攻击蝴蝶获得；也可用捕虫网活捉并种成花。', use: '蝴蝶松饼、奶油和直接治疗。' },
  { slug: 'electric-milk', prefab: 'goatmilk', title: '电羊奶', english: 'Electric Milk', aliases: ['电羊奶', '羊奶'], stage: '沙漠雷雨', where: '带电伏特羊掉落', how: '雷雨时让伏特羊被雷击进入带电状态，再击杀才会掉落电羊奶。', use: '冰淇淋和乳制品料理。' },
  { slug: 'drumstick', title: '鸡腿', english: 'Drumstick', stage: '第一周', where: '火鸡、鸟类和多种生物掉落', how: '击杀火鸡最常见；用浆果引诱火鸡到角落后攻击。', use: '火鸡大餐和肉度料理。' },
  { slug: 'royal-jelly', prefab: 'royal_jelly', title: '蜂王浆', english: 'Royal Jelly', stage: '蜂后后', where: '蜂后掉落', how: '击败蜂后后收集；每次战斗产量有限，优先用于彩虹糖豆。', use: '彩虹糖豆。' }
]

const refined: WikiEntry[] = [
  simpleEntry({
    slug: 'rope', title: '绳子', english: 'Rope', category: '资源', stage: '第 1 天',
    summary: '把草压缩成通用制作材料，是护甲、武器和建筑的常见中间件。',
    crafting: craft([amount('cut-grass', '草', 3)], '徒手制作', '精炼'),
    acquisition: [acquire('制作', '用草精炼', '收集 3 个草。', '打开制作栏的“精炼”分类制作 1 根绳子。')],
    uses: ['木甲、长矛、帐篷、晾肉架等。']
  }),
  simpleEntry({
    slug: 'boards', title: '木板', english: 'Boards', category: '资源', stage: '第一周',
    summary: '四根木头精炼成一块木板，主要服务基地建筑和航海。',
    crafting: craft([amount('log', '木头', 4)], '科学机器及以上科技', '精炼'),
    acquisition: [acquire('制作', '用木头精炼', '站在科学机器或更高科技旁。', '消耗 4 根木头制作 1 块木板。')],
    uses: ['箱子、冰箱、炼金引擎、船套装等。']
  }),
  simpleEntry({
    slug: 'cut-stone', prefab: 'cutstone', title: '石砖', english: 'Cut Stone', category: '资源', stage: '第一周',
    summary: '三块石头精炼成建筑材料，用于科技、烹饪和防御建筑。',
    crafting: craft([amount('rocks', '石头', 3)], '科学机器及以上科技', '精炼'),
    acquisition: [acquire('制作', '用石头精炼', '站在科学机器或更高科技旁。', '消耗 3 个石头制作 1 块石砖。')],
    uses: ['炼金引擎、烹饪锅、避雷针等。']
  }),
  simpleEntry({
    slug: 'papyrus', title: '莎草纸', english: 'Papyrus', category: '资源', stage: '第一周',
    summary: '芦苇精炼材料，是鸟笼、书籍和魔法物品的基础。',
    crafting: craft([amount('cut-reeds', '芦苇', 4)], '科学机器及以上科技', '精炼'),
    acquisition: [acquire('制作', '用芦苇精炼', '从沼泽安全带回 4 个芦苇。', '在科学机器旁制作 1 张莎草纸。')],
    uses: ['鸟笼、书籍、蜂蜡纸等。']
  }),
  simpleEntry({
    slug: 'electrical-doodad', prefab: 'transistor', title: '电器元件', english: 'Electrical Doodad', aliases: ['电器元件', '电子元件', '电气元件'], category: '资源', stage: '第一周',
    summary: '炼金引擎和机械建筑使用的科技中间件。',
    crafting: craft([amount('gold-nugget', '金块', 2), amount('cut-stone', '石砖', 1)], '科学机器及以上科技', '精炼'),
    acquisition: [acquire('制作', '制作电器元件', '准备 2 个金块和 1 个石砖。', '站在科学机器旁制作 1 个电器元件。')],
    uses: ['炼金引擎、雪球发射器和其他机械科技。']
  })
]

export const materialEntries: WikiEntry[] = [
  ...gathered.map(item => simpleEntry({
    slug: item.slug,
    prefab: item.prefab,
    title: item.title,
    english: item.english,
    aliases: item.aliases,
    category: '资源',
    stage: item.stage,
    summary: `${item.title}是《饥荒联机版》的常用资源；获取时要同时考虑安全、再生速度和运输成本。`,
    acquisition: [acquire('采集', item.where, item.how)],
    uses: [item.use],
    tips: ['第一次发现稳定来源时在地图上做标记。'],
    mistakes: ['只看眼前数量，不保留可再生来源。']
  })),
  ...refined
]
