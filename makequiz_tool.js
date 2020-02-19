$(function() {
    var LOADURL = "https://script.google.com/macros/s/AKfycbx65oBGA7GbPsxMzM18DEpM3W2PpLMrJJHDujtv/exec";
    quiztable.push({q:""});
    $("#makequiz").show();

    //単語リスト・再定義文字
    $("#wordlist, #redefine").keydown(function(e) {
        if (e.keyCode == 13 && e.ctrlKey) {
            $("#make").click();
        }
    });

    $("#make").click(function() {
        make_quiz();
        $("#qsave, #qload").css("background-color", "");
    });

    $("#untempo").click(function() {
        var list = $("#wordlist").val().split("(").join("").split(")").join("");
        $("#wordlist").val(list);
        $(this).hide();
    });
    
    //統計
    $("#stat").click(function() {
        $(this).remove();
	$("#statbox").show();
	setTimeout(stats, 400);
    });

    //頻出再定義リスト
    $("#makequiz .help").click(function() {
        if ($("#frequents label").size() > 0) return;

        $("#redefinelist").text().split("/").forEach(function(frag) {
            frag = frag.trim();
            if (frag.indexOf("#") == 0) {
                $("<br/>").appendTo("#frequents");
                $("<label>").append(frag.substr(1)).appendTo("#frequents");
                return;
            }
            $("#frequents").append(" / ");
            $("<span>").text(stringToArray(frag).join("")).appendTo("#frequents");
        });
        $("#frequents span").click(function() {
            var txt = $("#redefine").val();
            var redef = $(this).text();
            if ((0 < txt.length) && (txt.substr(-1) != "/")) txt += "/";
            if (txt.indexOf(redef) == -1)
                $("#redefine").val(txt + redef + "/");
            else
                $("#redefine").val(txt.split(redef + "/").join(""));
        });

    });

    //投稿ボタン
    $("#main .qid").click(function() {

	var n = $("#op .fragkey").size();
	if (n == 0) return;
	if (!$("#qpost").size()) {
	    var name = $("#message input").val();
	    $("#message").text("").css({"padding":"30px"});
	    $("<button class=closer>").text("x").appendTo("#message").click(function() {
		$("#message").hide();
	    });
	    var $name = $("<div>").text("名前:").appendTo("#message");
	    var $desc = $("<div>").text("内容:").appendTo("#message");
	    $("<input>").appendTo($name).val(name);
	    $("<input>").appendTo($desc).css({"width": "100%"});
	    $("<div class=n>").appendTo("#message");
	    $("<button id=qpost>").appendTo("#message").css({"font-size": "20px"});
	}
	$("#message").show();
	$("#message .n").text(n + "部首");
	$("#qpost").text("投稿").click(function() {
	    var post = {};
            post.date = "#" + (new Date).toJSON();
	    post.q = $("#wordlist").val();
	    post.def = $("#redefine").val();
	    post.author = $("#message input").eq(0).val();
	    post.desc = $("#message input").eq(1).val();
	    post.n = $("#op .fragkey").size();

	    if (post.desc === "") {
		$("#message").hide();
		return;
	    }
	    $(this).prop("disabled", true).text("投稿中...");
	    
	    $.ajax({
		url: LOADURL,
		data: JSON.stringify(post),
		type: 'post',
		dataType: 'json',
		timeout: 10000,
	    }).fail(function(data, status, error) {
		$("#qpost").prop("disabled", false).text("Post error");
	    }).done(function(data, status, error) {
		$("#qpost").prop("disabled", false);
		$("#message").fadeOut();
	    });
	});
    });

    $("#posted").click(function() {
	var $qlist = $(this).next().show();
	$(this).remove();
	var $qlist = $("#qposts");
	$.ajax({
	    url: LOADURL,
	    data: {v:"qlist"},
	    type: 'get',
	    dataType: 'json',
	    timeout: 10000,
	}).fail(function(data, status, error) {
	    $qlist.append("Loading error");
	}).done(function(rawdata, status, error) {
	    $qlist.text("");
	    rawdata.forEach(function(factor, idx) {
		if (!factor.date) return;
		if (0 <= factor.qid) return;
		if (!factor.q) return;
		var q = factor.q;
		var words = q.split("/");
		var $option = $('<div>').addClass("qoption").appendTo($qlist);
		var $qid = $('<div>').addClass("qid").appendTo($option).text(1 + idx);
		$('<div>').addClass("qinfo").appendTo($option)
		    .html(words.length + "語 " + words.join("").length + "字 " + factor.n + "部首" + "<br />" +
			  factor.date.split("T").shift().substring(1) + " " + factor.author);
		$('<div>').addClass("qdesc").appendTo($option).html(factor.desc);
		$("<div>").addClass("qdef").appendTo($option).text(factor.def).hide();
		$("<div>").addClass("qwq").appendTo($option).text(factor.q).hide();
	    });
	    $qlist.find(".qoption").click(function() {
		$("#wordlist").val($(this).find(".qwq").text());
		$("#redefine").val($(this).find(".qdef").text());
		$("#demo").prop("checked", true);
		make_quiz();
	    });

	});
    });

    
    //保存ボタン
    $("#qsave").click(function() {
        var date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        var expired = ";expires=" + date.toGMTString();

        var cookie = "wordlist=" + encodeURIComponent($("#wordlist").val());
        document.cookie = cookie + expired;
        var cookie = "redefine=" + encodeURIComponent($("#redefine").val());
        document.cookie = cookie + expired;

        $(this).css("background-color", "#cfc");
    });

    //呼出ボタン
    if (document.cookie) {
        $("#qload").show().click(function() {
            if (!confirm("ロードする?")) return;
            var is_valid = false;
            document.cookie.split(";").forEach(function(param) {
                var p = param.split("=");
                if (p[0].trim() == "wordlist") {
                    $("#wordlist").val(decodeURIComponent(p[1]));
                    is_valid = true;
                }
                if (p[0].trim() == "redefine") {
                    $("#redefine").val(decodeURIComponent(p[1]));
                    is_valid = true;
                }
                console.log(p[0], decodeURIComponent(p[1]));
            });
            if (is_valid) {
                $(this).css("background-color", "#cfc");
                make_quiz();
            } else {
                $(this).css("background-color", "red");
            }
        });
    }
    $("#qset").click(function() { qset(LOADURL); });

    return;
    
   if(typeof find_defchange !== "undefined") {
        for (var i = 0; i < quiztable.length; i++)
            find_defchange(i+1);

        return;
        /* 現行の漢字テーブルのソート用 */
        var base = [];
        var base = $("#fragtable").text().split("/");
        base.sort(function(a, b) {return a[0] < b[0] ? -1 : 1;});
        base = base.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
        $("body").append('<textarea>'+base.join("/")+'</textarea>');

   }

});

