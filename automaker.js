//usage: node automaker.js

const REDEFINE = "";

//// from: jisho_tool.js

//検索対象文字(辞書に用例があるもの)
const _SKKTABLE = //1
"踉抓濘賺辿擽徨咥婀娜匕靉靆姶吽韲齷齪薊稙闍惇黽罨尹雖躄渭柞孰櫟籌軼怡嘶愈杁殞廴堙茴泛齲裲襠"+
"鬯泱悒禹苜蓿傴蟒蠎繧繝慍琅薀衲娃鷂郢瀛睿猴衿鴦閹嫣疸莽獏鰆燠瘧膃肭穽囮飫駮儚邂逅螯膾疥暝乖瑰槭"+
"嚊硴瑾鈎恁隗矍鑠馘挌霍崗胥穡鰍夥丐糅裹椛螳鑢羚遐坩堝轗軻黠宦歇顴鉗凾邯鄲鉋凵駻渙柬寨涵皚咢萼鵝"+
"歹榻蟆鴈莓麾冀饑嶇樵喟閧憚佶駛廐盡翕湍窿跫匈嚮喬歔欷倨僖蟋螽幗瑟霑沾窘仗艤僥蟯肚倆莎箜篌鬮絛濟"+
"崛倔瞿佝詁葷颶茱萸謦烱奎硅蹕懈桀狷胛羂闥轂囈鴃闃檄蚰阮粱圷溘猾瀚杆壑熈薨綮纐霓皎嚆哄滉甦楮雹埔"+
"槁閘腴沽呱餬茲爰廼倅譟蝴骼溷柢焜崙崘噫鼇愎遨釐茣蓙瞽謨骰蔡儕豺囀曩嘖囁蠑扠袒蹉跌匣髑髏繖彡巓巉"+
"塹弑嗤咨泗雫鷙桎梏屡溲蠹迢蠖芍鷓鴣稷暹驟蓚鞦韆愀酋猷痾竢侏倏臾椶舜蠢髦舸蒋馗燬絅猖獗憔笙慴黌爿"+
"慫慂倡雎枌囑緇癜皴恚襯撼箴斟駸饌僊軫瀋瓷忸怩橲轜昵躪荀蓆溽蓐舒瘁苒敲燧隧夊枋椙戔蔔鯣汕圜惺羶"+
"掣鏃鶺鴒浙糶潺湲僉嬋娟銓蹤尠陝栴闡殲殱讚雍觚絖匝幀丕孀剿艸囎唹齟齬軾爼笨忖贓峙擡颱玳瑁鼾峽斌"+
"胼胝慥蹈婬倪婪鴕妲韃靼拿鯊葮矗窖萵苣筅筌洙箚詬肇冢汀掉諚鴆闖湎儺鴾呟啼牴撕迪枴覘椽臀猗泓甄嶼幢"+
"圀覩兀迚甫黐燉遯恫糒螫褞駑醪嫩訌陦毋瀞棗鉉憖鞣皰鱚髻脯鐃楡蔘叶拈蚤烽徘咋皙匚摧陌袷溂陂匁綵塙秡"+
"孕瘢燔芻范蠡妁莪謖萃麭裨蟾蜍蜩粃篳篥髀嫖慓驃鯰榜粮鵯殯擯繽醺朮甸閔騫紊瘋鱶薹馥覡鳧贍淦舩俛萍"+
"氛紜躾憮欅睥并斃迸炳竇陬畚衫閇袂羃嬪辮篋咆哮熕彭繃湃鋩魴菠薐溟榾鵑姆馮惘沱厖耋攴攵渤椪邨澳澗醯"+
"柾胯靺鞨蟶鵺蝮蹣跚幔澪鰊鶚潴鷦鷯椏簑鴟葩蜈蚣辜豸酩酊鯒碯曚矇睹杢糢靠鑵軈簗矧稍侑簧邃踰裄梼羮佯"+
"邀瑤殀煬窈窕笵瓔珞禧葭霆韭鈿騾闌犂驤燎撩閭膂奐嗇漓誄瘰癧醴俐檸檬翹櫺壟薈鹵鱸廬顱颪攷賂裙栞儂"+
"崋珎罠們"+
//"莊兒恆拔碎覺穐戲檪壹圍驛寃樂讎愼輕鷄殼歸縣釋圈豐觀聽稱粫隸屬晝塲縱穰經陷醉效梦噐賣壯殘踐觸竊盜飜肅冩寫舖鋪帶拜譽區繩瓣萠聰飮處埓聨樞"+

