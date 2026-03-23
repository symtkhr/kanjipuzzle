
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
            if ($(this).find(".undone").size() == 0) return;
            let $c = $(this).find(".correct");
            //console.log(d.a, $c.text());
            if (d.a.indexOf($c.text()) == -1) return;
            $c.show().addClass("cdone"+d.uid);
            $(this).find(".elm div").hide();
            return true;
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

const sock = new SocketClient();

$(function() {
    $("#sh, #continue, #main").hide();
    sock.launch();
    menu.load_qlist();
});

