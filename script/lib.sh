#!/bin/bash

function getFullDir() {
	local value=$1
	if [ ${value:0:1} != '/' ] ; then
		local value=$PWD/$value
		local value=`echo $value | sed 's/\/\.//'`
	fi
	echo $value
}