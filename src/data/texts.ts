export interface PracticeText {
  id: string;
  title: string;
  content: string;
  lang: 'en' | 'zh' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  source?: string;
}

export const practiceTexts: PracticeText[] = [
  // ── 英文 ──
  {
    id: 'en-1',
    title: 'The Power of Consistency',
    lang: 'en',
    difficulty: 'easy',
    content:
      'Success is the product of daily habits, not once-in-a-lifetime transformations. The key to achieving anything meaningful is showing up every day, even when you do not feel like it. Small actions repeated consistently lead to remarkable results over time. Focus on the process, not just the outcome, and let your habits shape your future.',
  },
  {
    id: 'en-2',
    title: 'Technology and Innovation',
    lang: 'en',
    difficulty: 'medium',
    content:
      'Technology is evolving at an unprecedented pace, reshaping every aspect of our lives. From artificial intelligence to quantum computing, the boundaries of what is possible are expanding daily. However, with great power comes great responsibility. We must ensure that these innovations serve humanity as a whole, bridging gaps rather than creating new ones. The future belongs to those who can adapt, learn, and grow alongside these changes.',
  },
  {
    id: 'en-3',
    title: 'The Art of Programming',
    lang: 'en',
    difficulty: 'hard',
    content:
      'Programming is not merely about writing code; it is a discipline of logical thinking and creative problem solving. A well-designed program reads like a carefully crafted piece of literature, where every function has a clear purpose and every variable tells a story. The best developers understand that code is written for humans to read first, and for machines to execute second. Clean code, meaningful comments, and thoughtful architecture distinguish exceptional engineers from average ones. Mastering this craft requires patience, curiosity, and an unwavering commitment to continuous improvement.',
  },

  // ── 中文 · 经典书籍 ──
  {
    id: 'zh-book-1',
    title: '《红楼梦》选段',
    lang: 'zh',
    difficulty: 'medium',
    source: '曹雪芹',
    content:
      '黛玉方进入房时，只见两个人搀着一位鬓发如银的老母迎上来，黛玉便知是她外祖母。方欲拜见时，早被她外祖母一把搂入怀中，心肝儿肉叫着大哭起来。当下侍立之人，无不掩面涕泣，黛玉也哭个不住。一时众人慢慢解劝住了，黛玉才拜见了外祖母。此即冷子兴所云之史氏太君，贾赦贾政之母也。',
  },
  {
    id: 'zh-book-2',
    title: '《西游记》选段',
    lang: 'zh',
    difficulty: 'medium',
    source: '吴承恩',
    content:
      '那猴在山中，却会行走跳跃，食草木，饮涧泉，采山花，觅树果；与狼虫为伴，虎豹为群，獐鹿为友，猕猴为亲；夜宿石崖之下，朝游峰洞之中。真是山中无甲子，寒尽不知年。一朝天气炎热，与群猴避暑，都在松阴之下顽耍。一群猴子耍了一会，却去那山涧中洗澡。见那股涧水奔流，真个似滚瓜涌溅。',
  },
  {
    id: 'zh-book-3',
    title: '《水浒传》选段',
    lang: 'zh',
    difficulty: 'hard',
    source: '施耐庵',
    content:
      '林冲踏着雪只顾走，看看天色冷得紧。渐渐晚了，远远望见枕溪靠湖一个酒店，被雪漫漫地压着。但见：银迷草舍，玉映茅檐。数十株老树杈枒，三五处小窗关闭。疏荆篱落，浑如腻粉轻铺；黄土绕墙，却似铅华布就。千团柳絮飘帘幕，万片鹅毛舞酒旗。林冲看见，奔入那酒店里来，揭开芦帘，拂身入去，倒侧身看时，都是座头。',
  },
  {
    id: 'zh-book-4',
    title: '《三国演义》选段',
    lang: 'zh',
    difficulty: 'hard',
    source: '罗贯中',
    content:
      '却说玄德访孔明两次不遇，欲再往访之。关公曰：兄长两次亲往拜谒，其礼太过矣。想诸葛亮徒有虚名而无实学，故避而不敢见也。兄何惑于斯人之甚也！玄德曰：不然，昔齐桓公欲见东郭野人，五反而方得一面。况吾欲见大贤耶？张飞曰：哥哥差矣。量此村夫，何足为大贤。今番不须哥哥去，他如不来，我只用一条麻绳缚将来。',
  },
  {
    id: 'zh-book-5',
    title: '《围城》选段',
    lang: 'zh',
    difficulty: 'medium',
    source: '钱钟书',
    content:
      '夜仿佛纸浸了油，变成半透明体。它给太阳拥抱住了，分不出身来，也许是给太阳陶醉了，所以夕照晚霞隐褪后的夜色也带着酡红。到红消醉醒，船舱里的睡人也一身腻汗地醒来，洗了脸赶到甲板上，只见海天一片，分不出哪里是水，哪里是天。这船，倚仗人的机巧，载满人的扰攘，寄满人的希望，热闹地行着，每分钟把沾污了人气的一小方水面，还给那无情无尽一无所见的大海。',
  },
  {
    id: 'zh-book-6',
    title: '《边城》选段',
    lang: 'zh',
    difficulty: 'easy',
    source: '沈从文',
    content:
      '小溪流下去，绕山岨流去了，这山岨便成了两边的界限。茶峒地方凭水依山筑城，近山的一面，城墙如一条长蛇，缘山爬去。临水一面则在城外河边留出余地设码头，湾泊小小篷船。船下行时运桐油青盐，染色的五倍子。上行则运棉花棉纱以及布匹杂货同海味。贯串各个码头有一条河街，人家房子多一半着陆，一半在水。',
  },
  {
    id: 'zh-book-7',
    title: '《平凡的世界》选段',
    lang: 'zh',
    difficulty: 'easy',
    source: '路遥',
    content:
      '黄土高原严寒而漫长的冬天看来就要过去，但那真正温暖的春天还远远地没有到来。在这样的大旱之年，许多人家连肚子都填不饱，可少安一家人却还勉强能够支撑下来。这全靠他父亲孙玉厚老汉的苦熬苦撑。老人一年四季在山里劳作，挣的钱全部交给了队里，换来一点点可怜的工分。但他从不叫苦，只是默默地承受着生活给予他的一切。',
  },
  {
    id: 'zh-book-8',
    title: '《活着》选段',
    lang: 'zh',
    difficulty: 'easy',
    source: '余华',
    content:
      '我娘常说，人只要活得高兴，穷也不怕。那时候我们家境还算殷实，有田有地，一家人其乐融融。可好景不长，我染上了赌博的恶习，把家产输得精光。爹气得卧床不起，最后撒手人寰。我这才如梦初醒，可一切都已经晚了。家珍带着孩子回了娘家，只剩下我和娘相依为命。娘没有怪我，只是说人这一辈子，总会遇到些坎儿，迈过去就好了。',
  },

  // ── 中文 · 散文 ──
  {
    id: 'zh-prose-1',
    title: '《荷塘月色》选段',
    lang: 'zh',
    difficulty: 'medium',
    source: '朱自清',
    content:
      '曲曲折折的荷塘上面，弥望的是田田的叶子。叶子出水很高，像亭亭的舞女的裙。层层的叶子中间，零星地点缀着些白花，有袅娜地开着的，有羞涩地打着朵儿的。正如一粒粒的明珠，又如碧天里的星星。微风过处，送来缕缕清香，仿佛远处高楼上渺茫的歌声似的。这时候叶子与花也有一丝的颤动，像闪电般，霎时传过荷塘的那边去了。',
  },
  {
    id: 'zh-prose-2',
    title: '《匆匆》选段',
    lang: 'zh',
    difficulty: 'easy',
    source: '朱自清',
    content:
      '燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢：现在又到了哪里呢？像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。',
  },
  {
    id: 'zh-prose-3',
    title: '《背影》选段',
    lang: 'zh',
    difficulty: 'easy',
    source: '朱自清',
    content:
      '我看见他戴着黑布小帽，穿着黑布大马褂，深青布棉袍，蹒跚地走到铁道边，慢慢探身下去，尚不大难。可是他穿过铁道，要爬上那边月台，就不容易了。他用两手攀着上面，两脚再向上缩。他肥胖的身子向左微倾，显出努力的样子。这时我看见他的背影，我的眼泪很快地流下来了。我赶紧拭干了泪，怕他看见，也怕别人看见。',
  },

  // ── 中英混合 ──
  {
    id: 'mixed-1',
    title: '中英双语 · 科技名言',
    lang: 'mixed',
    difficulty: 'medium',
    content:
      'Steve Jobs once said: "Stay hungry, stay foolish." This simple phrase captures the essence of innovation and lifelong learning. 在科技行业，变化是唯一不变的真理。Those who embrace change and adapt quickly will thrive in this dynamic environment. The best way to predict the future is to create it. 正如 Alan Kay 所说，预测未来的最好方式就是创造未来。',
  },
  {
    id: 'mixed-2',
    title: '中英双语 · 编程箴言',
    lang: 'mixed',
    difficulty: 'hard',
    content:
      'In the world of software, the most beautiful code is the code that never has to be written. 优秀的程序员懂得简洁的力量。"Any fool can write code that a computer can understand," said Martin Fowler, "good programmers write code that humans can understand." 写代码是一种沟通，不仅是与计算机沟通，更是与未来的自己和其他开发者沟通。可读性永远比炫技更重要。',
  },
]

export function getTextsByLang(lang: 'en' | 'zh' | 'mixed' | 'all'): PracticeText[] {
  if (lang === 'all') return practiceTexts
  return practiceTexts.filter((t) => t.lang === lang)
}

export function getTextById(id: string): PracticeText | undefined {
  return practiceTexts.find((t) => t.id === id)
}
