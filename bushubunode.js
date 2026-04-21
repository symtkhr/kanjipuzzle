#!/bin/node

const WORDLEN = 40;
const REDEFINE = "";

const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');
const { execSync } = require('child_process');

let nodeapp = { help: () => { console.log("arg:", Object.keys(nodeapp)); }};

const [dic, kanjifrag, partquiz, kanjitable, makequiz, Array, cdp2ucs] = require('vm').runInNewContext(
    getfile('./bushubumaker.js') + "\n[dic, kanjifrag, partquiz, kanjitable, makequiz, Array, cdp2ucs];"
);

// 自動生成テスト
nodeapp.automake = (argv) => {
    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));
    kanjifrag.definelocal(REDEFINE);
    dic.load(getfile("SKK-JISYO.ML.utf8"));

    let options = Object.fromEntries(argv.map(v=>v.split("=")));
    partquiz.qwords = makequiz.select_random_words(options).split("/").filter(w => w);
    partquiz.make(partquiz.qwords, options);

    if (argv.indexOf("qwords.sample1") != -1)
        partquiz.qwords = '士大夫/国際化/脳卒中/枯草熱/攻玉社/柱時計/言語学/花柳界/北茨城/吉田茂/伊吹山/潜望鏡/主産物/御寮人/附加税/牽牛星/謝肉祭/軽合金/仲間割/理知的/膀胱癌/阿僧祇/成熟卵/固溶体/荒療治/弦楽器/空取引/焼林檎/陣太鼓/内沙汰/沖積層/交叉点/尊厳死/野薔薇'
        .split("/");
    if (argv.indexOf("qwords.sample2") != -1)
        partquiz.qwords = "政府米/氷河期/雲母引/上屋敷/信号場/知名度/化粧台/水溶液/麒麟児/充電器/撥音便/交換局/薄花色/双胴船/太陽年/監督官/定額法/大発会/向日葵/宇都宮/地蔵堂/担保物/腹具合/同位体/高楊枝/回覧板/若旦那/真木柱/序数詞/油揚本/曹洞宗/歳時記/漫画家/脳震盪/降誕祭"
        .split("/");

    let miss = 0;
    const wordlen = options.n || 40;
    for (;;)
    {
        let qn = partquiz.qwords.length;
        if (makequiz.select_rpbc_words(options) < 0) { console.log("-1!"); break; }
        console.log(qn, makequiz.abandon);
        partquiz.make(partquiz.qwords, options);
        if (partquiz.qwords.length >= wordlen) break;
        if (qn == partquiz.qwords.length) miss++;
        if (30 < miss) break;
    }
    makequiz.wordsort();
    console.log(partquiz.qwords.join("/"));
    console.log(JSON.stringify(partquiz.kidx));
    console.log(JSON.stringify(partquiz.count));
};

