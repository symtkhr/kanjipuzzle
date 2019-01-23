// noprotect
$(function() {
    show_menu();
});

var TimeCounter = function()
{
    var _count = 0;
    var _rotate = 0;
    var _intcount;
    var _handler = function(){};
    this.is_running = false;

    this.stop = function() {
        clearInterval(_intcount);
        this.is_running = false;
    };

    this.start = function(count) {
        console.log("start");
        _count = count;
        this.stop();
        _handler(_count);
        this.is_running = true;

        _intcount = setInterval(function() {
            _count++;
            _handler(_count);
        }, 1000);
    };

    this.count = function() {
        return _count;
    };

    this.set_handler = function(handler) {
        _handler = handler;
    };
};

/*
リファクタリング:
var splitbox = function(c, elm, hidden) -> $(c).prototype.splitbox(struct); にしたい. cは$cだし, hidden不要
*/
var splitbox = function(c, elm)
{
    if (elm.length == 1) {
        c = $("<div>").addClass("sbox").appendTo(c);
        elm = elm[0];
    }
	
    if (!Array.isArray(elm)) {
        c.addClass("elm").html(elm);
        return;
    }
   
    var make_box = {
        "N": function(c) {
            c.append('<div class="sbox" style="left:0;">');
            c.append('<div class="sbox" style="right:0;">');
            return [1, 0];
        },
        "M": function(c) {
            c.append('<div class="sbox" style="left:0;">');
            c.append('<div class="sbox" style="right:33%;">');
            c.append('<div class="sbox" style="right:0;">');
            return [2, 0];
        },
        "Z": function(c) {
            c.append('<div class="sbox" style="top:0;">');
            c.append('<div class="sbox" style="bottom:0;">');

            if (c.hasClass("L1")) c.children().eq(0).css({"width":"30%"}); // 題=是+頁
            return [0, 1];
        },
        "E": function(c) {
            c.append('<div class="sbox" style="top:0;">');
            c.append('<div class="sbox" style="bottom:33%;">');
            c.append('<div class="sbox" style="bottom:0;">');
            if (c.hasClass("L1")) {  // 勉=免+力, 翹=堯+羽
                c.next().css({"height":"85%", "width":"50%"});
                c.children().eq(0).css({"width":"50%"});
                c.children().eq(1).css({"width":"50%"});
            }
            return [0, 2];
        },
        "O": function(c) { // 国街裏
            c.append('<div class="sbox O1">');
            c.append('<div class="sbox" style="width:60%; height:60%; top:20%; right:20%;">');
            return [.5, .5];
        },
	
        "H": function(c) { //閃凧鬨同
            c.append('<div class="sbox H1">');
            c.append('<div class="sbox" style="width:60%; height:60%; bottom:0; right:20%;">');
	    
            if (c.hasClass("L1")) c.children().eq(1).css({"width":"20%", "left":"5%"}); // 颱=風+台
            return [.7, .5];
        },
        "U": function(c) { // 凵[興-同]
            c.append('<div class="sbox U1">');
            c.append('<div class="sbox" style="width:70%; height:70%; top:0; right:15%;">');
            return [.7, .5];
        },
	
        "C": function(c) { // 匚
            c.append('<div class="sbox C1">');
            c.append('<div class="sbox" style="width:70%; height:70%; right:0; top:15%;">');
            return [.5, .7];
        },
        "F": function(c) { //广厂病届戻
            c.append('<div class="sbox F1">');
            c.append('<div class="sbox" style="width:70%; height:70%; bottom:0; right:0;">');
	    
            if (c.hasClass("L1")) c.children().eq(1).css({"width":"85%", "height":"30%"}); // 彪=虎+彡
            return [.5, .5];
        },
        "K": function(c) { //気式戒匂
            c.append('<div class="sbox K1">');
            c.append('<div class="sbox" style="width:70%; height:70%; bottom:0; left:0;">');
            return [.5, .5];
        },
        "L": function(c) {
            c.append('<div class="sbox L1">');
            c.append('<div class="sbox" style="width:70%; height:70%; top:0; right:0;">');
            return [.5, .5];
        },
        "J": function(c) { //氷図
            c.append('<div class="sbox J1">');
            c.append('<div class="sbox" style="width:70%; height:70%; top:0; left:0;">');
            if (c.hasClass("K1")) { //武裁織
                c.next().css({"height": "33%"});
                c.children().eq(1).css({"height":"33%"});
            }
            return [.5, .5];
        },
        "Q": function(c) {
            c.append('<div class="sbox Q1">');
            c.append('<div class="sbox">');
            return [0, 0];
        },//null, // 坐幽楽盥弐匁
    };

    //make_box["Q"] = make_box["O"];
    
    var splitype = elm.shift();

    // 子要素の作成
    var splitrate = make_box[splitype](c);
    var div = {
        "x": splitrate[0],
        "y": splitrate[1]
    };
    var divch = [];

    //作成した子要素の割当(再起)
    var cc = c.children().eq(0);
    while (elm.length > 0) {
        var n = elm.shift();
        var d = splitbox(cc, n);
        divch.push(d ? d : {x:0, y:0});
        cc = cc.next();
        if (cc.length == 0) break;
    }

    //子要素の分割パラメータからサイズ調整
    if (splitype === "Z") {
        div.x += Math.max(divch[0].x, divch[1].x);
        div.y += divch[0].y + divch[1].y;

        var bunbo = divch[0].y + divch[1].y + 2;
        c.children().eq(0).css("height", ((divch[0].y + 1) / bunbo * 100) + "%");
        c.children().eq(1).css("height", ((divch[1].y + 1) / bunbo * 100) + "%");
    }

    if (splitype === "E") {
        div.x += Math.max(divch[0].x, divch[1].x, divch[2].x);
        div.y += divch[0].y + divch[1].y + divch[2].y;

        var bunbo = divch[0].y + divch[1].y + divch[2].y + 3;
        c.children().eq(0).css("height", ((divch[0].y + 1) / bunbo * 100) + "%");
        c.children().eq(1).css("height", ((divch[1].y + 1) / bunbo * 100) + "%")
                          .css("bottom", ((divch[2].y + 1) / bunbo * 100) + "%");
        c.children().eq(2).css("height", ((divch[2].y + 1) / bunbo * 100) + "%");
    }

    if (splitype === "N") {
        div.x += divch[0].x + divch[1].x;
        div.y += Math.max(divch[0].y, divch[1].y);

        var bunbo = divch[0].x + divch[1].x + 2;
        c.children().eq(0).css("width", ((divch[0].x + 1) / bunbo * 100) + "%");
        c.children().eq(1).css("width", ((divch[1].x + 1) / bunbo * 100) + "%");
    }

    if (splitype === "M") {
        div.x += divch[0].x + divch[1].x + divch[2].x;
        div.y += Math.max(divch[0].y, divch[1].y, divch[2].y);
        
        var bunbo = divch[0].x + divch[1].x + divch[2].x + 3;
        c.children().eq(0).css("width", ((divch[0].x + 1) / bunbo * 100) + "%");
        c.children().eq(1).css("width", ((divch[1].x + 1) / bunbo * 100) + "%")
                          .css("right", ((divch[2].x + 1) / bunbo * 100) + "%");
        c.children().eq(2).css("width", ((divch[2].x + 1) / bunbo * 100) + "%");
    }

    if ("OHUCFKLQJ".indexOf(splitype) != -1) {
        div.x += divch[0].x + divch[1].x;
        div.y += divch[0].y + divch[1].y;
    }
    
    return div;
};

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