//文字化けのおそれがあるパーツの判定
var possible_mojibake = function(c)
{
    if (c.match(/&CDP[^;]+;/)) return "CDP";
    //Kana
    if (c.match(/^[\u3041-\u30FF]$/)) return "kana";
    //CJK Radicals Supplement (3.0)
    if (c.match(/^[\u28E0-\u2EFF]$/)) return "radical";
    //CJK (1.0.1)
    if (c.match(/^[\u4E00-\u9FA5]$/)) return "CJK1";
    //Private
    if (c.match(/^[\uE000-\uF8FF]$/)) return "private";
    //CJK added (4.1.0)
    if (c.match(/^[\u9FA6-\u9FBB]$/)) return "CJK4";
    //CJK ExtA (3.0)
    if (c.match(/^[\u3400-\u4DBF]$/)) return "CJKA";
    //ExtB (3.1)
    if (c.match(/^[\uD800-\uDBFF][\uDC00-\uDFFF]$/)) return "CJKB";

    return "unknown";
};

var draw_partbox = function(c, n, $parent, callback)
{
    var $partbox = $("<div>").addClass("setpartbox").text(n).appendTo($parent);
    var $part = $("<div>").addClass("setpart").text(c).appendTo($partbox);
    
    if (callback) {
	$partbox.css('background-color', callback(c, n));
	$part.addClass((1 < n) ? "fragkey" : "barekey");
    } else {
	var ctype = possible_mojibake(c);
        $part.css("background-color", {
            "kana": "#999",
            "radical": "#f77",
            "CDP": "#8c8",
            "private": "#8c8",
            "CJK1": "#ccc",
            "CJK4": "#a7f",
            "CJKA": "#fa7",
            "CJKB": "#7af",
        }[ctype] || "#f00");
    }

    //SVG
    if (!c.match(/&[^;]+;/)) return;
            
    if (c.indexOf("CDP") != -1) {
        $part.html(cdp2ucs(c)).addClass("cdpf");
        return;
    }
    var $svg = $("#" + c.substr(1, c.length - 2));
    if ($svg.size() > 0) {
        $part.html($svg.clone().show());
        $part.css("background-color", "#7C7");
    }
};

