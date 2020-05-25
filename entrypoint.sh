#!/bin/sh -l

server=$1
filename=$2

echo "*** Web Validate ***"
echo "server = $server filename=$filename"

cd /app

dotnet /app/webvalidate.dll --server $server --files $filename

cd /github/workspace
