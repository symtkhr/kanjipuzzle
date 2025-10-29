// noprotect

// Utilities
const TimeCounter = function()
{
    let _count = 0;
    let _rotate = 0;
    let _intcount;
    let _handler = () => {};
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

        _intcount = setInterval(() => {
            _count++;
            _handler(_count);
        }, 1000);
    };

    this.count = () => _count;
    this.set_handler = (handler) => { _handler = handler; };
};

class Random {
  constructor(seed = 12345) {
    this.a = 102030405;
    this.b = 314159265;
    this.c = 271828183;
    this.d = seed;
  }

  next() {
      let t = this.a ^ (this.a << 11);
      this.a = this.b;
      this.b = this.c;
      this.c = this.d;
      return this.d = (this.d ^ (this.d >> 19)) ^ (t ^ (t >> 8));
  }
}

//JISが変更した字形を同一視する
String.prototype.jischange = function() {
    if (!this) return "";
    return Array.from(this).map(c => {
        const t = "倶剥呑嘘妍屏并痩繋唖焔鴎噛侠躯鹸麹屡繍蒋醤蝉掻騨箪掴填顛祷涜嚢溌醗頬麺莱蝋攅叱".indexOf(c);
        return (t < 0) ? c : Array.from("俱剝吞噓姸屛幷瘦繫啞焰鷗嚙俠軀鹼麴屢繡蔣醬蟬搔驒簞摑塡顚禱瀆囊潑醱頰麵萊蠟攢𠮟")[t];
    }).join("");
};

//全角英数を半角化する
String.prototype.toHalfWidth = function() {
    return this.replace(/[！-ｚ]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x20 - 0xff00));
};

//かな・カナの大小を同一視する
String.prototype.kanachange = function() {
    if (!this) return "";
    let c = this.trim();
    return Array.from(this).map(c => {
        if (c.match(/[ぁ-ゔ]/)) c = String.fromCharCode(c.charCodeAt(0) + 0x60);
        const t = "ァィゥェォヵヶャュョッヮ".indexOf(c);
        return (t < 0) ? c : Array.from("アイウエオカケヤユヨツワ")[t];
    }).join("");
};

