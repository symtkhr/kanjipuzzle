//usage: node automaker.js

const REDEFINE = "";

//// from: jisho_tool.js

//検索対象文字(辞書に用例があるもの)
const _SKKTABLE = `
#1:丐丕乖仗佝佯佶侏侑俐俛倅倆倏們倔倡倨倪傴僉僊僖僥儂儕儚儺兀冀冢凵剿匁匈匕匚匝匣厖叶吽呟呱咆咋咢咥咨哄哮唹啼喟喬嗇嗤嘖嘶噫嚆嚊嚮囀囁囈囎囮圀圜圷坩埔堙堝塙塹壑壟夊夥奎奐妁妲姆姶娃娜娟婀婪婬嫖嫣嫩嬋嬪孀孕孰宦寨尠尹屡峙崋崗崘崙崛嶇嶼巉巓幀幔幗幢并廬廴廼弑彡彭徘徨忖忸怡怩恁恚恫悒惇惘惺愀愈愎慂慍慓慥慫慴憔憖憚憮懈戔扠抓拈拿挌掉掣摧撕撩撼擡擯擽攴攵攷敲斃斌斟昵暝暹曚曩朮杁杆杢枋枌枴柞柢柬柾栞栴桀桎梏梼棗椏椙椛椪椶椽楡楮榜榻榾槁槭樵橲檄檬檸櫟櫺欅欷歇歔歹殀殞殯殲毋氛汀汕沱沽沾泓泗泛泱洙浙涵淦渙渤渭湃湍湎湲溂溘溟溲溷溽滉漓潴潺澗澪澳濘瀋瀚瀛瀞炳烱烽焜煬熕燉燎燔燠燧燬爰爿牴犂狷猖猗猴猷猾獏獗玳珎珞琅瑁瑟瑤瑰瑾瓔瓷甄甦甫甸畚疥疸痾瘁瘋瘢瘧瘰癜癧皎皙皚皰皴睥睹睿瞽瞿矇矍矗矧硅硴碯禧禹秡稍稙稷穡穽窈窕窖窘窿竇竢笙笨笵筅筌箚箜箴篋篌篥篳簑簗簧籌粱糅糒糶紊紜絅絖絛綮綵緇繃繖繝繧繽纐罠罨羂羃羚羶翕翹耋肇肚肭胛胝胥胯胼脯腴膂膃膾臀臾舒舜舸艤艸芍芻苒苜苣范茣茱茲茴荀莎莪莽菠萃萍萵萸萼葩葭葮葷蒋蓆蓐蓙蓚蓿蔔蔘蔡薀薈薊薐薨薹蚣蚤蚰蜈蜍蜩蝮蝴螫螯螳螽蟋蟒蟯蟶蟾蠑蠖蠡蠢蠹衫衲衿袂袒袷裄裙裨裲裹褞襠襯覘覡覩觚訌詁詬誄諚謖謦謨譟讚豸豺賂賺贍贓跌跚跫踉踰蹈蹉蹕蹣蹤躄躪躾軈軫軻軼軾轂轗轜辜辮辿迚迢迪迸逅遐遨遯邀邂邃邨邯郢鄲酊酋酩醪醯醴醺釐鈎鈿鉉鉋鉗銓鋩鏃鐃鑠鑢鑵閇閔閘閧閭閹闃闌闍闖闡闥阮陂陌陝陦陬隗隧雍雎雖雫雹霆霍霑霓靆靉靠靺靼鞣鞦鞨韃韆韭顱顴颪颱颶飫餬饌饑馗馘馥馮駑駛駮駸駻騫騾驃驟驤骰骼髀髏髑髦髻鬮鬯魴鯊鯒鯣鯰鰆鰊鰍鱚鱶鱸鳧鴃鴆鴒鴕鴟鴣鴦鴾鵑鵝鵯鵺鶚鶺鷂鷓鷙鷦鷯鹵麭麾黌黐黠黽鼇鼾齟齪齬齲齷
//兒冩區噐囑圈圍埓塲壯壹寃寫屬帶恆愼戲拔拜效晝梦樂樞檪濟歸殘殼瓣盜碎稱穐穰竊粫經縣縱繩聨聰聽肅舖莊萠處覺觀觸譽讎豐賣踐輕醉釋鋪陷隸飜飮驛鷄凾峽廐殱熈爼盡粃粮糢羮舩莓蟆蠎韲鴈
#2:亦估佇佻侈俑俟倩僂儼冑冕冤凋刮剋劈匍匐卉卍厥厦叟吶吼哇唳唸啀喊喙嗾嘔嘸嚥嚼坏堊塘墺墻壅奘姨媽媾孚孩孺寐寞岨巍帑廿弋弖彿徂徊徠徭忿恂恙恪悋悖悛悴惧愍愾慇慟憧憬憺懃懊懣懦懶懿戍戟扮抒拷掟揄揣揶擒擘擢攬斛旌旒曠杙杞杳柯栢梟梭梳棊棍棠椴楓楫楳榊榑槧槨槿樸橇橈橢檣檻櫂櫞氓氾汝沁沌沮洵淪湮滂滌潭澎瀟瀰炯烝煦熄爨犇狄狽獪獰琺瑙瑜瑯瑳璋瓏瓠甌甑甥畢畦畷疆疋疔疝疣疼痂痣痼癩盒睾瞋瞠瞻矜砦砧碕碣碩碼磋磔磬礒祁祟禦秣秧站竟笄笊笋筏筮筰箝篁篝簸籀籬糯紂紮絣絮絳綏緲縅繙繻纓纜罌羇羯羸翡翩翫耘耨耿聢肓肱腥膈膺臚舁艟艨艪艮艾芬苟茘茯莞菎葎蒐蓴蔀蔕蔬蕁藐藺蘂蘿虔蚪蛔蛞蛟蛯蛹蜃蜉蜑蜒蜚蝌蝎蝓蝙蝟蝠蝣蝸蟀蟠蟷袁褓襁訝詛詼誡誨諂諡諱諳譴豎貽賈贏趺跛跣跼蹐蹙蹲蹶躅躑躓輓輦輾辟逕逞逡逼邏鄭醗醵鈞鈷鉈銖銹錙鎗鏑鏖鐙鐚閖闢隘霄霖霹靂靱鞅鞆鞜鞴韜頤頷颯餮饕馨馭駘駱騏驍驥髣髴鬩魃魍魎魑鮒鰤鰾鴇鴛鵄鷁黎黛鼕齦//亂價剩劍勞參團寶對嵜廢插棧榮樓濶獸祕禮繼腦藏藥衞軆辭辯遞關鬪鯵鹽麥點嚴嶌徃懷暎總繪鑄頴麁
#3:云佃俎俘偃偈偸冪凪凰刎刪匆吝呻咤哥啖喀喨嗚嗽噂噪嚠坤埒墟夭奕奠姐姪嬬嬲孑孜宸尨屹嶄嶮帙幄廂廈廠弐彊彷怙怜恍恬悚悧悸惹愕愧慚戈戎扈扼捐掏摯撻擱斡旛昴晧晨晰暉曰枇枸柘柝柩框桔棉棕楷榔樗樟橡檳毯氈汪沐沛洟涕淙淮淹渣渫溯滔滸漑漱澹瀕瀝瀾煥熾燦燼牆狒猊猜玻珀珈琥琲瑛瑪痲瘴癈癘皐盂盞盥盪瞞瞥瞼硼碇碾礪禾稈稠穹竄笈筍筥篦簒籏籐籟粂粳綯綻縋縟縺繚纈罅罔羲耄聊脾膊臑臙舅舛艙苓莱菟菰萊蒜蒡蓖蕾蘗虧蚓蚯蛆蛻蜆蜊蜷蝨螂螻蠍蠕衙衢衾裔裘褪褶褸襞襤襴覯覿觴訃訊詢誂誑誣諄諍諒諛謂謫譫讖谿豁豌豕貂貶贄跏跪踞踵蹂蹇輜輳轡逍鉦錚鍍鍔鎬鏘鑓鑰鑼閤隕雉雰霏霽靫鞏頗餉餞饉饋饒駝驀驢鬆鬧鮪鰌鴫鶉鶸鷸//假埜壓惡收數斷樣涛淺烟燒砺絲續臺與蝿覽賎邉錢雙驗鴬齊冲寳爐祢禀竃箆纒缺諌贊鑛隨
#4:且佗佼侃侶倚傅僑兢冉凜凭剽勒匪叭吻呎咀咸哈哩唆啜喃喇嗄嗟噎噸嚇夙娑婢宕尸岑岱崑帚幟庖弉弭弼彎徽怏慳慷憊憾懼戛抉抛拌拮拱捏撈撚攪旱晏曙杣杷栂梔楔楢橙橿檗櫨欒毟汞泄淘渥湛澣炸煖熔熬牀狛琳瓊甕疇痍瘻癆盈眄眸睛睫礙穎穣窄窺竈竣笏笞筐籃粍糺紆絆絢綸聳脩臈舫舳艫艱苞苺茜荏菫菲蓉蔗蔦蕨蕷虱虻蛄蛤蜿螟蟄蟇衍袍袢袱褌襖襦訶詭謁謳贖趨蹌蹠躇躊輛轆轤迭遽鄙醂鈑鈔銑銜銷鋏鋲錮鎚鏝鐸閼隋霰鞋顫駭鬘鬨鮑鰈鰥鱇鵞鵬鶲鼈鼬龕//侭單壤壽弯撹槇歐溪爭當發螢讀輌靜體齋佛
#5:亘亨伶佞俚偕僭兌剔劉劾咬啾坡堵壕壜婁孵弩悌慙憫拇拗按捺揖攀旁曖枷桓桿梓椰槐槓橄櫚欖殆涎涜淆滄滲滾澱濛瀆炮焉煕熨猩獺珂璧甜畸疳痔癪癲眷眺瞑碌碓祚箏糜糾紘綜緘緞縒罹羨耆聘肆脆腓腱艘芒芭苧荊蕊薑藷蘊蘚虞蜥蜴蝗蠱褄詈謔讒跋踪軋轟迹鍬鍮鎔鏤鑽閻鞄騨驒髷鬢魄鮟鰐鰓鵠鸚鸞//惠欝滿澁轉齒彌畫
#6:丞亢佚佩倖倦倹傀僅儡几刳劃卦咫哭啄嘯嘴噺圃埃墾夾婉媛嫉嫋寇屁屏屓已巷弗怯怱恃恢恤恰惟惻慄懺扨捗捧掠掩揆擅敝斂旺朦枳榛檎殷渺溌潑瀑烙烹煌犀瑕瑣痘皓眇眈瞳磊礬禰稗竦筵簇緬緻縊繭翰翳聾胱臘舐芙蒟蓼蕗藹蘆虜衒袈裟褻襷訣諜諮諺贔赫趾跨躙躬逝遜遵邇銚錫鍾閏閾隼韋頒顰飄驕魁鯱鰯鰺鳶鴎鵡鷗鹹麒麝麿鼎//來傳圓嶽挾潅罐聲蛎邊變靭
#7:乍什俄倣允凧剪厨喋囂址埠堡堺塑姥宍宥寥屎幇廓彗彬恣悍悼惶慾截戮撓擾斧於桝梃椋涌濠濤瀉炙燗燵爬牒狡璽疽痢癇癬癸瞰砒硯箭簀籾紬綽繍羈耀耽肖胤膀膵臂苅苫茉茗莢菖董蒻蕃蕪薗藉蛭裳褥覗訥詣詫諤諫謄謐謗賽赭蹊逗邁醇醍錨麩黍齣//實獨
#8:些仇伍俯俺做冽凱剌匂厩吃吠咄哺唖啞坦堕堰妥妾娩帥恕悄托拉捉搦攫斥晦枡柚梵榎槙櫓歿浚浣涅渠溺濾灼牲瑚畝疏痙盧祠禎竺筈篆簾絃繹肯芹莉萎萱蕉藪詔誅誹諷譬讐贋轍轢辣遡酉酎醐鋤錘陛靄鞠頌餃饗鱒鴉鴻麟//桧櫻證會蟲
#9:佑侘傭傲勁匙卿厘呵咎喘嘱奄妬媚孟尤屯巌帷庸惣戌捩摸擁攘昂暈朧朶梢棘棹棺槃槻欽歪殉毘毫涸淋渇游灸焔焰煤煽爽珊畠疱砥禿稔稟窃箋糟絨縷纂羞肛脛膣臆舷蕭薙薪薯蜀袴謬賄賑贅躁遭酪釧鍼鑿闕陋顆駁鮭麓麴麹黴//駈號
#10:丙亥埴奢妓峯崖嵯庇弄忽愉慌慧戊掬擂擲杭柵梗洩玖疵瘡瘤皺盃瞭碍礫秦穫竪箒綬肴茄荼莫蓑蓬虹蠅訛赴迅逓采釉閨韮頽顚顛飩饂駕髯鮎鶯//藝凛
#11:仄伺侮侯俸僻儘兇冴勃升卜叔咳唾塀壬套姑嬉嬌寓嵌庚弛悉慕慨憐戚扁拵挨斤昏曼朔朴杓桟楕楚榴樫毬沃沫灌焙燭犠玲珪琢畔痰祓祷禱秤箔篩粥縹罷羹翅臍芯蔑薇薔誼諧謎賜躯軀輯遁遥遼鉾鋒鎧閃闊隙餐骸魯鯖鰭齧//亞氣
#12:乎仔但凹刹匡叛喝嗅堆墜墳壱姻娼宰寵峻嵩徐惰或戴拶挫攣暢朽楯樺沓渾湊滓炬燻瓢畏痒瘍矮穢緋而腋腑茫蛉蛛蛸蛾蜘蜻豹貰迂鋸鞭飢鬚鰹鰻//學瀧薮壷
#13:伎侠俠兜凌匿叡哨嗜嘗嘘嘲姜嫡巫捌搗撞梱椀椒椿橘欣洪溢礁禽窩箕肋脹蕩蛋蠣衷誦貌賤蹄蹟醒頁騙魏//悽裡頚
#14:乞亮准剃卯叫塡填奸屍屠帖廟据掴摑撒晒李槌檜櫃泌洛涯湘燐牝狙猶痺眩窟粕糊聡脅腿膠葺蛙蝉蟬詮輻輿邸郁錆閥靡頸髭鯉鷺
#15:丑俣剖劫厭囃堪奔妃宋岬彙抹拐捲搏搾杵栃毀汐漠狸睨矩祇穿笥籤繕翔翠聚肢膿茹萄葵蚊蝕裾誰諏赦迄逢逮陪顎饅馳驚鵜//爲
#16:倭倶咽娯婿寅峨庵庶廊忙悶愴披曝柑楊歎洒淀淑漂漕琉琵琶瑠璃疹穏罵聯肘萌葡譚貪邑郭酌錠阻隻鱈
#17:俵儲冶凸勿嘩壌敢晋杏杜梶樽殴漉牟猥矯碑稜罫翁脊蒔蟻誇迦餓魅鮨鮫//條渕
#18:僕儒冗勲呈噛嚙娠嵐廉憎把挟挽棲椅湧煩爵牢癒盾矛租稀箪簞繋舶芥茨蔓蔭薫蚕褐註賓賭酬醜陥//濱篭萬鐵
#19:埼妨尉捷撥旦款汲汽潔濫燕獅玩痕碗碧祈紺絞綺緯耶舵萩葦諦諭践遂阜鞘鯛//應
#20:叉叱后坑嶺巴悩挑敦暫曳机枢栖梯櫛渓滴爺畿痩窒窯竿粟膏蔽賠飴餡鳳
#21:丼享吏呆囚堤嬢寧帛怠怨悠憤懲拭挺楠欺滋漆灘爛牽秩粛紗繞菅誓醸錬鷲鹸鹼
#22:努喚圭恨憩扉拘撤昧桶牌狗祀窪縞纏膨荻蒼藁蛮褒謹貢貼隷頬
#23:兎厄只寡尖幣慎憑撫杖柏檀毅耗蝦螺誕轄辱酷隈駿騰
#24:喉宜宵摺槍汰渦炒睦粋糠紐紡紳肪膚臼苑茅葱賦踊這雌
#25:乏促偉勾叙呪弔悔懇拙揉斐旬暁曇淳淵漸焚碁禍篤糧腔蜂閲//燈
#26:伐兆勉叢坪奨奮撰曹栽樋濯牙甚眉硝禄稽胚菩蝋蠟鋳鍛頑鱗//廣
#27:串傘冥匠呉喩夷嬰寂尼拒握濡蒙//冨彈眞舘豫餘
#28:函卸嘆愁槽浸漿狼獲穀箸芦詐詳謙謡鋭陵
#29:侍俳傑冒凄唇喪尋廻恥惜拾捻播旭梁爾班盆翌藻覆輔酵釘錐
#30:唄喧墓妊姦廷弊怖扶揃搭斯栓汎煉狐稚窮篠膝蕎蜜襟逐雛鯨
#31:伽偵匹垢培朋楼沸燥爪疲睡硫薦詠遷錯陳隅雁鞍//曾
#32:勅嗣峡崇慈携泳潟瓜痴稼腎苛茸蝶覇贈鈍陀頓餌鴨
#33:亭伴僚卑含呑哀塊壇妄嫁屑巳巾怒惨慰抄昆澄苗誉讃遮郊霞靖
#34:其凝吐噴困坐帆弧彰扇畜藩遇霜
#35:又吊喰妖巧庄悦拓揮桂歓此潤瞬臥艶薩躍辻鐘鳩//戰
#36:凡励嚢恭拳晃暇柿涼烈砕虐訟該輩醤馴髄
#37:塾宴昔曽柴洞淫濁縛茎貿頻顧
#38:乙仰剥叩孫悟惚斗柔椎溝猪疫粧絹繊藍蛍襲遍鍵
#39:億凶吟咲奴姓峠揺摂斑桐泡洲煎狭癖糞胃胴艇蟹衰鎌鎮零需飽
#40:召埋旨涙祥秒胆舗裸謀鉛鉤銘
#41:壺幡憂桁猟疎腺葛諾錦闇
#42:幽彫忘控汗滝磯綾署荘蓄賊鷹黙
#43:劣勧哉婆宛循徹慢掌搬朱桑炊牡癌累膳袖貯麺
#44:伯剰幌扱措摘暑瑞箇篇豚跳逸靴
#45:乃及娘履枕溜笛胎腫菱蹴辰
#46:傍冊刃唯壮径招斎斬缶翻耕迎魂
#47:奪妹彼捜焦珠疾磐紛綴
#48:堅慮抽撲是殻浴潰祉股蛇誠軒較附
#49:傾斉瓶羊蓮雇騎
#50over:抱戯塞挿克釜笠蒲昨塔肺筑忌漏盲看掘粘縫抑淡倫衡閑削懐皆酢苔蘇顕孤批午盟随臓掻緒描飼併韻抵患笹幻没届捕枯暖猛紹硬帽偽媒祐肌凍鈴琴賢沿輝罰鼠訂緊霧雀蓋欄禅征銃屈噌貞妙掲吾擬簿閣偶譲悲棟隣軟梨孔到猿尿寮虎峰綱迫肝烏尺旋卓鎖喫珍鬱緩汚畳巣邪賛勘鋼軌潜譜架餅堀恒渉塵葬貧拍鉢筒趣陶瓦姉彩侵韓麗芽駄括皿鶏丈棚訪狩維頃郡桃獄預謝衝棋晩鑑肩墨戒玄還殊嫌忍恐憶往塁蘭銅泰啓頂尽籠磨厳胡浪圏腸翼寛刈殖昼渋如幾否繁敬灰嘉漁漬眠湾騒泥徴湿危炉唱豪雷勇暮繰懸避疑岳姿某擦綿岐栗滞辛弓掃沈尚隔亀鮮督剛逃胸舌駒愚嶋績欧迷溶茂腕弦菓丘牧奉暦鼓既惑棄祖垣沖姫崩脇剣紋怪昌幼曜捨畑芝威氏熊熟兼蒸貫恩慣恋穴功柳獣那託鉱酔戻泣郵巡封漫弟粗甘献杉沙枠飾壊至腰亡俊僧災齢腐耐尻誘兄菊巨佳斜縄丹貝脚歳浄朗妻舟杯晶虚脂裂寸覧柄芳釈致滑拝頼也却償稲弥呂採簡激坊械儀承添敏忠盗執鍋欲糖授季浩尊伏旗択救駐童邦就刺痛柱汁穂充須拠枚浅臣契撮述縦診晴透触募菌垂敵宏討泊概冠刊購遅夢祝催麦裕哲隆臭震占踏肥跡拡猫君礎敗釣狂伸棒煮囲銭濃郷駆願包潮昇慶舎訓似氷芋貨帝融夕鳴敷徒絡符紫沼即塗陣訴砲燃刷必宙双孝俗膜去序殿締脈暴粒息賃著唐債偏仙排庁均籍羅雅梅仲途創帳互炭才庭湖候衆爆与窓響鼻髪鶴笑易閉奥緑依卒普乾干隠鬼紅桜艦婦冬針欠卵誤丁摩快昭探滅岸遣寒従憲我築陰胞刑副吹倍傷幹呼倒炎寿幕飲塚監宣床父働露毎礼貸鏡援借厚幅刀因臨弱
称荒脳磁混仁希灯束耳毒察暗範弘糸句乳犬索革詰牛浦操揚顔挙秘答闘粉被阿訳秀軸詩浮砂縮霊将亜智宅壁了鹿核律故夏枝縁袋宝底抗奇距審脱停供婚純札房詞洗歯豆苦責魔彦康勤吸犯液損竜寝央週菜恵稿服歴刻衣益況箱警景練街奈展喜矢軽載提株廃免腹背施企坂静微煙奏健請黄興継薄模栄永飯皮華考甲他遺網党省求聖払延裁推余豊農輸辺突罪盛染私裏森貴押植七港談盤庫委略聴劇残降宗並辞障己賀販若麻祭影九陽析瀬弾担旧折漢守筆険待適介航令虫章許禁秋攻首眼塩幸注六之始遊失照留池財固湯減絵深除勢藤課属倉療申遠荷居陸争筋更肉群雨泉岩養歩望樹舞為片堂善破復般乱複渡違宇旅羽納諸仏隊完給領友短少絶博誌労殺雲退右票評密寄買講佐帰老竹存券満導額冷階症剤確仮級返難起逆策早弁派例県富協思左林衛雪宿写族伊測護競芸府覚負席酸優客司末映撃児阪鳥個移増蔵便項休骨紀母親里材輪追層典賞州春志標独織今案雄超油像皇毛専巻浜替飛則具河雑効香酒件源異印比聞丸念散順兵抜整好改城越認程低環布境住極百朝端板害統円江徳悪助尾医吉清象消帯登得周沢想細読射温際血崎編仕師圧王福建茶段断識愛張視橋赤夫万告声役岡掛終黒修村積容防示英職支収歌局任寺済洋習補薬態強熱銀乗走青由横持館振未域玉判税津精等使園然参装病久商院死限草達良命広在営船夜試味決史割類演様備果説査節男各武近米準戸条接星図約軍離観球議松以官五係側録八伝紙角何焼配落止非続四受証育千験両急資宮曲谷題進換常都構応値費根来共総店単井究打処区価規魚検要身再初勝列種火団葉質過指頭話十向素版務活台着郎界差太予土士第治校基率製反問管置結南座次投門選足鉄込造速組格感波放室半花設算意号番古元町技真世可安白位京特運楽転風路交北馬流月系量食解現島駅最加民多権術知売調直送西器政先女重研状員型別集引当石産光経美有空切点平利義相色料画変字言見対情連取科和保教公品海口期計同戦開木制報付形信家正記心市明回屋表論原実川主天工全後能二式神面関社成野度年所長立気東代場御無外名音不田前目作語通新下道車三水自発小力山方機事電業入高金体動内化書線合手地時部出定文性国間物分上者生数行用法理会本日的中子人一学大
//國龍澤
`.trim().split("#").map(v=>v.split(":").pop().split("//").shift().trim()).filter(v=>v).join("");


