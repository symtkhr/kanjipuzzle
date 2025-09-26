const PlayerLog = function() {
    let pvlog = [];
    const draw_pulldown = function(logstring, qlist)
    {
        let qwords = qlist.split("/");
        pvlog = logstring.split("@@")[0].split(';').filter(v=>v).map(ans => {
            if (ans.indexOf("=") < 0) {
                ans = ans.slice(1).split("]").join("=");
            }
            let d = ans.split("=");
            if (d.length < 2) return {};

            let ret = { wid: 0, time: d[0], input: d[1], };
            let wid = d[1].match(/\[[0-9]+\]/);
            if (!wid) return ret;

            ret.wid = parseInt(wid[0].slice(1));
            ret.input = d[1].split("x").shift() + "x";
            ret.glyph = d[1].split(wid[0]).pop();
            return ret;

        }).filter(v=>v).map(log => {
            if (!parseInt(log.time)) return {};
            let wid = parseInt(log.wid);
            let time = log.time;
            let input = log.input;
            let match = input.slice(-1) == "x" ? input.slice(0, -2) : input;
            
            // 語番号の推定
            if (wid == 0 && match.length) {
                //todo:"蝋人形"などjischange/kanachangeへの対応
                wid = qwords.findIndex(w => w.indexOf(match) != -1) + 1;
            }

            if (!wid || !match.length) return log;
            console.log(log,qwords[wid-1]);
            // 入力位置の特定(todo:"湯湯婆"(AAB型),"十人十色"(ABAC型)への対応)
            log.wid = wid;
            log.glyph = Array.from(qwords[wid - 1]).findIndex(c => c == input[0]);
            return log;
        });

        timer.stop();
        $("#bonus").text("");
        let $pdown = $('<select id="srvlog">').appendTo("#bonus");
        //.css("position","absolute").css("right","30px")
        [{}, ...pvlog].map(v => {
            let $opt = $("<option>").text("<Playlog>").appendTo($pdown);
            if (!v.time) return;
            $opt.text(v.input);
        });
    };

    const replay_log = (answerchecker) => {
        // 事前にkidxとpointを模擬しておく
        pvlog = pvlog.map(v => {
            // 実際に入力する
            $("#quiz .glyph").removeClass("selected");
            let $word = $('#quiz .word').eq(v.wid - 1);
            $word.find('.glyph').eq(v.glyph).addClass('selected');
            answerchecker(v.input, true);
            
            // 点数と開いた部首番号の記録
            v.point = $("#point").text();
            v.kidx = $word.find(".elm .kidx:not(.undone)").map(function() {
                return parseInt($(this).text());
            }).get().filter((v, i, self) => self.indexOf(v) == i);
            return v;
        });

        let clearall = () => {
            $("#quiz .kpart").show();
            $("#quiz .kidx").addClass("undone").show().next().hide();
            $("#quiz .correct, #overlap, .replay").hide();
            $("#quiz .glyph").removeClass("selected");
            $(".judge").remove();
        };
        clearall();

        // eventhandler for pulldown
        $("#srvlog").focus().change(function(e) {
            e.stopPropagation();
            clearall();
            
            let n = $(this).prop("selectedIndex") - 1;
            if (n < 0) return $("#time").text(0);
            
            //指定ログ以前の入力を反映
            pvlog.slice(0, n).map(v => v.kidx).toString().split(",").forEach(p => {
                if (!p) return;
                $("#quiz .kidx" + p).removeClass("undone").hide().next().show();
            });
            
            //指定ログ描画
            let ans = pvlog[n];
            if (!ans.wid) return;

            //全パーツが開いたグリフを表示
            $("#quiz .glyph").each(function() {
                if ($(this).find(".undone").size() > 0) return;
                $(this).find(".correct").show();
                $(this).find(".elm div").hide();
            });
            
            // select glyph
            let $word = $('#quiz .word').eq(ans.wid - 1);
            let $glyph = $word.find('.glyph').eq(ans.glyph).addClass('selected');
            if ($glyph.size() == 0)
                $glyph = $word.find('.glyph').eq(0).addClass('selected');
            answerchecker(ans.input);

            // drawbox
            $glyph.find(".kidx").eq(0).click();
            $(".userans").prop('disabled', false)
                .val(ans.input)
                .prop('disabled', true);
            $("#srvlog").focus();
            $("#keyinput").show();
            $("#time").text(ans.time);
            $("#point").text(ans.point);
        });

        $("#point").parent().css("cursor","pointer").unbind().click(function() {
            let n = $("#srvlog").prop("selectedIndex");
            $("#srvlog").prop("selectedIndex", n + 1).change();
        });
        $(".gonext").eq(1).addClass("withheld");
        $(".gonext").eq(0).unbind().click(function() {
            location.reload();
        });
    };
    this.draw_pulldown = draw_pulldown;
    this.run_replay = replay_log;
    this.pvlog = () => pvlog;
};
