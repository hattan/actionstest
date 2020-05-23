#!/bin/sh -l

server=$1
filename=$2


dotnet webvalidate.dll --server $1 -- files $2