const WordDictionary = function()
{
    let _wordDb = {};

    // 読みがなを返す
    this.read = function(kanji) { return _wordDb[kanji]; };

    // 辞書を消去する
    this.clear = function() { _wordDb = {}; };

    // 辞書を読み込む
    this.load = function(data) {
        data.split("\n").forEach(txt => {
            if (txt.match(/^;/)) return;
            let keys = txt.split("/");
            let kana = keys.shift();
            keys.pop();
            if (!kana) return;
            keys.forEach(key => {
                let ws = key.split(";");
                key = ws.shift();
                if(key.match(/^[!-~]+$/)) return;
                if(key.length < 2) return;
                key = key.split("").map(c => {
                    let t =
                        "剥呑繋焔鴎噛侠躯鹸麹屡蒋醤蝉掻騨箪掴填顛祷涜嚢溌醗頬莱蝋".indexOf(c);
                    return (t < 0) ? c :
                        "剝吞繫焰鷗嚙俠軀鹼麴屢蔣醬蟬搔驒簞摑塡顚禱瀆囊潑醱頰萊蠟"[t];
                }).join("");
                if(!_wordDb[key]) _wordDb[key] = "";
                _wordDb[key] += kana;
                if(ws.length == 0) return;
                _wordDb[key] += ws.pop();
            });
        });
    };

    // 指定された条件の語を探す
    this.find = function(cfg) {
        let cs = cfg.cs || [];         // 含む文字
        let ps = cfg.ps || [];         // 含む部首
        let num = cfg.num || [2, 0];   // 文字数
        let exc = cfg.exc || [];       // 除く文字
        let ctypes = cfg.ctypes || {}; // 色つき文字

        //該当語の絞り込み
        let words = Object.keys(_wordDb).filter((word) => {
            let knjmatch = word.match(/[一-龠々]/g);
            if (!knjmatch) return;
            
            //文字数・除外文字の条件チェック
            if (num[0] && knjmatch.length < num[0]) return;
            if (num[1] && knjmatch.length > num[1]) return;
            if (exc.some(e => (word.indexOf(e) != -1))) return;
            
            if (cs[0] != "/") {
                //包含文字チェック
                if (cs.some(c => (word.indexOf(c) == -1))) return;
            } else {
                let target = cs.map(v => (ctypes[v] || "")).join("");
                //赤青以外の文字がないかチェック
                if (word.split("").some(d => (target.indexOf(d) == -1))) return;
            }
            
            // 包含部品チェック
            if (0 < ps.length) {
                let frag = word.split("").reduce((frag, d) => frag + kanjifrag.split(d), "");
                if (ps.some(p => (frag.indexOf(p) == -1))) return;
            }
            return true;
        });

        return (cfg.sort) ? this.sortbyfactor(words, cs[0]) : [words];
    };

    // 語を複合要素でソートする
    this.sortbyfactor = function(words, c) {
        let ret = {"_": []};

        words.forEach(word => {
            let pos = word.indexOf(c);
            //wordからcを含む二字熟語bicharを抽出する
            let hit = [pos - 1, pos].filter(pos => {
                if (pos < 0) return;
                let bichar = word.slice(pos, pos + 2);
                if (bichar.length != 2) return;
                //二字熟語が存在するか
                if (!this.read(bichar)) return;
                //二字熟語と語全体の読みが一致するか
                if (!this.read(bichar).split(" ")
                    .some(kana => (kana != "") && (this.read(word).indexOf(kana) != -1))) return;
                //登録
                if (!ret[bichar]) ret[bichar] = [];
                ret[bichar].push(word);
                return true;
            });
            //未登録
            if (hit.length == 0) ret["_"].push(word);
        });

        let wordgroup = Object.keys(ret).sort((a,b) => {
            let d = a.indexOf(c) - b.indexOf(c);
            if (d != 0) return d;
            return this.read(a) < this.read(b) ? -1 : 1;
        }).map(key => {
            if (key == "_") return;
            if (ret[key].length < 2) {
                ret["_"].push(ret[key][0]);
                return;
            }
            return ret[key];
        }).filter(v => v);
        wordgroup.push(ret["_"]);

        return wordgroup;
    };

    // 語を指定文字の位置でソートする
    this.sortbypos = function(words, c) {
        let ret = [];
        words.forEach(word => {
            let pos = word.indexOf(c);
            if (!ret[pos]) ret[pos] = [];
            ret[pos].push(word);
        });
        ret.push([]);
        return ret;
    };
};

