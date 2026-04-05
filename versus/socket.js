
const SocketClient = function() {
    let ws = null;
    let uid = 0;

    const replies = {
        wait:(d) => {
            const ucolor = ["fee/300", "ccf/00a", "fcc/c00", "cfc/0f0", "cff/0ff", "ffc/ff0", "fcf/a0a", "caa/840"].map(v=>v.split("/"));
            let users = d.user.filter(u => u.uid != uid);
            users.unshift(d.user.find(u => u.uid == uid));
            let $users = users.map((u,i)=>{
                return `<div class="user uid${u.uid}" style="border:2px solid #${ucolor[i%8][1]}; border-radius:20px; margin:2px; background:#${ucolor[i%8][0]}; padding:5px; display:inline-block; ${i==0?"font-weight:bold;text-decoration:underline;":""}">${u.name}</div>`;
            }).join("");
            $("#qlists").show().html("待機中: " + $users);
            $("#member").html($users);
            $("#member .user").css({margin:"2px -2px","font-size":"12px",color:"black",width:"25px","white-space":"nowrap","text-align":"center",overflow:"hidden"});
        },
    answer: (d) => {
        //if (d.uid == uid) return;
        let $glyphs = $("#quiz .glyph").filter(function() {
            return d.qclear.some(v=> {
                let cdoneclass = "cdone"+v.uid;
                if ($(this).hasClass(cdoneclass)) return;
                let $c = $(this).find(".correct");
                //console.log(d.a, $c.text());
                if (v.c.indexOf($c.text()) == -1) return;
                $c.show().addClass(cdoneclass);
                $(this).find(".elm div").hide();
                return true;
            });
        });
        $glyphs.each(function() {
            $(this).find(".elm").each(function() {
                let $c = $(this).find(".kidx.undone");
                if (!$c || !$c.html()) return;
                let c = $c.prop("class").match(/kidx([0-9]+)/);
                if (!c) return;
                $("#quiz ." + c[0]).removeClass("undone").hide().next().show();
            });
            $(this).find(".elm div").hide();
        });
        //全パーツが開いたグリフを表示
        $("#quiz .glyph").map(function() {
            if ($(this).find(".undone").size() > 0) return;
            $(this).find(".correct").show().text();
            $(this).find(".elm div").hide();
        });

        $("#member .user").get().map($u=>{
            let uid = [...$u.classList].find(v=>v.indexOf("uid")==0);
            if (!uid) return;
            let cname = uid.split("uid").join("cdone");
            $("."+cname).css("color",$u.style.borderColor);
        });

        let $w = $("#quiz .word").filter(function() {
            return !$(this).hasClass("wdone") && ($(this).find(".undone").size() == 0);
        }).addClass("wdone");
        const cb = (n) => {
            $w.css({"background-blend-mode":"lighten"})
                .css({"background-color":`rgba(200,255,200,${n*5/100})`});
            console.log($w.css("background-color"));
            if (n < 10) return setTimeout(() => { cb(n+1); }, 50);
            $(".wdone .correct").css({"text-shadow":"0 0 4px #500"});
        };
        cb(0);

        if ($("#quiz .kidx.undone").size() == 0) qscreen.end(-1);
    },
    qstart: (d) =>  {
        let q0 = {qid:-1, q:d.q, def:d.def, };
        //q0.resume = true; // for debug
        $("#overlap").hide();
        return qscreen.start(q0);
    },
    select: () => {},
    finish: () => {},
    };

    const socksend = (obj) => {
        obj.uid = uid;
        console.log(obj);
        ws.send(JSON.stringify(obj));
    };
    this.send = socksend;
    this.launch = function() {
        $("#message input").val(localStorage.uname || "");
        ws = new WebSocket(`ws://${location.hostname}:50100`);
        ws.onopen = function(){
            $("#greet").text("戦いますか?");

            $("#overlap").show();
            $("#config,#control,#qlists,#howto").hide();
            $("#message .submit").show().unbind().click(function() {
                let name = $("#message input").val().trim();
                if (!name) return;
                // todo: given from server
                uid = localStorage.uid || parseInt(Math.random() * 0xfffff);;
                userdata.savelogin(name, uid);
                socksend({ 
                    action:"participate",
                    name, uid,
                });
                $("#message").fadeOut();
            });

            $("#message input").focus().unbind().keypress(function(e) {
                if (e.which != 13 && e.key != "Enter") return;
                $("#message .submit").click();
            });

        };
        ws.onclose = function() {
            console.log("closed...");
            $("#overlap,#message").show();
            $("#config,#control,#qlists,#howto").hide();
            $("#greet").get(0).innerText = "申し訳ない。\nサーバが落ちたようだ。";
            $("#message .submit").unbind().text("再接続").focus().click(function() {
                location.reload();
            });
        };
        ws.onmessage = (e) => {
            let replyundefined = () => ({});
            let d = {};
            try {
                d = JSON.parse(e.data);
            } catch {
                d.reply = "none";
            }
            console.log(d);
            return (replies[d.reply] || replyundefined)(d);
        };
    };
    this.debugreply = (d) => (replies[d.reply])(d);
    this.uid = () => uid;
};

