#!/bin/node

let nodeapp = { help: () => {
    let thefile = process.argv[1].split("/").slice(-1).join("");
    console.log("arg:", Object.keys(nodeapp));
    console.log();
    console.log(`How to generate the webfont from glyphappend.json: `)
    console.log(` ${thefile} getdef | tee ./gwdefs.txt`);
    console.log(` ${thefile} generatesvg ./gwdefs.txt`);
    console.log(` ./glyphappend.py`);
}};

const { execSync } = require('child_process');
const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');

// pick up definitions of glyphs from dump_newest_only.txt
const getdef = (gwname) => {
    let gwname0 = gwname;
    const GWNEWEST = "dump_newest_only.txt";
    if (!require('fs').existsSync(GWNEWEST)) {
        console.log(`locate ${GWNEWEST} in the current directory`);
        return;
    }
    for (let i = 0; i < 20; i++) {
        let dump = execSync(`grep ` + gwname0.map(v=>`-e "^ ${v} "`).join(" ") + ` ` + GWNEWEST).toString();
        gwname0 = dump.split("\n").map(v=>v.split("|").pop().trim().split("$").filter(r=>r.indexOf("99:")==0).map(r=>r.split(":")[7].split("@").shift()).join(";")).join(";").split(";").filter((v,i,s)=>s.indexOf(v)==i).filter(name=>gwname.indexOf(name)<0);
        dump.split("\n").map(row => console.log(i?"*":"",row.split("|").map(v=>v.trim()).join(" = ")));
        gwname.push(...gwname0);
        if (gwname0.length == 0) return dump;
    }
}
nodeapp.getdef = (argv) => {
    let gwnames = JSON.parse(getfile(argv[0] || "./glyphappend.json")).map(v=>v.gw);
    return getdef(gwnames);

    const REPS = `&CDP-88F0;:&CDP-8B5E;/&CDP-8971;:⺀/&CDP-8BDE;:𫩏/&CDP-8CA6;:⺻/&CDP-8DCB;:𬎾/&CDP-8DEC;:𫝀/&u2e976;:𮥶/`
          .split("/").map(v=>v.split(":").shift().slice(1,-1).toLowerCase()).filter(v=>v);
    console.log(REPS);
    getdef(GWNAME.filter(v=>REPS.indexOf(v)==-1));

    return;
    // recursively check
    let dump2 = execSync(`grep ` + gwname2.map(v=>`-e "^ ${v} "`).join(" ") +` dump_newest_only.txt`).toString();
    let gwname3 = dump2.split("\n").map(v=>v.split("|").pop().trim().split("$").filter(r=>r.indexOf("99:")==0).map(r=>r.split(":")[7])).filter((v,i,s)=>s.indexOf(v)==i);
    let dump3 = execSync(`grep ` + gwname3.map(v=>`-e "^ ${v} "`).join(" ") +` dump_newest_only.txt`).toString();
    console.log(dump);
    console.log(dump2);
    console.log(dump3);
};

nodeapp.generatesvg = (argv) => {

    if (argv.length == 0) return console.log("specify glyphwiki definition file");

    const context = {};
    require('vm').runInNewContext(getfile('./kage.js'), context);
    const Kage = context.Kage;
    let kage = new Kage();
    kage.kShotai = 1;
    
    Object.entries({
        "shotai":1,"kRate":100,"kMinWidthY":2,"kMinWidthU":2,"kMinWidthT":6,"kWidth":5,"kKakato":1.5,
        "kL2RDfatten":1.3,"kMage":10,"kUseCurve":false,"kAdjustKakatoL":[14,9,5,2,0],"kAdjustKakatoR":[8,6,4,2],
        "kAdjustKakatoRangeX":20,"kAdjustKakatoRangeY":[1,19,24,30],"kAdjustKakatoStep":3,"kAdjustUrokoX":[24,20,16,12],
        "kAdjustUrokoY":[12,11,9,8],"kAdjustUrokoLength":[22,36,50],"kAdjustUrokoLengthStep":3,"kAdjustUrokoLine":[22,26,30],
        "kAdjustUroko2Step":3,"kAdjustUroko2Length":40,"kAdjustTateStep":4,"kAdjustMageStep":5,
    }).map(([key,value])=> { kage.kFont[key] = value; });

    let glyphs = getfile(argv[0]).trim().split("\n").filter(v => {
        if (!v.trim()) return false;
        let key, u, defs;
        if (v.indexOf("=") < 0) v = "=" + v;
        [key, u, defs] = v.trim().split("=");
        if (key[0] == "*") key = key.slice(1);
        //console.log(key.trim());
        kage.kBuhin.push(key.trim(), (defs||"").trim());
        return v[0] != "*";
    });
    glyphs.map(gwdata0 => {
        let gwdata = gwdata0.split("=").pop().trim();
        if (!gwdata.trim() || gwdata == "*") return;
        let polygons = new Kage.Polygons();
        kage.makeGlyph2(polygons, gwdata.trim());
        let svg = polygons.generateSVG(false);
        let ofpath = "./svg/" + gwdata0.split("=")[0].trim() + ".svg"
        console.log("generate... " + ofpath);
        require('fs').writeFileSync(ofpath, svg, "utf-8");
    });
};