// ランダムソート
Array.prototype.shuffle = function() {
    let array = this;
    for (let i = array.length - 1; 0 < i; i--) {
        const j = parseInt(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// 重複除去
Array.prototype.uniq = function() {
    return this.filter((v, i, self)=>(self.indexOf(v) === i));
};

const getfile = (fname) => new Promise(cb => {
    const ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {
        if (ajax.readyState != 4) return;
        if (ajax.status != 200) return cb();
        cb(ajax.responseText);
    };
    ajax.open("GET", fname, true);
    ajax.send(null);
});

const SoundEffect = function() {
    const file = {
        "tap" : "book-close1.mp3",
        "start" : "sei_ge_kiita_toruoku02.mp3",
        "gselect" : "saucer-coffee-place1.mp3",
        "incorrect" : "beep1.mp3",
        "correct": "decision51.mp3",
        "clear": "koto-kasso.mp3",
    };
    const audio = Object.entries(file).reduce((ret, [key, file]) => {
        ret[key] = new Audio("sounds/" + file);
        return ret;
    }, {});
    let enabled = true;
    this.enable = (val) => { enabled = val; };
    this.play = (e) => {
        if (enabled) (audio[e] || audio.start).play();
    };
};

// ユーザデータ
const UserRecord = function() {
    let playerlog = "";

    // 解いた経過をキャッシュ保存する
    const savepartway = (qid) => {
        //console.log(timer.is_running, qid);

        if (!timer.is_running || !qid) {
            localStorage.removeItem("savepartway");
            return;
        }

        let undone = $('#quiz .kidx.undone').map(function() {
            return parseInt($(this).text());
        }).get().uniq();
        if (!undone.length) return;
        
        let pt = parseInt($("#point").text(), 10);
        const val = {
            date: (new Date()).getTime(),
            qid: qid,
            pt: pt,
            time: timer.count(),
            undone: undone,
            log: playerlog,
        };
        console.log("save",val);
        localStorage.setItem("savepartway", JSON.stringify(val));
    };

    // 解き終わったデータを読み出す
    const loadqclear = () => {
        try {
            JSON.parse(localStorage.qclear).map(q => q.qid).map(qid => {
                let q = menu.quiztable().find(q => q.qid == qid);
                if (q) q.done = true;
            });
        } catch {
            console.log(localStorage.qclear)
        }
        // ユーザ名
        $("#message input").val(localStorage.uname || "");
    };

    // 再開データを読み出す
    const loadpartway = (quiz) => {
        let resume = (() => {
            try {
                return JSON.parse(localStorage.savepartway);
            } catch (e) {
                return;
            }
        })();

        if (!resume) return;

        // 再開時のデータ展開
        let q = quiz || menu.quiztable().find(q => q.qid == resume.qid);
        if (!q) return;

        $("#resume").addClass("enabled").unbind().click(function() {
            $(this).unbind().removeClass("enabled");

            q.resume = true;
            q.hintwait = resume.time;
            qscreen.start(q);

            // 解きかけ分の展開
            $("#quiz .kidx").removeClass("undone").hide().next().show();
            resume.undone.forEach(kid => $("#quiz .kidx" + kid).addClass("undone").show().next().hide());

            $("#quiz .glyph").each(function() {
                if ($(this).find(".undone").size() > 0) return;
                let n = $(this).parent().find(".glyph").index($(this));
                $(this).find(".correct").show();
                $(this).find(".elm div").hide();
            });

            playerlog = resume.log;
            $("#point").text(resume.pt);
            timer.start(resume.time + 1);
        });
        return true;
    };


    const save_result = function(qid, pt, tpt, name)
    {
        let param = {
            qid: qid,
            score: (pt + ";" + tpt),
            log: playerlog,
            name: name,
            date: (new Date()).getTime(),
        };
        try {
            param.log += "@@";
            if (qid == -1) param.log += qscreen.quiz.q + "@@" + qscreen.quiz.def;
            console.log(param.log);
        } catch (e) {
            console.log(e);
        }
        {
            localStorage.setItem("uname", name);
            try {
                let score = JSON.parse(localStorage.qclear);
                localStorage.setItem("qclear", JSON.stringify([...score,param]));
                // todo:古いデータを捨てる
            } catch {
                localStorage.setItem("qclear", JSON.stringify([param]));
            }
        }

        let url = $("#gasapi").prop("href") || "";
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

    //指定した問題を解き終わった扱いにする
    const makeup_save = function()
    {
        if (location.href.indexOf("?cache=") < 0) return;
        let val = location.href.split("?cache=").pop().match(/^[0-9A-Za-z.,]+/);
        let ret = val[0].split("").map(c => "ABCDEFGHIJKLMNOPQRSTUVWXYZ,0123456789abcdefghijklmnopqrstuvwxyz.".indexOf(c));
        if (ret.reduce((sum, v) => sum + v) % 64) return;
        ret.shift();
        let rev = (ret.shift() == 12);
        ret.forEach((v, i) => {
            [0,1,2,3,4,5].map(n => {
                if ((v >> n) & 1) document.cookie = 'done_' + (i * 6 + n + 1) +
                    (rev ? '=; max-age=0': '=undefined');
            });
        });
        $("body").append('(Cache have been made)');

        return true;
    };

    this.logappend = (applog) => {
        if (applog) playerlog += ";" + applog;
        return playerlog;
    };
    this.resetlog = () => { playerlog = ""; };
    this.savepartway = savepartway;
    this.loadpartway = loadpartway;
    this.loadqclear  = loadqclear;
    this.save_result = save_result;
    this.makeup_save = makeup_save;
};

// パズル描画
const PuzzleScreen = function() {

    // JQueryのdiv要素$cに切断要素を追加する
    const make_box = {
        "N": $c => {
            $c.append('<div class="sbox" style="left:0;">');
            $c.append('<div class="sbox" style="right:0;">');
            return [1, 0];
        },
        "M": $c => {
            $c.append('<div class="sbox" style="left:0;">');
            $c.append('<div class="sbox" style="right:33%;">');
            $c.append('<div class="sbox" style="right:0;">');
            return [2, 0];
        },
        "Z": $c => {
            $c.append('<div class="sbox" style="top:0;">');
            $c.append('<div class="sbox" style="bottom:0;">');

            if ($c.hasClass("L1")) $c.children().eq(0).css({"width":"30%"}); // 題=是+頁
            return [0, 1];
        },
        "E": $c => {
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
        "O": $c => { // 国街裏
            $c.append('<div class="sbox O1">');
            $c.append('<div class="sbox" style="width:60%; height:60%; top:20%; right:20%;">');
            return [.5, .5];
        },
	
        "H": $c => { //閃凧鬨同
            $c.append('<div class="sbox H1">');
            $c.append('<div class="sbox" style="width:60%; height:60%; bottom:0; right:20%;">');
	    
            if ($c.hasClass("L1")) $c.children().eq(1).css({"width":"20%", "left":"5%"}); // 颱=風+台
            return [.7, .5];
        },
        "U": $c => { // 凵[興-同]
            $c.append('<div class="sbox U1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; top:0; right:15%;">');
            return [.7, .5];
        },
	
        "C": $c => { // 匚
            $c.append('<div class="sbox C1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; right:0; top:15%;">');
            return [.5, .7];
        },
        "F": $c => { //广厂病届戻
            $c.append('<div class="sbox F1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; bottom:0; right:0;">');
	    
            if ($c.hasClass("L1")) $c.children().eq(1).css({"width":"85%", "height":"30%"}); // 彪=虎+彡
            return [.5, .5];
        },
        "K": $c => { //気式戒匂
            $c.append('<div class="sbox K1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; bottom:0; left:0;">');
            return [.5, .5];
        },
        "L": $c => {
            $c.append('<div class="sbox L1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; top:0; right:0;">');
            return [.5, .5];
        },
        "J": $c => { //氷図
            $c.append('<div class="sbox J1">');
            $c.append('<div class="sbox" style="width:70%; height:70%; top:0; left:0;">');
            if ($c.hasClass("K1")) { //武裁織
                $c.next().css({"height": "33%"});
                $c.children().eq(1).css({"height":"33%"});
            }
            return [.5, .5];
        },
        "Q": $c => { // 坐幽楽盥弐匁
            $c.append('<div class="sbox Q1">');
            $c.append('<div class="sbox">');
            return [0, 0];
        },
    };

    // JQueryのdiv要素$cをelmに示したIDS配列で切断する
    const splitbox = function($c, elm)
    {
        if (elm.length == 1) {
            $c = $("<div>").addClass("sbox").appendTo($c);
            elm = elm[0];
        }

        if (!Array.isArray(elm)) {
            $c.addClass("elm").html(elm);
            return;
        }

        let splitype = elm.shift();

        // 子要素の作成
        let div = {x:0, y:0};
        [div.x, div.y] = make_box[splitype]($c);
        let divch = [];

        //作成した子要素の割当(再起)
        let $cc = $c.children().eq(0);
        elm.some(n => {
            divch.push(splitbox($cc, n) || {x:0, y:0});
            $cc = $cc.next();
            return ($cc.length == 0);
        });

        //子要素の分割パラメータからサイズ調整
        if (splitype === "Z") {
            div.x += Math.max(divch[0].x, divch[1].x);
            div.y += divch[0].y + divch[1].y;
            
            let bunbo = divch[0].y + divch[1].y + 2;
            $c.children().eq(0).css("height", ((divch[0].y + 1) / bunbo * 100) + "%");
            $c.children().eq(1).css("height", ((divch[1].y + 1) / bunbo * 100) + "%");
        }
        
        if (splitype === "E") {
            div.x += Math.max(divch[0].x, divch[1].x, divch[2].x);
            div.y += divch[0].y + divch[1].y + divch[2].y;
            
            let bunbo = divch[0].y + divch[1].y + divch[2].y + 3;
            $c.children().eq(0).css("height", ((divch[0].y + 1) / bunbo * 100) + "%");
            $c.children().eq(1).css("height", ((divch[1].y + 1) / bunbo * 100) + "%")
                .css("bottom", ((divch[2].y + 1) / bunbo * 100) + "%");
            $c.children().eq(2).css("height", ((divch[2].y + 1) / bunbo * 100) + "%");
        }
        
        if (splitype === "N") {
            div.x += divch[0].x + divch[1].x;
            div.y += Math.max(divch[0].y, divch[1].y);
            
            let bunbo = divch[0].x + divch[1].x + 2;
            $c.children().eq(0).css("width", ((divch[0].x + 1) / bunbo * 100) + "%");
            $c.children().eq(1).css("width", ((divch[1].x + 1) / bunbo * 100) + "%");
        }
        
        if (splitype === "M") {
            div.x += divch[0].x + divch[1].x + divch[2].x;
            div.y += Math.max(divch[0].y, divch[1].y, divch[2].y);
            
            let bunbo = divch[0].x + divch[1].x + divch[2].x + 3;
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
    const draw_puzzle = (qwords, $quiz, options = {}) => {
        let ans = qwords.reduce((ans, qword, i) => {
            let is_hidden = (options.display && options.display != i);
            
            if (!is_hidden) {
                var $word = (qword[0] == "+" && $quiz.find(".word").size() != 0) ?
                    $quiz.find(".word:last-child") :
                    $("<div>").addClass("word").appendTo($quiz);
                $("<div>").addClass("wid").text((101 + i).toString().slice(-2)).appendTo($word);
            }
            return [...ans, ...Array.fromCdp(qword).filter(c => !c.match(/^[ -~\s]?$/)).map(c => {
                // 漢字分解
                let n = kanjifrag.split(c);
                let fragged = n.toString();
                if (fragged == "X") n = [c];
                
                if (is_hidden) return fragged;
                //分解結果の記録(問題作成ツール用)
                if (fragged !== c)
                    $("#knjtb").val($("#knjtb").val() + c + ":" + fragged.split(",").join("") + "/");
                
                // 描画
                let $glyph = $('<div class="glyph">').appendTo($word);
                splitbox($glyph, n, false);
                $glyph.append('<div class="correct">' + c + '</div>');
                
                //かな文字の場合
                if (!c.match(/\p{Script=Han}/u)) {
                    $glyph.addClass("hiragana");
                }
                return fragged;
            })];
        }, []).filter(v=>v).join(",");

        // ansから番号リストを生成する
        const onestrokes = "一丨亅丿ノ乙𠃌⺄乚𠃊丶";
        const kidx = partquiz.make_list(ans, options.openlist || onestrokes);

        // 分割DOM要素内に部首または番号を表示
        $quiz.find(".elm").each(function(){
            let c = $(this).text();

            $(this).text("");

            // 枠を表示しない
            if (c == "＿") {
                $(this).parent().remove();
                return;
            }

            // 番号表示
            if (kidx[c]) {
                $(this).addClass("qelm");

                let $npart = $(this).html('<div>' + kidx[c] + "</div>").find("div:last");
                $npart.addClass('kidx undone kidx' + kidx[c]);

                let boxclass = $(this).parent().prop("class") + $(this).parent().parent().prop("class");
                // にょう・はこの番号は左下に配置
                if (boxclass.indexOf("L1") != -1 || boxclass.indexOf("U1") != -1 ) {
                    $npart.css({"bottom":0, "top":"auto", "text-align": "left"});
                }
                // 逆にょうの番号は右下に配置
                if (boxclass.indexOf("J1") != -1 ) {
                    $npart.css({"bottom":0, "top":"auto", "text-align": "right"});
                }
                // 四方構・右上構の番号は右上に配置
                if (boxclass.indexOf("K1") != -1 || boxclass.indexOf("O1") != -1 ) {
                    $npart.css({"text-align":"right"});
                }
                // かなの番号はセンタリング
                if (boxclass.indexOf("hiragana") != -1) {
                    $npart.css({"top":"20px", "bottom":"auto"});
                }
                // 1画パーツは色変更
                else if (onestrokes.indexOf(c) != -1) {
                    $(this).addClass("onestroke");
                };
            }

            // 部首表示: 枠内目一杯に表示
            let $kpart = $('<div>').addClass("kpart").appendTo(this);
            let style = {};
            let h = $(this).innerWidth() + 'px';
            style['font-size'] = h;
            style['height'] = h;
            style['line-height'] = h;
            style['transform'] = 'scale(1, ' + $(this).innerHeight() / $(this).innerWidth() + ')';

            // 部首表示: 番号付きならば伏せる
            if ($(this).hasClass("qelm")) $kpart.hide();

            let name = c.match(/^&([^;]+);$/);
            if (!name) {
                $kpart.append(c).css(style);
                return;
            }

            let gaiji = cdp2ucs(c);
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
            let $svg = $("#" + name[1]);
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
        if (!$("#onwid").prop("checked")) $quiz.addClass("nowid");
        return (Object.keys(kidx).length);
    };

    // 要素が画面内にあるか
    const isHeightViewable = (element, isviewport) => {
        const {top, bottom} = element.getBoundingClientRect();
        if (!isviewport) {
            return 0 <= top && bottom <= window.innerHeight;
        }
        let p = window.visualViewport;
        return (p.offsetTop < top && bottom < p.offsetTop + p.height);
    };

    // パズル盤面作成
    const load_quiz = function(quiz)
    {
        this.quiz = quiz;
        let qlist = quiz.q;
        kanjifrag.definelocal(quiz.def);
        let qid = quiz.qid;
        userdata.resetlog();

        $("#main").show();
        $("#knjtb").val('');
        $("#quiz").text('');
        $("#head .qid").text((quiz.qid == -1) ? "生成" : quiz.qno);
        $("#point,#bonus").text(0);
        $("#top, #score").hide();
        $("#wordlist").val(qlist);
        $("#redefine").val(quiz.def);

        if (quiz.genre) {
            $("#genre").text(quiz.genre);
        }
        $("#control .gonext").eq(1).addClass(quiz.done?"":"withheld").unbind().click(function() {
            if ($(this).hasClass("withheld")) return;
            se.play("tap");
            $("#resume, #control, .loading").hide();
            $("#keyinput").appendTo("#main");
            $(".qbox, .qoption").css("opacity","").removeClass("qselected");
            let n = menu.quiztable().findIndex(q => q.qid == qid);
            let $qbox = (qid == -1) ? $(".qbox.automake") : $(".qbox").eq(n + 1)
            console.log(n+1,$qbox);
            $qbox.removeClass("withheld").click();

            if (!$qbox.hasClass("automake")) return;

            $("#qlists").show();
            $("#archives").click();
            $qbox.show().find(".qoption").show();
            $("#qlists .closer").hide();
        });
        
        // パズル描画
        this.quiz.qlen = draw_puzzle(
            qlist.split("/"), $("#quiz"),
            {openlist: quiz.def.split("/").filter(def => def.indexOf("x:") != -1).join("")}
        );
        let qlen = this.quiz.qlen;
        
        // 中断時の保存
        $(window).unbind().on('pagehide', (e) => userdata.savepartway(qid));
        
        //枠外クリックで選択外し
        $(document).unbind().on('click', function(e) {
            if ($(e.target).closest('.word').length != 0) return;
            if ($(e.target).closest('#keyinput').length != 0) return;
            $("#quiz .glyph").removeClass("selected");
            $("#quiz .elm").removeClass("pselected");
            $("#keyinput, #hint, #discover").hide();
        });
        
        const popup_otheruses = (cname) => {
            return $("#hint").hide();
            if (!$(cname).eq(0).hasClass("undone")) return;
            let wids = $("#quiz .word").map(function() {
                return $(this).find(cname).size();
            }).get().map((n, wid)=> 0 < n ? wid : -1).filter(wid => wid != -1);
            let outs = wids.filter(wid => !isHeightViewable($("#quiz .word").eq(wid).get(0), true));
            if (outs.length == 0) return;
            $("#hint").css("zoom",$("#quiz").css("zoom")*0.8).html(`<span style="background:#58a;">Hint:</span><br/>`).show();
            outs.map(wid => $("#quiz .word").eq(wid).clone().appendTo("#hint"));
            $("#hint .keyinput").remove();
        };

        //枠内クリックで入力欄表示
        $("#quiz .elm").unbind().click(function() {
            se.play("gselect");
            let $glyph = $(this).parents(".glyph");
            let $word = $glyph.parents(".word").css("position", "relative");
            //glyph_expander(80,$word);
            let classname = $(this).find(".kidx").html();
            $("#quiz .elm").removeClass("pselected");
            $("#quiz .kidx" + classname).parent().addClass("pselected");
            $("#judge, #hintc").hide();
            $("#quiz .glyph").removeClass("selected");
            $glyph.addClass("selected");

            let $ki = $("#keyinput").appendTo($word).show();
            let zoom = $("#quiz").css("zoom") || 1;
            $ki.css(
                {"width": $word.width() - $glyph.position().left / zoom,
                 "left" : $glyph.position().left / zoom,
                 "bottom": ($word.height() - $glyph.position().top / zoom) });
            $(".userans").show().css({"width": "100%"}).focus().select();

            if ($("#srvlog").size()) {
                $("#srvlog").focus().select();
            } else if ($(this).parents(".word").find(".correct:hidden").size() == 0) {
                $ki.hide();
            }

            let $kidx = $(this).find(".kidx");
            if ($kidx.hasClass("undone") || !classname) {
                $("#discover").hide().html("");
            } else {
                $("#discover").show().html(`${classname} <span class='cdpf'>${$kidx.next().html()}</span>`);
            }
            popup_otheruses(".kidx" + classname);
        });

        $(".userans").unbind().keypress(function(e){
            if (e.which != 13 && e.key != "Enter") return;
            
            //数字入力は語番号選択扱い
            let val = $(this).val().toHalfWidth().trim();
            let m = val.match(/^p([0-9]+)/i);
            if (m) {
                let classname = parseInt(m[1]);
                $("#quiz .elm").removeClass("pselected");
                $("#quiz .kidx" + classname).parent().addClass("pselected");
                $(this).select();
                return;
            }
            
            let wid = val.match(/[0-9]+/);
            if (wid) {
                $("#onwid").prop("checked", true).trigger("change");
                $("#quiz .word").eq(wid - 1).find(".glyph:first").find(".elm:first").click();
                return;
            }
            answer_check($(this).val().trim());
        });

        const parthint = () => {
            const WAITSEC = 60;
            const HINTNUM = 14;
            
            // ポップアップを表示(キー操作とか他のヒント)
            $("#hintc").show().css({left:"-50px",bottom:"20px"});
            let offset = $("#hintc").offset();
            let x = offset.left + $("#hintc").width() - $("#main").width();
            let y = offset.top + $("#hintc").height() - $("#main").height();
            let left = (offset.left < 0) ? 0 : (0 < x) ? -x-80 : -50;
            let top = (offset.top < 0) ? -150 : (0 < y) ? -y-50 : 20;
            $("#hintc").css({left:left,bottom:top});

            // $selectedから開示されている部品を拾う
            $("#hintc").show();
            $("#khint").html(`<div style="line-height:20px;font-size:15px;">このマスのヒントは<br/>ありません</div>`);

            let kopen = $("#quiz .glyph.selected .kpart")
                .filter(function(){ return $(this).siblings(".undone").size() == 0; })
                .get().map($v => $v.innerText);
            console.log(kopen);
            if (kopen.length == 0 || $("#quiz .selected .undone").length == 0) return;

            quiz.hintwait = quiz.hintwait || 0;
            // 時間経過前なら通常メッセージを表示して終了
            if (timer.count() - quiz.hintwait < WAITSEC) {
                return $("#khint").html(
                    `<div style="line-height:20px;font-size:15px;">次のヒントまで`
                        +`<div style="font-size:20px;">${WAITSEC - (timer.count() - quiz.hintwait)}秒</div>`
                        +` お待ちください</div>`);
            }
            
            // ない場合は通常メッセージを表示して終了
            let khint = kanjitable.find(kopen);
            if (khint.length == 0) return;
            
            quiz.hintwait = timer.count();
            let correct = $("#quiz .glyph.selected .correct").text();
            khint = khint.slice(-parseInt(HINTNUM / 2 * 3)).filter(c => (kopen.indexOf(c) < 0)).shuffle();
            if ((Math.random() * 2 < 1) && (khint.indexOf(correct) < 0)) khint = [...khint.slice(0, HINTNUM - 1),correct];
            
            $("#khint").html(khint.shuffle().slice(-HINTNUM).map(c => '<span class="khint">' + c + '</span>').join(""));
            //$("#hintc ul, #hintc h3:first-child").hide();
            $("#khint .khint").css({
                "background-image":"url(p0499_m.jpg)",
                border:"2px solid #920",display:"inline-block",
                height:"20px",padding:"1px",margin:"1px"});
            $(".userans").val("");
        };
        
        const answer_check = function(value, undraw)
        {
            if (value == "?" || value == "？") return parthint(); 

            // 問の対象にない文字の除去
            let $glyph = $("#quiz .glyph.selected").nextAll(".glyph").addBack();
            let outoftarget = $glyph.filter(function() {
                return ($(this).find(".qelm").size() == 0) && !$(this).hasClass("selected");
            }).map(function() { return $(this).find(".correct").text(); }).get().join(",").kanachange().jischange();

            let values = Array.from(value).filter(u => outoftarget.indexOf(u.jischange().kanachange()) < 0);
            let $selecteds = $glyph.filter(function() {
                return $(this).hasClass("selected") || (0 < $(this).find(".qelm").size()) || $(this).hasClass("hiragana .qelm");
            });

            // 指定の漢字かな書式に合わない文字の除去
            values = values.reduce((ret,v) => {
                let ischira = $selecteds.eq(ret.length).hasClass("hiragana");
                let isvhira = v.match(/[ぁ-ー]/);
                if ((ischira && isvhira) || (!ischira && !isvhira && v.match(/\p{Script=Han}/u))) ret.push(v);
                return ret;
            }, []).slice(0, $selecteds.size());

            let g_log = timer.count() + "=";
            let trate = 0;
            const is_same = (a, b) => a.kanachange().jischange() == b.kanachange().jischange();
            
            //1文字ずつ正解判定
            let $word = $selecteds.eq(0).parent();
            let missed = values.some((c, i) => {
                let $selected = $selecteds.eq(i);
                g_log += c;
                
                //正解判定
                if (!is_same(c, $selected.find(".correct").text())) {
                    let n = $word.find(".glyph").index($("#quiz .glyph.selected"));
                    g_log += "x[" + $word.find(".wid").text() + "]" + n;
                    $("<div class='judge'>").text("×").appendTo($selected);
                    return true;
                }
                $selected.addClass("toopen");
                $("<div class='judge'>").text("○").appendTo($selected);
                
                //加点計算
                if (!$selected.hasClass("hiragana")) {
                    let rate = $selected.find(".kidx.undone").size() / $selected.find(".elm").size() * 10;
                    trate += rate;
                }
                return false;
            });

            //伏せられていた割合に応じて加点
            trate = trate / $word.find(".glyph").size();
            let pt = parseInt($("#point").text(), 10) + trate * trate * 9;
            
            if (!undraw) {
                userdata.logappend(g_log);
                userdata.savepartway(qid);
                $(".judge").show().animate({"left":"-120px","font-size":"300px","opacity":"0"}, function() {
                    $(this).remove();
                });
                se.play(trate ? "correct" : "incorrect");
            }

            if (0 == $word.find(".toopen").size()) {
                return;
            }

            //パーツ開け
            let opened = 0;
            $word.find(".toopen").each(function() {
                $(this).removeClass("toopen").find(".elm").each(function() {
                    let c = $(this).find(".kidx");
                    if (c.hasClass("undone")) opened++;
                    if (!c || !c.html()) return;
                    c = c.prop("class").match(/kidx([0-9]+)/);
                    if (!c) return;
                    $("#quiz ." + c[0]).removeClass("undone").hide().next().show();
                });
            });
            //開けたパーツの数に応じて加点
            pt += opened * opened;
            $("#point").text(parseInt(pt, 10));
            
            if (undraw) return;

            // キャッシュ保存
            userdata.savepartway(qid);
            
            //全パーツが開いたグリフを表示
            $("#quiz .glyph").each(function() {
                if ($(this).find(".undone").size() > 0) return;
                let n = $(this).parent().find(".glyph").index($(this));
                $(this).find(".correct").show();
                $(this).find(".elm div").hide();
            });

            // 全パーツが開いた単語を発光
            let $w = $("#quiz .word").filter(function() {
                return !$(this).hasClass("wdone") && ($(this).find(".undone").size() == 0);
            }).addClass("wdone");
            const cb = (n) => {
                $w.find(".correct").css({"text-shadow":`0 0 ${n}px #c00`,"color":`rgb(${20*n+50},${20*n},${13*n})`})
                    .parent().find(".elm").css({
                        "box-shadow":`0 0 ${n/2}px #f99,  inset 0 0 ${n/2}px #f00`,
                        "border":`rgb(${144+(255-144)*n/10},${34+(160-34)*n/10},${8*n}) solid 1px`,
                    });
                if (n < 10) return setTimeout(() => { cb(n+1); }, 50);
                $(".wdone .elm").css("box-shadow","");
                $(".wdone .correct").css({"text-shadow":"0 0 4px #500","color":"#fc9"});
            };
            cb(0);

            $(".userans").select();
            if ($("#quiz .kidx.undone").size() == 0) show_ending(qlen);
        };

        $(document).keydown(function(e) {
            if (e.ctrlkey && $("#quiz .glyph.selected").size() == 0)
                $("#quiz .glyph").eq(0).find(".kidx").eq(0).click();
            
            if (!e.ctrlKey) return;
            if (e.key == "Enter") return;
            if ($(".correct:hidden").size() == 0) return;
            
            // Ctrl + Shift
            if (e.shiftKey && $("#quiz .pselected .kidx").size()) {
                $("#onwid").prop("checked", true).trigger("change");
                let kids = $("#quiz .selected .kidx").get().map($v => [...$v.classList].find(v=>v.match(/^kidx[0-9]/))).uniq();
                if (kids.length < 2) return;
                let kid0 = [...$("#quiz .pselected .kidx").get(0).classList].find(v=>v.match(/^kidx[0-9]/));
                let classname = "." + kids[(1 + kids.indexOf(kid0)) % kids.length];
                $("#quiz .selected " + classname).click();
                return;
            }

            // Ctrl + 左右キー
            if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
                $("#onwid").prop("checked", true).trigger("change");
                let $glyphs = $("#quiz .word:not(.wdone) .glyph, #quiz .glyph.selected")
                let n = $glyphs.index($("#quiz .glyph.selected")) + (e.key == "ArrowRight" ? 1 : -1);
                let max = $glyphs.size();
                let $glyph = $glyphs.eq((n + max) % max);
                let $kidx = $glyph.find(".kidx");
                ($kidx.length ? $kidx : $glyph.find(".kpart")).eq(0).click();
            }
        }).keyup(function(e) {
            if (!e.ctrlKey) return;
            if ((e.keyCode != 39) && (e.keyCode != 37)) return;
            $(".userans").select();
        });
        
        $("#main").show();
        $("#menu, #keyinput, .replay").hide();

        $(".replay").unbind().click(function() {
            let qclear = JSON.parse(localStorage.qclear);
            let pvlog = qclear.findLast(q => q.qid == qid);
            if (!pvlog) return;
            let replay = new PlayerLog(pvlog);
            replay.draw_pulldown(pvlog.log, qlist);
            replay.run_replay(answer_check);
            console.log(replay.pvlog());
        });

        if (quiz.done) {
            $(".replay").show();
        }

        timer.set_handler(count => {
            $('#time').text(count);
            let bpm = qlen * 60 / (count || 0.5);
            $("#bonus").text(parseInt((bpm * bpm) * 20));
        });

        // 画面内に収まるように縮小
        let rate = Array(10).fill(0).map((_,i) => 150 - i * 10).find(rate => {
            $("#quiz").css("zoom", rate/100);
            return isHeightViewable($("#quiz .word:last-child").get(0));
        });
        $("#zoomer").val((rate / 10) - 10).unbind().change(function() {
            $("#quiz").css("zoom", $(this).val() / 10 + 1);
        });
        $("#top").hide();

        if (quiz.pvlog) {
            let pvlog = quiz.pvlog;
            let replay = new PlayerLog(pvlog);
            replay.draw_pulldown(pvlog.log, qlist);
            console.log(pvlog,qlist);
            return replay.run_replay(answer_check);
        }
        
        //location.href="#quiz:qno=" + quiz.qno;
        if (quiz.resume) return;
        start_animation(qlen);
    };

    const start_animation = (qlen, notimer) => {
        const op = $("#quiz .word").map(function() {
            let ret = $(this).position();
            ret.top0 = parseInt(2 * Math.random()) ? ret.top + 100 : ret.top - 100;
            ret.left0 = parseInt(2 * Math.random()) ? -100 : $("#quiz").width();
            ret.deg0 = parseInt(180 * Math.random());
            return ret;
        }).get();

        $("#quiz").css("overflow","hidden");
        $("#quiz .word").css("position","relative").hide();
        $("#overlap, #q1st").hide();
        se.play("start");

        const _nmax = 30;
        let startup = (_n) => {
            $("#quiz .word").each(function(eq) {
                let dn = (1 - _n / _nmax);
                let top  = parseInt(dn * (op[eq].top0 - op[eq].top));
                let left = parseInt(dn * (op[eq].left0 - op[eq].left));
                let deg = parseInt(dn * op[eq].deg0);
                $(this)//.css("top",(top)+"px").css("left",(left)+"px")
                    .css("transform",`translate(${left}px,${top}px) rotate(${deg}deg)`).show();
            });
            if (_n < _nmax) return setTimeout(() => { startup(_n + 1); }, 30);
            $("#quiz").css("overflow", "").addClass(isHeightViewable($("#quiz .word:last-child").get(0)) ? "":"scroll");
            $("#quiz .word").css("transform","");
            if (!notimer) timer.start(0);
        };
        setTimeout(() => { startup(0); }, 30);
    };

    const show_ending = () => {

        if ($("#srvlog").size()) return;
        
        timer.stop();
        $(document).unbind();

        let qid = this.quiz.qid;
        let qlen = this.quiz.qlen;
        let bpm = qlen * 60 / timer.count();
        let pt = parseInt($("#point").text(), 10);
        let tpt = parseInt((bpm * bpm) * 20);

        const message = [
            "クリア!\nおつかれさまでした。",
            "すばらしい\n非常にすばらしい!",
            "お見事!\nよくできました。",
            "でかした!\nよくやった!",
            "お楽しみいただけました\nでしょうか！",
            "完成！\nお上手ですね",
        ];
        $("#greet").get(0).innerText = message[parseInt(Math.random() * message.length)];
        
        userdata.save_result(qid, pt, tpt, $("#message input").val());
        $("#point").text(pt);
        $(".tpoint").text(pt + tpt);
        $("#keyinput, #howto, #qlists, #control").hide();
        $("#message").css("left",$("#overlap").width()+"px");
        $(".gonext").eq(1).removeClass("withheld");
        let n = menu.quiztable().findIndex(q => q.qid == qid) + 2;
        $(".qoption").filter(function(i) { return i < n; }).removeClass("withheld");

        setTimeout(() => {
            se.play("clear");
            $("#overlap, #score, #message, .replay").show();
            $("#message").animate({"left":0},function() {
                $("#message .submit").unbind().click(function() {
                    userdata.save_result(qid, pt, tpt, $("#message input").val());
                    $("#quiz .word").css({"opacity":"1"});
                    $("#message").fadeOut();
                });
                $("#message input").focus().unbind().keypress(function(e) {
                    if (e.which != 13 && e.key != "Enter") return;
                    $("#message .submit").click();
                });
                $("#control").show();
            });
        }, 1000);
    };
    
    this.draw = draw_puzzle;
    this.start = load_quiz;
    this.end = show_ending;
};

// メニュー画面
const TopMenu = function() {
    let quiztable = [];

    const load_qlist = (url) => {
        let files = [$("#gasapi").prop("href"), "qlist.json"].slice(1);

        const loadfile = function() {
            if (files.length == 0) return;
            let file = files.shift();
            $.ajax({
                url: file,
                type: 'get',
                dataType: 'json',
                timeout: 10000,
            }).success(function(data, status, error) {
                quiztable = data.filter(q => {
                    let p = q.date[0];
                    return (p != "*" && p != "#");
                });
                show_menu("frg");
            }).fail(function(){
                console.log("fail toload")
                loadfile();
            });
        };

        $("#fragtable,#fragtablep").load(function(){
            let txt = $(this).contents().find("body").text();
            kanjifrag.define(txt);
            $(this).addClass("done");
            show_menu("rgs");
        });

        loadfile();
    };

    const show_menu = (arg) => {
        if (!quiztable.length || !$("#fragtable").hasClass("done") || !$("#fragtablep").hasClass("done")) return;
        
        // draw the sample quiz
        kanjifrag.definelocal("尌:/洛:");
        //$(".qex").text("模様替");
        $("#overlap").show();
        $(".sampleword").each(function() {
            let w = $(this).text().split("/");
            $(this).text("");
            qscreen.draw(w, $(this), {open: !$(this).hasClass("qex")});
            if ($(this).hasClass("qex")) return;
            $(this).find(".wid").text("");
            $(this).find(".glyph").each(function() {
                const $elms = $(this).find(".elm");
                if (($elms.length == 1) && (1 < Math.random() * 3)) return;
                $elms.eq(parseInt(Math.random() * $elms.length)).addClass("pselected");
            });
        });
        kanjifrag.definelocal("");
        $(".qex").each(function(i) {
            if (i == 1) {
                $(this).find(".correct").show();
                $(this).find(".elm div").hide();
            }
            if (i == 2) {
                let $g = $(this).find(".glyph").eq(1).addClass("selected");
                $(this).find(".kidx2").parent().addClass("pselected");
                $(this).siblings("input").val($g.find(".correct").text());
            }
        });
        // サイズ調整
        if ($(window).height() < $("#howto").height()) {
            let r = $(window).height() / $("#howto").height();
            console.log(r,$(window).height(),$("#howto").height());
            $("#overlap").css("zoom", r < 0.8 ? 0.8 : r);
        }
        $("#overlap,#resume,#newstart,#continue").hide();
        $("#head h2 .glyph").eq(-1).remove();
        $("#head h2 .glyph").eq(-1).addClass("selected");
        $("#head h2 .correct").eq(-1).hide();
        $("#head h2 .kidx").addClass("qid").show().css({"bottom":"10px", "top":"auto", "text-align": "center"});
        {
            let i = 0;
            setInterval(() => {
                i = (i + 1) % 90;
                let loop = Math.sin(i * 2 * Math.PI/90);
                $("#title .word").css("transform",`rotate(${4*loop}deg) translate(0,30px)`);
                if (i % 18 != 0) return;
                $("#title .glyph").each(function() {
                    const $elms = $(this).find(".elm").removeClass("pselected");
                    if (($elms.length == 1) && (1 < Math.random() * 3)) return;
                    $elms.eq(parseInt(Math.random() * $elms.length)).addClass("pselected");
                });
            }, 50);
        }
        draw_qlists();

        // clickevents in #menu
        $("#newstart").click(function() {
            se.play("tap");
            $("#quiz").text("");
            $("#overlap, #howto, #q1st, #main").show();
            $("#control, #qlists, #config, .closer, #menu, #keyinput, #message").hide();
            $("#q1st").show().css("opacity",1).find("button").show().click(function() {
                se.play("tap");
                $("#menu, #howto").hide();
                $("#main").show();
                $(this).fadeOut(function() {
                    qscreen.start(quiztable[0]);
                    $(".closer, #config").show();
                });
            });
        });
        $("#continue").click(function() {
            se.play("tap");
            let n = quiztable.findIndex(q => !q.done);
            $(".qoption").eq(n).click();
        });
        $(".menu .word").unbind().hover(function() {
            se.play("gselect");
            $(this).css("background-color","rgba(90,90,90,.5)").css("background-blend-mode","multiply").find(".glyph").addClass("selected");
        }, function() {
            $(this).css("background-color","").find(".glyph").removeClass("selected")
        });
        
        $("#archives").click(function() {
            $("#overlap, #qlists, #qlists .closer").show();
            $("#qlists .qbox").removeClass("qselected").map(function() {
                let $qbox = $(this);
                let $qopt = $(this).find(".qoption");
                let pos = $qbox.position();
                let inwidth = pos.left + 0 + $qopt.width() - $("#qlists").width();
                let inheight = pos.top + 40 + $qopt.height() - $("#qlists").height();
                $qopt.css({
                    top:    inheight < 0 ? 40 : (-inheight),
                    left:   inwidth < 0 ? 0 : (-inwidth),
                });
            });
            $("#control, #message, #howto, #qlists .qoption").hide();
            $("#qlists").hide().fadeIn();
        });

        // clickevents in #main
        $(".showrule").unbind().click(function() {
            $("#control, #message, #qlists").hide();
            $("#overlap, #howto").show();
        });

        $("#main h2").unbind().click(function() {
            $("#howto, #message, #qlists").hide();
            $("#overlap,#control").show();
        });

        // clickevents in #overlap
        $("#control .gonext").eq(0).unbind().click(function() {
            se.play("tap");
            $("#menu,.menu").show();
            $("#main,#overlap,#resume,#newstart,#continue,.loading").hide();
            $("#keyinput").appendTo("#main");
            $(".qbox").css("opacity","");
            quiztable.map(v => v.resume = false);
            $(quiztable.find(v => v.done) ? "#continue":"#newstart").show();
            $(window).unbind();
            userdata.savepartway();
            userdata.loadqclear();
            draw_qlists();
            location.hash = quiztable.length < 40 ? "#menu" : "#menu:archives";
        });
        $("#onse").change(function() {
            se.enable($("#onse").prop("checked"));
        });
        $("#rmrec").click(function() {
            if (!confirm("やっちまうか")) return;
            localStorage.removeItem("qclear");
            location.reload();
        });
        $("#makeuprec").click(function() {
            if ($(this).hasClass("withheld")) return;
            if (!confirm("やっちまうか")) return;
            location.href = "#menu:archives";
            location.reload();
        });
        $("#dlrec").click(function() {
            let save = localStorage.qclear;
            let save0 = JSON.parse(save);
            let blob = new Blob(JSON.stringify(save0).split(""), {type:"text/plan"});
            let $link = document.createElement('a');
            $link.href = URL.createObjectURL(blob);
            $link.download = 'bushubu.save.dat';
            $link.click();
        });
        $("#onwid").change(function() {
            $("#quiz")[$("#onwid").prop("checked") ? "removeClass":"addClass"]("nowid");
        });

        hashcheck();
    };

    const draw_qlists = () => {
        // start the resumed quiz
        userdata.loadqclear(true);
        $("#qlists").html('<button class="closer">X</button>');

        let allopen = $("#qlists").hasClass("earlier");
        quiztable.map((quiz, idx) => {
            let q = quiz.q;
            quiz.qno = idx + 1;
            let words = q.split("/");
            let $qbox = $('<div>').appendTo("#qlists").addClass("qbox").css({position:"relative",display:"inline-block",margin:"2px"});
            let $qid = $('<div>').addClass("qid").appendTo($qbox).text(quiz.qno);
            let $option = $('<div>').addClass("qoption").appendTo($qbox).hide().css({position:"absolute"});
            $('<div>').addClass("qid").appendTo($option).text(quiz.qno);
            $('<div>').addClass("qclear").appendTo($qid).text('✔');
            let d = new Date(quiz.date.split("T").shift() + "T12:00+0900");
            $('<div>').addClass("qinfo").appendTo($option).show()
                .html(words.length + "語 " + words.join("").length + "字 " + quiz.n + "部首" + "<br />" +
                      d.toJSON().split("T").shift() + " " + (allopen ? (quiz.author || "") : ""));
            $('<div>').addClass("qdesc").appendTo($option).html(quiz.desc.split("\n").join("<br/>")).show();
            $('<div>').addClass("loading").text("読込中").appendTo($option).hide();
            if (quiz.done) $qbox.addClass('cleared');
        });

        // for automake
        if (1) {
            let $qbox = $('<div>').appendTo("#qlists").addClass("qbox automake").css({position:"relative",display:"inline-block",margin:"2px"});
            let $qid = $('<div>').addClass("qid").appendTo($qbox).text("生成");
            let $option = $('<div>').addClass("qoption").appendTo($qbox).hide().css({position:"absolute"});
            $('<div>').addClass("qid").appendTo($option).text("生成");
            $('<div>').addClass("qinfo").appendTo($option).show().html(
                "40語 120字 x部首<br />" + new Date().toJSON().split("T").shift() + " (自動生成)");
            $('<div>').addClass("qdesc").appendTo($option).text("問題を自動生成します。").show();
            $('<div>').addClass("loading").text("読込中").appendTo($option).hide();
        }
        
        if (!allopen) {
            let n = quiztable.filter(q => q.done).length;
            $("#qlists .qbox:not(.cleared)").filter(function(i) { return (n * 2) < i; }).addClass("withheld");
            $((n == 0) ? "#newstart" : "#continue").show();
            if (!$("#qlists .qbox").eq(-2).hasClass("cleared")) $(".qbox.automake").hide();
        }

        $("#qlists .qbox").unbind().click(function(e) {
            if ($(this).hasClass("withheld") || $("#qlists .qselected").size()) return;
            $(this).addClass("qselected");
            let $qopt = $(this).find(".qoption").show();

            if ($(this).hasClass("automake")) {
                $(this).siblings(".qbox").animate({"opacity": "0"});
                $(".qbox.automake .qdesc").html('<div id="seekbar"></div><div id="seekval"></div>');
                $("#seekbar").css({width:"0%", backgroundColor:"red", height:"15px"});
                $("#seekval").css({"text-align":"right"}).text("0%");
                automaker();
                return $(this).find(".loading").show().css("opacity", 0).animate({"opacity":".5"});
            }

            let qid = parseInt($qopt.find(".qid").text());
            $("#main .qid").text(qid);
            $("#makeuprec").addClass("withheld");
            if ((qid == 1) && !$(this).hasClass("cleared")) return $("#newstart").click();
            let quiz = quiztable[qid - 1];//.find(q => qid == q.qid);
            $(this).siblings(".qbox").animate({"opacity": "0"});
            $(this).find(".loading").show().css("opacity", 0).animate({"opacity":".5"}, function() { qscreen.start(quiz); });
        }).hover(function() {
            if ($(this).hasClass("withheld")) return;
            $(this).find(".qoption").show();
        }, function() {
            if (!$(this).hasClass("qselected")) $(this).find(".qoption").hide();
        });


        $(".closer").unbind().click(function() {
            $("#overlap").hide();
        });
    };

    const hashcheck = function() {
        let hash = location.hash;
        //if (!hash.length || hash[0] != "#") return;

        const decodehash = (str) => {
            try {
                return decodeURIComponent(escape(window.atob(str)));
            } catch(e) {
                console.log(e);
                return false;
            }
        };
        
        const runapps = {};
        runapps.replay = async (param) => {
            let qlist = decodehash(param.q);
            let qdef = decodehash(param.def) || "";
            if (!qlist) {
                let quiz0 = quiztable[param.qno - 1] || quiztable.find(q => q.qid == param.qid);
                if (quiz0) [qlist, qdef] = [quiz0.q, quiz0.def];
            }
            if (!qlist) {
                let json = await getfile("earlier/qlist.json");
                let quiz0 = JSON.parse(json).find(q => q.qid == param.qid);
                if (quiz0) [qlist, qdef] = [quiz0.q, quiz0.def];
            }
            qscreen.start({
                qno:param.qno || param.qid, qid:param.qid, q:qlist, def:qdef,
                pvlog:{log:decodehash(param.log), score:param.score},
            });
        };

        // todo: consider resume
        runapps.quiz = async (param) => {
            if (param.qno) {
                return $("#qlists .qoption").eq(param.qno - 1).click();
            };
            if (param.qid) {
                if ((200 < param.qid) && (param.qid <= 230)) {
                    return $("#qlists .qoption").eq(param.qid - 201).click();
                }
                let json = await getfile("earlier/qlist.json");
                let q0 = JSON.parse(json).find(q => q.qid == param.qid);
                if (q0) qscreen.start(q0);
                return;
            };
            if (param.q) {
                let qlist = decodehash(param.q);
                let qdef = decodehash(param.def) || "";
                if (!qlist) return;
                let q0 = {qid:-1, q:qlist, def:qdef };
                if (!userdata.loadpartway(q0)) return qscreen.start(q0);
                $("#overlap").hide();
                $(".menu:not(.enabled)").hide();
                return setTimeout(() => $("#resume").click(), 700);
            }
        };

        runapps.menu = async (param) => {
            if (!param.archives) {
                $("#menu").show();
            } else {
                let json = await getfile("earlier/qlist.json");
                try {
                    quiztable = JSON.parse(json).filter(q => {
                        let p = q.date[0];
                        return (p != "*" && p != "#");
                    });
                    $("#qlists").addClass("earlier").css({width:"80vw", height:"75vh"});
                    draw_qlists();
                    $("#makeuprec").addClass("withheld");
                    $("#archives").click();
                } catch (e) {
                    console.log(e, "failedtoload");
                }
            }

            userdata.loadpartway();
            if (!$("#resume.enabled").show().size()) return;
            $("#overlap").hide();
            $(".menu:not(.enabled)").hide();
            return setTimeout(() => $("#resume").click(), 700);
        };

        let param = hash.slice(1).split(":");
        let runapp = runapps[param.shift()] || runapps.menu;
        //console.log(runapp);
        return runapp(param.reduce((ret,p) => {
            let ps = p.split("=");
            ret[ps[0]] = ps.slice(1).join("=") || true;
            return ret;
        }, {}));
    };

    const unsed = () => {  // 使ってないかも
        $(".help").click(function() {
            if ($(this).prop("id") == "showrule") return;
            let $helper = $(this).parent().find(".helper");
            if ($helper.is(":visible")) $helper.hide(); else $helper.show();
        });
        $("#menu a, button.anch").click(function() {
            location.href = $(this).attr("href");
            anchor_check();
        });

        window.addEventListener("hashchange", () => { anchor_check(); }, false);
        show_daily();

        if (location.href.indexOf("#debug") < 0 || userdata.makeup_save()) return;

        $("#top").hide();

        $.getScript("./makequiz_tool.js");
        $.getScript("./jisho_tool.js");
    };

    this.show_menu = show_menu;
    this.load_qlist = load_qlist;
    this.quiztable = () => quiztable;
};

// 自動生成
const automaker = async () => {
    const encoder = s => btoa(unescape(encodeURIComponent(s)));

    dic.load(await getfile("./dicts/SKK-JISYO.ML.utf8"));
    kanjifrag.definelocal(REDEFINE);
    partquiz.qwords = makequiz.select_random_words().split("/").filter(w => w);
    partquiz.make(partquiz.qwords, {});

    let dump = () => {
        makequiz.wordsort();
        location.hash = "quiz:q=" + encoder(partquiz.qwords.join("/")) + ":def=" + encoder(REDEFINE);
        qscreen.start({q:partquiz.qwords.join("/"), def:REDEFINE, qid:-1});
    };

    let miss = 0;
    let append = () => {
        let qn = partquiz.qwords.length;
        let percent = parseInt(100 * (partquiz.qwords.length) / (WORDLEN)) + "%";
        $("#seekval").text(percent);
        $("#seekbar").css("width", percent);

        if (makequiz.select_rpbc_words() < 0) return dump();
        partquiz.make(partquiz.qwords, {});
        if (partquiz.qwords.length >= WORDLEN) return dump();
        if (qn == partquiz.qwords.length) miss++;
        if (30 < miss) return dump();
        setTimeout(append, 10);
    };
    append();
};

const menu = new TopMenu();
const qscreen = new PuzzleScreen();
const userdata = new UserRecord();
const timer = new TimeCounter();
const se = new SoundEffect();

$(function() {
    if (location.href.indexOf("/renewalsandbox") != -1) return location.href = "..";
    $("#sh, #continue, #main").hide();
    menu.load_qlist();
});
