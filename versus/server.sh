#!/bin/bash

cd "$(dirname "$(readlink -f "$0")")"
for f in $(ls ../frag*.txt ../*.js ../*.css); do ln -s $f; done
ln -s ../webfont

kill $(cat ./run.pid)
python3 -m http.server 8188 &
echo $! > run.pid

touch srvqlist.json
npm install ws
nohup node ./socketserver.js &
echo $! >> run.pid

if [ "$1" != "oncolab" ]; then rm sockurl; exit; fi

which cloudflared

if [ $? -ne 0 ]; then
    wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb > /dev/null
    dpkg -i cloudflared-linux-amd64.deb > /dev/null
fi
nohup cloudflared tunnel --url http://127.0.0.1:8188  > nohup8188.out &
nohup cloudflared tunnel --url http://127.0.0.1:50100 > nohup50100.out &

pgrep cloudflared >> run.pid
while true; do
    sleep 1
    grep http.*trycloudflare.com nohup50100.out -o > sockurl
    if [ $? -ne 0 ]; then continue; fi
    grep http.*trycloudflare.com nohup8188.out -o
    if [ $? -ne 0 ]; then continue; fi
    break
done