//2
"榑蹲恙腥鬩梳沁諂躓贏掟狽頷啀俟隘痣蓴碕絳坏碩趺憧憬畦弖耨藐鐙厦藺曠諳筏貽沮嚴頤莞蝟喙礒狄"+
"懿橇疣誡苟蕁磬慇懃湮蜉蝣疼懊唸姨楳僂頴暎戍蛯蜒鴛嚥冤槧袁墺甥膈嘔甌鏖鞅鉈汝徂徠襁褓蝌"+
"蚪纓篁訝繪詼悛蛔懷棠闢纜蝸篝卉蔕恪砦唳舁蘂跛縅羯冑亦刮楫痂鏑蟷梭甑潭栢翡蝙蝠箝檻喊魃鰤楓孩"+
"艾翫諱愾騏驥棊惧羇砧竟癩杞梟誨疆矜靱懦醵跼蹐擘蟀旒槿鵄擒巍驍馭鰾秧櫞煦憺蜑跣炯虔馨佻逕"+
"邏罌蹶紮紂祁膺戟譴岨壅鷁剋儼奘耿耘獪笄睾肓媾筰吼綏蛟臚瓠逡估肱痼悴絣沌菎棍拷艮蔬榊寞"+
"嘸颯蛹鈷叟笊碼聢齦諡錙銖畷嗾樸蔀揣瑙侈蒐銹熄攬霖繻笋駘賈瀟霄疔檣墻瞋緲蜃疋哇孺豎詛洵恂"+
"橈烝醗抒絮爨彿髣髴簸蘿魑旌禦黛霹靂鞜斛槨磋瑳瞻疝鈞滌筮鎗總氓麁嚼徭孚磔嶌佇鞴祟擢蹙橢"+
"蝎魍魎籀鑄凋淪躑躅倩茘徊鄭鮒輾韜饕餮鼕俑鴇吶厥椴鞆獰慟瞠艟艨帑蛞蝓柯悖堊瓏廿輦塘盒繙氾"+
"蟠輓碣蜚犇畢逼籬寐鐚瀰羸愍芬逞扮忿懣茯站辟劈翩冕悋澎琺瑯匍匐滂秣媽卍璋糯懶葎揶揄徃弋瑜閖杳駱杙黎櫂艪"+
//"棧點獸辭參插鹽衞嵜繼亂樓軆寶榮剩劍對廢價團腦遞鬪禮麥勞祕辯關藏藥濶鯵"+

//3
"縺霽罅碾惹嬲綯縋誑盥掏恍彷滸噂褪嗚菟框晧幄餉凪蜊驢嬬鉦斡誂姐罔噪廈諛澹碇贄怙諍聊"+
"諌鷸蚯蚓廂瞥冲豕曰淹謂墟哥隕旛嗽觴蛆鶉靫籐呻盂粳譫云虧瑛癘淮戎偃蹇臙豌笈姪汪羲蘗熾螻"+
"愕豁竄楷燼踵奕擱喀桔禾鮪舅膊螂氈蕾蜷戈衙漑晰煥帙衢瞼饋暉饉覯奠跪愧雉屹橡箆瑪裘柩穹"+
"牆彊鞏貶棉褶盞鍔蒡鍍襴捐瞞艙柝枸樟轡貂粂綻谿鬆跏缺纈孑坤嶮啖鬧猊偈珈琲菰裔覿鑛廠詢鎬扈琥"+
"珀皐撻沐猜溯渣蠍鑰渫贊燦刪簒柘慚悸嶄竃鴫孜宸蜆輜咤篦襞棕筍瘴鏘悚弐逍籟吝讖摯訊晨盪刎毯"+
"蹂苓諄饒玻寳縟頗臑隨扼蛻餞蠕漱錚匆淙俎祢踞沛閤瀾謫鑓駝蝨爐偸稠樗佃涕恬纒滔礪衾鑼鰌枇瀝蒜"+
"癈筥籏洟驀稈脾狒霏蓖繚鶸瀕檳榔訃輳誣俘埒雰冪凰硼莱萊昴尨耄襤褸痲舛夭悧嚠諒喨禀怜"+
//"惡覽鴬與臺淺燒絲收斷齊雙賎蝿數假樣壓續驗涛邉砺錢烟埜"+