const KanjiTable = function()
{
    // 指定された部首を持つ漢字を返す
    this.find = function(part) {
        return _SKKTABLE.split("").filter(c => {
            let n = kanjifrag.split(c).toString() + ",";
            return (!part.some(val => (n.indexOf(val) == -1)));
        });
    };

    // 指定された部首を持つ漢字を分類する
    this.classify = function(cfg) {
        let queriesR = cfg.pclose; // 伏せられた部首
        let queriesB = cfg.popen;  // 見えている部首

        return _SKKTABLE.split("").reduce((ret, c) => {
            //既使用字は除外
            if (cfg.exc.indexOf(c) != -1) return ret;

            //分解
            let n = kanjifrag.split(c);
            let s = n.toString().match(/(&.+?;)|[(\[].+?[)\]]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^ -~]/g);
            if (!s) return ret;

            //分解部品と既存パーツとの比較(r:番号パーツ,b:Openパーツ)
            let psize = s.reduce((part, val) => {
                if (queriesR.join(",").indexOf(val) != -1) part.r++;
                if (queriesB.join(",").indexOf(val) != -1) part.b++;
                return part;
            }, {r:0, b:0});

            //red: 番号パーツのみで全伏せ
            if (psize.r == s.length) ret.r += c;
            //blue: Openパーツで全伏せ
            else if (psize.r + psize.b == s.length) ret.b += c;
            //pink: 番号パーツのみで準全伏せ
            else if (0 < psize.r && (psize.r + 1 == s.length)) ret.p += c;
            //cyan: Openパーツを含む
            else if (0 < psize.b) ret.c += c;
            return ret;
        }, {r:"", b:"", p:"", c:""});
    };

    this.partslist = function(is_counting) {
        let ans = "";
        let list = {};
    
        _SKKTABLE.split("").forEach(function(c) {
            kanjifrag.split(c).toString().split(",").forEach(function(p) {
                if (p.length == 0 || p.match(/^[A-Z]$/)) return;
                if (!list[p]) list[p] = 0;
                if (is_counting) list[p]++;
            });
        });
        return list;
    };

};

