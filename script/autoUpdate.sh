#!/bin/bash

scriptDir=$(dirname $0)

source $scriptDir/lib.sh

function processUpdate() {
	local moduleDir=$1
	local branch=$2
	cd $moduleDir
	git co $branch
	git pull
	mvn clean install
}

scriptDir=$(getFullDir $scriptDir)
inputFile=$scriptDir/compile_info

while read line || [[ -n ${line} ]]; do
	processUpdate $line
done < $inputFile

echo ==========更新完毕==========