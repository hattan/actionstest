#!/bin/sh -l

server=$1
filename=$2


echo "server = $server filename=$filename"

#sleep 300
cd /app
dotnet /app/webvalidate.dll --host https://www.microsoft.com --files msft.json

#ls

##dotnet --list-runtimes

#dotnet webvalidate.dll --host https://www.microsoft.com --files msft.json
#dotnet webvalidate.dll --host $server --files $filename