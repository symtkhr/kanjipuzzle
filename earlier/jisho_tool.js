$(function() {

    //語検索用の辞書ロード
    var wordDb = {};
    $("#dicload").click(function() {
        wordDb = {};
        const ongetfile = (dic) => {
            let data = dic.split("\n");
            data.forEach(function(txt) {
                if (txt.match(/^;/)) return;
                var keys = txt.split("/");
                var kana = keys.shift();
                keys.pop();
                if (!kana) return;
                keys.forEach(function(key) {
                    var ws = key.split(";");
                    key = ws.shift();
                        if(key.match(/^[!-~]+$/)) return;
                    if(key.length < 2) return;
                    if(!wordDb[key]) wordDb[key] = "";
                    wordDb[key] += kana;
                    if(ws.length != 0)
                        wordDb[key] += ws.pop();
                });
            });
            $("#dicloaded").append("[読込済]").show();
            $("#ifdicload").show();
        };

        $("#dicloader").hide();
        $("#dicloaded").html("");
        $("#dicloader label :checked").each(function() {
            let filename = $(this).parent().text().trim();
            if (!filename) return;
            $.get("../dicts/" + filename, dic => { ongetfile(dic); }).fail(function() {
                $("#dicloaded").append("[失敗]");
            });
        });

        let file = $("#dicloader input[type=file]").get(0).files[0];
        if (!file) return;
        let gettext = async (blob) => {
            const dic = await blob.text();
            ongetfile(dic);
            let undef = Object.keys(wordDb).reduce((ret,w) =>
                [...ret, ...Array.from(w).filter(c => ("\u2e80" <= c) && !c.match(/[ぁ-ー！-￮]/) && ret.indexOf(c) < 0 && _SKKTABLE.indexOf(c) < 0 && !kanjifrag.db(c))],
                []).sort();
            if (!undef.length) return $("#dicalert").hide();
            $("#dicalert").show().text("\n未定義文字=" + undef.map(c=>c+":").join("/"));
        };
        return gettext(new Blob([file], { type: "text/plain" }));
    }).click();

    $("#dicloaderopen").click(function() {$("#dicloader").toggle();});

    //語検索I/F
    $("#chars, #nchars, #numof").keydown(function(e){
        if(e.keyCode != 13) return;
        findwords();
    });

    //部品一覧
    $("#showparts").click(function() {
        if (0 < $("#partlist div").size()) {
            let $fbox = $("#partlist");
            if ($fbox.is(":visible")) {
                $fbox.hide();
            } else {
                $fbox.show();
            }
            return;
        }
        let list = partslist(true); // = {"部首": n}
        let $list = $("#partlist").css({"line-height":"10px"}).show();

        Object.keys(list).sort()
	    .forEach(c => draw_partbox(c, list[c], $list));
    });
    
    //既使用字の展開
    var append_to_but = function() {
        if (!$("#addbut").prop("checked")) return;
        let txt = $("#nchars").val().split("/").shift();
        txt += "/" + $("#wordlist").val().replace(/\(.+\)/g, "").split("/").join("");
        $("#nchars").val(txt);
    };
    
    //語検索
    var findwords = () => {
        append_to_but();
	find_chars_with_existing_parts(true);

	if ($("#chars").val() === "") $("#chars").val("/rp");

        var cs = $("#chars").val().split("");
        var ps = stringToArray($("#parts").val());
        var num = $("#numof").val().split("-");
        var exc = $("#nchars").val().split("").filter(c => (cs.indexOf(c) == -1));

	if ($("#chars").val() === "*") cs = [];
        if ($("#nchars").val() === "") exc = [];
        if ($("#parts").val() === "*") ps = [];

        $("#foundwords").html("searching...");

        //指定パーツを分割しない
        kanjifrag.definelocal($("#redefine").val() + "/" + ps.join(":/") + ":/");

        //色付き判定
        if ($("#glyphcolor").prop("checked")) {
            var maskch = {};
            maskch.r = $(".maskr .fchar").map(function() { return $(this).text(); }).get().join("");
            maskch.b = $(".maskb .fchar").map(function() { return $(this).text(); }).get().join("");
            maskch.p = $(".maskp .fchar").map(function() { return $(this).text(); }).get().join("");
            maskch.c = $(".maskc .fchar").map(function() { return $(this).text(); }).get().join("");
        }

        setTimeout(() => {
            if (num.length == 1) num[1] = num[0];
            if (num.length == 0) num = [2, 2];

            //該当語の絞り込み
            var words = Object.keys(wordDb).filter(function(word) {
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
		    var target = cs.map(v => (maskch[v] || "")).join("");
                    //赤青以外の文字がないかチェック
                    if (word.split("").some(d => (target.indexOf(d) == -1))) return;
                }

                // 包含部品チェック
                if ($("#parts").val() !== "") {
                    var frag = word.split("").reduce((frag, d) => frag + kanjifrag.split(d), "");
                    if (ps.some(p => (frag.indexOf(p) == -1))) return;
                }
                return true;
            });

            // 結果表示
            $("#foundwords").show().text("");
            if (words.length == 0) {
                $("#foundwords").show().text("No results");
                return;
            }
            if($("#factorsort").prop("checked")) {
                factorsort(cs[0], words);
            } else {
                words.forEach(function(word) {
                    var $word = $("<span>").addClass("fword").text(word).appendTo("#foundwords");
                    $word.after(", ");
                });
            }

            $(".fword").each(function() {
                var word = $(this).text();
                var $word = $(this);
                //色付け
                if ($("#glyphcolor").prop("checked")) {
                    $word.html(word.split("").map(function(d) {
                        var key = "rbpc".split("").find(key => maskch[key].indexOf(d) != -1);
                        return key ? ('<span class="mask' + key + '">' + d + '</span>') : d;
                    }).join(""));
                }
                //かな付け
                var kana = "(" + wordDb[word].replace(/ $/,"") + ")";
                var $kana = $("<span>").addClass("fkana").text(kana).appendTo($word);
            });


            //パーツ辞書を元に戻す
            kanjifrag.definelocal($("#redefine").val());

            $("#skana").change();
            $(".fword").click(function() {
		if ($(this).hasClass("selected")) {
                    var text = $("#wordlist").val().replace(/\(.+?\)/g, "").replace(/\/+$/, "") +
			"/(" + $(this).text().split("(").shift() + ")";
                    $("#wordlist").val(text).parents().show().next(".minimized").remove();
                    make_quiz(true);
        } else {
            $(".fword").removeClass("selected");
            $(this).addClass("selected");
        }
            });

        }, 20);
    };

    //位置ソート
    var sort_position = function(c) {
        var ret = [];
        $(".fword").each(function() {
            var word = $(this).text().split("(").shift();
            var pos = word.indexOf(c);
            if (!ret[pos]) ret[pos] = [];
            ret[pos].push($(this).html());
        });
        var $ret = $("#foundwords").html("");
        ret.forEach(function(words) {
            $ret.append(words.join(",") + "◆");
        });

    };
    //検索結果文字クリック時のイベント
    var fchar_events = function() {
        $(".fchar").unbind().click(function() {
            if ($(this).hasClass("selected")) {
                $("#chars").val($(this).text());
                findwords();
            } else {
                $(".fchar").removeClass("selected");
                $(this).addClass("selected");
            }
        });
    };


    //複合語ソート
    var factorsort = function(c, words) {
        var ret = {"_":[]};
        words.forEach(function(word) {
            var pos = word.indexOf(c);
            var hit = 0;
            //wordからcを含む二字熟語bicharを抽出する
            [pos - 1, pos].forEach(function(pos) {
                if (pos < 0) return;
                var bichar = word.substr(pos, 2);
                if (bichar.length != 2) return;
                //二字熟語が存在するか
                if (!wordDb[bichar]) return;
                //二字熟語と語全体の読みが一致するか
                if (!wordDb[bichar].split(" ")
                    .some(kana => (kana != "") && (wordDb[word].indexOf(kana) != -1))) return;
                //登録
                hit++;
                if (!ret[bichar]) ret[bichar] = [];
                ret[bichar].push(word);
            });
            //未登録
            if(hit == 0)
                ret["_"].push(word);
        });

        //結果表示
        $("#foundwords").html("");

        Object.keys(ret).sort(function(a,b) {
            var d = a.indexOf(c) - b.indexOf(c);
            if (d != 0) return d;
            return wordDb[a] < wordDb[b] ? -1 :1;
        }).forEach(function(key) {
            if (key == "_") return;
            if (ret[key].length < 2) {
                ret["_"].push(ret[key][0]);
                return;
            }
            var $map = ret[key].map(word => '<span class="fword">' + word + '</span>');
            $("#foundwords").append($map.join(", ") + "◆");
        });
        var $map = ret["_"].map(word => '<span class="fword">' + word + '</span>');
        $("#foundwords").append($map.join("/"));
    };
    
    //かな表示
    $("#skana").change(function() {
        if ($(this).prop("checked"))
            $(".fkana").show();
        else
            $(".fkana").hide();
    });

    //字検索I/F
    $("#parts").keydown(function(e){
        if(e.keyCode != 13) return;
        find_parts($(this).val());
    });

    $("#partlist, #op, #statbox").on("click", ".setpartbox", function() {
	//$("body").append("[click]");
	if ($(this).hasClass("selected")) {
	    $(this).removeClass("selected");
            var $key = $(this).find(".setpart").text();
            $("#parts").val($key);
            find_parts($key);
	    return;
	}
	$(".setpartbox").removeClass("selected");
	$(this).addClass("selected");
    });
    $("#makequiz").on("click", function(e) {
        if ($(e.target).closest('.setpartbox').length != 0) return;
	$(".setpartbox").removeClass("selected");
    });
    
    //字検索
    var find_parts = function(val) {
        append_to_but();

        $("#parts_ret").text("Searching...").parents().show().next(".minimized").remove();
        setTimeout(function() {
            $("#parts_ret").text("");
            if (val == "*" || val == "") return find_chars_with_existing_parts();
            var queries = stringToArray(val);
            if (!queries) return "";

	    var maskch = $("#glyphcolor").prop("checked") ? 
		find_chars_with_existing_parts(true) : {};
            
            //指定パーツを分割しない
            kanjifrag.definelocal($("#redefine").val() + "/" + queries.join(":/") + ":/");
            
            //_SKKTABLEの各文字について調べる
            var ret = _SKKTABLE.split("").filter(function(c) {
                var n = kanjifrag.split(c).toString() + ",";
                return (!queries.some(val => (n.indexOf(val) == -1)));
            });
            
            //結果表示
            $("#parts_ret").append("(" + ret.length + ")");
            ret.forEach(function(c) {
                var $c = $("<span>").addClass("fchar").text(c).appendTo("#parts_ret");
                if ($("#nchars").val().indexOf(c) != -1) $c.before("[").after("]");
                if (!$("#glyphcolor").prop("checked")) return;
                //色付け
                "rbpc".split("").forEach(function(key) {
                    var cname = "mask" + key;
                    if (maskch[key].indexOf(c) != -1) $c.addClass(cname);
                });
            });
            fchar_events();

            //パーツ辞書を元に戻す
            kanjifrag.definelocal($("#redefine").val());
        }, 100);
    };

    //既存部品字
    var find_chars_with_existing_parts = function(is_hidden) {
        //既存部品リスト
        var queriesR = $("#op .fragkey").map(function() { return $(this).text(); }).get();
        var queriesB = $("#op .barekey").map(function() { return $(this).text(); }).get();

        var maskch = _SKKTABLE.split("").reduce(function(ret, c) {
            //既使用字は除外
            if ($("#wordlist").val().indexOf(c) != -1) return ret;

            //分解
            var n = kanjifrag.split(c);
            var s = n.toString().match(/(&.+?;)|[(\[].+?[)\]]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^ -~]/g);
            if (!s) return ret;

            //分解部品と既存パーツとの比較(r:番号パーツ,b:Openパーツ)
            var psize = s.reduce(function(part, val) {
                if (queriesR.join(",").indexOf(val) != -1) part.r++;
                if (queriesB.join(",").indexOf(val) != -1) part.b++;
                return part;
            }, {r:0, b:0});

            //red:番号パーツのみで全伏せ
            if (psize.r == s.length) ret.r += c;
            //blue:Openパーツで全伏せ
            else if (psize.r + psize.b == s.length) ret.b += c;
            //pink:番号パーツのみで準全伏せ
            else if (0 < psize.r && (psize.r + 1 == s.length)) ret.p += c;
            //cyan:Openパーツを含む
            else if (0 < psize.b) ret.c += c;
            return ret;
        }, {r:"", b:"", p:"", c:""});

        //結果表示
        for (var key in maskch) {
            var fchars = maskch[key];
            var $div = $("<div>").addClass("maskful mask" + key).appendTo("#parts_ret")
                .text("(" + fchars.length + ")").hide();
            fchars.split("").forEach(function(c) {
                $div.append('<span class="fchar">' + c + "</span>");
            });
        }
        if (is_hidden) return maskch;
         $(".maskful").show();
        fchar_events();
        return maskch;
    };


});

// パーツリスト
var partslist = function(is_counting) {
    var ans = "";
    var list = {};

    _SKKTABLE.split("").forEach(c => kanjifrag.split(c).toString().split(",").forEach(p => {
        if (p.length == 0 || p.match(/^[A-Z]$/)) return;
        if (!list[p]) list[p] = 0;
        if (is_counting) list[p]++;
    }));

    return list;
};

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