//4
"蹌凭噎毟窄鋲嗄捏躊躇聳遽啜唆抉銜謳窺憾鮑噸呎哩粍鎚閼茜贖曙宕渥虻霰絢晏徽鱇倚弼嚇懼弉冉鏝鼬佗"+
"苺欒撚竈熬瘻僑眄紆怏弭穎盈鈔瓊荏鋏謁褌蜿嗟衍菲檗脩筐侶甕琳蛄佛岱鰥駭澣攪拌傅橿鬘鬨且戛"+
"婢訶旱侃艱汞蔗咸鵞舫蟇睛龕詭幟帚趨拮蔦絆鶲糺兢拱輛錮菫襖鼈籃撈楔梔襦崑蟄綸虱轆轤匪隋慳臈慷尸"+
"岑佼迭鈑吻櫨狛栂憊穣睫炸哈娑蕨螟笏淘袱夙竣痍銷礙牀蹠彎顫舳艫咀袢蓉眸袍銑癆苞杣鵬湛橙煖笞喃"+
"庖疇鄙蕷鐸抛楢杷泄剽鰈蛤醂勒熔喇叭凜鞋"+
//"溪歐壽壤爭弯當發讀螢槇單侭體齋靜撹輌"+

//5
"縒攀滾軋滲脆眺褄腓疳魄欝藷艘曖苧腱耆虞枷梓薑槓鮟按堵焉揖痔彌鸚桓碓壕蘊祚鰓蜥蜴閻羨捺壜"+
"鰐驒騨箏蕊槐畫謔偕旁亘鞄咬髷櫚獺桿緘癪佞璧橄欖兌拇畸啾迹殆婁糾癲弩亨鑽緞鏤淆珂鵠鍬荊眷煕蝗悌芒"+
"肆拗蠱聘轟劾綜慙讒踪猩坡鍮鸞憫涜瀆孵涎僭蘚滄鬢紘詈跋澱剔炮甜椰糜熨芭瞑濛碌鎔罹俚劉伶"+
//"齒惠滿澁轉"+
    
//6
"怯慄倦跨翳躙捗僅舐扨竦蓼襷亢刳鯱嫉捧袈裟縊掠驕藹哭鰯啄鼎鹹蘆恰痘弗筵佚赫閾已恃韋鳶"+
"劃揆顰蒟鰺懺蕗殷卦丞嘯麿閏渺訣逝贔屓埃媛掩婉魁旺鴎鷗鵡躬銚佩恤錫恢墾傀儡翰瑕溌潑烹圃枳斂"+
"諜寇巷趾几變臘夾靭褻嘴煌麒倹屏犀倖邇諮繭遜瀑諺衒皓緻眈噺惟磊屁瑣隼瞳咫鍾眇榛麝遵嫋朦芙禰惻擅"+
"虜簇怱緬礬聾頒稗飄敝烙胱檎"+ //"圓傳罐來潅挾嶽聲邊蛎"+

//7
"涌耽倣覗宥梃截喋撓乍狡悍於炙齣悼慾址蕪赭彬斧綽燗砒菖褥謐錨簀諫藉裳什牒廓瀉蒻允璽濠姥邁耀痢疽蛭"+
"臂紬凧燵椋賽胤詫癬濤堡瞰蹊箭塑屎苅諤癇薗俄羈莢黍惶麩繍詣厨膀戮囂擾硯蕃寥堺謄董實訥醍謗恣宍彗肖"+
"逗幇癸醇膵剪爬籾茗埠苫桝茉"+//"獨"+

//8
"藪櫓做吠攫轢匂堰鋤悄浚搦溺堕拉仇枡唖啞靄妾饗哺辣餃疏鴉槙浣剌渠痙牲些萎詔娩芹伍托鱒酎灼祠莉斥"+
"俯畝厩筈捉榎繹讐錘凱蟲晦麟萱俺會諷禎酉竺誅絃恕贋鞠吃坦涅簾帥頌鴻肯陛濾咄醐遡瑚歿蕉篆冽轍"+
"誹譬妥盧梵柚"+//"櫻桧證"+

