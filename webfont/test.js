#!/bin/node

const { execSync } = require('child_process');

let ret = execSync(`cat ../fragtable*.txt ../qlist.json ../earlier/qlist.json | grep '&[^;]\\+;' -o|sort|uniq`);
let glyphs = ret.toString().trim().split("\n").map(v=>v.slice(1,-1)).filter(v=>v.indexOf("#x")!=0&&v.indexOf("CDP-")!=0&&v!="amp")
    .map(v=>console.log('https://glyphwiki.org/glyph/'+v+'.ttf'));
