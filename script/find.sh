#!/bin/bash

scriptDir=$(dirname $0)

source $scriptDir/lib.sh

scriptDir=$(getFullDir $scriptDir)
outputFile=$scriptDir/../tmp/branch_info

if [ $# != 0 ] ; then
	rootDir=$(getFullDir $1)
else
	rootDir=$PWD/
fi
#echo "Begin check root directory of $rootDir"

if [ ! -d $rootDir ] ; then
	#echo Please input correct directory
	exit 0
fi

gitProjectDirs=`find $rootDir -name '.git'`

for dir in $gitProjectDirs ; do
	dir=${dir%/.git}
	cd $dir
	branch=`git status -b | awk 'BEGIN { getline; print $3 }'`
	branchInfo=$branchInfo"$dir $branch\n"
done

echo $branchInfo > $outputFile