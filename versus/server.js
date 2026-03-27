const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 0xc3b4, host:"0.0.0.0", });

let users = [];
let room = {state:"lobby", qclear:""};
const broadaction = (d) => {
    let ret = d;
    ret.reply = d.action;
    ret.multicast = true;
    d.action = null;
    return ret;
};

const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');

const qtable = getfile("srvqlist.txt").split("--").map(b => {
    return {q:b.trim(), def:"円:H冂丄",};
});
const qtablesample =
[{
    q: "猛禽類/等閑視/総統府/蛍光灯/騒音計/八重桜/募金箱/更待月/浮世絵/標準時/立方根/経済学/青梗菜/針葉樹/耳掃除/分相応/消防庁/愛息子/木綿糸/浄玻璃/衝撃波/急接近/往復便/大前提/文章題/進駐軍/紋白蝶/注意力/対抗馬/腹膜炎/温泉街/護送車/虫眼鏡/導火線/新聞社/闘争心/坊主頭/取締役/関連付/摩天楼/好投手/軽労働/自叙伝/独禁法/焼林檎/運動会/煙草盆/全粒粉/首脳陣/鎮静剤",
    def :"凶:/光:Z⺌兀/反:F厂又/尓:Z𠂉小/争:Zク/斉:Z文/:Z亠丷",
},{
    "q": "保護者/雑木林/消去法/明後日/花言葉/化粧台/胡麻油/銀行員/老眼鏡/幼馴染/新境地/借金取/赤信号/著作権/椎間板/温度計/経験則",def:"",
},{
    "q": "徒競走/超音波/洗浄器",def:"争:",
},{q:"準結晶/易損品/委員会/大過去/固溶体/兌換券/湯湯婆/咽頭炎/贔屓目/十日町/明治村/迦楼羅/奥女中/潤滑油/抱茗荷/月桂樹/連絡先/潜伏期/新嘉坡/時代物/朝比奈/仏舎利/花散里/規格判/賃貸借/王昭君/胆汁質/四重唱/仲間割/法螺貝/七変化/芋羊羹/熱量計/精進揚/菠薐草/条件付/丸暗記/保育園/如何程/半濁音/加速器/河口湖/闘牛士/麦藁帽/分数式/未定稿/昆布巻/犬吠埼/森林浴/青表紙/婚姻届/基本給/扶持米/高松市/秋吉台/転向力/瑜伽宗/赤提灯/公社債/真骨頂/清見潟/有袋類/浄土寺/古今集/勅任官/能狂言/納豆菌/黒色腫/木太刀/伊勢湾/味噌漬/蠟細工/相姦者/谷地田/安全弁/寄合書/名前負/信号場/賛美歌/責問権/宇宙船/素封家/切絵図/尾瀬沼/洪積層/和漢洋/特別区/空約束/勘解由/料理番/蜂須賀/直江津/無造作/流星群/専門語/居酒屋/胃潰瘍/留守宅/八路軍/頸動脈",def:"",
}].slice(-1);

const actions = {
    participate: (d,ws) => {
        ws.uid = d.uid;

        let user = users.find(u => d.uid == u.uid);
        let ret = {reply:"wait", multicast:true};

        if (user) {
            user.name = d.name;
            user.state = "lobby"; // これは微妙?
            ret.state = "alreadyset";
        } else {
            users.push({uid:d.uid,name:d.name,state:"lobby",qclear:""});
        }
        ret.user = users.filter(v=>v.state!="offline");
        if (room.state != "lobby") return [ret, actions.qstart(d,ws,true)]; // todo:q.stateも投げたい
        return ret;
    },
    qstart: (d,ws,midwayjoin) => {
        let ret = {reply:"qstart"};

        if (!midwayjoin) {
            room.qid = d.qid ? (d.qid % qtable.length) : parseInt(Math.random() * qtable.length);
            ret.multicast = true;
            users.map(u=>u.qclear="");
        }
        let qtable0 = qtable[room.qid];
        ret.q = qtable0.q;
        ret.def = qtable0.def;
        room.state = "inplay";
        if (!midwayjoin) room.qclear = ret.q;

        return ret;
    },
    answer: (d) => {
        d.a = Array.from(d.a).filter(c => room.qclear.indexOf(c) != -1).join("");
        room.qclear = Array.from(room.qclear).filter(c => (c != '/') && (d.a.indexOf(c) < 0)).join("");
        let user = users.find(u => u.uid == d.uid);
        if (!user) return;
        user.qclear += d.a;
        d.qclear = users.map(v=>({uid:v.uid,c:v.qclear}));
        console.log(users);
        if (room.qclear.length == 0) room.state = "lobby";
        return broadaction(d);
    },
    select: (d) => broadaction(d),

};

wss.on('connection', ws => {
    ws.on('error', console.error);
    ws.on('message', (data) => {
        let actionundefined = () => ({reply:"undefined"});
        let d = {};
        try {
            d = JSON.parse(data);
        } catch {
            d.action = "none";
        }
        console.log(d);
        let ret = (actions[d.action] || actionundefined)(d,ws);

        (Array.isArray(ret) ? ret : [ret]).filter(v=>v).map(mes => {
            if (mes.multicast) {
                wss.clients.forEach(ws0 => ws0.send(JSON.stringify(mes)));
                return;
            }
            mes.uid = d.uid;
            return ws.send(JSON.stringify(mes));
        });
    });
    ws.on("close", () => {
        let uid = ws.uid;
        if (!uid) return;
        let user = users.find(u => uid == u.uid);
        if (!user) return;
        user.state = "offline";
        //todo:時刻とか
        let ret = {reply:"wait"};
        ret.user = users.filter(v=>v.state!="offline");//.map(v=>v.name);
        wss.clients.forEach(ws0 => ws0.send(JSON.stringify(ret)));
    });
});
