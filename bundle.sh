#!/bin/bash

version="$(jq -r <ccmod.json .version)";
[ -n "$1" ] && version="$version-$1";

filename="CC-Open-World-v$version.ccmod";
[ -f "$filename" ] && rm "$filename"
zip -r "$filename" assets ccmod.json extra-patches patches plugin.js src