nodeapp.qdifficulty = (param) => {
    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));
    let qlists = JSON.parse(getfile("qlist.json"));
    let qs = qlists.map(q => {
        kanjifrag.definelocal(q.def);
        partquiz.make(q.q.split("/"));
        let entry = Object.entries(partquiz.count);
        let ret = {
            qid:q.qid,
            // the less pair kids, the more difficult solved
            pair: entry.filter(([k,n])=>n==2).map(v=>v[0]).join(""),
            // the more single kids, the easier solved.
            open: entry.filter(([k,n])=>n==1).map(v=>v[0]).join(""),
        };
        let ev = entry.reduce((sum,k) => {
            let n = k[1];
            return n == 1 ? (sum - 100) : (sum + 100/((n-1)**2))
        },0);
        ret.val = 6000 + parseInt(ev);

        // Sigma(count==1 ? (-count/2):(1/count))
        //ret.val = 3 * ret.pair.length - 2 * ret.open.length
        return ret;
    });
    qs.sort((a,b)=>a.val-b.val).map(v=>console.log(JSON.stringify(v)));

};
// check how much it affects qlist.json to append fragtable.plus.txt
nodeapp.qcompatible = (param) => {
    const suggestRedef = {
        2:'旦:Z日一', 3:'旦:Z日一', 11:'&k5-026c;:Z一由', 12:'𠮛:Z一口', 17:'𠮛:Z一口', 19:'𠮛:Z一口', 31:':Z亠丷', 34:'𠮛:Z一口', 38:'旦:Z日一',
        43:'午:Z𠂉十', 45:'旦:Z日一', 51:'旦:Z日一', 53:'𠮛:Z一口', 91:'𠮛:Z一口', 111:'旦:Z日一', 119:'旦:Z日一', 122:'旦:Z日一', 124:':Z亠丷',
    };

    let qlists = JSON.parse(getfile("qlist.json")).slice(0).map(q => {
        q.def = (q.def  + "/" + (suggestRedef[q.qid] || "")).split("/").map(v=>v.trim()).filter(v=>v).join("/");
        return q;
    });
    if (param.indexOf("dump") != -1) console.log(JSON.stringify(qlists,null,2));

    kanjifrag.define(getfile("fragtable.txt"));
    let origin = qlists.map(q => {
        kanjifrag.definelocal(q.def);
        partquiz.make(q.q.split("/"));
        return {q:q.q, def:q.def, kid:Object.keys(partquiz.kidx).join(""), json:JSON.stringify(partquiz.count)};
    });
    kanjifrag.define(getfile("fragtable.plus.txt"));
    let remake = qlists.map(q => {
        kanjifrag.definelocal(q.def);
        partquiz.make(q.q.split("/"));
        return {kid:Object.keys(partquiz.kidx).join(""), json:JSON.stringify(partquiz.count)};
    });
    
    // what definelocal makes the same as original qlist.json
    origin.map((ori,i)=>{
        let q = ori.q;
        let rem = remake[i];
        let remp = Object.keys(JSON.parse(rem.json));
        let orip = Object.keys(JSON.parse(ori.json)).map(c=>c=="八"?"ハ":c);
        
        // parts in orip which remp does not include
        let notincl = orip.filter(c=>remp.indexOf(c)<0);
        
        // remake using localdef which the remp does not include
        kanjifrag.definelocal(ori.def + "/" + notincl.map(c => c+":").join("/"));
        partquiz.make(q.split("/"));
        let remp2 = Object.keys(partquiz.count);

        return {
            "plus1" : notincl.map(c => c+":").join("/"),
            "minus" : orip.filter(c=>remp2.indexOf(c)<0).join(""),
            "plus2" : remp2.filter(c=>orip.indexOf(c)<0).join("")
        };
    }).map((v,i) => {if(v.plus1 ||v.plus2||v.minus) console.log(i+1,v ? v : "")});
};

// 引数で指定された部品を持つ漢字を検索する
nodeapp.findpart = (argv) => {
    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));
    let target = Array.fromCdp(argv[0]);
    kanjifrag.definelocal(target.map(c => c+":").join("/"));
    let filter = (n) => (n.length < 4) && n[0]=="N" && n[1]=="月";
    let ret = kanjitable.find(target) //, filter);
    console.log(ret.length, ret.join(""));
};

nodeapp.songcheck = (argv) => {
    let q = JSON.parse(getfile("earlier/qlist.json")).find(v => v.qid == 130);
    let list = getfile("vocaloid-karatetsu2024.txt").split("\n");
    //console.log(q);
    let ret = q.q.split("/").map(v => [v,list.find(l => l.indexOf("/" + v + ";") != -1)]);
    console.log(ret);
};

nodeapp.make = (argv) => {
    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));
    let qlists = JSON.parse(getfile("./earlier/qlist.json"));
    let maker = q => {
        if (!q) return console.log("specify qid as arg");
        kanjifrag.definelocal(q.def);
        let ret = partquiz.make(q.q.split("/"));
        let entry = Object.entries(partquiz.count);
        let tb = ret.tb.split("/");
        let quiz = q.q.split("/").map(w =>
            Array.from(w).map(c=> (tb.find(t => t.indexOf(c+":") == 0)||(c+":"+c)).split(":").slice(1)[0])
                .map(fr=>Array.from(fr).map(p=> [p,1+Object.keys(partquiz.count).indexOf(p)]))
                .map(fr=>fr.map(p=>p[1]||p[0]).join("."))
        );
        quiz.map(w=>console.log(w));
    };
    maker(qlists.find(q => q.qid == parseInt(argv)));
};