//漢字分解ツール
var kanjiFragment = function()
{
    var dbglobal = {};
    var dblocal = {};

    this.define = function(globaldb) {
        globaldb.split("/").forEach(function(frag) {
            var k = frag.trim().split(":");
            var key = cdp2ucs(k[0]);
            dbglobal[key] = k[1];
        });
    };
    
    this.definelocal = function(localdb) {
        dblocal = {};
        if (!localdb) {
            return;
        }
        localdb.split("/").forEach(function(frag) {
            var k = frag.trim().split(":");
            var key = cdp2ucs(k[0]);
            dblocal[key] = k[1];
        });
    };

    var referdb = function(c) {
        if (typeof dblocal[c] !== "undefined")
            return dblocal[c];
        return dbglobal[c];
    };

    this.db = referdb;
    
    var kumikae = function(ret) {
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

        var make_combination = function(idep) {
            var ret = [idep];
            var n_parts = (idep == "E" || idep == "M") ? 3 : 2;
            while (ret.length < n_parts + 1)  {
                if (fragments.length == 0) return ret;
                var c = fragments.shift();
                
                var idechild = idesymbol(c);
                
                if (idechild) {
                    ret.push(make_combination(idechild));
                } else {
                    ret.push(c);
                }
            }

            if ($.isArray(ret[1]) && "OHUCFKL".indexOf(idep) != -1) {
                var ret0 = kumikae(ret);
                return ret0 ? ret0 : ret;
            }
            return ret;
        };

        subparts_fragment(knjf);
        return make_combination(fragments.shift());
    };
};