//9
"侘淋咎涸薪禿捩賑薙昂妬媚黴煽顆號棹厘喘砥賄毘糟奄謬佑鮭畠帷鑿嘱朶縷呵戌槻巌箋舷暈焔焰匙袴灸"+
"臆傲羞惣朧棘游渇棺薯勁疱酪肛卿麓陋麹麴毫稟爽稔闕躁欽蜀歪釧駁脛膣攘殉孟傭窃尤珊纂槃蕭鍼梢絨擁煤摸"+
"遭贅庸屯"+//"駈"+

//10
"凛洩擂掬皺崖弄鮎蠅髯茄埴慌玖礫庇瞭擲亥饂飩釉綬鶯疵秦采蓑逓慧碍莫訛奢赴梗肴駕瘡妓韮忽盃杭"+
"閨頽荼瘤箒丙虹峯嵯柵迅穫戊蓬顛顚愉竪"+//"藝"+
//11
"伺祓罷拵齧兇仄臍篩嵌箔謎弛焙昏咳鯖冴慕慨憐嬉賜畔挨斤輯嬌痰縹粥侮杓儘沫羹骸毬犠塀升閃姑戚遁闊桟勃樫卜"+
"魯秤鋒玲侯叔鰭誼諧芯寓餐燭祷禱唾庚俸鉾鎧灌隙套躯軀翅扁珪蔑悉曼朔榴朴遼楚薔薇遥壬琢楕僻沃"+//"氣亞"+

//12
"貰鞭痒腑豹攣蜻蛉楯戴朽穢燻嵩嗅墜畏拶瘍鬚沓挫渾刹壷或蛸喝壱瓢鋸姻飢迂滓鰻乎腋而墳鰹凹匡湊"+
"炬蜘蛛徐寵蛾宰矮樺娼峻惰仔緋堆茫但暢叛"+//"薮學瀧"+

//13
"醒蕩溢嗜捌巫嘗騙嘲搗脹椀嘘梱頁誦魏凌肋礁箕蹟蠣窩匿叡洪椒侠俠貌禽伎兜橘姜哨椿衷賤蹄欣蛋嫡撞"+//"裡悽頚"+

//14
"葺掴摑乞眩聡撒据糊晒狙叫猶剃詮錆脅帖槌蛙鷺髭膠檜粕蝉蟬窟郁櫃涯靡卯腿廟痺燐牝屠輿李奸邸泌閥洛頸"+
"湘屍鯉輻填塡亮准"+

