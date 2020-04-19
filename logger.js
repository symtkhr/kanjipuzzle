$(function() {

var LOGGERURL = $("#gasapi").prop("href");
//var LOGGERURL = false;
var scorelist = function()
{
    var $lately = $("<div>").prependTo("#menu");
    $("<h4>").text("●最近の解かれ").appendTo($lately);
    $lately.append("<br/>");
    $("<hr>").insertAfter($lately);

    $.ajax({
	url: LOGGERURL || "evac/scorelist.json",
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
            if (!$qopt.size()) return;
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
                        url: LOGGERURL || "evac/log.json",
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
    var done = [];
    var logs = [];
    
    $('#main .word').css("position", "relative");
    $("#srvlog option").each(function(i) {
        var arr = $(this).text().split("|");
        if (arr.length != 3) return;
        var wid = parseInt(arr[1]);
        var time = arr[0];
        var input = arr[2];
	var match = input.slice(-1) != "x" ? input : input.slice(0, -2);

	// 語番号の推定
        if (wid == 0 && match.length) {
            wid = qlist.split("/").findIndex(v => v.indexOf(match) != -1) + 1;
        }
	// ログの書式化
        $(this).text(time + "s: [" + ("00" + wid).substr(-2) + "]" + input);

	logs[i] = {wid:wid, time:time, input:input};
	if (!wid || !match.length) return;

	// 入力位置の特定
        $(".glyph").removeClass("selected");
        var $word = $('#main .word').eq(wid - 1);
	$word.find('.correct').each(function(i) {
	    if ($(this).text() == input.substring(0,1)) {
                $(this).parent().addClass('selected');
		logs[logs.length - 1].glyph = i;
		return false;
	    }
        });
	// 判定
	callback(input, true);

	// 開いた番号の記録
	var kidx = $word.find(".elm .kidx:not(.undone)").map(function() {
	    return parseInt($(this).text());
	}).get().filter((v, i, self) => (done.indexOf(v) < 0) && (self.indexOf(v) == i));

	done = done.concat(kidx);
	logs[i].kidx = kidx;
	logs[i].point = $("#point").text();
    });

    var clearall = () => {
	$("#quiz .kpart").show();
	$("#quiz .kidx").addClass("undone").show().next().hide();
	$("#quiz .correct").hide();
        $("#quiz .glyph").removeClass("selected");
        $("#quiz .elm").css("background-color", "");
	$(".judge").remove();
    };
    clearall();
    
    $("#srvlog").focus().change(function(e) {
        e.stopPropagation();
	clearall();

        var n = $(this).prop("selectedIndex");
        if (n == 0) return;

	//指定ログ以前の入力を反映
        logs.slice(1, n).map(v => v.kidx).toString().split(",").forEach(p => {
	    if (!p) return;
	    $("#quiz .kidx" + p).removeClass("undone").hide().next().show();
	});
	
        //全パーツが開いたグリフを表示
        $(".glyph").each(function() {
            if ($(this).find(".undone").size() > 0) return;
            $(this).find(".correct").show();
            $(this).find(".elm div").hide();
        });
	
	//指定ログ描画
        var ans = logs[n];
        if (!ans.wid) return;
	
	// select glyph
        var $word = $('#main .word').eq(ans.wid-1);
        var $glyph = $word.find('.glyph').eq(ans.glyph).addClass('selected');
	if ($glyph.size() == 0)
	    $glyph = $word.find('.glyph').eq(0).addClass('selected');
	callback(ans.input);

	// drawbox
	$(".userans").show().css({"width": "100%"})
	    .prop('disabled', false)
	    .val(ans.input)
	    .prop('disabled', true);
	
	$("#keyinput").appendTo($word).show().css(
	    {"width": $word.width() - $glyph.position().left,
	     "left" : $glyph.position().left,
	     "bottom": ($word.height() - $glyph.position().top) });

	$("#point").text(ans.point);
	$("#g_log").val("").hide();
    });

};