var kanjifrag = new kanjiFragment();
var timer = new TimeCounter();

//これはload_quiz内に取り込むべき関数
var make_list = function(ans, openlist)
{
    if (!openlist) openlist = "";
    var count = {};
    ans.split(",").forEach(function(val) {
        if (val.length == 0 || val.match(/^[A-Z]$/)) return;
        if (("一丨亅丿乙乚丶＿" + openlist).indexOf(val) != -1) return;

        if (!count[val]) count[val] = 0;
        count[val]++;
    });


    var kidx = {};
    var idx = 0;
    for (var key in count) {
        if (count[key] <= 1) continue;
        idx++;
        kidx[key] = idx;
    }

    if (typeof dump_partstable !== "undefined")
        dump_partstable(kidx, count);
    
    return kidx;
};

var save_status = function(qid)
{
    if ((!timer.is_running)) {// ($(".qoption").eq(qid - 1).hasClass("resume"))) {
        qid = -1;
    }

    if (qid < 0) {
        document.cookie = "tempopreserve=";
        return;
    }

    var undone = $('.kidx.undone').map(function() {
        return parseInt($(this).text());
    }).get().filter((x, i, self) => (self.indexOf(x) == i));

    var time = timer.count();
    var pt = parseInt($("#point").text(), 10);

    var date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    var expired = ";expires=" + date.toGMTString();

    var val = qid + "<>" + pt + "<>" + time + "<>" + undone.join(",")
        + "<>" + $("#g_log").val();
    var cookie = "tempopreserve=" + encodeURIComponent(val);
    document.cookie = cookie + expired;
};

var load_status = function()
{
    var is_valid = false;
    var res = {};
    
    document.cookie.split(";").forEach(function(param) {
        var p = param.split("=");
        if (p[0].trim() != "tempopreserve") return;
        var data = decodeURIComponent(p[1]).split("<>");
        console.log(data);

        if (data.length < 5) return;
        res.qid = data.shift();
        res.pt = data.shift();
        res.time = parseInt(data.shift());
        res.undone = data.shift().split(",");
        res.logs = data.join("<>");
        is_valid = true;
    });

    if (!is_valid) return false;
    if (!res.qid) return false;

    // 再開時のデータ展開
    $(".qoption").eq(res.qid - 1).addClass("resume").click(function() {
        var qid = $(this).addClass("selected").find(".qid").text();
        $(this).find(".loading").text("再開").animate({"color":"#ccf"}, function() {
            
            $(".kidx").removeClass("undone").hide().next().show();
            res.undone.forEach(function(kid) {
                $(".kidx" + kid).addClass("undone").show().next().hide();
            });
            //全パーツが開いたグリフを表示
            $(".glyph").each(function() {
                if ($(this).find(".undone").size() > 0) return;
                var n = $(this).parent().find(".glyph").index($(this));
                $(this).find(".correct").show();
                $(this).find(".elm div").hide();
            });
            
            $("#g_log").val(res.logs);
            $("#point").text(res.pt);
            timer.start(res.time + 1);
        });
    });

    $("#erase_resume").show().click(function() {
        save_status(-1);
        $(this).hide();
        $(".qoption.resume").removeClass("resume").unbind().click(function() {
            if (!$("#fragtable").hasClass("done")) return;
            var qid = $(this).addClass("selected").find(".qid").text();
            $('<div>').addClass("loading").text("読込中").appendTo(this)
                .animate({"opacity":".5"}, function() { load_quiz(qid); });
            $(this).siblings(".qoption").animate({"opacity": "0"});
        });
    });
    return true;
};


