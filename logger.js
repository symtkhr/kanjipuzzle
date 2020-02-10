$(function() {

var LOGGERURL = "https://script.google.com/macros/s/AKfycbx65oBGA7GbPsxMzM18DEpM3W2PpLMrJJHDujtv/exec";
var scorelist = function()
{
    var $lately = $("<div>").prependTo("#menu");
    $("<h4>").text("●最近の解かれ").appendTo($lately);
    $lately.append("<br>");
    $("<hr>").insertAfter($lately);

    $.ajax({
        url: LOGGERURL,
        type: 'get',
        data: {v: "score"},
        dataType: 'json',
        cache: false,
        timeout: 10000,
    }).fail(function(data, status, error) {
        $lately.append("Loading log error");
        console.log(data, status, error);
    }).done(function(rawdata, status, error) {
        // sort & merge data
        var data = rawdata.reduce(function(ret, v) {
            if (v.time.toString().indexOf("-") != -1) {
                var d = v.time.split("-").map(v => parseInt(v));
                v.time = (new Date(d[0], d[1]-1, d[2], 0, 0)).getTime();
            }
            var idx = ret.findIndex(function(setv) {
                var timediff = v.time - setv.time;
                return (0 < timediff) && (timediff < 1000 * 60 * 60 * 24) && (v.score == setv.score);
            });
            if (idx < 0) 
                ret.push(v);
            else
                ret[idx] = v;
            return ret;
        }, []);
        data.sort((a, b) => (b.time - a.time));
        dump_logs(data);
    });

    var dump_logs = function(logs) {
        logs.forEach(function(r, i) {
            var $qopt = $("#qlists .qoption").eq(r.qid - 1);
            var $rec = $("<div>").addClass("log").appendTo($qopt)
                .click(function(e) {
                    e.stopPropagation();
                    var toclose = $(this).hasClass("logdetail");
                    $("#qlists .log").removeClass("logdetail");
                    if (!toclose) $(this).parent().find(".log").addClass("logdetail");
                });

            var d = new Date(r.time);
            var strdate = d.getFullYear() * 10000
                + (d.getMonth() + 1) * 100
                + d.getDate();
            
            var strtime = '0000' + (d.getHours() * 100 + d.getMinutes());
            strtime = strtime.slice(-4, -2) + ':' + strtime.slice(-2);
            
            var score = r.score.split(";").map(v => parseInt(v));
            score.push(score.reduce((sum, v) => (sum + 1 * v), 0));

            $('<div>').addClass("logid").text(r.time).appendTo($rec).hide();
            var $date = $('<div>').addClass("logdate").text(strdate).appendTo($rec);
            $("<span>").text(strtime).appendTo($date);
            
            var $score = $('<div>').addClass("logscore").text(score[2]).appendTo($rec);
            $("<span>").text("(=" + score[0] + "+" + score[1] + ")").appendTo($score);
            
            if (r.name)
                $rec.append(r.name);
            else
                $("<span>").text("--").css("color", "#999").appendTo($rec);
            
            if (20 <= i) return;
            
            var $box = $("<div>").css(
                {"display": "inline-block",
                 "margin":"2px",
                }).appendTo($lately);
            $("<div>").addClass("qid").text(r.qid).appendTo($box);
            
            $rec.clone().appendTo($box).addClass("logdetail");
        });
        
        var $logplay = $("<div id=logplay>").prependTo($lately).css("float", "right");
        $("<button>").text("ログ").appendTo($logplay).hide().click(function() {
            $(this).next().show();
            $(this).remove();
        });
        $("<div class=qoption>").appendTo($logplay).hide().click(function() {
            var $qoption = $(this);
            var qid = parseInt($(this).addClass("selected").find(".qid").text());
            var logid = $(this).find(".logid").text();
            $("#qlists .qoption").animate({"opacity": "0"});

            $('<div>').addClass("loading").text("読込中").appendTo(this)
                .animate({"opacity":".5"}, function() {

                    $.ajax({
                        url: LOGGERURL,
                        type: 'get',
                        data: {logid: logid},
                        dataType: 'json',
                        cache: false,
                        timeout: 10000,
                    }).fail(function(data, status, error) {
                        $qoption.append("Loading log error");
                        console.log(data, status, error);
                    }).done(function(rawdata, status, error) {
                        console.log(rawdata);
                        make_pulldown(rawdata.shift().log);
                        load_quiz(qid);
                    });
                });
        });
        $(".log").click(function() {
            var $q = $("#logplay .qoption").text("");
            $(this).parent().find(".qid").clone().appendTo($q);
            $("<div>").text("クリックでログ表示").appendTo($q);
            $(this).clone().appendTo($q);
            $("#logplay button").show();
        });
    };
};

var make_pulldown = function(log)
{
    var $pdown = $('<select id="srvlog">').insertAfter("#g_log");
    var logs = log.split(';').map(ans => {

        if (!ans) return {};

        if (ans.indexOf("=") < 0) {
            ans = ans.substring(1).split("]").join("=");
        }
        
        var d = ans.split("=");
        var ret = {};
        ret.time = d[0];

        var wid = d[1].match(/\[[0-9]+\]/);

        ret.wid = wid ? wid.shift().substring(1) : 0;
        ret.input = d[1];

        if (wid) {
            ret.wid = parseInt(ret.wid);
            ret.input = ret.input.split("x").shift() + "x";
        }
        return ret;
    });

    logs.forEach(v => {
        var $opt = $("<option>").text("<Playlog>").appendTo($pdown);
        if (v.time) $opt.text(v.time + "|" + v.wid + "|" + v.input);
    });
};

    scorelist();
});