nodeapp.logfilter = (argv) => {
    let options = Object.fromEntries(argv.map(v=>v.split("=")));
    let fname = options.file || `tmpbushubulog${parseInt(Math.random()*99999)}.json`;
    if (!argv[0]) {
        console.log("getlog...");
        execSync(`wget 'https://script.google.com/macros/s/AKfycbx65oBGA7GbPsxMzM18DEpM3W2PpLMrJJHDujtv/exec?v=score&logid=entire' -O ${fname}`);
    }
    let logs = JSON.parse(getfile(fname)).reduce((ret, v) => {
        if (v.time.toString().indexOf("-") != -1) {
            let d = v.time.split("-").map(v => parseInt(v));
            v.time = (new Date(d[0], d[1]-1, d[2], 0, 0)).getTime();
        }
        let idx = (v.qid < -1) ? v.qid : ret.findIndex(setv => {
            let timediff = v.time - setv.time;
            return (0 < timediff) && (timediff < 1000 * 60 * 60 * 24) && (v.score == setv.score);
        });
        if (idx < 0) 
            ret.push(v);
        else
            ret[idx] = v;
        return ret;
    }, [])
    //logs.filter(v=>(typeof v.name!=="string")).map(v=>console.log(v));
    if (options.name) logs = logs.filter(v =>v.name.toString().indexOf(options.name) != -1);
    console.log(JSON.stringify(logs,null,1));
};

// makequiz_tool.jsの移植
nodeapp.stat = (argv) => {
    let qlists = JSON.parse(getfile("./earlier/qlist.json"));
    JSON.parse(getfile("./qlist.json")).filter(v => !qlists.find(q=>q.qid == v.qid)).map(v => qlists.push(v));
    kanjifrag.define(getfile("fragtable.txt"));
    kanjifrag.define(getfile("fragtable.plus.txt"));

    let wordstat = Object.entries(qlists.reduce((stat,q) => {
        q.q.split("/").map(w => {
            w = w.trim().split("+").join("").split("=").pop();
            stat[w] = [...(stat[w]||[]), q.qid];
        });
        return stat;
    }, {})).sort((a,b)=>b[1].length-a[1].length);

    let glyphstat = Object.entries(qlists.reduce((stat,q) => {
        Array.from(q.q).filter(c=>c.trim()&&c!="="&&c!="/"&&c!="+")
            .map(c => { stat[c] = [...(stat[c]||[]), q.qid]; });
        return stat;
    }, {})).sort((a,b)=>a[1].length-b[1].length);

    let partstat = Object.entries(qlists.reduce((stat,q) => {
        kanjifrag.definelocal(q.def);
        Array.from(q.q).filter(c=>c.match(/\p{Script=Han}/u)).map(c=> kanjifrag.split(c).toString()).join(",").split(",")
            .filter(p=>!p.match(/^[A-z]$/)).map(p => { stat[p] = [...(stat[p]||[]), q.qid]; });
        return stat;
    },{})).sort((a,b)=>a[1].length-b[1].length);

    console.log("--word");
    wordstat.map(p=>console.log(p[0],p[1].length,JSON.stringify(p[1].filter((v,i,s)=>s.indexOf(v)==i).slice(0,10))));
    console.log("--glyph");
    glyphstat.map(p=>console.log(p[0],p[1].length,JSON.stringify(p[1].filter((v,i,s)=>s.indexOf(v)==i).slice(0,10))));
    console.log("--part");
    partstat.map(p=>console.log(p[0],p[1].length,JSON.stringify(p[1].filter((v,i,s)=>s.indexOf(v)==i).slice(0,10))));
};

if (typeof window == "undefined" && typeof process !== "undefined") {
    let argv = process.argv.slice(2);
    let key = argv.shift();
    (nodeapp[key] || nodeapp.help)(argv);
}

