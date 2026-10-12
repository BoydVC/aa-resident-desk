#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${AA_RESIDENT_DESK_PORT:-4322}"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p screenshots dist
if [[ ! -f dist/aa-resident-desk.html ]]; then python3 build.py; fi
if ! ss -ltn | grep -q "127.0.0.1:$PORT "; then
  nohup python3 server.py > /tmp/aa-resident-desk-$PORT.log 2>&1 &
  sleep 1
fi
shot() {
  local url="$1" out="$2" size="$3"; shift 3 || true
  local prof; prof="$(mktemp -d /tmp/aardshot.XXXX)"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --run-all-compositor-stages-before-draw --virtual-time-budget=28000 \
    --window-size="$size" --user-data-dir="$prof" --screenshot="$out" "$@" "$url" >/dev/null 2>&1
  rm -rf "$prof"; echo "  $out ($(wc -c < "$out") bytes)"
}
U="http://127.0.0.1:$PORT"
shot "file://$PWD/dist/aa-resident-desk.html#home" screenshots/00-best-home.png 1440,1100
shot "$U/#home" screenshots/00-desktop-home.png 1440,1000
shot "$U/#trash" screenshots/01-trash.png 1440,1000
shot "$U/#library" screenshots/02-library.png 1440,1000
shot "$U/#parks" screenshots/03-parks.png 1440,1000
shot "$U/#links" screenshots/04-links.png 1440,1000
shot "$U/#about" screenshots/05-about.png 1440,1000
shot "$U/#home" screenshots/06-phone.png 390,844 --user-agent="Mozilla/5.0 (iPhone)"
echo "screenshots done"
