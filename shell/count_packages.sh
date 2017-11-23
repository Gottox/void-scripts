#! /bin/sh
#
# cound_packages.sh
# Copyright © 2017 tox <tox@rootkit>
#
# Distributed under terms of the MIT license.
#

for arch in x86_64 x86_64-musl i686 armv7l armv7l-musl aarch64 aarch64-musl; do
	sub=
	case $arch in *-musl) sub=/musl ;; esac
	case $arch in aarch64*) sub=/aarch64 ;; esac
	printf "$arch: "
	XBPS_ARCH=$arch xbps-query -i -M --repository=https://repo.voidlinux.eu/current$sub -s '' | wc -l
done