// メソッドの追加
userdata.savelogin = function(name, uid)
{
    localStorage.setItem("uname", name);
    localStorage.setItem("uid", uid);
};

qscreen.onAnswer = function(value)
{
    let $sel = $("#quiz .glyph.selected");

    // 問の対象にない文字の除去
    let $glyph = $sel.nextAll(".glyph").addBack();
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
            let n = $word.find(".glyph").index($sel);
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
    
    userdata.logappend(g_log);
    $(".judge").show().animate(
        {"left":"-120px","font-size":"300px","opacity":"0"},
        function() { $(this).remove(); }
    );
    se.play(trate ? "correct" : "incorrect");
    
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

    //全パーツが開いたグリフを表示
    let cpen = $("#quiz .glyph").map(function() {
        if ($(this).find(".undone").size() > 0) return;
        let n = $(this).parent().find(".glyph").index($(this));
        let c = $(this).find(".correct").show().text();
        $(this).find(".elm div").hide();
        return c;
    }).get().filter(v=>v);
    
    if (cpen.length) {
        let wid = $word.find(".wid").text() * 1 - 1;
        let gid = $word.find(".glyph").index($sel);
        sock.send({
            action:"answer",
            a:cpen.filter(v=>v).join("")});
    }
    
    $(".userans").select();
};

 
qscreen.end = () => {
    timer.stop();
    $(document).unbind();

    $("#greet2").css("width","300px").get(0).innerHTML = $("#member .user").get().map($v=>{
        let uid = [...$v.classList].find(v=>v.indexOf("uid")==0);
        if (!uid) return;
        let n = $("#quiz ." + uid.split("uid").join("cdone")).size();
        return {obj:$v.outerHTML, n};
    }).filter(v=>v).map(v=>`<span style="display:inline-block;vertical-align:center;margin-right:5px;">${v.obj} = ${v.n}</span>`).join("");
    $("#member .user").get().map($v => [...$v.classList].find(v=>v.indexOf("uid")==0))
    $("#keyinput, #howto, #qlists, #message").hide();
    $("#control").css("left",$("#overlap").width()+"px").show();
    
    setTimeout(() => {
        se.play("clear");
        $("#overlap, #score, .replay").show();
        $("#control").show().animate({"left":0});
        $(".gonext").unbind().click(function() {
            location.reload();
        });
    }, 1000);
};

// メニュー画面
const TopMenuVersus = function() {
    const load_qlist = (url) => {
        $("#fragtable,#fragtablep").removeClass("done").load(function(){
            $(this).addClass("done");
            show_menu("rgs");
        });

    };

    const show_menu = (arg) => {
        if ($("#fragtable").contents().find("body").text().length < 30000 ||
            $("#fragtablep").contents().find("body").text().length < 3000) {
            //setTimeout(() => location.reload(), 1000);
            return;
        }
        $("#fragtable,#fragtablep").each(function(){
            let txt = $(this).contents().find("body").text();
            kanjifrag.define(txt);
        });
        
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
        $(".closer").unbind().click(function() {
            $("#overlap").hide();
        });

        // clickevents in #main
        $(".showrule").unbind().click(function() {
            $("#control, #message, #qlists").hide();
            $("#overlap, #howto, #config").show();
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
            //userdata.savepartway();
            userdata.loadqclear();
            draw_qlists();
            location.hash = quiztable.length < 40 ? "#menu" : "#menu:archives";
        });
        $("#onse").change(function() {
            se.enable($("#onse").prop("checked"));
        });
        $("#onwid").change(function() {
            $("#quiz")[$("#onwid").prop("checked") ? "removeClass":"addClass"]("nowid");
        });
    };

    this.show_menu = show_menu;
    this.load_qlist = load_qlist;
};

const menuversus = new TopMenuVersus();
const sock = new SocketClient();

$(function() {
    $("#sh, #continue, #main").hide();
    sock.launch();
    menuversus.load_qlist();
});