//問題パーツ一覧表示
var dump_partstable = function(kidx, count)
{
    // <div#op><div($part)><checkbox/><span.fragkey/barekey>key</span><span.cdpf>cdp</span></div></div>
    // <div#op><div($partbox)><div.setpart($part)>key/cdpf</div></div></div>
    var colorcode = (c, n) => {
	if (n == 1) return "#ccf";
        var color = (n < 7 ? (0xfff - (n - 2) * 0x022) : 0xf11);
        return ('#' + color.toString(16));
    };
    
    // リスト表示
    $("#op").text("");
    for (var key in kidx) {
        draw_partbox(key, count[key], "#op", colorcode);
    }
    for (var key in count) {
        if (count[key] != 1) continue;
        draw_partbox(key, 1, "#op", colorcode);
    }

    //チェック時に解表示
    $("#op .fragkey").click(function() {
        var classname = "kidx" + (1 + $(this).index("#op .fragkey"));
        if ($("." + classname).eq(0).hasClass("undone")) {
            $("." + classname).removeClass("undone").hide().next().show();
        } else {
         //   $("." + classname).addClass("undone").show().next().hide();
        }
    });
    if (1) {
        $("#genre").unbind().css("font-style", "italic").click(function() {
            find_max_soten();
        });
    }
    return kidx;
};

//問題生成
var make_quiz = function(is_unsort)
{
    $("#top, #menu").text("");
    $("#keyinput").appendTo("#main");
    
    var quiz = quiztable.pop();
    //再定義
    if (quiz.def != $("#redefine").val()) {
        var redef = stringToArray($("#redefine").val()).join("");
        $("#redefine").val(redef);
        quiz.def = redef;
    }
    //生成
    quiz.q = $("#wordlist").val();
    quiztable.push(quiz);
    load_quiz();
    $("#main .qid").text("投稿");

    if (quiz.q.indexOf("(") < quiz.q.indexOf(")"))
        $("#untempo").show();
    else
        $("#untempo").hide();
    
    //ソート
    if ($("#wsort").prop("checked") && !is_unsort) {
	return wordsort();
    }

    // 作成ツール情報の非表示
    if ($("#demo").prop("checked")) {
	$("#makequiz .closer").each(function() {
	    if ($(this).parent().is(":visible")) $(this).click();
	});
	$("#demo").prop("checked", false);
	return;
    }

    $("<span>").css({"display":"inline-block"}).appendTo("#quiz")
        .text("(" + $(".word").size() + "語 " + $(".glyph").size() + "字 " + $(".fragkey").size() + "部首)");

    //文字重複チェック
    var dup = quiz.q.split("").filter(function(x, i, self) {
        return (x !== "/") && self.indexOf(x) === i && i !== self.lastIndexOf(x);
	//return (x !== "/") && (self.indexOf(x) !== self.lastIndexOf(x));
    });
    if (dup.length > 0) {
        $("<span>").css({"display":"inline-block", "color":"red"}).appendTo("#quiz").text(" [重複あり]" + dup.join());
    }
    
    //語使用歴チェック
    var words = $(".wordstat").map(function() { return $(this).text(); }).get();
    
    var worddup = quiz.q.split("/").reduce(function(dup, w) {
        if (words.join(",").split(",").indexOf(w) == -1) return dup;
        var n = words.findIndex((word, i) => (word.split(",").indexOf(w) != -1));
        dup.push(w + "(" + (n + 1) + ")");
        return dup;
    }, []);
    
    if (worddup.length > 0) {
        $("<span>").css({"display":"inline-block","color":"blue"}).appendTo("#quiz").text(" [既出語]" + worddup.join(", "));
    }
    
    //グリフをクリックしたときに定義を表示
    $(".elm").click(function() {
        var $glyph = $(this).parents(".glyph");
        var c = $glyph.find(".correct").text();
        $("#knjdef").text(c + ":" + kanjifrag.db(c));
    });

};

// ソート
var wordsort = function()
{
    var qlists = [];

    $(".word").each(function(idx) {
        var t = $(this).find(".glyph").size();
        var c = $(this).find(".elm").size() - $(this).find(".qelm").size();
        var txt = $(this).find(".correct").text();
        qlists.push({n:t, ex:c, w:txt})
    });

    var txt = qlists.sort((a,b) => {
        if (a.n != b.n) return b.n - a.n;
        if (a.ex != b.ex) return a.ex - b.ex;
        return (Math.random() * 2 - 1);
    }).map(q => q.w).join("/");
    
    $("#wordlist").val(txt);
    $("#wsort").prop("checked", false);
    make_quiz(true);
};