//15
"赦茹睨囃堪逢捲搏繕抹穿馳誰裾搾籤蚊驚鵜丑翔葵厭祇迄顎岬俣饅笥彙狸奔杵毀膿劫萄妃諏蝕拐剖肢"+
"矩翠逮聚漠汐栃宋陪"+ //"爲"+
//16
"萌罵咽貪悶曝肘洒忙穏漕庶酌淀錠隻庵疹婿阻郭楊柑譚廊寅邑歎葡漂披倭淑娯聯峨琵琶鱈倶瑠璃愴琉"+
//17
"勿魅儲蒔誇殴敢漉俵蟻杏鮫翁壌牟稜渕鮨碑猥餓梶罫冶凸嘩迦樽杜矯晋脊"+ //"條" +
//18
"湧噛嚙挽癒蔓挟把憎繋盾薫棲冗煩嵐褐芥椅勲箪簞娠茨酬爵蔭舶陥蚕賭廉僕賓稀儒註呈矛牢租醜"+//"鐵篭萬濱"+
//19
"遂絞撥應燕汲鞘綺諭祈諦玩尉舵鯛葦痕耶緯旦碧碗埼妨阜款獅萩捷潔汽紺濫践"+
//20
"悩痩巴滴叱暫粟梯嶺渓飴窒敦窯膏栖餡竿蔽枢曳后爺叉机畿坑鳳櫛賠挑"+
"鷲爛怠拭呆秩誓懲醸挺嬢堤悠寧憤丼繞灘怨漆享吏牽楠欺鹸鹼菅粛紗帛囚錬滋"+
"藁喚桶纏褒頬貼膨蛮恨拘窪蒼昧狗牌憩祀扉貢努荻縞撤謹圭隷"+
"厄撫憑酷慎只隈轄蝦螺柏檀兎毅辱尖誕寡杖騰幣耗駿"+
"這宵睦炒踊紐摺糠茅渦葱膚臼粋槍紳汰喉賦苑宜雌紡肪"+
"揉禍斐乏曇焚悔偉暁淳篤勾蜂燈腔碁旬糧淵閲呪叙弔拙懇促漸"+
"奮頑濯鱗鍛甚鋳坪兆稽硝菩樋叢禄奨廣撰眉勉栽曹伐胚牙蝋蠟"+
"寂呉濡握串拒傘尼嬰喩匠夷蒙冥"+//"豫彈舘餘眞冨"+
"浸箸嘆卸穀狼愁函芦獲謙謡陵槽鋭漿詐詳"+
"惜凄藻盆拾捻恥播尋釘錐覆侍旭翌爾喪酵輔班唇廻俳傑梁冒"+
//30
"怖揃雛膝墓煉栓篠喧斯襟姦狐弊唄扶蕎蜜鯨妊汎稚廷逐窮搭"+
"沸詠垢睡疲爪鞍匹伽偵曾雁陳朋硫隅遷薦培錯楼燥"+
"痴鈍稼蝶苛慈泳餌鴨峡崇嗣陀贈腎茸潟瓜携勅覇頓"+
"含嫁靖誉呑澄慰怒卑哀霞伴郊昆巾抄亭巳塊苗屑惨壇僚妄讃遮"+
"凝噴吐其霜困彰坐遇畜扇帆弧藩"+
"巧喰臥又揮吊艶辻歓躍桂此鳩庄瞬潤悦鐘妖拓薩"+ //"戰"+
"馴涼暇励砕柿晃虐醤嚢烈恭拳髄凡訟該輩"+
"昔縛頻柴顧曽洞茎淫濁宴塾貿"+
"斗柔粧剥惚孫仰叩繊襲鍵遍藍悟疫溝絹猪蛍乙椎"+
"飽揺衰糞姓咲煎胴零狭蟹泡億吟奴桐癖峠胃斑鎌摂洲艇需凶鎮"+
//40
"召銘秒涙鉤埋鉛裸祥胆謀旨舗"+
"闇憂桁疎葛壺腺諾幡錦猟"+
"忘彫控黙汗荘署磯鷹綾賊滝蓄幽"+
"炊劣徹袖膳慢掌勧宛朱循哉婆癌牡麺搬桑貯累"+
"跳暑逸瑞扱措摘靴箇篇剰豚幌伯"+
"腫溜笛履蹴及乃娘枕胎辰菱"+
"翻迎招斬刃魂缶傍冊斎唯径耕壮"+
"綴焦紛捜彼疾奪磐珠妹"+
"較潰浴撲軒堅是慮股附誠祉蛇殻抽"+
"雇傾斉瓶蓮騎羊"+
//over50
"抱戯塞挿克釜笠蒲昨塔肺筑"+
"忌漏盲看掘粘縫抑淡倫衡閑削懐皆酢苔蘇顕孤批午盟随臓掻緒描飼併韻抵患笹幻没届捕枯暖"+
"猛紹硬帽偽媒祐肌凍鈴琴賢沿輝罰鼠訂緊霧雀蓋欄禅征銃屈噌貞妙掲吾國擬簿閣偶譲悲棟隣"+
"軟梨孔到猿尿寮虎峰綱迫肝烏尺旋卓鎖喫珍鬱緩汚畳巣邪賛勘鋼軌潜譜架餅堀恒渉塵葬貧拍"+
"鉢筒趣陶瓦姉彩侵韓麗芽駄括皿鶏丈棚訪狩維頃郡桃獄預謝衝棋晩鑑肩墨戒玄還殊嫌忍恐憶"+
"往塁蘭銅泰啓頂尽籠磨厳胡浪圏腸翼寛刈殖昼渋如幾否繁敬灰嘉漁漬眠湾騒泥徴湿危炉唱豪"+
"雷勇暮繰懸避疑岳姿某擦綿岐栗滞辛弓掃沈尚隔亀鮮督剛逃胸舌駒愚嶋績欧迷溶茂腕弦菓丘"+
"牧奉暦鼓既惑棄祖垣沖姫崩脇剣紋怪昌幼曜捨畑芝威氏熊熟兼蒸貫恩慣恋穴功柳獣那託鉱酔"+
"戻泣郵巡封漫弟粗甘献杉沙枠飾壊至腰亡俊僧災齢腐耐尻誘龍兄菊巨佳斜縄丹貝脚歳浄朗妻"+
"舟杯晶虚脂裂寸覧柄芳釈致滑拝頼也却償稲弥呂採簡激坊械儀承添敏忠盗執鍋欲糖授季浩尊"+
"伏旗択救駐童邦就刺痛柱汁穂充須拠枚浅澤臣契撮述縦診晴透触募菌垂敵宏討泊概冠刊購遅"+
"夢祝催麦裕哲隆臭震占踏肥跡拡猫君礎敗釣狂伸棒煮囲銭濃郷駆願包潮昇慶舎訓似氷芋貨帝"+
"融夕鳴敷徒絡符紫沼即塗陣訴砲燃刷必宙双孝俗膜去序殿締脈暴粒息賃著唐債偏仙排庁均籍"+
"羅雅梅仲途創帳互炭才庭湖候衆爆与窓響鼻髪鶴笑易閉奥緑依卒普乾干隠鬼紅桜艦婦冬針欠"+
"卵誤丁摩快昭探滅岸遣寒従憲我築陰胞刑副吹倍傷幹呼倒炎寿幕飲塚監宣床父働露毎礼貸鏡"+
"援借厚幅刀因臨弱称荒脳磁混仁希灯束耳毒察暗範弘糸句乳犬索革詰牛浦操揚顔挙秘答闘粉"+
"被阿訳秀軸詩浮砂縮霊将亜智宅壁了鹿核律故夏枝縁袋宝底抗奇距審脱停供婚純札房詞洗歯"+
"豆苦責魔彦康勤吸犯液損竜寝央週菜恵稿服歴刻衣益況箱警景練街奈展喜矢軽載提株廃免腹"+
"背施企坂静微煙奏健請黄興継薄模栄永飯皮華考甲他遺網党省求聖払延裁推余豊農輸辺突罪"+
"盛染私裏森貴押植七港談盤庫委略聴劇残降宗並辞障己賀販若麻祭影九陽析瀬弾担旧折漢守"+
"筆険待適介航令虫章許禁秋攻首眼塩幸注六之始遊失照留池財固湯減絵深除勢藤課属倉療申"+
"遠荷居陸争筋更肉群雨泉岩養歩望樹舞為片堂善破復般乱複渡違宇旅羽納諸仏隊完給領友短"+
"少絶博誌労殺雲退右票評密寄買講佐帰老竹存券満導額冷階症剤確仮級返難起逆策早弁派例"+
"県富協思左林衛雪宿写族伊測護競芸府覚負席酸優客司末映撃児阪鳥個移増蔵便項休骨紀母"+
"親里材輪追層典賞州春志標独織今案雄超油像皇毛専巻浜替飛則具河雑効香酒件源異印比聞"+
"丸念散順兵抜整好改城越認程低環布境住極百朝端板害統円江徳悪助尾医吉清象消帯登得周"+
"沢想細読射温際血崎編仕師圧王福建茶段断識愛張視橋赤夫万告声役岡掛終黒修村積容防示"+
"英職支収歌局任寺済洋習補薬態強熱銀乗走青由横持館振未域玉判税津精等使園然参装病久"+
"商院死限草達良命広在営船夜試味決史割類演様備果説査節男各武近米準戸条接星図約軍離"+
"観球議松以官五係側録八伝紙角何焼配落止非続四受証育千験両急資宮曲谷題進換常都構応"+
"値費根来共総店単井究打処区価規魚検要身再初勝列種火団葉質過指頭話十向素版務活台着"+
"郎界差太予土士第治校基率製反問管置結南座次投門選足鉄込造速組格感波放室半花設算意"+
"号番古元町技真世可安白位京特運楽転風路交北馬流月系量食解現島駅最加民多権術知売調"+
"直送西器政先女重研状員型別集引当石産光経美有空切点平利義相色料画変字言見対情連取"+
"科和保教公品海口期計同戦開木制報付形信家正記心市明回屋表論原実川主天工全後能二式"+
"神面関社成野度年所長立気東代場御無外名音不田前目作語通新下道車三水自発小力山方機"+
"事電業入高金体動内化書線合手地時部出定文性国間物分上者生数行用法理会本日的中子人"+
"一学大";

