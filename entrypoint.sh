#!/bin/sh -l

server=$1
filename=$2


echo "server = $server filename=$filename"

dotnet /app/webvalidate --host https://www.microsoft.com --files msft.json

##dotnet --list-runtimes

#dotnet webvalidate.dll --host https://www.microsoft.com --files msft.json
#dotnet webvalidate.dll --host $server --files $filename