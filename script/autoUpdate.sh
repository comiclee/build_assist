#!/bin/bash

scriptDir=$(dirname $0)

source $scriptDir/lib.sh

function processUpdate() {
	local moduleDir=$1
	local branch=$2
	cd $moduleDir
	git fetch
	git checkout $branch
	git pull
	mvn clean install
}

scriptDir=$(getFullDir $scriptDir)
inputFile=$scriptDir/../tmp/compile_info
resultFile=$scriptDir/../tmp/op_result

echo working > $resultFile

while read line || [[ -n ${line} ]]; do
	processUpdate $line
done < $inputFile

echo success > $resultFile