//JISが変更した字形を同一視する
String.prototype.jischange = function() {
    if (!this) return "";
    var c = this.trim();
    var t = "倶剥呑嘘妍屏并痩繋唖焔鴎噛侠躯鹸麹屡繍蒋醤蝉掻騨箪掴填顛祷涜嚢溌醗頬麺莱蝋攅".indexOf(c);
    if (t < 0) return c;
    return "俱剝吞噓姸屛幷瘦繫啞焰鷗嚙俠軀鹼麴屢繡蔣醬蟬搔驒簞摑塡顚禱瀆囊潑醱頰麵萊蠟攢".slice(t, t + 1);
};

var WordDictionary = function()
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
            var knjmatch = word.match(/[一-龠々]/g);
            if (!knjmatch) return;
            
            //文字数・除外文字の条件チェック
            if (num[0] && knjmatch.length < num[0]) return;
            if (num[1] && knjmatch.length > num[1]) return;
            if (exc.some(e => (word.indexOf(e) != -1))) return;
            
            if (cs[0] != "/") {
                //包含文字チェック
                if (cs.some(c => (word.indexOf(c) == -1))) return;
            } else {
                var target = cs.map(v => (ctypes[v] || "")).join("");
                //赤青以外の文字がないかチェック
                if (word.split("").some(d => (target.indexOf(d) == -1))) return;
            }
            
            // 包含部品チェック
            if (0 < ps.length) {
                var frag = word.split("").reduce((frag, d) => frag + kanjifrag.split(d), "");
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

var KanjiTable = function()
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
var stringToArray = function(str) {
    var ret = str.match(/&[^;]+;|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
    return ret.map(c => cdp2ucs(c));
};

var cdp2ucs = function(cdpref)
{
    var m = cdpref.match(/&CDP-([^;]+);/);
    if (!m) return cdpref;
    var cdp = parseInt(m[1], 16);
    var upper = (cdp >> 8) & 0x7f;
    var lower = (cdp & 0xff);
    lower -= (lower <= 62 + 64) ? 64 : 98;
    return String.fromCharCode(upper * 157 + lower + 0xee1b);
};

var KanjiFragment = function()
{
    let dbglobal = {};
    let dblocal = {};

    this.define = function(globaldb) {
        globaldb.split("/").forEach(function(frag) {
            var k = frag.trim().split(":");
            var key = cdp2ucs(k[0]);
            dbglobal[key] = k[1];
        });
    };
    
    this.definelocal = function(localdb) {
        dblocal = {};
        if (!localdb) return;

        localdb.split("/").forEach(function(frag) {
            var k = frag.trim().split(":");
            var key = cdp2ucs(k[0]);
            dblocal[key] = k[1];
        });
    };

    let referdb = function(c) {
        if (typeof dblocal[c] !== "undefined")
            return dblocal[c];
        return dbglobal[c];
    };

    this.db = referdb;
    
    let kumikae = function(ret) {
        var ide = ret[0];
        var outer = ret[1];
        var inner = ret[2];
        var idechild = outer[0];
	
        var kumikaeTable =  {
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
        return kumikaeTable[ide + idechild];
    };
    

    this.split = function(knjf)
    {
        var fragments = [];

        var idesymbol = function(c) {
            var ide = "NZMEOHUCFKLQJ".indexOf(c);
            if (ide < 0) return false;
            return c;
        };
    
        var subparts_fragment = function(knj) {
            var idestr = referdb(knj);
            if (!idestr) {
                fragments.push(knj);
                return;
            }
        
            var idearray = stringToArray(idestr);
        
            while (idearray.length > 0) {
                var c = idearray.shift();
                if ("NZMEOHUCFKLQJ".indexOf(c) != -1) {
                    fragments.push(c);
                } else {
                    subparts_fragment(c);
                }
            }
        };

        let make_combination = function(idep) {
            let ret = [idep];
            let n_parts = (idep == "E" || idep == "M") ? 3 : 2;
            while (ret.length < n_parts + 1)  {
                if (fragments.length == 0) return ret;
                let c = fragments.shift();
                
                let idechild = idesymbol(c);
                
                if (idechild) {
                    ret.push(make_combination(idechild));
                } else {
                    ret.push(c);
                }
            }

            if (Array.isArray(ret[1]) && "OHUCFKL".indexOf(idep) != -1) {
                let ret0 = kumikae(ret);
                return ret0 ? ret0 : ret;
            }
            return ret;
        };

        subparts_fragment(knjf);
        return make_combination(fragments.shift());
    };
};

//// kanji_puzzle.js から一部改設計

let PartQuiz = function() {
    this.make = function(qwords, options)
    {
        var ret = {ans:"", tb:"", q:[]};
        if (!options) options = {};
        
        qwords.map((qword, i) => {
            return stringToArray(qword).map(c => {
                if (c.match(/^[ -~\s]?$/)) return;
                
                // 漢字分解
                var n = kanjifrag.split(c);
                var fragged = n.toString();
                ret.ans += fragged + "/";
                if (fragged == "X") n = [c];
                
                //分解結果の記録(問題作成ツール用)
                if (fragged !== c)
                    ret.tb += c + ":" + fragged.split(",").join("") + "/";
            });
        });
        
        // ansから番号リストを生成する
        const onestrokes = "一丨亅丿ノ乙乚𠃊丶";
        var kidx = this.make_list(ret.ans, options.openlist || onestrokes);
        this.ans = ret.ans;
        this.n = Object.keys(kidx).length;
        //console.log(this.ans);
        //console.log(qwords.length);
        return (Object.keys(kidx).length);
    };
    
    //これはload_quiz内に取り込むべき関数
    this.make_list = function(ans, openlist)
    {
        let count = {};
        ans.split(",").join("/").split("/").forEach(val => {
            if (val.length == 0 || val.match(/^[A-Z]$/)) return;
            if (("＿" + openlist).indexOf(val) != -1) return;
            
            if (!count[val]) count[val] = 0;
            count[val]++;
        });
        
        let kidx = {};
        let idx = 0;
        for (let key in count) {
            if (count[key] <= 1) continue;
            idx++;
            kidx[key] = idx;
        }
        
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

        //console.log(ops);

        let pos = 0;
        let evals = partquiz.qwords.map(w => {
            let ex = ops.slice(pos, pos + w.length).reduce((sum, v) => sum + v);
            pos += w.length;
            return {ex:ex, w:w};
        });
        //console.log(evals);

        partquiz.qwords = evals.sort((a,b) => {
            if (a.n != b.n) return b.n - a.n;
            if (a.ex != b.ex) return a.ex - b.ex;
            return (Math.random() * 2 - 1);
        }).map(v => v.w);
    };
    
    // 語を自動追加する(任意)
    this.select_random_words = () => {
        var exc = this.nchars.split("");//.filter(c => (cs.indexOf(c) == -1));
        var words = dic.find({num:[3,3], cs:[], ps:[], ctypes:{}, exc:exc}).shift();
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
                var key = "rbpc".split("").find(key => ctypes[key].indexOf(d) != -1);
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

let nodemain = () => {
    const getfile = (fname, cb) => {
        const fs = require('fs');
        const less = fs.readFileSync(fname, 'utf8');
        if (!cb) return less;
        cb(less);
    };

    kanjifrag.definelocal(REDEFINE);

    getfile("SKK-JISYO.ML.utf8", (txt) => { dic.load(txt); });
    getfile("fragtable.txt", (txt) => { kanjifrag.define(txt); });
    getfile("fragtable.plus.txt", (txt) => { kanjifrag.define(txt); });

    partquiz.qwords = makequiz.select_random_words().split("/").filter(w => w);
    let options = {};
    partquiz.make(partquiz.qwords, options);

    if (0)
    partquiz.qwords =
        '士大夫/国際化/脳卒中/枯草熱/攻玉社/柱時計/言語学/花柳界/北茨城/吉田茂/伊吹山/潜望鏡/主産物/御寮人/附加税/牽牛星/謝肉祭/軽合金/仲間割/理知的/膀胱癌/阿僧祇/成熟卵/固溶体/荒療治/弦楽器/空取引/焼林檎/陣太鼓/内沙汰/沖積層/交叉点/尊厳死/野薔薇'
        .split("/");
    //"政府米/氷河期/雲母引/上屋敷/信号場/知名度/化粧台/水溶液/麒麟児/充電器/撥音便/交換局/薄花色/双胴船/太陽年/監督官/定額法/大発会/向日葵/宇都宮/地蔵堂/担保物/腹具合/同位体/高楊枝/回覧板/若旦那/真木柱/序数詞/油揚本/曹洞宗/歳時記/漫画家/脳震盪/降誕祭"

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
    var window = {};
};

if (typeof window == "undefined") nodemain();

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
    $("#newest .qoption .qdesc").html('<div id="seekbar"></div><div id="seekval"></div>');
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
        //load_quiz({q:partquiz.qwords.join("/"), def:REDEFINE});
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