//// from: kanji_puzzle.js
Array.fromCdp = function(str) {
    let ret = str.match(/&[^;]+;|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
    return ret.map(c => cdp2ucs(c));
};

const cdp2ucs = function(cdpref)
{
    let m = cdpref.match(/&CDP-([^;]+);/);
    if (!m) return cdpref;
    let cdp = parseInt(m[1], 16);
    let upper = (cdp >> 8) & 0x7f;
    let lower = (cdp & 0xff);
    lower -= (lower <= 62 + 64) ? 64 : 98;
    return String.fromCharCode(upper * 157 + lower + 0xee1b);
};

const KanjiFragment = function()
{
    let dbglobal = {};
    let dblocal = {};

    this.define = function(globaldb) {
        globaldb.split("/").forEach(function(frag) {
            let k = frag.trim().split(":");
            let key = cdp2ucs(k[0]);
            dbglobal[key] = k[1];
        });
    };
    
    this.definelocal = function(localdb) {
        dblocal = {};
        if (!localdb) return;

        localdb.split("/").forEach(frag => {
            let k = frag.trim().split(":");
            let key = cdp2ucs(k[0]);
            dblocal[key] = k[1];
        });
    };

    let referdb = function(c) {
        if (typeof dblocal[c] !== "undefined")
            return dblocal[c];
        return dbglobal[c];
    };

    this.db = referdb;
    
    const kumikae = function(ret) {
        if (!Array.isArray(ret[1])) return ret;
        if ("OHUCFKL".indexOf(ret[0]) < 0) return ret;

        const ide = ret[0];
        const outer = ret[1];
        const inner = ret[2];
        const idechild = outer[0];
	
        const kumikaeTable =  {
            "FF": ["F", outer[1], ["Z", outer[2], inner]], // 腐鹿摩
            "FN": ["N", outer[1], ["Z", outer[2], inner]], // 乾修族
            "FZ": ["Z", outer[1], ["F", outer[2], inner]], // 危産厳
            "HN": ["N", outer[1], ["K", outer[2], inner]], // 臧
            "HZ": ["Z", outer[1], ["H", outer[2], inner]], // 向蔵贏
            "HH": ["H", outer[1], ["Z", outer[2], inner]], // 同威
            "OH": ["O", outer[1], ["Z", outer[2], inner]], // 冏咸
            "OO": ["O", outer[1], ["Z", outer[2], inner]], // 囧圀
            "KK": ["K", outer[1], ["Z", outer[2], inner]], // 貳
            "KZ": ["Z", outer[1], ["K", outer[2], inner]], // 耉
            "KN": ["N", ["Z", outer[1], inner], outer[2]], // 殼毀
            "UE": ["E", ["O", outer[1], inner], outer[2], outer[3]], // 興輿
            "UZ": ["Z", ["O", outer[1], inner], outer[2]], // 舋爨
            "LL": null, // 嚺
            "ON": ["M", outer[1], inner, outer[2]], // 術辯
            "OZ": ["E", outer[1], inner, outer[2]], // 囟囱褒
            "HE": null, // 高
        };
        return kumikaeTable[ide + idechild] || ret;
    };
    

    this.split = function(knjf)
    {
        const isIDE = c => ("NZMEOHUCFKLQJ".indexOf(c) != -1);

        // Apply IDEs recursively ("警" => [Z,敬,言] => [Z,N,Z,艹,K,勹,口,攵,言])
        const subparts_fragment = (knj) => {
            let idestr = referdb(knj);
            return (!idestr) ? [knj] :
                Array.fromCdp(idestr).map(c => isIDE(c) ? c : subparts_fragment(c));
        };
        let fragments = subparts_fragment(knjf).toString().split(",");

        // Find combination recursively (=> [Z,[N,[Z,艹,[K,勹,口]],攵],言])
        const make_combination = (idep) => {
            let ret = Array((idep == "E" || idep == "M") ? 3 : 2).fill("").map(_ => {
                let c = fragments.shift();
                return isIDE(c) ? make_combination(c) : c;
            }).filter(v => v);
            ret.unshift(idep);
            return kumikae(ret);
        };
        return make_combination(fragments.shift());
    };
};

//// kanji_puzzle.js から一部改設計

let PartQuiz = function() {
    this.make = function(qwords, options = {})
    {
        let ret = {};
        let ans = Array.fromCdp(qwords.join("")).filter(c => !c.match(/^[ -~\s]?$/))
            .map(c => ({c:c, ans:kanjifrag.split(c).toString(),}));

        ret.ans = ans.map(v => v.ans).join("/");
        //分解結果の記録(問題作成ツール用)
        ret.tb = ans.map(v => (v.ans === v.c) ? "" : (v.c + ":" + v.ans.split(",").join(""))).join("/");

        // ansから番号リストを生成する
        const onestrokes = "一丨亅丿ノ乙乚𠃊丶";
        const kidx = this.make_list(ret.ans, options.openlist || onestrokes);
        this.ans = ret.ans;
        this.n = Object.keys(kidx).length;
        return this.n;
    };

    this.make_list = function(ans, openlist)
    {
        let count = ans.split(",").join("/").split("/")
            .filter(v => (0 < v.length) && !v.match(/^[A-Z]$/) && (("＿" + openlist).indexOf(v) < 0))
            .reduce((count, v) => {
                if (!count[v]) count[v] = 0;
                count[v]++;
                return count;
            }, {});

        let kidx = Object.entries(count).filter(([k,v]) => 1 < v).reduce((kidx,[k,v],i) => {
            kidx[k] = i + 1;
            return kidx;
        }, {});

        this.count = count;
        this.kidx = kidx;
        return kidx;
    };
};

//// jisho_tools.js から一部改設計

let PartQuizMaker = function() {
    this.nchars = "一三様事飛母承兎";

    //既存字を除外字にする
    this.update_exc = () => {
        let txt = this.nchars.split("/").shift();
        txt += "/" + partquiz.qwords.join("").replace(/\(.+\)/g, "").split("/").join("");
        this.nchars = (txt);
    };

    this.wordsort = () => {
        //各文字の露出部首数
        let ops = partquiz.ans.split("/").map(pj => {
            let ps = pj.split(",");
            let ops = ps.map(p => ("NZMEOHUCFKLQJ".indexOf(p) != -1 || partquiz.kidx[p]) ? "" : p).filter(p => p);
            return ops.length;
        });

        let pos = 0;
        let evals = partquiz.qwords.map(w => {
            let ex = ops.slice(pos, pos + w.length).reduce((sum, v) => sum + v, 0);
            pos += w.length;
            return {ex:ex, w:w};
        });

        partquiz.qwords = evals.sort((a,b) => {
            if (a.n != b.n) return b.n - a.n;
            if (a.ex != b.ex) return a.ex - b.ex;
            return (Math.random() * 2 - 1);
        }).map(v => v.w);
    };
    
    // 語を自動追加する(任意)
    this.select_random_words = () => {
        let exc = this.nchars.split("");//.filter(c => (cs.indexOf(c) == -1));
        let words = dic.find({num:[3,3], cs:[], ps:[], ctypes:{}, exc:exc}).shift();
        let ret = "";
        let i = 0;
        while (ret.length < 5 * 4 && i < 20) {
            i++;
            let n = parseInt(words.length * Math.random());
            if (words[n].split("").every(c => ret.indexOf(c) == -1)) ret += words[n] + "/";
        }
        ret = ret.replace(/[ぁ-ン]/g, "");
        return ret;
    };
    
    //語を自動追加する(部首遮蔽)
    this.select_rpbc_words = () => {
        this.update_exc(); 
       
        let cfg = {
            pclose: Object.keys(partquiz.count).filter(key => partquiz.count[key] > 1),
            popen:  Object.keys(partquiz.count).filter(key => partquiz.count[key] == 1),
            exc: this.nchars,
        };
        let barekeys = cfg.popen;
        let ctypes = kanjitable.classify(cfg);
        let exc = cfg.exc.split("");
        let abandon = this.abandon;
       
        //2部首以上空いている文字を探す
        let cs = partquiz.ans.split("/").map(pj => {
            let ps = pj.split(",");
            let ops = ps.map(p => ("NZMEOHUCFKLQJ＿".indexOf(p) != -1 || partquiz.kidx[p]) ? "" : p).filter(p => p);
            if (1 < ops.length || (ps.length == ops.length))
                return ops.filter(p => "一丨亅丿ノ乙乛𠃌⺄乚𠃊丶".indexOf(p) < 0 && abandon.indexOf(p) < 0);
            return [];
        }).filter(ps => ps.length);
        //console.log(cs);
        
        let words = [[]];
        if (cs.length == 0) {
            // なければ既存部首から成る語を検索
            ["/rb", "/rpb"].find(cs => {
                words = dic.find({cs:cs.split(""), ps:[],
                                  exc:exc, num:[3,3], ctypes: ctypes });
                return (words[0].length);
            });
        } else {
            // あれば該当の部首を含む語を検索
            let c = cs.find(ps => {
                return ps.some(p => {
                    words = dic.find({cs:"".split(""),
                                      ps:[p],
                                      exc:exc, num:[3,3], ctypes: ctypes });
                    if (words[0].length) return true;
                    abandon.push(p);
                });
            });
        }
        
        if (words[0].length == 0) {
            //Todo:なければ[cs:"*"]で検索、それもなければ当該語を除去
            return -1;
        }
        
        // 検索された語を評価
        let result = words.shift().map(w => {
            let mask = w.split("").map(d => {
                let key = "rbpc".split("").find(key => ctypes[key].indexOf(d) != -1);
                return key ? key : "-";
            });
            let pt = mask.reduce((sum,m) => sum + ("rpbc-".indexOf(m)), 0); 
            return {w:w,t:mask,pt:pt};
        }).sort((a,b)=>a.pt-b.pt);
        
        // 上位20語からランダムで選ぶ
        // ToDo:部首数に合わせてさらに上位の語しか取らないようにする
        result = result.splice(0,20);
        
        let n = parseInt(result.length * Math.random());
        try {
            partquiz.qwords = (partquiz.qwords.join("/") + "/" + result[n].w).split("/");
        }catch(e) {
            console.log(e);
            console.log(cs,words,result);
            stop();
        }
    };
    this.abandon = [];
};

//// main
let kanjifrag  = new KanjiFragment();  // 字分解
let partquiz   = new PartQuiz();       // 出題
let dic        = new WordDictionary(); // 語検索
let kanjitable = new KanjiTable();     // 字検索
let makequiz   = new PartQuizMaker();  // 作問

const WORDLEN = 40;

/* 各オブジェクト参照先
 makequiz -> partquiz   -> kanjifrag
 makequiz -> dic        -> kanjifrag
 makequiz -> kanjitable -> kanjifrag
*/

let nodeapp = { help: () => { console.log("arg:", Object.keys(nodeapp)); }};

// 自動生成テスト
nodeapp.automake = (argv) => {
    const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');

    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));
    kanjifrag.definelocal(REDEFINE);
    dic.load(getfile("SKK-JISYO.ML.utf8"));

    partquiz.qwords = makequiz.select_random_words().split("/").filter(w => w);
    let options = {};
    partquiz.make(partquiz.qwords, options);

    if (argv.indexOf("qwords.sample1") != -1)
        partquiz.qwords = '士大夫/国際化/脳卒中/枯草熱/攻玉社/柱時計/言語学/花柳界/北茨城/吉田茂/伊吹山/潜望鏡/主産物/御寮人/附加税/牽牛星/謝肉祭/軽合金/仲間割/理知的/膀胱癌/阿僧祇/成熟卵/固溶体/荒療治/弦楽器/空取引/焼林檎/陣太鼓/内沙汰/沖積層/交叉点/尊厳死/野薔薇'
        .split("/");
    if (argv.indexOf("qwords.sample2") != -1)
        partquiz.qwords = "政府米/氷河期/雲母引/上屋敷/信号場/知名度/化粧台/水溶液/麒麟児/充電器/撥音便/交換局/薄花色/双胴船/太陽年/監督官/定額法/大発会/向日葵/宇都宮/地蔵堂/担保物/腹具合/同位体/高楊枝/回覧板/若旦那/真木柱/序数詞/油揚本/曹洞宗/歳時記/漫画家/脳震盪/降誕祭"
        .split("/");

    let miss = 0;
    for (;;)
    {
        let qn = partquiz.qwords.length;
        if (makequiz.select_rpbc_words() < 0) { console.log("-1!"); break; }
        console.log(qn, makequiz.abandon);
        partquiz.make(partquiz.qwords, options);
        if (partquiz.qwords.length >= WORDLEN) break;
        if (qn == partquiz.qwords.length) miss++;
        if (30 < miss) break;
    }
    makequiz.wordsort();
    console.log(partquiz.qwords.join("/"));
    console.log(JSON.stringify(partquiz.kidx));
    console.log(JSON.stringify(partquiz.count));
};

