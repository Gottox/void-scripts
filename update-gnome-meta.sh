#! /bin/bash
#
# build-all.sh
# Copyright © 2016 tox <tox@rootkit>
#
# Distributed under terms of the MIT license.
#

cd "$(xdistdir)" || exit 1

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RESET=$(tput sgr0)

type jq > /dev/null || {
	echo "Need jq"; exit 0;
}

msg() {
	printf "%s$RESET" "$@" >&2
	echo >&2
}

update_depends() {
	local dfield="$1" deps="$2"
	deps=$(echo "$deps" | tr "\n" "~" | sed 's/~\+$//; s/~\+/\\n/g; s/^ //')
	sed -i -e "/^$dfield=/,/^[^ \t]/{
			/^[ \t]/d
			s/^$dfield=.*/$dfield=\"${deps}\"/
			/^$dfield=\"[^ ]*\"/s/\"//g
		}" "./srcpkgs/gnome/template"
}

filter_names() {
	while read -r n v; do
		(
			for i in ${n}08 ${n}3 $n lib$n python-${n#py}; do
				[ -e "./srcpkgs/$i/template" ] || continue;

				# [ "$i" != "$n" ] && msg "${BLUE}rename: $GREEN$n" " to $GREEN$i" >&2
				echo "$i $v"
				return 0
			done
			msg "${RED}missing: ${GREEN}${n}-${v}" >&2
		)
	done
}

mindep() {
	deps=$(cat)
	for i in $(xmindep $(echo "$deps" | cut -d' ' -f 1)); do
		echo "$deps" | grep "^$i "
	done
}

check_versions() {
	while read -r n v; do
		(
			. "./srcpkgs/${n}/template" 2>/dev/null
			if ! xbps-uhelper pkgmatch "${pkgname}-${version}_${revision}" "$n>=$v"; then
        msg "${GREEN}pkgmatch: $n-$version" >&2
				echo "$n $v"
			else
				msg "${YELLOW}pkgmatch: " \
					"failed ${GREEN}${n}>=${v} " \
					"using repo version $GREEN${version}" >&2
				echo "$pkgname ${version}_$revision"
			fi
		)
	done
	echo
}

get_deps() {
	local modul="$1" version="$2"
	curl -s "http://ftp.gnome.org/pub/GNOME/$modul/${version%.*}/$version/cache.json" | \
		jq -r '.[2] | to_entries | map_values((.key | tostring) + " " +(.value[0] | tostring)) | join("\n")' | \
		sort | filter_names | check_versions | sed 's/ />=/; s/^/ /; s/ \+$//'
}

update_template=
update_version=
if [ "$1" == "-u" ]; then
	update_template=1
	shift
fi
if [ "$1" == "-U" ]; then
	update_template=1
	update_version=1
	shift
fi
gnome_version=$1

core_deps=$(get_deps core "$gnome_version")
apps_deps=$(get_deps apps "$gnome_version")

if [ "$update_template" ]; then
	echo "${GREEN}scanning gnome...${RESET}"
	update_depends depends "$core_deps"
	echo "${GREEN}scanning gnome-apps...${RESET}"
	update_depends _apps_depends "$apps_deps"
else
	:
	#echo "${GREEN}gnome${RESET}"
	#printf "  %s\n" $core_deps
	#
	#echo "${GREEN}gnome-apps${RESET}"
	#printf "  %s\n" $apps_deps
fi

if [ "$update_version" ]; then
	(
		. "./srcpkgs/gnome/template"
		if [ "$version" = "$gnome_version" ]; then
			let revision=$revision+1
			sed -i "s/^revision=.*/revision=$revision/" "./srcpkgs/gnome/template"
		else
			sed -i "s/^version=.*/version=$gnome_version/" "./srcpkgs/gnome/template"
			sed -i "s/^revision=.*/revision=1/" "./srcpkgs/gnome/template"
		fi
	)
fi