/* 既存問題と現行の漢字テーブルが一致しているかのチェック用 */
var find_defchange = function(qid)
{
    var kanjifragkizon = new kanjiFragment();

    kanjifragkizon.define(localKnjDb[qid - 1]);
    var localfrag = {};
    console.log(qid);
    
    for(var key in localdb) {
        //var n = do_fragment(key);
        var n = kanjifragkizon.split(key);
        localfrag[key] = n.toString().split(",").join("");
    }

    kanjifrag.definelocal(quiztable[qid - 1].def);

    var additional = "";
    for(var key in localfrag) {
        if (!kanjifrag.db(key)) {
            additional += key + ":" + localfrag[key] + "/";
            continue;
        }
        var n = kanjifrag.split(key);
        if (localfrag[key] != n.toString().split(",").join(""))
            console.log(key, localfrag[key], n.toString());
    }

    console.log(additional);

};

// パーツリスト
var partslist = function(is_counting) {
    var ans = "";
    var list = {};
    
    skktable.split("").forEach(function(c) {
        kanjifrag.split(c).toString().split(",").forEach(function(p) {
            if (p.length == 0 || p.match(/^[A-Z]$/)) return;
            if (!list[p]) list[p] = 0;
            if (is_counting) list[p]++;
        });
    });

    return list;
};


// 統計
var stats = function()
{
    var q = quiztable.pop();
    var qs = quiztable.reduce((ret, quiz) => (ret + "/" + quiz.q.split("+").join("")), "");
    quiztable.push(q);

    // 語出現数
    var wordstat = function(ws) {
	// {"語":n}
        var occ = ws.reduce((occ, w) => {
            if (!occ[w]) occ[w] = 0;
            occ[w]++;
	    return occ;
        }, {});

	// {n:"語,語"}
        return Object.keys(occ).reduce((list, w) => {
            if (list[occ[w]])
                list[occ[w]] += "," + w;
            else
                list[occ[w]] = w;
	    return list;
        }, []);
    }(qs.split("/"));

    // 字出現数
    var glyphstat = function(ws) {
	// {"字":n}
        var occ = ws.join("").split("").reduce((occ, c) => {
            if (!occ[c]) occ[c] = 0;
            occ[c]++;
	    return occ;
        }, {});

	// {n:"字字"}
	return Object.keys(occ).reduce((list, c) => {
            if (list[occ[c]])
                list[occ[c]] += c;
            else
                list[occ[c]] = c;
	    return list;
        }, []);
    }(qs.split("/"));

    //結果表示
    var $statjigo = $("#statbox .result").text("");
    $("<p>").text("出題数:" + (quiztable.length - 1)).appendTo($statjigo);
    var $wordstat = $("<h4>").text("部首出現数").appendTo($statjigo);
    var $pl = $("<div>").appendTo($statjigo).addClass("statparts")
	.css({"margin":"0 0 30px 0", "line-height":"10px"});
    var $wordstat = $("<h4>").text("語出現数(2回以上)").appendTo($statjigo);
    var $wl = $("<ol>").appendTo($statjigo);
    var $glyphstat = $("<h4>").text("字出現数").appendTo($statjigo);
    var $gl = $("<ol>").appendTo($statjigo);
    
    wordstat.forEach((v, i) => {
        var $list = $('<li>').appendTo($wl).prop("value", i);
	$("<span>").text(v).addClass("wordstat").appendTo($list);
        if (i == 1) $list.hide();
    });
    glyphstat.forEach((v, i) => $("<li>").prop("value", i).appendTo($gl).text(v));

    // パーツ出現数
    var partappear = function() {
	// ["部首"...]
        var ans = quiztable.map(q => {
            kanjifrag.definelocal(q.def);
            return q.q.split("/").join("").split("")
		.map(c => c.match(/^[!-ー]$/) ? "" : kanjifrag.split(c));
        }).toString().split(",");

	// {"部首":n}
        var occ = ans.reduce((occ, p) => {
            if (p.length == 0 || p.match(/^[A-Z＿]$/)) return occ;
            if (!occ[p]) occ[p] = 0;
            occ[p]++;
	    return occ;
        }, partslist());

	// {n:["部首"...]}
        var list = Object.keys(occ).reduce((list, c) => {
            var n = occ[c];
            if (!list[n]) list[n] = [];
	    list[n].push(c);
	    return list;
        }, []);

        //結果表示
        list.forEach((v, i) => v.forEach(c => draw_partbox(c, i, "div.statparts")));
    }();
};