nodeapp.cdprequired = () => {
    let ret = execSync(`cat ../fragtable*.txt ../qlist.json ../earlier/qlist.json | grep '&[^;]\\+;' -o|sort|uniq`);
    let glyphs = ret.toString().trim().split("\n").map(v=>v.slice(1,-1)).filter(v=>v.indexOf("#x")!=0&&v.indexOf("CDP-")!=0&&v!="amp");
    console.log(JSON.stringify(glyphs));
};

nodeapp.sort = () => {
    let gwnames = JSON.parse(getfile("./glyphappend.json"));
    gwnames.sort((a,b)=>parseInt(a.u,16)-parseInt(b.u,16)).map(v=>{
        if (!v.memo) v.memo = String.fromCodePoint("0x" + v.u);
    });
    console.log(JSON.stringify(gwnames));
};
nodeapp.glyphrequired = () => {
    // partslist
    let gwnames = JSON.parse(getfile("./glyphappend.json"));
    const [kanjitable, kanjifrag] = require('vm').runInNewContext(getfile('../bushubumaker.js') + "\n[kanjitable, kanjifrag];");
    kanjifrag.define(getfile("../fragtable.txt"));
    kanjifrag.define(getfile("../fragtable.plus.txt"));
    let partlist = Object.keys(kanjitable.partslist());

    // qlist.json statistics
    let qdefs = JSON.parse(getfile("../qlist.json")).concat(JSON.parse(getfile("../earlier/qlist.json"))).map(q => q.def)
        .join("/").split("/").map(v=>v.trim().split(":").pop()).join("").match(/&[^;]+;|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g);

    //
    let redefs = getfile("../earlier/index.html").split("redefinelist").pop().split("/").filter(v=>v.indexOf(":")!=-1)
        .map(d=>d.split("&amp;").join("&").match(/&[^;]+;|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g))
        .reduce((a,v)=>a.concat(v),[]).filter(c=>!c.match(/^[!-~]$/)).map(c=>c.indexOf("&#x")==0 ? String.fromCodePoint("0x"+c.slice(3,-1)):c);
    console.log(redefs);
    // merge
    let required = [...partlist,...qdefs,...redefs].filter((v,i,s)=>s.indexOf(v)==i).map(v=>v.toLowerCase()).filter(c=>
        c.trim() && !c.match(/^[@:a-z＿ぁ-ー一-龠]$/) && !gwnames.find(v => (c == `&${v.gw};`) || parseInt("0x" + v.u) == c.codePointAt(0))
    ).sort();
    required.map(v=> {
        let ret = {gw: v[0]=="&" ? v.slice(1,-1) : "u" + v.codePointAt(0).toString(16), };
        ret.u = ret.gw[0] == "u" ? ret.gw.slice(1) : "";
        ret.memo = v;
        console.log(JSON.stringify(ret));
        return ret;
    });
};


const cdp2ucs = function(cdpref)
{
    let m = cdpref.match(/&CDP-([^;]+);/);
    if (!m) return cdpref;
    let cdp = parseInt(m[1], 16);
    let upper = (cdp >> 8) & 0x7f;
    let lower = (cdp & 0xff);
    lower -= (lower <= 62 + 64) ? 64 : 98;
    return String.fromCharCode(upper * 157 + lower + 0xee1b);
};

nodeapp.c2f = (argv) => {
    let dd = argv.map(v => {
        let gw = v.split(".svg").shift();
        let u = cdp2ucs("&" + gw.toUpperCase() + ";").codePointAt(0);
        return {gw:gw, u:u == 0x26 ? gw : u.toString(16), }
    })
    console.log(JSON.stringify(dd));
}

nodeapp.f2c = (argv) => {
    const cdplist = [...Array(0xa00)].map((_,i) => {
        let gw = "&CDP-" + (i + 0x8500).toString(16) + ";";
        return {gw, u:cdp2ucs(gw)};
    });
    let n = Array.from(argv.join("")).filter(v=>v.trim()).map(c => cdplist.find(v => v.u == c) || {u:c}).map(v=>{
        return {gw:v.gw, u:v.u.codePointAt(0).toString(16)};
    });
    console.log(JSON.stringify(n));
};

if (typeof window == "undefined") {
    let argv = process.argv.slice(2);
    let key = argv.shift();
    (nodeapp[key] || nodeapp.help)(argv);
}