nodeapp.qdifficulty = (param) => {
    const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');
    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));
    let qlists = JSON.parse(getfile("qlist.json"));
    let qs = qlists.map(q => {
        kanjifrag.definelocal(q.def);
        partquiz.make(q.q.split("/"));
        let entry = Object.entries(partquiz.count);
        let ret = {
            qid:q.qid,
            // the less pair kids, the more difficult solved
            pair: entry.filter(([k,n])=>n==2).map(v=>v[0]).join(""),
            // the more single kids, the easier solved.
            open: entry.filter(([k,n])=>n==1).map(v=>v[0]).join(""),
        };
        let ev = entry.reduce((sum,k) => {
            let n = k[1];
            return n == 1 ? (sum - 100) : (sum + 100/((n-1)**2))
        },0);
        ret.val = 6000 + parseInt(ev);

        // Sigma(count==1 ? (-count/2):(1/count))
        //ret.val = 3 * ret.pair.length - 2 * ret.open.length
        return ret;
    });
    qs.sort((a,b)=>a.val-b.val).map(v=>console.log(JSON.stringify(v)));

};
// check how much it affects qlist.json to append fragtable.plus.txt
nodeapp.qcompatible = (param) => {
    const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');
    const suggestRedef = {
        2:'旦:Z日一', 3:'旦:Z日一', 11:'&k5-026c;:Z一由', 12:'𠮛:Z一口', 17:'𠮛:Z一口', 19:'𠮛:Z一口', 31:':Z亠丷', 34:'𠮛:Z一口', 38:'旦:Z日一',
        43:'午:Z𠂉十', 45:'旦:Z日一', 51:'旦:Z日一', 53:'𠮛:Z一口', 91:'𠮛:Z一口', 111:'旦:Z日一', 119:'旦:Z日一', 122:'旦:Z日一', 124:':Z亠丷',
    };

    let qlists = JSON.parse(getfile("qlist.json")).slice(0).map(q => {
        q.def = (q.def  + "/" + (suggestRedef[q.qid] || "")).split("/").map(v=>v.trim()).filter(v=>v).join("/");
        return q;
    });
    if (param.indexOf("dump") != -1) console.log(JSON.stringify(qlists,null,2));

    kanjifrag.define(getfile("fragtable.txt"));
    let origin = qlists.map(q => {
        kanjifrag.definelocal(q.def);
        partquiz.make(q.q.split("/"));
        return {q:q.q, def:q.def, kid:Object.keys(partquiz.kidx).join(""), json:JSON.stringify(partquiz.count)};
    });
    kanjifrag.define(getfile("fragtable.plus.txt"));
    let remake = qlists.map(q => {
        kanjifrag.definelocal(q.def);
        partquiz.make(q.q.split("/"));
        return {kid:Object.keys(partquiz.kidx).join(""), json:JSON.stringify(partquiz.count)};
    });
    
    // what definelocal makes the same as original qlist.json
    origin.map((ori,i)=>{
        let q = ori.q;
        let rem = remake[i];
        let remp = Object.keys(JSON.parse(rem.json));
        let orip = Object.keys(JSON.parse(ori.json)).map(c=>c=="八"?"ハ":c);
        
        // parts in orip which remp does not include
        let notincl = orip.filter(c=>remp.indexOf(c)<0);
        
        // remake using localdef which the remp does not include
        kanjifrag.definelocal(ori.def + "/" + notincl.map(c => c+":").join("/"));
        partquiz.make(q.split("/"));
        let remp2 = Object.keys(partquiz.count);

        return {
            "plus1" : notincl.map(c => c+":").join("/"),
            "minus" : orip.filter(c=>remp2.indexOf(c)<0).join(""),
            "plus2" : remp2.filter(c=>orip.indexOf(c)<0).join("")
        };
    }).map((v,i) => {if(v.plus1 ||v.plus2||v.minus) console.log(i+1,v ? v : "")});
};

