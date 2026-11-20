// noprotect
$(function() {
    $("#rule, #sh, #continue, #main, #menu").hide();
    load_qlist("qlist.json");
});

// replace userdata.loadpartway
const earlier_loadpartway = function()
{
    let resume = (() => {
        try {
            return JSON.parse(localStorage.savepartway);
        } catch (e) {
            return;
        }
    })();
    
    if (!resume) return;
    
    // 再開時のデータ展開
    let q = menu.quiztable().find(q => q.qid == resume.qid);
    if (!q) return;

    $("#continue").show().find(".resume").remove();
    $(`#menu .qoption .qid[data-qid=${resume.qid}]`).parent().addClass("resume").clone().appendTo("#continue");

    $(".resume").unbind().click(function() {
        if (!$("#fragtable").hasClass("done")) return;
        let qid = parseInt($(this).addClass("selected").find(".qid").attr("data-qid"));
        $(this).siblings(".qoption").animate({"opacity": "0"});

        $('<div>').addClass("loading").text("再開").appendTo(this)
            .animate({"opacity":".5"}, function() {
                q.resume = true;
                q.hintwait = resume.time;
                qscreen.start(q);

                $("#quiz .kidx").removeClass("undone").hide().next().show();
                resume.undone.forEach(kid => $("#quiz .kidx" + kid).addClass("undone").show().next().hide());

                //全パーツが開いたグリフを表示
                $("#quiz .glyph").each(function() {
                    if ($(this).find(".undone").size() > 0) return;
                    let n = $(this).parent().find(".glyph").index($(this));
                    $(this).find(".correct").show();
                    $(this).find(".elm div").hide();
                });
                $("#g_log").val(resume.log);
                $("#point").text(resume.pt);
                timer.start(resume.time + 1);
            });
    });

    $("#erase_resume").show().click(function() {
        userdata.erasepartway();
        $(this).hide();
        $("#continue").hide();
        $(".qoption.resume").removeClass("resume").show();
    });
    return true;
};

const show_daily = function()
{
    if ($("#daily .word").size()) return;
    let today = new Date();
    let seed = today.getFullYear() * 12 +
        today.getMonth() * 35 + today.getDate();
    //seed = 2019 * 12 + 9 * 35 + 13;
    let random = new Random(seed);
    let qidx = random.next() % (quiztable.length);
    let quiz = quiztable[qidx];
    let qlist = quiz.q;
    let wlen = qlist.split("/").length;
    let iword = wlen - 1 - random.next() % parseInt(wlen * 0.3);
    let options = {
        display: iword,
        openlist: quiz.def.split("/").filter(def => def.indexOf("x:") != -1).join(""),
    };
    kanjifrag.definelocal(quiz.def);
    qscreen.draw(qlist.split("/"), $("#daily").text(""), options);

    $("#daily").css("position", "relative").click(function() {
        $(this).parent().css("background-color", "#bdc");
        $('*').unbind();
        $('<div>').addClass("loading").text("読込中").appendTo(this)
            .animate({"opacity":".5"}, function() {
                qscreen.start(quiz);
                $("#quiz .word").eq(iword).find(".elm").eq(0).click();
            });
    });
};

let quiztable = [];
const load_qlist = (url) =>
{
    // GAS が重くなってきたのでローカル qlist.json をデフォルトに
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
            if ($("#fragtable").hasClass("done"))
                show_menu();
        }).fail(function(){
            $("#example, #daily, #newest").text("(読込失敗)");
            loadfile();
        });
    };

    $("#fragtable,#fragtableplus").load(function(){
        let txt = $(this).contents().find("body").text();
        kanjifrag.define(txt);
        $(this).addClass("done");
        if ($("#fragtable.done").size() && $("#fragtableplus.done").size()) show_menu();
    });

    loadfile();
};

