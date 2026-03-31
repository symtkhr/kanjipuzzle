
const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');

const dumpsvg = function(argv) {
    const context = {};
    require('vm').runInNewContext(getfile('./kage.js'), context);
    const Kage = context.Kage;
    let kage = new Kage();
    kage.kShotai = 1;
    
    Object.entries({
        "shotai":1,"kRate":100,"kMinWidthY":2,"kMinWidthU":2,"kMinWidthT":6,"kWidth":3,"kKakato":3,
        "kL2RDfatten":1.1,"kMage":10,"kUseCurve":false,"kAdjustKakatoL":[14,9,5,2,0],"kAdjustKakatoR":[8,6,4,2],
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

//console.log(process.argv);
updateGlyph();