if (typeof window == "undefined") {
    let argv = process.argv.slice(2);
    let key = argv.shift();
    if (!nodeapp[key]) key = "help";
    nodeapp[key](argv);
    var window = {};
}

const getfile = (fname, cb) => {
    const ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {
        if (ajax.readyState != 4) return;
        if (ajax.status != 200) return;
        cb(ajax.responseText);
    };
    ajax.open("GET", fname, true);
    ajax.send(null);
};

const $id = (id) => document.getElementById(id);
const $name = (name) => [... document.getElementsByName(name)];
const $c = (c, $dom) => [... ($dom ? $dom : document).getElementsByClassName(c)];
const $q = (query) => [... document.querySelectorAll(query)];

var main = () => {
    $(".qbox.automake .qdesc").html('<div id="seekbar"></div><div id="seekval"></div>');
    $("#seekbar").css({width:"5%", backgroundColor:"red", height:"15px"});
    $("#seekval").css({"text-align":"right"}).text("5%");

    getfile("SKK-JISYO.ML.utf8", (txt) => {
        dic.load(txt); 
        getfile("fragtable.plus.txt", (txt) => {
            kanjifrag.define(txt);
            main2();
        });
    });
};


let main2 = () => {
    kanjifrag.definelocal(REDEFINE);
    partquiz.qwords = makequiz.select_random_words().split("/").filter(w => w);
    partquiz.make(partquiz.qwords, {});

    let dump = () => {
        makequiz.wordsort();
        //$("#main").show();
        location.hash = btoa(unescape(encodeURIComponent(partquiz.qwords.join("/") + "@@" + REDEFINE)));
        qscreen.start({q:partquiz.qwords.join("/"), def:REDEFINE});
    };

    let miss = 0;
    let append = () => {
        let qn = partquiz.qwords.length;
        //console.log(partquiz.qwords);
        let percent = parseInt(100 * (partquiz.qwords.length) / (WORDLEN)) + "%";
        $("#seekval").text(percent);
        $("#seekbar").css("width", percent);

        if (makequiz.select_rpbc_words() < 0) return dump();
        partquiz.make(partquiz.qwords, {});
        if (partquiz.qwords.length >= WORDLEN) return dump();
        if (qn == partquiz.qwords.length) miss++;
        if (3 < miss) return dump();
        setTimeout(append, 10);
    }
    append();
};
