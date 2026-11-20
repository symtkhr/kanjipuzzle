const LOADURL = "https://script.google.com/macros/s/AKfycbx65oBGA7GbPsxMzM18DEpM3W2PpLMrJJHDujtv/exec";

$(function() {
    $("#makequiz").show();

    ///// class:Editor (問題作成ツール) /////
    // 作成ボタン
    $("#make").click(function() {
        make_quiz();
        $("#qsave, #qload").css("background-color", "");
    });

    // 単語リスト・再定義文字
    $("#wordlist, #redefine").keydown(function(e) {
        if (e.keyCode == 13 && e.ctrlKey) {
            $("#make").click();
        }
    });

    // 仮追加解除
    $("#untempo").click(function() {
        let list = $("#wordlist").val().split("(").join("").split(")").join("");
        $("#wordlist").val(list);
        $(this).hide();
    });
    
    // 投稿ボタン
    $("#main .qid").click(function() {

        let n = $("#op .fragkey").size();
        if (n == 0) return;
        if (!$("#qpost").size()) {
            let name = $("#message input").val();
            $("#message").text("").css({"padding":"30px"});
            $("<button class=closer>").text("x").appendTo("#message").click(function() {
                $("#message").hide();
            });
            let $name = $("<div>").text("名前:").appendTo("#message");
            let $desc = $("<div>").text("内容:").appendTo("#message");
            $("<input>").appendTo($name).val(name);
            $("<input>").appendTo($desc).css({"width": "100%"});
            $("<div class=n>").appendTo("#message");
            $("<button id=qpost>").appendTo("#message").css({"font-size": "20px"});
        }
        $("#message").show();
        $("#message .n").text(n + "部首");
        $("#qpost").text("投稿").click(function() {
            let post = {};
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

    // 投稿ボタン
    $("#posted").click(function() {
        let $qlist = $(this).next().show();
        $(this).remove();
        $qlist = $("#qposts");
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
                let q = factor.q;
                let words = q.split("/");
                let $option = $('<div>').addClass("qoption").appendTo($qlist);
                let $qid = $('<div>').addClass("qid").appendTo($option).text(1 + idx);
                $('<div>').addClass("qinfo").appendTo($option)
                    .html(words.length + "語 " + words.join("").length + "字 " + factor.n + "部首" + "<br />" +
                          factor.date.split("T").shift().slice(1) + " " + factor.author);
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
        let date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        let expired = ";expires=" + date.toGMTString();

        let cookie = "wordlist=" + encodeURIComponent($("#wordlist").val());
        document.cookie = cookie + expired;
        cookie = "redefine=" + encodeURIComponent($("#redefine").val());
        document.cookie = cookie + expired;

        $(this).css("background-color", "#cfc");
    });

    //呼出ボタン
    $("#qload").click(function() {
        if (!$("#qloadhash").is(":visible")) {
            return $("#qloadhash").show();
        }
        let hash = $("#qloadhash").val().split("#").slice(1).join("#").trim();
        if (hash) {
            const decodehash = (str) => {
                try {
                    return decodeURIComponent(escape(window.atob(str)));
                } catch(e) {
                    console.log(e);
                    return false;
                }
            };
            if (!confirm("ハッシュ問題をロードする?")) return;
            let param = Object.fromEntries(hash.split(":").map(v=>v.split("=")));
            $("#wordlist").val(decodehash(param.q));
            $("#redefine").val(decodehash(param.def));
            $(this).css("background-color", "#cfc");
            $("#qloadhash").val("").hide();
            make_quiz();
            return;
        }
        if (document.cookie) {
            if (!confirm("ローカル保存データをロードする?")) return;
            let is_valid = false;
            document.cookie.split(";").forEach(function(param) {
                let p = param.split("=");
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
                $("#qloadhash").val("").hide();
                make_quiz();
            } else {
                $(this).css("background-color", "red");
            }
            return;
        }
        $(this).css("background-color", "red");
    });

    // help:頻出再定義リスト
    $("#makequiz .help").click(function() {
        if ($("#frequents label").size() > 0) return;

        $("#redefinelist").text().split("/").forEach(function(frag) {
            frag = frag.trim();
            if (frag.indexOf("#") == 0) {
                $("<br/>").appendTo("#frequents");
                $("<label>").append(frag.slice(1)).appendTo("#frequents");
                return;
            }
            $("#frequents").append(" / ");
            $("<span>").text(Array.fromCdp(frag).join("")).appendTo("#frequents");
        });
        $("#frequents span").click(function() {
            let txt = $("#redefine").val();
            let redef = $(this).text();
            if ((0 < txt.length) && (txt.slice(-1) != "/")) txt += "/";
            if (txt.includes(redef))
                $("#redefine").val(txt.split(redef + "/").join(""));
            else
                $("#redefine").val(txt + redef + "/");
        });

    });


    ///// class:DicScreen (辞書ツール)
    // 字検索
    $("#parts").keydown(function(e){
        if (e.keyCode != 13) return;
        find_parts($(this).val());
    });

    // 語検索
    $("#chars, #nchars, #numof").keydown(function(e){
        if (e.keyCode != 13) return;
        findwords();
    });

    // 語のかな表示チェックボックス
    $("#skana").change(function() {
        if ($(this).prop("checked"))
            $(".fkana").show();
        else
            $(".fkana").hide();
    });

    // 部首選択で字検索
    $("#partlist, #op, #statbox").on("click", ".setpartbox", function() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            let $key = $(this).find(".setpart").text();
            $("#parts").val($key);
            find_parts($key);
            return;
        }
        $(".setpartbox").removeClass("selected");
        $(this).addClass("selected");
    });

    // 部首選択の枠外クリックで解除
    $("#makequiz").on("click", function(e) {
        if ($(e.target).closest('.setpartbox').length != 0) return;
        $(".setpartbox").removeClass("selected");
    });

    // help:部品一覧
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
        let list = kanjitable.partslist(true); // = {"部首": n}
        let $list = $("#partlist").css({"line-height":"10px"}).show();
        Object.keys(list).sort().forEach(c => draw_partbox(c, list[c], $list));
    });
    
    // help:語検索用の辞書ロード
    $("#dicloaderopen").click(function() {$("#dicloader").toggle();});
    $("#dicload").click(function() {
        dic.clear();
        const ongetfile = (txt) => {
            dic.load(txt);
            $("#dicloaded span").remove();
            $("#dicloaded").append("[読込済]<span>:全" + dic.words().length + "語</span>").show();
            $("#ifdicload").show();
        };

        $("#dicloader").hide();
        $("#dicloaded").text("");
        $("#dicloader label :checked").each(function() {
            let filename = $(this).parent().text().trim();
            if (!filename) return;
            $.get("../dicts/" + filename, txt => { ongetfile(txt); }).fail(function() {
                $("#dicloaded").append("[失敗]");
            });
        });

        let file = $("#dicloader input[type=file]").get(0).files[0];
        if (!file) return;
        let gettext = async (blob) => {
            const txt = await blob.text();
            ongetfile(txt);
            let undef = dic.words().reduce((ret,w) =>
                [...ret, ...Array.from(w).filter(c => ("\u2e80" <= c) && !c.match(/[ぁ-ー！-￮]/) && !ret.includes(c) && !_SKKTABLE.includes(c) && !kanjifrag.db(c))],
                []).sort();
            if (!undef.length) return $("#dicalert").hide();
            $("#dicalert").show().text("\n未定義文字=" + undef.map(c=>c+":").join("/"));
        };
        return gettext(new Blob([file], { type: "text/plain" }));
    }).click();

    ///// class:Stat (統計) /////
    $("#stat").click(function() {
        $(this).remove();
        $("#statbox").show();
        setTimeout(stats, 400);
    });
});

///// class:Editor (問題作成ツール)
//問題生成
const make_quiz = function(is_unsort)
{
    $("#top, #menu").text("");
    $("#keyinput").appendTo("#main");
    
    let quiz = {};
    //再定義
    if (quiz.def != $("#redefine").val()) {
        let redef = Array.fromCdp($("#redefine").val()).join("");
        $("#redefine").val(redef);
        quiz.def = redef;
    }
    //生成
    quiz.q = $("#wordlist").val();
    quiz.resume = !$("#demo").prop("checked");
    qscreen.start(quiz);
    dump_partstable();
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
    if (!quiz.resume) {
        $("#makequiz .closer").each(function() {
            if ($(this).parent().is(":visible")) $(this).click();
        });
        $("#demo").prop("checked", false);
        return;
    }

    const encoder = s => btoa(unescape(encodeURIComponent(s)));
    let $qstat = $("<span>").css({"display":"inline-block"}).appendTo("#quiz")
        .html("(" + $(".word").size() + "語 " + $(".glyph").size() + "字 " + $(".fragkey").size() + "部首 <a>新デモ</a>)");
    $qstat.find("a").prop("href", "../#quiz:demo=:q=" + encoder(quiz.q) + ":def=" + encoder(quiz.def))
        .prop("target","_blank");

    //文字重複チェック
    let dup = Array.from(quiz.q).filter((x, i, self) => (x !== "/") && self.indexOf(x) === i && i !== self.lastIndexOf(x));
    if (0 < dup.length) {
        let $dup = $("<span>").css({"display":"inline-block", "color":"red"}).appendTo("#quiz").text(" [重複あり]" + dup.filter(c=>c.match(/\p{Script=Han}/u)).join());

        // 語重複チェック
        let wdup = quiz.q.split("/").filter((x, i, self) => self.indexOf(x) == i && self.lastIndexOf(x) != i);
        if (0 < wdup.length) {
            $("<span>").css({"display":"inline-block", "margin-left":"2px","background":"#fdd"}).appendTo($dup).text(" [語重複] " + wdup.join());
        }
        // 語根重複チェック
        let stems = quiz.q.split("/").map(w => w.trim()).map(w => Array.from({length:w.length-1},(_,i)=> {
            let stem = w.slice(i,i+3); // 連続かな3字・それ以外は2字を語根とする
            return (w[i].match(/^[ぁ-ー]+$/)) ? stem : w.slice(i,i+2);
        })).flat();
        let stemdup = stems.filter((x, i, self) => !wdup.join("/").includes(x) && self.indexOf(x) == i && self.lastIndexOf(x) != i);
        stemdup.map(s=> {
            let n = (s.length == 3) ? stemdup.indexOf(s.slice(-2)) : -1;
            if (n != -1) stemdup[n] = ""; // 3字のかな語根重複は末尾2字も当然重複のため除去
        });
        if (0 < stemdup.length) {
            $("<span>").css({"display":"inline-block", "margin-left":"2px","background":"#fdd"}).appendTo($dup).text(" [語根重複] " + stemdup.filter(v=>v).join());
        }
    }

    //語使用歴チェック
    let words = $(".wordstat").get().map(v=>[v.innerText,v.parentNode.value]);
    let worddup = quiz.q.split("/").reduce((dup, w) => {
        let word = words.find(v=>v[0]==w);
        if (!word) return dup;
        dup.push(word[0] + "(" + (word[1]) + ")");
        return dup;
    }, []);
    
    if (worddup.length > 0) {
        $("<span>").css({"display":"inline-block","color":"blue"}).appendTo("#quiz").text(" [既出語]" + worddup.join(", "));
    }

    //グリフをクリックしたときに定義を表示
    $(".elm").click(function() {
        let $glyph = $(this).parents(".glyph");
        let c = $glyph.find(".correct").text();
        $("#knjdef").text(c + ":" + kanjifrag.db(c));
    });
};

//問題パーツ一覧表示
const dump_partstable = () => {
    let kidx = partquiz.kidx;
    let count = partquiz.count;
    const colorcode = (c, n) => {
        if (n == 1) return "#ccf";
        let color = (n < 7 ? (0xfff - (n - 2) * 0x022) : 0xf11);
        return ('#' + color.toString(16));
    };
    
    // リスト表示
    // <div#op><div($part)><checkbox/><span.fragkey/barekey>key</span><span.cdpf>cdp</span></div></div>
    // <div#op><div($partbox)><div.setpart($part)>key/cdpf</div></div></div>

    $("#op").text("");
    let frgs = $("#knjtb").val().split("/").sort()
        .filter((v,i,self) => v.slice(0,1).match(/\p{Script=Han}/u) && self.indexOf(v)==i)
        .map(v=>v.split(":")[1]);
    for (let key in kidx) {
        let $part = draw_partbox(key, count[key], "#op", colorcode);
        // 閉じた(=単一漢字にしか使われていない)部首の判定
        if (!key.match(/[ぁ-ん]/) && frgs.filter(f => f.includes(key)).length == 1) $part.css("color","blue");
    }
    for (let key in count) {
        if (count[key] != 1) continue;
        draw_partbox(key, 1, "#op", colorcode);
    }

    //選択時に解表示
    $("#op .fragkey").click(function() {
        let classname = "kidx" + (1 + $(this).index("#op .fragkey"));
        if ($("." + classname).eq(0).hasClass("undone")) {
            $("." + classname).removeClass("undone").hide().next().show();
        }
    });
    return kidx;
};

// ソート
const wordsort = function()
{
    let qlists = [];

    $(".word").each(function(idx) {
        let t = $(this).find(".glyph").size();
        let c = $(this).find(".elm").size() - $(this).find(".qelm").size();
        let txt = $(this).find(".correct").text();
        qlists.push({n:t, ex:c, w:txt})
    });

    let txt = qlists.sort((a,b) => {
        if (a.n != b.n) return b.n - a.n;
        if (a.ex != b.ex) return a.ex - b.ex;
        return (Math.random() * 2 - 1);
    }).map(q => q.w).join("/");
    
    $("#wordlist").val(txt);
    $("#wsort").prop("checked", false);
    make_quiz(true);
};

// 統計
const stats = async (argv) => {
    let qlists = JSON.parse(await getfile("qlist.json"));
    JSON.parse(await getfile("../qlist.json")).filter(v => !qlists.find(q=>q.qid == v.qid)).map(v => qlists.push(v));

    let wordstat = Object.entries(qlists.reduce((stat,q) => {
        q.q.split("/").map(w => {
            w = w.trim().split("+").join("").split("=").pop();
            stat[w] = [...(stat[w]||[]), q.qid];
        });
        return stat;
    }, {})).sort((a,b)=>b[1].length-a[1].length);

    let glyphstat = Object.entries(qlists.reduce((stat,q) => {
        Array.from(q.q).filter(c=>c.trim() && !"=/+_".includes(c))
            .map(c => { stat[c] = [...(stat[c]||[]), q.qid]; });
        return stat;
    }, {})).sort((a,b)=>a[1].length-b[1].length);

    let partstat = Object.entries(qlists.reduce((stat,q) => {
        kanjifrag.definelocal(q.def);
        Array.from(q.q).filter(c=>c.match(/\p{Script=Han}/u)).map(c=> kanjifrag.split(c).toString()).join(",").split(",")
            .filter(p=>!p.match(/^[A-z]$/)).map(p => { stat[p] = [...(stat[p]||[]), q.qid]; });
        return stat;
    },{})).sort((a,b)=>a[1].length-b[1].length);

    //結果表示
    let $statjigo = $("#statbox .result").text("");
    $("<p>").text("出題数:" + (quiztable.length - 1)).appendTo($statjigo);
    let $wordstat = $("<h4>").text("部首出現数").appendTo($statjigo);
    let $pl = $("<div>").appendTo($statjigo).addClass("statparts")
        .css({"margin":"0 0 30px 0", "line-height":"10px"});
    $wordstat = $("<h4>").text("語出現数(2回以上)").appendTo($statjigo);
    let $wl = $("<ol>").appendTo($statjigo);
    let $glyphstat = $("<h4>").text("字出現数").appendTo($statjigo);
    let $gl = $("<div id=glyphstat>").appendTo($statjigo);

    wordstat.forEach(v => {
        let len = v[1].length;
        let $list = $wl.find(`li[value=${len}]`);
        if (!$list.size()) $list = $("<li>").appendTo($wl).prop("value", len);
        $("<span>").text(v[0]).addClass("wordstat").appendTo($list);
    });
    $wl.find("li[value=1]").hide();
    $gl.html(glyphstat.map(v => `<div class="glyphstat">${v[1].length}<span>${v[0]}</span></div>`).join(""));
    partstat.forEach(v => draw_partbox(v[0], v[1].length, "div.statparts"));
};

///// class:DicScreen (辞書ツール)
//語検索
let findwords = () => {
    append_to_but();
    find_chars_with_existing_parts(true);
    
    if ($("#chars").val() === "") $("#chars").val("/rp");
    
    // 検索パラメタ
    let cs = ($("#chars").val() === "*") ? [] : Array.from($("#chars").val());
    let ps = ($("#parts").val() === "*") ? [] : Array.fromCdp($("#parts").val());
    let num = $("#numof").val().split("-");
    let exc = Array.from($("#nchars").val()).filter(c => !cs.includes(c));
    let sort = $("#factorsort").prop("checked");
    let ctypes = !$("#glyphcolor").prop("checked") ? {} : Object.fromEntries("rbpc".split("").map(key => [
        key, $(".mask" + key + " .fchar").get().map(v => v.innerText).join(""),
    ]));
    
    // パラメタ略記の補完
    if (num.length == 1) num[1] = num[0];
    if (num.length == 0) num = [2, 2];
    
    $("#foundwords").html("searching...");
    
    setTimeout(() => {
        //指定パーツを分割しない
        kanjifrag.definelocal($("#redefine").val() + "/" + ps.join(":/") + ":/");
        let words = dic.find({cs,ps,num,exc,ctypes,sort});
        //パーツ辞書を元に戻す
        kanjifrag.definelocal($("#redefine").val());
        
        // 結果表示
        $("#foundwords").show().text("");
        if (words.length == 0) {
            $("#foundwords").show().text("No results");
            return;
        }
        
        $("#foundwords").show().html(words.map(word0 =>
            word0.map(word => '<span class="fword">' + word + '</span>').join(", ")
        ).join("◆"));
        
        $(".fword").each(function() {
            let word = $(this).text();
            let $word = $(this);
            //色付け
            if ($("#glyphcolor").prop("checked")) {
                $word.html(Array.from(word).map(d => {
                    let key = "rbpc".split("").find(key => ctypes[key].includes(d));
                    return key ? ('<span class="mask' + key + '">' + d + '</span>') : d;
                }).join(""));
            }
            //かな付け
            $("<span>").addClass("fkana").text("(" + dic.read(word).trim() + ")").appendTo($word);
        }).click(function() {
            // 語クリックで追加
            if ($(this).hasClass("selected")) {
                let text = $("#wordlist").val().replace(/\(.+?\)/g, "").replace(/\/+$/, "") +
                    "/(" + $(this).text().split("(").shift() + ")";
                $("#wordlist").val(text).parents().show().next(".minimized").remove();
                make_quiz(true);
            } else {
                $(".fword").removeClass("selected");
                $(this).addClass("selected");
            }
        });
        $("#skana").change();
    }, 20);
};

//字検索
const find_parts = function(val) {
    append_to_but();
    
    $("#parts_ret").text("Searching...").parents().show().next(".minimized").remove();
    setTimeout(function() {
        $("#parts_ret").text("");
        if (val == "*" || val == "") return find_chars_with_existing_parts();
        let target = Array.fromCdp(val);
        if (!target) return "";
        
        //指定パーツを分割しない
        kanjifrag.definelocal($("#redefine").val() + "/" + target.map(c => c+":").join("/"));
        let ret = kanjitable.find(target);
        //パーツ辞書を元に戻す
        kanjifrag.definelocal($("#redefine").val());
        
        //結果表示
        $("#parts_ret").append("(" + ret.length + ")");
        let maskch = $("#glyphcolor").prop("checked") ? find_chars_with_existing_parts(true) : {};
        ret.forEach(c => {
            let $c = $("<span>").addClass("fchar").text(c).appendTo("#parts_ret");
            if ($("#nchars").val().includes(c)) $c.before("[").after("]");
            if (!$("#glyphcolor").prop("checked")) return;
            //色付け
            "rbpc".split("").filter(key => maskch[key].includes(c))
                .map(key => $c.addClass("mask" + key));
        });
        fchar_events();
        
    }, 100);
};

//字クリックで語検索
const fchar_events = function() {
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

//既存部品字
const find_chars_with_existing_parts = function(is_hidden) {
    let maskch = kanjitable.classify({
        pclose: $("#op .fragkey").get().map(v=>v.innerText),
        popen:  $("#op .barekey").get().map(v=>v.innerText),
        exc: "",
    });
    
    //結果表示
    for (let key in maskch) {
        let fchars = maskch[key];
        let $div = $("<div>").addClass("maskful mask" + key).appendTo("#parts_ret")
            .text("(" + fchars.length + ")").hide();
        Array.from(fchars).forEach(c => $div.append('<span class="fchar">' + c + "</span>"));
    }
    if (is_hidden) return maskch;
    $(".maskful").show();
    fchar_events();
    return maskch;
};

//既使用字の展開
const append_to_but = function() {
    if (!$("#addbut").prop("checked")) return;
    let txt = $("#nchars").val().split("/").shift() + "/"
        + $("#wordlist").val().replace(/\(.+\)/g, "").replace(/[ぁ-ー]/g,"").split("/").join("");
    $("#nchars").val(txt);
};


//// Common libs /////
const draw_partbox = function(c, n, $parent, callback)
{
    let $partbox = $("<div>").addClass("setpartbox").text(n).appendTo($parent);
    let $part = $("<div>").addClass("setpart").text(c).appendTo($partbox);
    
    if (callback) {
        $partbox.css('background-color', callback(c, n));
        $part.addClass((1 < n) ? "fragkey" : "barekey");
    } else {
        let ctype = possible_mojibake(c);
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
    if (!c.match(/&[^;]+;/)) return $part;
    if (c.includes("CDP")) {
        $part.html(cdp2ucs(c)).addClass("cdpf");
        return $part;
    }
    let $svg = $("#" + c.slice(1, -2));
    if ($svg.size() > 0) {
        $part.html($svg.clone().show());
        $part.css("background-color", "#7C7");
    }
    return $part;
};
//文字化けのおそれがあるパーツの判定
const possible_mojibake = c => {
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