//素点ガイダンス
var find_max_soten = function()
{
    // DOM要素が表示された状態から探索開始
    var his = [];
    var maxpoint = 0;

    //語iを開ける
    var typein0 = function(i) {
        var trate = 0;
        var ks = [];
        var $selected = $(".word").eq(i);

        //未開パーツ率の計算
        $selected.find(".glyph").each(function() {
            trate += $(this).find(".kidx.undone").size() / $(this).find(".elm").size() * 10;
        });

        var pt = trate * trate;
        var opened = 0;

        //パーツを開ける
        $selected.find(".elm").each(function() {
            var c = $(this).find(".kidx");
            if (!c.hasClass("undone")) return;
            opened++;
            if (!c || !c.html()) return;
            c = c.prop("class").match(/kidx([0-9]+)/);
            if (!c) return;
            ks.push(c[0]);
            $("." + c[0]).removeClass("undone");//.css("background-color","#777");;
        });
        pt += opened * opened;

        return {pt: pt, ks: ks};
    };

    //閉じる
    var unset0 = function(ks) {
        ks.forEach(function(k) {
            $("." + k).addClass("undone");//.css("background-color","");
        });
        return;
    };

/*
  {
    glyphs: [[1,2,3,4], [5,6,1,2], [7,8,9,-1]];
    undone: [1,2,3,5,6],  
  },
...
];

*/
    //語iを開ける
    var typein = function(i, is_only_pt) {
        // 未開パーツ率
        var trate = 0;
        var word = words[i];
        word.glyphs.forEach(function(glyph) {
            trate += glyph.filter(function(x) { return (word.undone.indexOf(x) != -1); }).length
                / glyph.length * 10;
        });

        // 開ける
        var ks = word.undone;
        var pt = trate * trate + ks.length * ks.length;
        if (!is_only_pt) {
            words.forEach(function(word) {
                word.undone = word.undone.filter(function(x, i, self) {
                    return (ks.indexOf(x) == -1);
                });
            });
        }
        return {pt: pt, ks:ks};
    };
    
    //閉じる
    var unset = function(ks) {
        words.forEach(function(word) {
            var concat = [];
            word.glyphs.forEach(function(glyph) {
                Array.prototype.push.apply(concat, glyph);
            });
            //console.log(concat);
            Array.prototype.push.apply(word.undone, ks.filter(function(x) {
                return (concat.indexOf(x) != -1);
            }));
        });
        //console.log(ks, words);
        //exit();
    };

    var order = [];
    // 終了履歴の表示
    var ok = function() {
        var pt = 0;
        order = [];
        his.forEach(function(h) {
            order.push(h[0]);
            pt += (h[1].pt);
        });
        //console.log(order);
        STEP++;
        pt = parseInt(pt);

       /* if (STEP >10000) {
            exit();
        }
*/
        if (STEP % 2000 == 0) {
            console.log(STEP + " STEPS");
            is_found = true;
        }
        //if (!is_found && pt < maxpoint) order = [];
        if (pt <= maxpoint) return;
        maxpoint = pt;
        console.log(order, pt);
        //is_found = true;
        //order = [];
    };

    // 語群の構造体をつくる
    var words = function() {
        var ret = [];
        $(".word").each(function() {
            var num = [];
            $(this).find(".kidx").each(function() {
                var m = $(this).prop("class").match(/kidx([0-9]+)/);
                if (m) num.push(m[1] * 1);
            });
            var glyphs = [];
            $(this).find(".glyph").each(function() {
                var glyph = [];
                $(this).find(".elm").each(function() {
                    if ($(this).find(".kidx").size() == 0) {
                        glyph.push(-1);
                        return;
                    }
                    var m = $(this).find(".kidx").prop("class").match(/kidx([0-9]+)/);
                    if (m) glyph.push(m[1] * 1);
                });
                glyphs.push(glyph);
            });
            
            ret.push({
                undone: $.unique(num.sort(function(a, b) { return a - b; })),
                glyphs: glyphs
            });
        });
        return ret;
    }();
    console.log(words);

    //共通するパーツがないもの
    var independants = function(words) {
        var rets = [];
        for (var n = 0; n < words.length; n++) {
            var ret = [];
            // word[n].undone と word[i].undone に重複する値があるか?
            for (var i = 0; i < n; i++) {
                if (words[n].undone.filter(function(x) {
                    return words[i].undone.indexOf(x) != -1;
                }).length == 0) {
                    ret.push(i);
                }
            }
            rets.push(ret);
        }
        return rets;
    }(words);

    // 得失点差アルゴリズム
    var tokushitten = function() {
        //各語の加点
        var gains = [];
        for(var i = 0; i < words.length; i++) {
            if (words[i].undone.length == 0) { continue; }
            var ret = typein(i, true); //点数だけ
            gains[i] = ret.pt;
        }
        //各語の得失点
        var diffs = [];
        gains.forEach(function(gain, i) {
            //console.log("gain = " +i + ":" + gain);
            var diff = gain;
            var typed = typein(i); //抜く
            
            for(var j = 0; j < words.length; j++) {
                if (i == j) continue;
                if (!gains[j]) continue;
                diff += typein(j, true).pt - gains[j]; //2つめを抜いた場合の点数
            }
            unset(typed.ks); // 戻す
            //console.log("diff = " + i + ":" + diff);
            diffs.push({id:i, diff:diff});
        });
        //console.log(diffs);
        
        var max = diffs.sort(function(a, b) { return b.diff - a.diff; }).shift();
        //console.log(max);
        typein(max.id);//抜く

        console.log(max.id, gains[max.id]);
        return gains[max.id];
    };
    //for (var i = 0; i < words.length; i++)
    var pt0 = 0;
    for (var i = 0; i < 11; i++)
    {
        pt0 += tokushitten();
        if (words.filter(function(x) { return (0 < x.undone.length); }).length == 0)
            break;
    }
    console.log(pt0);
    return;

    // 総当りアルゴリズム
    var STEP = 0;
    var SAIKI = 0;
    var is_found = false;
    var is_end = false;
    var search = function() {
        if (is_found) return;
        if(1) {
            if ($(".kidx.undone").size() == 0) {ok(); return; }
        } else {
            //console.log(words.filter(function(x) { console.log(x); return (x.undone.length == 0); }));

            if (words.filter(function(x) { return (0 < x.undone.length); }).length == 0)
            { return ok(); }
        }

        var n = function() {
            //通常時
            if (order.length == 0) {
                return 0;
            }
            //前回保存の再開部
            if (SAIKI == order.length - 1) {
                var ret = order.pop() + 1;
                order = [];
                //console.log("from:" + ret);
                return ret;
            }
            return order[SAIKI]; // 前回保存値
        }();
        //console.log(SAIKI, order, n);
        SAIKI++;

        for(var i = n; i < words.length; i++) {
            if (his.length == 1 && order.length == 0) console.log("turn" + his[0][0] + "." + i);
            //console.log(i);
            if(1)
                var nkid = $(".word").eq(i).find(".kidx.undone").size();
            else
                var nkid = words[i].undone.length;
            //全開き状態
            if (nkid == 0) {continue;}
            //
            //さっき操作した語より若い番号の独立語は調査必要なし
            if (0 < his.length && (independants[his[his.length - 1][0]].indexOf(i) != -1)) {
                //console.log("match: his[" + (his.length - 1) + "]=" + his[his.length - 1][0] + "." + i);
                continue;
            }
            //抜く
            var ret = typein0(i);
            
            his.push([i, ret]);
            //console.log(his, words);
            
            //さらに抜く
            search();
            //console.log(order, his);
            //戻す
            if (is_found) return;
            var ret = his.pop();
            unset0(ret[1].ks);
        };
    };
        
    var pattern = function() {
        is_found = false;
        his = [];
        SAIKI = 0;
        //$(".kidx").addClass("undone").css("background-color","");
        // console.log(his, SAIKI);
        search();
        //console.log(order, his);
        if (order.length == 0) {console.log("finfin??"); return;}
        //if(STEP < 30000)
            setTimeout(function() { pattern(); }, 1);
    };

    pattern();
};


var qset = function(LOADURL)
{
    $("body").append("qset start");
    if (quiztable.length == 0) return;
    var post = quiztable.shift();
    post.author = "2020-xx-xx Mt.Nest";
    post.date = post.author.split(" ").shift();

    if (post.genre) post.author += ("," + post.genre);
    $.ajax({
	url: LOADURL,
	data: JSON.stringify(post),
	type: 'post',
	dataType: 'json',
	timeout: 10000,
    }).fail(function(data, status, error) {
	$("body").append(" Post error");
    }).done(function(data, status, error) {
	qset(LOADURL);
	$("body").append(-quiztable.length);
    });
};
