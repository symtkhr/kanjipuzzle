#!/bin/node

const { WebSocketServer } = require('ws');
const { execSync } = require('child_process');
const getfile = (fname) => require('fs').readFileSync(fname, 'utf8');

const wss = new WebSocketServer({ port: 0xc3b4, host:"0.0.0.0", });

let users = [];
let room = {state:"lobby", qclear:""};
const qtable = getfile("srvqlist.txt").split("--").map(b => ({q:b.trim(), def:"円:H冂丄",}));

const broadaction = (d) => {
    let ret = d;
    ret.reply = d.action;
    ret.multicast = true;
    d.action = null;
    return ret;
};

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
