// noprotect
$(function() {
    $("#rule, #sh, #continue, #main, #menu").hide();
    load_qlist();
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

class Random {
  constructor(seed = 12345) {
    this.a = 102030405;
    this.b = 314159265;
    this.c = 271828183;
    this.d = seed;
  }

  next() {
    var t = this.a ^ (this.a << 11);
    this.a = this.b;
    this.b = this.c;
    this.c = this.d;
    return this.d = (this.d ^ (this.d >> 19)) ^ (t ^ (t >> 8));
  }
}

var splitbox = function($c, elm)
{
    if (elm.length == 1) {
        $c = $("<div>").addClass("sbox").appendTo($c);
        elm = elm[0];
    }
	
    if (!Array.isArray(elm)) {
        $c.addClass("elm").html(elm);
        return;
    }
   
    var make_box = {
        "N": function($c) {
            $c.append('<div class="sbox" style="left:0;">');
            $c.append('<div class="sbox" style="right:0;">');
            return [1, 0];
        },
        "M": function($c) {
            $c.append('<div class="sbox" style="left:0;">');
            $c.append('<div class="sbox" style="right:33%;">');
            $c.append('<div class="sbox" style="right:0;">');
            return [2, 0];
        },
        "Z": function($c) {
            $c.append('<div class="sbox" style="top:0;">');
            $c.append('<div class="sbox" style="bottom:0;">');

            if ($c.hasClass("L1")) $c.children().eq(0).css({"width":"30%"}); // 題=是+頁
            return [0, 1];
        },
        "E": function($c) {
            $c.append('<div class="sbox" style="top:0;">');
            $c.append('<div class="sbox" style="bottom:33%;">');
            $c.append('<div class="sbox" style="bottom:0;">');
            if ($c.hasClass("L1")) {  // 勉=免+力, 翹=堯+羽
                $c.next().css({"height":"85%", "width":"50%"});
                $c.children().eq(0).css({"width":"50%"});
                $c.children().eq(1).css({"width":"50%"});
            }
            return [0, 2];
        },
        "O": function($c) { // 国街裏
            $c.append('<div class="sbox O1">');
            $c.append('<div class="sbox" style="width:60%; height:60%; top:20%; right:20%;">');
            return [.5, .5];
        },
	
        "H": function($c) { //閃凧鬨同
            $c.append('<div class="sbox H1">');
            $c.append('<div class="sbox" style="width:60%; height:60%; bottom:0; right:20%;">');
	    
            if ($c.hasClass("L1")) $c.children().eq(1).css({"width":"20%", "left":"5%"}); // 颱=風+台
            return [.7, .5];
        },
        "U": function($c) { // 凵[興-同]
            $c.append('<div class="sbox U1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; top:0; right:15%;">');
            return [.7, .5];
        },
	
        "C": function($c) { // 匚
            $c.append('<div class="sbox C1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; right:0; top:15%;">');
            return [.5, .7];
        },
        "F": function($c) { //广厂病届戻
            $c.append('<div class="sbox F1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; bottom:0; right:0;">');
	    
            if ($c.hasClass("L1")) $c.children().eq(1).css({"width":"85%", "height":"30%"}); // 彪=虎+彡
            return [.5, .5];
        },
        "K": function($c) { //気式戒匂
            $c.append('<div class="sbox K1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; bottom:0; left:0;">');
            return [.5, .5];
        },
        "L": function($c) {
            $c.append('<div class="sbox L1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; top:0; right:0;">');
            return [.5, .5];
        },
        "J": function($c) { //氷図
            $c.append('<div class="sbox J1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; top:0; left:0;">');
            if ($c.hasClass("K1")) { //武裁織
                $c.next().css({"height": "33%"});
                $c.children().eq(1).css({"height":"33%"});
            }
            return [.5, .5];
        },
        "Q": function($c) {
            $c.append('<div class="sbox Q1">');
            $c.append('<div class="sbox">');
            return [0, 0];
        },//null, // 坐幽楽盥弐匁
    };

    //make_box["Q"] = make_box["O"];
    
    var splitype = elm.shift();

    // 子要素の作成
    var splitrate = make_box[splitype]($c);
    var div = {
        "x": splitrate[0],
        "y": splitrate[1]
    };
    var divch = [];

    //作成した子要素の割当(再起)
    var $cc = $c.children().eq(0);
    while (elm.length > 0) {
        var n = elm.shift();
        var d = splitbox($cc, n);
        divch.push(d ? d : {x:0, y:0});
        $cc = $cc.next();
        if ($cc.length == 0) break;
    }

    //子要素の分割パラメータからサイズ調整
    if (splitype === "Z") {
        div.x += Math.max(divch[0].x, divch[1].x);
        div.y += divch[0].y + divch[1].y;

        var bunbo = divch[0].y + divch[1].y + 2;
        $c.children().eq(0).css("height", ((divch[0].y + 1) / bunbo * 100) + "%");
        $c.children().eq(1).css("height", ((divch[1].y + 1) / bunbo * 100) + "%");
    }

    if (splitype === "E") {
        div.x += Math.max(divch[0].x, divch[1].x, divch[2].x);
        div.y += divch[0].y + divch[1].y + divch[2].y;

        var bunbo = divch[0].y + divch[1].y + divch[2].y + 3;
        $c.children().eq(0).css("height", ((divch[0].y + 1) / bunbo * 100) + "%");
        $c.children().eq(1).css("height", ((divch[1].y + 1) / bunbo * 100) + "%")
                          .css("bottom", ((divch[2].y + 1) / bunbo * 100) + "%");
        $c.children().eq(2).css("height", ((divch[2].y + 1) / bunbo * 100) + "%");
    }

    if (splitype === "N") {
        div.x += divch[0].x + divch[1].x;
        div.y += Math.max(divch[0].y, divch[1].y);

        var bunbo = divch[0].x + divch[1].x + 2;
        $c.children().eq(0).css("width", ((divch[0].x + 1) / bunbo * 100) + "%");
        $c.children().eq(1).css("width", ((divch[1].x + 1) / bunbo * 100) + "%");
    }

    if (splitype === "M") {
        div.x += divch[0].x + divch[1].x + divch[2].x;
        div.y += Math.max(divch[0].y, divch[1].y, divch[2].y);
        
        var bunbo = divch[0].x + divch[1].x + divch[2].x + 3;
        $c.children().eq(0).css("width", ((divch[0].x + 1) / bunbo * 100) + "%");
        $c.children().eq(1).css("width", ((divch[1].x + 1) / bunbo * 100) + "%")
                          .css("right", ((divch[2].x + 1) / bunbo * 100) + "%");
        $c.children().eq(2).css("width", ((divch[2].x + 1) / bunbo * 100) + "%");
    }

    if ("OHUCFKLQJ".indexOf(splitype) != -1) {
        div.x += divch[0].x + divch[1].x;
        div.y += divch[0].y + divch[1].y;
    }
    
    return div;
};

var timer = new TimeCounter();

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
        if (p[0].trim().indexOf('done') == 0) {
            var qid = parseInt(p[0].split("_").pop());
            if (!qid) return;
            $("#menu .qoption").eq(qid - 1).addClass('cleared');
            return;
        }
        if (p[0].trim() != "tempopreserve") return;
        var data = decodeURIComponent(p[1]).split("<>");

        if (data.length < 5) return;
        res.qid = data.shift();
        res.pt = data.shift();
        res.time = parseInt(data.shift());
        res.undone = data.shift().split(",");
        res.logs = data.join("<>");
        is_valid = true;
    });
    //console.log(document.cookie);

    if (!is_valid) return false;
    if (!res.qid) return false;

    // 再開時のデータ展開
    $("#continue").show().find(".resume").remove();
    $("#menu .qoption").eq(res.qid - 1).addClass("resume").clone().appendTo("#continue");
    //if (res.qid == quiztable.length) $("#newest").hide();

    $(".resume").unbind().click(function() {
        if (!$("#fragtable").hasClass("done")) return;
        var qid = parseInt($(this).addClass("selected").find(".qid").text());
        $(this).siblings(".qoption").animate({"opacity": "0"});

        $('<div>').addClass("loading").text("再開").appendTo(this)
            .animate({"opacity":".5"}, function() {
                load_quiz(qid);
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
        $("#continue").hide();
        $(".qoption.resume").removeClass("resume").show();
    });
    return true;
};


var draw_puzzle = function(qwords, $quiz, options)
{
    var ans = "";
    if (!options) options = {};

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
    qwords.forEach(function(qword, i) {
        var is_hidden = (options && options.display && options.display != i);

        if (!is_hidden) {
            var $word = (qword.substr(0, 1) == "+" && $quiz.find(".word").size() != 0) ?
                $quiz.find(".word:last-child") :
                $("<div>").addClass("word").appendTo($quiz);
            $("<div>").addClass("wid").text("[" + ("00" + (1 + i)).substr(-2) + "]").appendTo($word);
        }
        stringToArray(qword).forEach(function(c) {
            if (c.match(/^[ -~\s]?$/)) return;

            // 漢字分解
            var n = kanjifrag.split(c);
            var fragged = n.toString();
            ans += fragged + ",";
            if (fragged == "X") n = [c];

            if (is_hidden) return;
            //分解結果の記録(問題作成ツール用)
            if (fragged !== c)
               $("#knjtb").val($("#knjtb").val() + c + ":" + fragged.split(",").join("") + "/");

            // 描画
            var $glyph = $('<div class="glyph">').appendTo($word);
            splitbox($glyph, n, false);
            $glyph.append('<div class="correct">' + c + '</div>');

            //かな文字の場合
            if (c.match(/^[ぁ-ー]$/)) {
                $glyph.addClass("hiragana");
            }
        });
    });

    // ansから番号リストを生成する
    var onestrokes = "一丨亅丿ノ乙𠃌⺄乚𠃊丶";
    var kidx = partquiz.make_list(ans, options.openlist || onestrokes);

    if (0) {
        $(".glyph").css({"width":"45px", "height":"45px"});
        $(".correct").css({"font-size":"43px", "line-height":"43px"});
    }

    // 分割DOM要素内に部首または番号を表示
    $quiz.find(".elm").each(function(){
        var c = $(this).text();

        $(this).text("");
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
            // 1画パーツは色変更
            else if (onestrokes.indexOf(c) != -1) {
                $(this).addClass("onestroke");
            };
         }

        // 部首表示: 枠内目一杯に表示
        var $kpart = $('<div>').addClass("kpart").appendTo(this);
        var style = {};
        var h = $(this).innerWidth() + 'px';
        style['font-size'] = h;
        style['height'] = h;
        style['line-height'] = h;
        style['transform'] = 'scale(1, ' + $(this).innerHeight() / $(this).innerWidth() + ')';
        //style['transform'] = 'scale(.5, .5)';

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
        $("head").append('<link rel="stylesheet" href="https://glyphwiki.org/style?glyph=' + name[1] + '">');
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
    if (options.open) {
        $quiz.find(".glyph").each(function() {
            $(this).find(".correct").show();
            $(this).find(".elm div").hide();
        });
    }
    $quiz.find(".hiragana .elm .kpart").css("font-size", "");

    return (Object.keys(kidx).length);
}

var load_quiz = function(quiz)
{
    var qlist = quiz.q;
    kanjifrag.definelocal(quiz.def);
    var qid = 1;

    $("#main .qid").text(quiz.qid);
    $("#knjtb").val('');
    $("#quiz").text('');
    $("#main").show();
    $("#top").hide();
    $("#wordlist").val(qlist);
    $("#redefine").val(quiz.def);

    if (quiz.genre) {
        $("#genre").text(quiz.genre);
    }

    // パズル描画
    var qlen = draw_puzzle(qlist.split("/"), $("#quiz"),
                           {openlist: quiz.def.split("/").filter(def => def.indexOf("x:") != -1).join("")}
                          );

    // 中断時の保存
    $(window).unbind().on('pagehide', function(event) {
        save_status(qid);
        return;
    });

    //枠外クリックで選択外し
    $(document).unbind().on('click', function(e) {
        if ($(e.target).closest('.word').length != 0) return;
        if ($(e.target).closest('#keyinput').length != 0) return;
        $(".glyph").removeClass("selected");
        $(".elm").css("background-color", "");
        $("#keyinput").hide();
	//glyph_expander(70, $(".word").show());
    });

    // カウントアップタイマのイベントハンドラ
    timer.set_handler(function(count) {
        $('#time').html(count);
        var bpm = qlen * 60 / (count);
        $("#bonus").html(parseInt((bpm * bpm) * 20));
    });
    $("#qlen").text(qlen);

    var glyph_expander = (percent, $word) => {
	var h = (percent * 60 / 100) + "px";
        $word.find(".glyph").css({"width":h, "height":h});
        $word.find(".correct").css({"font-size":h, "line-height":h});
	$word.show().find(".kpart").each(function(){
	    var style = {};
	    var h = $(this).innerWidth() + 'px';
	    style['font-size'] = h;
	    style['height'] = h;
	    style['line-height'] = h;
	    $(this).css(style);
	});
    };

    //枠内クリックで入力欄表示
    $("#quiz .elm").unbind().click(function() {
        var $glyph = $(this).parents(".glyph");
        var $word = $glyph.parents(".word").css("position", "relative");
        var classname = $(this).find(".kidx").html();
        $(".elm").css("background-color", "");
        $(".kidx" + classname).parent().css("background-color", "#8cf");
        $("#judge").hide();
        $(".glyph").removeClass("selected");
        $glyph.addClass("selected");

	//ふせる
	if (0) {
	    $word.show().css({"position": "relative", "top": "-20px", "left":"-10px"});
	    glyph_expander(70, $word.siblings().css({"left": 0,"top":0}));
	    glyph_expander(100, $word);
	    //$word.siblings().hide();
	    //$(".kidx" + classname).parents(".word").show();
        }
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
    });

    $("#sh input").unbind().keypress(function(e){
        if (e.which != 13 && e.key != "Enter") return;
        //全角半角
        var val = $(this).val().replace(/[！-ｚ]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x20 - 0xff00);
        });
        var m = val.trim().match(/^p([0-9]+)/i);
        if (m) {
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
    
    $(".userans").unbind().keypress(function(e){
        if (e.which != 13 && e.key != "Enter") return;
        
        //数字入力は語番号選択扱い
        var val = $(this).val().replace(/[０-９：]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x20 - 0xff00);
        }).trim();
	
        var m = val.match(/^p([0-9]+)/i);
        if (m) {
            var classname = parseInt(m[1]);
            $(".elm").css("background-color", "");
            $(".kidx" + classname).parent().css("background-color", "#8cf");
	    $(this).select();
            return;
        }

        var wid = val.match(/[0-9]+/);
        if (wid) {
            console.log(wid);
            $("#quiz .word").eq(wid - 1).find(".glyph:first").find(".elm:first").click();
            return;
        }
        answer_check($(this).val());
    });

    var answer_check = function(value, undraw)
    {
        var $selected = $(".glyph.selected");
        var $word = $selected.parent();

        //かな不在の語はかな入力を無視
        if ($word.find(".hiragana .qelm").size() == 0) {
            value = (value.match(/[一-龥々]/g) || []).join("");
        }

        var $selecteds = $selected.nextAll(".glyph").filter(function() {
            return (0 < $(this).find(".qelm").size()) || $(this).hasClass("hiragana .qelm");
        });

        //枠外の入力を無視
        value = value.substring(0, $selected.size() + $selecteds.size());
        $(".userans").val(value);

        var g_log = $("#g_log").val() + ";" + timer.count() + "=";
        var trate = 0;

        var is_same = function(a, b) {
            //かな・カナの大小を同一視する
            String.prototype.kanachange = function() {
                if (!this) return "";
                var c = this.trim();
                if (c.match(/[ぁ-ん]/)) c = String.fromCharCode(c.charCodeAt(0) + 0x60);
                var t = "ァィゥェォヵヶャュョッヮ".indexOf(c);
                if (t < 0) return c;
                return "アイウエオカケヤユヨツワ".substring(t, t + 1);
            };

            //JISが変更した字形を同一視する
            String.prototype.jischange = function() {
                if (!this) return "";
                var c = this.trim();
                var t = "倶剥呑嘘妍屏并痩繋唖焔鴎噛侠躯鹸麹屡繍蒋醤蝉掻騨箪掴填顛祷涜嚢溌醗頬麺莱蝋攅".indexOf(c);
                if (t < 0) return c;
                return "俱剝吞噓姸屛幷瘦繫啞焰鷗嚙俠軀鹼麴屢繡蔣醬蟬搔驒簞摑塡顚禱瀆囊潑醱頰麵萊蠟攢".substring(t, t + 1);
            };

            return a.kanachange().jischange() == b.kanachange().jischange();
        };

        //1文字ずつ正解判定
        var missed = value.split("").some(function(c, i) {
            if (0 < i) $selected = $selecteds.eq(i - 1);
            g_log += c;

            //正解判定
            if (!is_same(c, $selected.find(".correct").text())) {
                g_log += "x" + $word.find(".wid").text();
                $("<div class='judge'>").text("×").appendTo($selected);
                return true;
            }
            $selected.addClass("toopen");
            $("<div class='judge'>").text("○").appendTo($selected);

            //加点計算
            if (!$selected.hasClass("hiragana")) {
                var rate = $selected.find(".kidx.undone").size() / $selected.find(".elm").size() * 10;
                trate += rate;
            }
            return false;
        });

        //伏せられていた割合に応じて加点
        trate = trate / $word.find(".glyph").size();
        var pt = parseInt($("#point").text(), 10) + trate * trate * 9;

	if (!undraw) {
	    $(".judge").show();
            $("#g_log").val(g_log).show();
            setTimeout(function() {
		$(".judge").fadeOut(200, function() {
                    $(this).remove(); }); }, 300);
        }
	
        if (0 == $word.find(".toopen").size()) {
            return;
        }
        
        //パーツ開け
        var opened = 0;
        $word.find(".toopen").each(function() {
            $(this).removeClass("toopen").find(".elm").each(function() {
                //console.log($(this).html());
                var c = $(this).find(".kidx");
                if (c.hasClass("undone")) opened++;
                if (!c || !c.html()) return;
                c = c.prop("class").match(/kidx([0-9]+)/);
                if (!c) return;
                $("." + c[0]).removeClass("undone");
                $("." + c[0]).hide().next().show();
            });
        });
        //開けたパーツの数に応じて加点
        pt += opened * opened;
        $("#point").text(parseInt(pt, 10));

        if (undraw) return;
        //全パーツが開いたグリフを表示
        $(".glyph").each(function() {
            if ($(this).find(".undone").size() > 0) return;
            var n = $(this).parent().find(".glyph").index($(this));
            $(this).find(".correct").show();
            $(this).find(".elm div").hide();
        });
    
        $(".userans").select();
        save_status(qid);
        if ($("#quiz .kidx.undone").size() == 0) show_ending();
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
            var max = $("#quiz .glyph").size();
            for(var i = 0; i < max; i++) {
                var n = $("#quiz .glyph").index($(".glyph.selected"));
                if (e.keyCode == 39){ n++; }
                if (e.keyCode == 37){ n--; }
                n = (n + max) % max;
                $("#quiz .glyph").eq(n).find(".kidx").eq(0).click();
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

    if (0 < $("#srvlog").size()) {
	replay_log(qlist, answer_check);
	return;
    }

    if (qid || $("#demo").prop("checked")) {
        timer.start(0);
    }
};

var show_daily = function()
{
    return $("#daily").parent().hide();
    if ($("#daily .word").size()) return;
    var today = new Date();
    var seed = today.getFullYear() * 12 +
        today.getMonth() * 35 + today.getDate();
    //seed = 2019 * 12 + 9 * 35 + 13;
    var random = new Random(seed);
    var qid = 1 + random.next() % (quiztable.length - 1);
    var quiz = quiztable[qid - 1];
    var qlist = quiz.q;
    var wlen = qlist.split("/").length;
    var iword = wlen - 1 - random.next() % parseInt(wlen * 0.3);
    var options = {
        display: iword,
        openlist: quiz.def.split("/").filter(def => def.indexOf("x:") != -1).join(""),
    };
    kanjifrag.definelocal(quiz.def);
    draw_puzzle(qlist.split("/"), $("#daily").text(""), options);

    $("#daily").css("position", "relative").click(function() {
        $(this).parent().css("background-color", "#bdc");
        $('*').unbind();
        $('<div>').addClass("loading").text("読込中").appendTo(this)
            .animate({"opacity":".5"}, function() {
                load_quiz(qid);
                $("#quiz .word").eq(iword).find(".elm").eq(0).click();
            });
    });
};

var quiztable = [];
var load_qlist = (url) =>
{
    var files = [$("#gasapi").prop("href"), "qlist.json"];

    var loadfile = function() {
        if (files.length == 0) return;
        var file = files.shift();
        $.ajax({
            url: file,
            type: 'get',
            dataType: 'json',
            timeout: 10000,
        }).success(function(data, status, error) {
            quiztable = data.filter(q => {
                var p = q.date.substring(0,1);
                return (p != "*" && p != "#");
            });
            if ($("#fragtable").hasClass("done"))
                show_menu();
        }).fail(function(){
            $("#example, #daily, #newest").text("(読込失敗)");
            loadfile();
        });
    };


    $("#fragtable").load(function(){
        var txt = $(this).contents().find("body").text();
        kanjifrag.define(txt);
        $(this).addClass("done");
        show_menu();
    });

    //loadfile();
};

var show_menu = function()
{
    var draw_top = () => {
        if ($("#example .word").size()) return;
        $("#example, #example_answer").text("");
        $("#top").show();
        draw_puzzle(["徒競走"], $("#example"));
        draw_puzzle(["徒競走"], $("#example_answer"), {open: true});
    };

    draw_top();

    $("#newest").text("");
    var $option = $('<div>').addClass("qoption").appendTo("#newest");
    var $qid = $('<div>').addClass("qid").appendTo($option).text("00");
    $('<div>').addClass("qclear").appendTo($qid).text('✔');
    $('<div>').addClass("qinfo").appendTo($option).html("40語 120字 x部首<br/>(自動生成)");
    $('<div>').addClass("qdesc").appendTo($option).html("問題を自動生成します。");

    var anchor_check = function() {
        try {
            let str = decodeURIComponent(escape(window.atob(location.hash.slice(1))));
            if (!str) return;
            let q = str.split("@@");

            getfile("fragtable.plus.txt", (txt) => {
                kanjifrag.define(txt);
                load_quiz({qid:"00", q:q[0], def:q[1]});
            });

        } catch (e) {
            console.log(e);
            return;
        }
    };
    window.addEventListener("hashchange", () => { anchor_check(); }, false);

    anchor_check();
    show_daily();

    $(".qoption").click(function() {
        if (!$("#fragtable").hasClass("done")) return;
        if ($(this).hasClass("resume")) return;
        $(this).unbind();

        var qid = parseInt($(this).addClass("selected").find(".qid").text());
        $(this).siblings(".qoption").animate({"opacity": "0"});
        var cleared = $(this).hasClass("cleared");
    
        $('<div>').addClass("loading").text("読込中").appendTo(this)
            .animate({"opacity":".5"}, function() {
                return main();
            });
    });

    $(".closer").click(function() {
        var $parent = $(this).parent().hide();
        var title = $parent.find("h2,h4").eq(0).text();
        if($parent.hasClass("helper")) return;
        $("<span>").text(title).addClass("minimized")
            .insertAfter($parent).click(function() {
                $(this).prev().show();
                $(this).remove();
            });
    });
    $(".help").click(function() {
        if ($(this).prop("id") == "showrule") return;
        var $helper = $(this).parent().find(".helper");
        if ($helper.is(":visible")) $helper.hide(); else $helper.show();
    });
    $("#menu a, button.anch").click(function() {
        location.href = $(this).attr("href");
        anchor_check();
    });

    $("#showrule").click(function() {
        $('#rule').toggle();
    });


    if (location.href.indexOf("#debug") < 0 || makecache()) return;

    draw_top = () => 0;
    $("#top").hide();
    $.getScript("./makequiz_tool.js");
    $.getScript("./jisho_tool.js");
};


var save_result = function(qid, pt, tpt, name)
{
    return;
    
    var param = {
        qid: (qid + 1),
        score: (pt + ";" + tpt),
        log: $("#g_log").val(),
        name: name,
    };
    var url = $("#gasapi").prop("href");
    $.ajax({
        url: url,
        data: JSON.stringify(param),
        type: 'post',
        dataType: 'json',
        success: function(data, status, error) {
        },
        timeout: 10000,
   });
};

var show_ending = function()
{
    if ($("#srvlog").size()) return;

    timer.stop();
    $(document).unbind();
    var qid = parseInt($(".qid:last").text()) - 1;

    var bpm = parseInt($("#qlen").text()) * 60 / timer.count();
    var pt = parseInt($("#point").text(), 10);
    var tpt = parseInt((bpm * bpm) * 20);
    
    $("#point").text(pt);
    $(".tpoint").html(pt + tpt);
    $("#score").show();
    $("#message").fadeIn();

    var uname = "";
    document.cookie = 'done_' + (qid + 1) + '=' + pt + '_' + timer.count();
    document.cookie.split(";").some(function(param) {
        var p = param.split("=");
        if (p[0].trim() != "uname") return false;
        uname = decodeURIComponent(p[1]);
    });
    

    save_result(qid, pt, tpt, uname);
    
    $("#message input").val(uname).focus().unbind().keypress(function(e){
        if (e.which != 13 && e.key != "Enter") return;
        save_result(qid, pt, tpt, $(this).val());
        document.cookie = "uname=" + $(this).val();
        $("#message").fadeOut();
    });


};

var makecache = function()
{
    if (location.href.indexOf("?cache=") < 0) return;
    var val = location.href.split("?cache=").pop().match(/^[0-9A-Za-z.,]+/);
    var ret = val[0].split("").map(function(c) {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ,0123456789abcdefghijklmnopqrstuvwxyz.".indexOf(c);
    });
    if (ret.reduce((sum, v) => sum + v) % 64) return;
    ret.shift();
    var rev = (ret.shift() == 12);
    ret.forEach(function(v, i) {
        for (var n = 0; n < 6; n++) {
            if ((v >> n) & 1) document.cookie = 'done_' + (i * 6 + n + 1) +
                (rev ? '=; max-age=0': '=undefined');
        }
    });
    location.href = "#archives";
    $("body").append('(Cache have been made)');

    return true;
};
