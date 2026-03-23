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

const qtable = [{
    q: "猛禽類/等閑視/総統府/蛍光灯/騒音計/八重桜/募金箱/更待月/浮世絵/標準時/立方根/経済学/青梗菜/針葉樹/耳掃除/分相応/消防庁/愛息子/木綿糸/浄玻璃/衝撃波/急接近/往復便/大前提/文章題/進駐軍/紋白蝶/注意力/対抗馬/腹膜炎/温泉街/護送車/虫眼鏡/導火線/新聞社/闘争心/坊主頭/取締役/関連付/摩天楼/好投手/軽労働/自叙伝/独禁法/焼林檎/運動会/煙草盆/全粒粉/首脳陣/鎮静剤",
    def :"凶:/光:Z⺌兀/反:F厂又/尓:Z𠂉小/争:Zク/斉:Z文/:Z亠丷",
},{
    "q": "保護者/雑木林/消去法/明後日/花言葉/化粧台/胡麻油/銀行員/老眼鏡/幼馴染/新境地/借金取/赤信号/著作権/椎間板/温度計/経験則",def:"",
},{
    "q": "徒競走/超音波/洗浄器",def:"争:",
}].slice(2);
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
            users.push({uid:d.uid,name:d.name,state:"lobby"});
        }
        ret.user = users.filter(v=>v.state!="offline");
        if (room.state != "lobby") return [ret, actions.qstart(d,ws,true)]; // todo:q.stateも投げたい
        return ret;
    },
    qstart: (d,ws,single) => {
        let ret = {reply:"qstart"};
        ret.q = qtable[0].q;
        ret.def = qtable[0].def;
        if (!single) ret.multicast = true;
        room.qclear = ret.q;
        room.state = "start";
        return ret;
    },
    answer: (d) => {
        d.a = Array.from(d.a).filter(c => room.qclear.indexOf(c) != -1).join("");
        room.qclear = Array.from(room.qclear).filter(c => (c != '/') && (d.a.indexOf(c) < 0)).join("");
        console.log(room.qclear);
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

        (Array.isArray(ret) ? ret : [ret]).map(mes => {
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