const show_menu = function()
{
    let draw_top = () => {
        if ($("#example .word").size()) return;
        $("#example, #example_answer").text("");
        $("#top").show();
        qscreen.draw(["徒競走"], $("#example"));
        qscreen.draw(["徒競走"], $("#example_answer"), {open: true});
    };

    draw_top();

    if (quiztable.length == 0) return;
    $("#qlists").text("");
    const qidtoname = (qid) => 2600 < qid ? ("詰" + (qid - 2600)): (200 < qid ? ("表" + (qid - 200)) : (qid == -1 ? "生成" : qid));

    quiztable.forEach(q => {
        q.qno = qidtoname(q.qid);
        let words = q.q.split("/");
        let $option = $('<div>').addClass("qoption").appendTo("#qlists");
        let $qid = $('<div>').addClass("qid").appendTo($option).text(q.qno).attr("data-qid",q.qid);
        $('<div>').addClass("qclear").appendTo($qid).text('✔');
        let d = new Date(q.date.split("T").shift() + "T12:00+0900");
        $('<div>').addClass("qinfo").appendTo($option)
            .html(words.length + "語 " + words.join("").length + "字 " + q.n + "部首" + "<br />" +
                  d.toJSON().split("T").shift() + " " + q.author);
        $('<div>').addClass("qdesc").appendTo($option).text(q.desc);
    });
    menu.quiztable = () => quiztable;

    if (!$('.qoption').size()) { return $('body').hide(); }

    let anchor_check = function() {
        if (location.href.indexOf("#archives") < 0) {
            $("#menu, #main").hide();
            $("#top").show();
            return;
        }
        $("#top, #main").hide();
        $("#menu").show();
        $("#inherit2new").click(function() {
            let params = document.cookie.split(";").map(param => {
                let p = param.split("=");
                if (p[0].trim().indexOf('done') != 0) return;
                return {
                    qid: parseInt(p[0].split("_").pop()),
                    score: p[1],
                };
            }).filter(v=>v && v.qid);
            try {
                let score = JSON.parse(localStorage.qclear);
                let qids = score.map(v=>v.qid);
                let json = [...score, ...params.filter(v => qids.indexOf(v.qid)==-1)];
                localStorage.setItem("qclear", JSON.stringify(json));
                $("#inherit2new").text("ログ統合済(" + json.length + "問)").attr("disabled",true);
            } catch {
                localStorage.setItem("qclear", JSON.stringify(params));
                $("#inherit2new").text("ログ移植済(" + params.length + "問)").attr("disabled",true);
            }
            console.log(localStorage.qclear);
        });
        if ($("#qlists").hasClass("logs")) return;
        if (location.href.slice(-3) != "log") return;
        $("#qlists").addClass("logs");
        $.getScript("./logger.js");
    };

    show_daily();
    earlier_loadpartway();
    anchor_check();

    $("#newest").text('');
    $(".qoption").eq(-1).clone().appendTo("#newest");
    $(".qoption").eq(-2).clone().appendTo("#newest");
    $(".qoption").eq(-3).clone().appendTo("#newest");
    $("#newest .resume").hide();

    $(".qoption").click(function() {
        if (!$("#fragtable").hasClass("done")) return;
        if ($(this).hasClass("resume")) return;
        let qid = parseInt($(this).addClass("selected").find(".qid").attr("data-qid"));
        //console.log(qid,qid[0],qid.slice(1));
        //qid = qid[0] == "詰" ? (2600 + parseInt(qid.slice(1))) : parseInt(qid);
        $(this).siblings(".qoption").animate({"opacity": "0"});
        let cleared = $(this).hasClass("cleared");
    
        $('<div>').addClass("loading").text("読込中").appendTo(this)
            .animate({"opacity":".5"}, function() {
                $("#top").hide();
                qscreen.start(quiztable.find(q=>q.qid==qid));
                if (!cleared) return;

                $("<button>").text("正解表示")
                    .css({"background":"#f99"})
                    .click(function() {
                        $(this).hide();
                        timer.stop();
                        $("#quiz .kpart").hide();
                        $("#quiz .kidx").removeClass("undone");
                        $("#quiz").find(".correct").show();
                    }).insertAfter("#main .qid");
            });
    });

    $(".closer").click(function() {
        let $parent = $(this).parent().hide();
        let title = $parent.find("h2,h4").eq(0).text();
        if($parent.hasClass("helper") || !title.trim()) return;
        $("<span>").text(title).addClass("minimized")
            .insertAfter($parent).click(function() {
                $(this).prev().show();
                $(this).remove();
            });
    });
    $(".help").click(function() {
        console.log($(this).prop("id"));
        if ($(this).prop("id") == "showrule") return;
        let $helper = $(this).parent().find(".helper");
        if ($helper.is(":visible")) $helper.hide(); else $helper.show();
    });
    $("#menu a, button.anch").click(function() {
        location.href = $(this).attr("href");
        anchor_check();
    });

    $("#showrule").click(function() {
        $('#rule').toggle();
    });

    if (location.href.indexOf("#debug") < 0) return;

    draw_top = () => 0;
    $("#top").hide();
    $.getScript("frontend_bushubumaker.js");
};