var load_quiz = function(qid)
{
    $(window).on('beforeunload', function(event) {
        save_status(qid);
        return;
    });
    
    $(".qid").html(qid);
    var quiz = quiztable[qid - 1];
    var qlist = quiz.q;
    var ans = "";
    kanjifrag.definelocal(quiz.def);

    $("#knjtb").val("");
    $("#quiz").html('');
    $("#wordlist").val(qlist);
    $("#redefine").val(quiz.def);

    if (quiz.genre) {
        $("#genre").text(quiz.genre);
    }
    
    // 語リストから以下のDOM要素を生成 + ansに分解結果を記録
    // .word
    //  .glyph
    //  (.sbox)
    //    .elm.qelm
    //      .kidx.undone [15]
    //      .kpart [木]
    //    .elm
    //      .kpart [寸]
    //    .correct [村]
    qlist.split("/").forEach(function(qword, i) {
        var $word = $("<div>").addClass("word").appendTo("#quiz");
        $word.css("padding", "0 0 0 5px");
        $("<div>").css({"width":"100%", "color":"green", "background-color":"", "font-size":"12px", "font-family":"monospace", "text-align":"right"})
            .html("["+("00"+(1+i)).substr(-2)+"]").appendTo($word);
        stringToArray(qword).forEach(function(c) {
            if (c.match(/^[ -~\s]?$/)) return;
            var $glyph = $('<div class="glyph">').appendTo($word)
            var n = kanjifrag.split(c);
            var fragged = n.toString();
            ans += fragged + ",";
            
           //分解結果の記録(問題作成ツール用)
           if (fragged !== c)
               $("#knjtb").val($("#knjtb").val() + c + ":" + fragged.split(",").join("") + "/");

           if (fragged == "X") n = [c];
           splitbox($glyph, n, false);
           $glyph.append('<div class="correct">' + c + '</div>');

           //かな文字の場合
           if (c.match(/^[ぁ-ン]$/)) {
               //$glyph = $(".word:last-child .glyph:last-child");
               $glyph.addClass("hiragana");
           }
        });
    });

    // ansから番号リストを生成する
    var kidx = make_list(ans);

    // 分割DOM要素内に部首または番号を表示
    $(".elm").each(function(){
        var c = $(this).text();
        $(this).html("");
        if (c == "＿") {
            $(this).parent().remove();
            return;
        }

        // 番号表示
        if (kidx[c]) {
            $(this).addClass("qelm");

            var $npart = $(this).html('<div>' + kidx[c] + "</div>").find("div:last");
            $npart.addClass('kidx undone kidx' + kidx[c]);

            var boxclass = $(this).parent().prop("class") + $(this).parent().parent().prop("class");
            // にょう・はこの番号は左下に配置
            if (boxclass.indexOf("L1") != -1 || boxclass.indexOf("U1") != -1 ) {
                $npart.css({"bottom":0, "top":"auto", "text-align": "left"});
            }
            // 四方構・右上構の番号は右上に配置
            if (boxclass.indexOf("K1") != -1 || boxclass.indexOf("O1") != -1 ) {
                $npart.css({"text-align":"right"});
            }
            // かなの番号はセンタリング
            if (boxclass.indexOf("hiragana") != -1 ) {
                $npart.css({"top":"20px", "bottom":"auto"});
            }
         }

        // 部首表示: 枠内目一杯に表示
        var $kpart = $('<div>').addClass("kpart").appendTo(this);
        var style = {};
        var h = $(this).innerWidth() + 'px';
        style['font-size'] = h;
        style['height'] = h;
        style['line-height'] = h;
        style['transform'] = 'scale(1, ' + $(this).innerHeight() / $(this).innerWidth() + ')';

        // 部首表示: 番号付きならば伏せる
        if ($(this).hasClass("qelm")) $kpart.hide();

        var name = c.match(/^&([^;]+);$/);
        if (!name) {
            $kpart.append(c).css(style);
            return;
        }

        var gaiji = cdp2ucs(c);
        if (gaiji != c) {
            $kpart.append(gaiji).css(style);
            return;
        }

        // 部首表示: glyphwikiからロードする
        $("head").append('<link rel="stylesheet" href="http://glyphwiki.org/style?glyph=' + name[1] + '">');
        style["font-family"] = name[1];
        $kpart.append("〓").css(style);
        return;
        
        // 部首表示: フォントがない場合はSVGを使う(いちおう残し?)
        var $svg = $("#" + name[1]);
        if ($svg.size() > 0) {
            $kpart.append($svg.clone().show()).css(style);
            return;
        }

        // 部首表示: 諦めてそのまま表示
        $kpart.append(c).css(style);
    });

    //枠外クリックで選択外し
    $(document).on('click', function(e) {
        if ($(e.target).closest('.word').length != 0) return;
        if ($(e.target).closest('#keyinput').length != 0) return;
        $(".glyph").removeClass("selected");
        $(".elm").css("background-color", "");
        $("#keyinput").hide();
    });

    // カウントアップタイマのイベントハンドラ
    var qlen = (Object.keys(kidx).length);
    timer.set_handler(function(count) {
        $('#time').html(count);
        var bpm = qlen * 60 / (count);
        $("#bonus").html(parseInt((bpm * bpm) * 20));
    });

    //枠内クリックで入力欄表示
    $(".elm").click(function() {
        var $glyph = $(this).parents(".glyph");
        var $word = $glyph.parents(".word").css("position", "relative");
        var classname = $(this).find(".kidx").html();
        $(".elm").css("background-color", "");
        $(".kidx" + classname).parent().css("background-color", "#8cf");
        $("#judge").hide();
        $(".glyph").removeClass("selected");
        $glyph.addClass("selected");
        
        console.log($word.height() - $glyph.position().top);
        var $ki = $("#keyinput").appendTo($word).show();
        $ki.css(
            {"width": $word.width() - $glyph.position().left,
             "left" : $glyph.position().left,
             "bottom": ($word.height() - $glyph.position().top) });
        $(".userans").show().css({"width": "100%"}).focus().select();

        if ($(this).parents(".word").find(".correct:hidden").size() == 0) {
            $ki.hide();
        }
        
        var $kidx = $(this).find(".kidx");
        if ($kidx.hasClass("undone") || !classname) {
            $("#discover").html("");
        } else {
            $("#discover").html("(" + classname + " = <span class='cdpf'>"  + $kidx.next().html() + "</span>)");
        }
        //if (!timer.is_running) timer.start(0);
    });

    $("#sh input").keypress(function(e){
        if (e.which != 13) return;
        //全角半角
        var val = $(this).val().replace(/[！-ｚ]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x20 - 0xff00);
        });
        console.log(val);
        var m = val.trim().match(/^p([0-9]+)/i);
        if (m) {
            console.log(m);
            var classname = m[1];
            $(".elm").css("background-color", "");
            $(".kidx" + classname).parent().css("background-color", "#8cf");
            $(this).select();
            return;
        }
        var m = val.trim().match(/^([0-9]+)([^0-9-]+)$/);
        if (m) {
            var value = m[2];
            var $glyphs = $(".word").eq(m[1]-1).find(".glyph");
            var pos = 0;
            for (; pos < $glyphs.size() && "?・*".indexOf(value.charAt(pos)) != -1 ; pos++);
            $(".glyph").removeClass("selected");
            console.log(pos);
            $glyphs.eq(pos).addClass("selected");

            answer_check(value);
        }
        var m = val.trim().match(/^([0-9]+)([^0-9]+)([0-9]+)([^0-9]+)$/);
        if (m) {
            var value = m[4];
            var $glyphs = $(".word").eq(m[1]-1).find(".glyph");
            $(".glyph").removeClass("selected");
            console.log(pos);
            $glyphs.eq(m[3]-1).addClass("selected");
            answer_check(value);
        }
        $(this).select();
    });
    
    $(".userans").keypress(function(e){
        if (e.which != 13) return;

        //数字入力は語番号選択扱い
        var val = $(this).val().replace(/[０-９：]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x20 - 0xff00);
        });
        console.log(val);
        var wid = val.match(/[0-9]+/);
        if (wid) {
            console.log(wid);
            $(".word").eq(wid - 1).find(".glyph:first").find(".elm:first").click();
            return;
        }
        answer_check($(this).val());
    });

    var answer_check = function(value)
    {
        //var c = $(".glyph.selected").prop("class");
        var $selected = $(".glyph.selected");
        $("#judge").show();

        //かな不在の語はかな入力を無視
        if ($selected.parent().find(".hiragana .qelm").size() == 0) {
            value = value.match(/[一-龠]/g).join("");
            $(".userans").val(value);
        }

        var g_log = $("#g_log").val() + ";[" + timer.count() + "]";
        var seikai = 0;
        var trate = 0;

        //1文字ずつ正解判定
        value.split("").forEach(function(c, i) {
            //途中に誤答があれば以降は判定しない
            if (seikai < i) return;

            g_log += c;
            //正解判定
            console.log($selected.find(".correct").text());
            if (c != $selected.find(".correct").text()){ g_log += "x"; return; }
            seikai++;

            //加点計算
            if (!$selected.hasClass("hiragana")) {
                var rate = $selected.find(".kidx.undone").size() / $selected.find(".elm").size() * 10;
                trate += rate;
            }

            $selected = $selected.next();
            //かなが解答対象でなければスキップ
            if ($selected.hasClass("hiragana") && $selected.find(".qelm").size() == 0)
                $selected = $selected.next();
        });

        //伏せられていた割合に応じて加点
        trate = trate / $(".glyph.selected").parent().find(".glyph").size();
        var pt = parseInt($("#point").text(), 10) + trate * trate * 9;
        console.log(trate);

        $("#g_log").val(g_log).show();
        
       if (0 == seikai) {
           $("#judge").css("color", "red").html("×");
           setTimeout(function() { $("#judge").fadeOut(200); }, 300);
           return;
       }

       //パーツ開け
       var opened = 0;
       var $selected = $(".glyph.selected");
       for (var i = 0; i < seikai; i++) {
           $selected.find(".elm").each(function() {
               //console.log($(this).html());
               var c = $(this).find(".kidx");
               if (c.hasClass("undone")) opened++;
               if (!c || !c.html()) return;
               c = c.prop("class").match(/kidx([0-9]+)/);
               if (!c) return;
               //console.log(c);
               $("." + c[0]).removeClass("undone");
               $("." + c[0]).hide().next().show();
           });
           $selected = $selected.next();
           if ($selected.hasClass("hiragana") && $selected.find(".qelm").size() == 0)
               $selected = $selected.next();
       }
       //開けたパーツの数に応じて加点
       pt += opened * opened;

       console.log(opened);
       $("#point").html(parseInt(pt, 10));

       $("#judge").css("color", "green").html("○");
       setTimeout(function() { $("#judge").fadeOut(200); }, 300);

       //全パーツが開いたグリフを表示
       $(".glyph").each(function() {
            if ($(this).find(".undone").size() > 0) return;
            var n = $(this).parent().find(".glyph").index($(this));
            $(this).find(".correct").show();
            $(this).find(".elm div").hide();
        });
    
        $(".userans").select();
        if ($(".kidx.undone").size() == 0) show_ending();
    };

    var light = 0;
    $(document).keydown(function(e) {
        if (e.ctrlkey && $(".glyph.selected").size() == 0)
            $(".glyph").eq(0).find(".kidx").eq(0).click();

        if (!e.ctrlKey) return;
        if (e.keyCode == 13) return;
        if ($(".correct:hidden").size() == 0) return;

        // Ctrl + 上下キー
        if (e.keyCode == 40 || e.keyCode == 38) {
            var $elms = $(".selected").find(".kidx");
            var max = $elms.size();
            if (e.keyCode == 40){ light++; }
            if (e.keyCode == 38){ light--; }
            $elms.eq((light + max) % max).click();
            return;
        }

        // Ctrl + 左右キー
        if (e.keyCode == 39 || e.keyCode == 37) {
            light = 0;
            var max = $(".glyph").size();
            for(var i = 0; i < max; i++) {
                var n = $(".glyph").index($(".glyph.selected"));
                if (e.keyCode == 39){ n++; }
                if (e.keyCode == 37){ n--; }
                n = (n + max) % max;
                $(".glyph").eq(n).find(".kidx").eq(0).click();
                if (!$("#keyinput").is(":hidden")) break;
            }
        }
    }).keyup(function(e) {
        if (!e.ctrlKey) return;
        if ((e.keyCode != 39) && (e.keyCode != 37)) return;
        $(".userans").select();
    });
    
    $("#main").show();
    $("#menu, #keyinput").hide();
    timer.start(0);
};

