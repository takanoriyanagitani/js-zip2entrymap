#!/bin/sh

port=52080
pubd=./public.d
addr=127.0.0.1

miniserve \
	--port ${port} \
	--interfaces "${addr}" \
	"${pubd}"
