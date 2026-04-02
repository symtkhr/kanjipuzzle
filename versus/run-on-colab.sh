#!/bin/bash

cd "$(dirname "$(readlink -f "$0")")"
ln -s ../fragtable.txt
ln -s ../fragtable.plus.txt
ln -s ../bushubumaker.js
ln -s ../bushubu.css

python3 -m http.server 8188 &
echo $! >> run.pid

touch srvqlist.txt
npm install ws
nohup node ./server.js &
echo $! >> run.pid

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