var show_menu = function()
{
    quiztable.forEach(function(factor, idx) {
        //var q = decodeURIComponent(escape(atob(factor[0])));
        var q = factor.q;
        quiztable[idx].q = q;
        var words = q.split("/");
        var $option = $('<div>').addClass("qoption").appendTo("#qlists");
        $('<div>').addClass("qid").appendTo($option).text(1 + idx);
        $('<div>').addClass("qinfo").appendTo($option).html(words.length + "語 " + words.join("").length + "字 " + factor.n + "部首" + "<br />" + factor.author);
        $('<div>').addClass("qdesc").appendTo($option).html(factor.desc);
        if (quiztable.length - idx <= 10) $option.addClass("newest");
    });
    $("#archives").click(function() {
	if ($(this).hasClass("open")) {
	    $(".qoption").hide();
	    $(".qoption.newest").show();
	    $(this).removeClass("open").text("昔のを表示");
	} else {
	    $(".qoption").show();
	    $(this).addClass("open").text("昔のを隠す");
	}
    });


    $(".qoption").click(function() {
        if (!$("#fragtable").hasClass("done")) return;
        var qid = $(this).addClass("selected").find(".qid").text();
        $('<div>').addClass("loading").text("読込中").appendTo(this)
            .animate({"opacity":".5"}, function() { load_quiz(qid); });
        $(this).siblings(".qoption").animate({"opacity": "0"});
    });
    $("#main").hide();
    $("#menu").show();
    $("#rule").hide();
    $("#sh").hide();
    
    load_status();

    $("#showrule").click(function() {
        $('#rule').toggle();
    });
    $("#shen").click(function() {
        $(this).hide();
        $("#sh").show();
    });

    $("#fragtable").load(function(){
        var txt = $(this).contents().find("body").text();
        kanjifrag.define(txt);
        $(this).addClass("done");
    });

    if (location.href.indexOf("#debug") < 0) return;
    $.getScript("./makequiz_tool.js");
    $.getScript("./jisho_tool.js");

};

var show_ending = function()
{
    timer.stop();
    $(document).unbind();
    var qid = parseInt($(".qid:last").text()) - 1;

    var bpm = quiztable[qid].n * 60 / timer.count();
    var pt = parseInt($("#point").text(), 10);
    var tpt = parseInt((bpm * bpm) * 20);
    
    $("#point").text(pt);
    $(".tpoint").html(pt + tpt);
    $("#score").show();
    $("#message").fadeIn().click(function() {
        $(this).fadeOut();
    });
};