var replay_log = function(qlist, callback)
{
    $("#srvlog option").each(function() {
        var arr = $(this).text().split("|");
        if (arr.length != 3) return;
        var wid = parseInt(arr[1]);
        var time = arr[0];
        var input = arr[2];
        if (wid == 0) {
            var match = input.slice(-1) != "x" ? input : input.slice(0, -2);
            if (match.length)
                wid = qlist.split("/").findIndex(v => v.indexOf(match) != -1) + 1;
        }
        $(this).text(time + "s: [" + ("00" + wid).substr(-2) + "]" + input);
    });

    $("#srvlog").focus().change(function(e) {
        e.stopPropagation();
        
        $(".glyph").removeClass("selected");
        $(".elm").css("background-color", "");
        var n = $(this).prop("selectedIndex");
        if (n == 0) {
            $("#quiz").find(".kpart").show();
            $("#quiz").find(".kidx").addClass("undone").show().next().hide();
            $("#quiz").find(".correct").hide();
            return;
        }
        var log = $(this).find("option:selected").text();
        var ans = {
            wid: parseInt(log.split("[").pop()),
            input: log.split("]").pop(),
        };
        if (!ans.wid) return;

	// select glyph
        var $word = $('#main .word').eq(ans.wid-1).css("position", "relative");
        $word.find('.correct').each(function() {
            if($(this).text() == ans.input.substring(0,1)) {
                $(this).parent().addClass('selected');
		return false;
	    }
        });
        var $glyph = $(".glyph.selected");
        var $ki = $("#keyinput").appendTo($word).show();
        
	// draw inputbox
        $(".userans").show().css({"width": "100%"})
            .prop('disabled', false)
            .val(ans.input)
            .prop('disabled', true);
        if ($glyph.size() == 0)
            $glyph = $word.find('.glyph').eq(0).addClass('selected');
        $ki.css(
            {"width": $word.width() - $glyph.position().left,
             "left" : $glyph.position().left,
             "bottom": ($word.height() - $glyph.position().top) });
    });

    $("#srvlog").keydown(function(e) {
	if (e.keyCode != 13) return;
	
        callback($(".userans").val());
	$("#g_log").val("").hide();
    });
    

};

