#!/bin/sh -l

server=$1
filename=$2


echo "server = $server filename=$filename"

dotnet webvalidate.dll --host $server --files $filename