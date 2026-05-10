#!/usr/bin/env bash
# Conference Mac Setup — 2026-05-11
# Run on the Mac:  bash setup.sh
# Or step-by-step:  bash setup.sh check | install | settings | ndi

set -u

RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; BLUE=$'\033[0;34m'; NC=$'\033[0m'
section() { printf "\n${BLUE}━━━ %s ━━━${NC}\n" "$1"; }
ok()      { printf "${GREEN}✓${NC} %s\n" "$1"; }
warn()    { printf "${YELLOW}⚠${NC}  %s\n" "$1"; }
err()     { printf "${RED}✗${NC} %s\n" "$1"; }
ask()     { read -rp "$(printf "${YELLOW}?${NC} %s [y/N] " "$1")" a; [[ "${a:-}" =~ ^[yY]$ ]]; }

require_mac() {
  if [[ "$(uname)" != "Darwin" ]]; then
    err "הסקריפט הזה הוא ל-macOS בלבד. אתה רץ על $(uname)."
    exit 1
  fi
}

# ─────────────────────────────────────────────────────────────
# שלב 1 — בדיקת תקינות
# ─────────────────────────────────────────────────────────────
sanity_check() {
  section "שלב 1 — בדיקת תקינות"

  echo "macOS:"
  sw_vers | sed 's/^/  /'

  echo ""
  echo "שטח דיסק:"
  df -h / | sed 's/^/  /'
  local free_gb
  free_gb=$(df -g / | awk 'NR==2 {print $4}')
  if (( free_gb < 20 )); then
    warn "פחות מ-20GB פנויים ($free_gb GB). תפנה מקום לפני המשך."
  else
    ok "${free_gb}GB פנויים"
  fi

  echo ""
  echo "סוללה:"
  if system_profiler SPPowerDataType 2>/dev/null | grep -qE "Battery Information"; then
    system_profiler SPPowerDataType | grep -E "Cycle Count|Condition|Maximum Capacity" | sed 's/^/  /'
    if system_profiler SPPowerDataType | grep -q "Service Recommended"; then
      err "הסוללה במצב Service Recommended — קח מתאם לכנס!"
    else
      ok "סוללה תקינה"
    fi
  else
    ok "מחשב שולחני — אין סוללה"
  fi

  echo ""
  echo "RAM:"
  top -l 1 -s 0 | grep -E "PhysMem|CPU usage" | sed 's/^/  /'

  echo ""
  echo "Wi-Fi:"
  networksetup -getairportnetwork en0 2>/dev/null | sed 's/^/  /' || warn "אין en0"

  echo ""
  echo "מסכים מחוברים:"
  system_profiler SPDisplaysDataType | grep -E "Resolution|Display Type" | sed 's/^/  /'

  echo ""
  echo "Bluetooth:"
  system_profiler SPBluetoothDataType 2>/dev/null | grep -A1 "Connected:" | head -20 | sed 's/^/  /' \
    || warn "אין מידע Bluetooth"

  echo ""
  echo "עדכוני macOS זמינים:"
  softwareupdate -l 2>&1 | tail -20 | sed 's/^/  /'
}

# ─────────────────────────────────────────────────────────────
# שלב 2 — התקנות
# ─────────────────────────────────────────────────────────────
install_homebrew() {
  if command -v brew >/dev/null 2>&1; then
    ok "Homebrew כבר מותקן ($(brew --version | head -1))"
  else
    warn "מתקין Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # הוסף ל-PATH (Apple Silicon ו-Intel)
    if [[ -f /opt/homebrew/bin/brew ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f /usr/local/bin/brew ]]; then
      eval "$(/usr/local/bin/brew shellenv)"
    fi
  fi
  brew update
}

install_apps() {
  section "שלב 2 — התקנת תוכנות"
  install_homebrew

  local casks=(
    google-chrome
    adobe-acrobat-reader
    vlc
    rectangle
  )
  for cask in "${casks[@]}"; do
    if brew list --cask "$cask" >/dev/null 2>&1; then
      ok "$cask כבר מותקן"
    else
      echo "מתקין $cask..."
      brew install --cask "$cask" || err "כשל בהתקנת $cask"
    fi
  done

  # PowerPoint — שואל
  if ! brew list --cask microsoft-office >/dev/null 2>&1 \
     && ! [[ -d "/Applications/Microsoft PowerPoint.app" ]]; then
    if ask "להתקין Microsoft Office? (דורש מנוי 365)"; then
      brew install --cask microsoft-office
    else
      warn "מדלג על Office. אם תצטרך — תפתח PowerPoint ב-web דרך Chrome."
    fi
  else
    ok "PowerPoint/Office כבר מותקן"
  fi

  # Keynote
  if [[ -d "/Applications/Keynote.app" ]]; then
    ok "Keynote מותקן"
  else
    warn "Keynote לא מותקן! התקן מ-App Store: open 'macappstore://apps.apple.com/app/keynote/id409183694'"
  fi
}

install_ndi() {
  section "שלב 2.5 — NDI Tools"
  if [[ -d "/Applications/NDI Tools" ]] || [[ -d "/Applications/NDI" ]]; then
    ok "NDI Tools כבר מותקן"
    return
  fi

  warn "מוריד NDI Tools..."
  local pkg=/tmp/ndi-tools.pkg
  if curl -fL "https://downloads.ndi.tv/Tools/NDI%206%20Tools.pkg" -o "$pkg"; then
    echo "מתקין (יבקש סיסמת sudo)..."
    sudo installer -pkg "$pkg" -target / && ok "NDI מותקן"
    rm -f "$pkg"
  else
    err "הורדה נכשלה. הורד ידנית מ: https://ndi.video/tools/mac/"
  fi

  warn "חובה ידנית: System Settings → Privacy & Security → Screen Recording → אפשר ל-NDI Scan Converter"
  if ask "לפתוח את הגדרות Screen Recording עכשיו?"; then
    open "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"
  fi
}

# ─────────────────────────────────────────────────────────────
# שלב 3 — הגדרות מערכת
# ─────────────────────────────────────────────────────────────
apply_settings() {
  section "שלב 3 — הגדרות מערכת"

  echo "מבטל שינה (sleep, displaysleep, disksleep)..."
  sudo pmset -a displaysleep 0 sleep 0 disksleep 0 && ok "Sleep מבוטל"

  echo "מבטל Hot Corners..."
  defaults write com.apple.dock wvous-tl-corner -int 0
  defaults write com.apple.dock wvous-tr-corner -int 0
  defaults write com.apple.dock wvous-bl-corner -int 0
  defaults write com.apple.dock wvous-br-corner -int 0
  killall Dock 2>/dev/null
  ok "Hot Corners מבוטלים"

  echo "מסתיר Dock אוטומטית..."
  defaults write com.apple.dock autohide -bool true
  killall Dock 2>/dev/null
  ok "Dock auto-hide פעיל"

  warn "ידני (לא קיים CLI אמין):"
  echo "  • System Settings → Displays → True Tone = OFF"
  echo "  • System Settings → Displays → Night Shift = OFF"
  echo "  • System Settings → Displays → Use as: Extended Display (לא Mirror)"
  echo "  • Control Center → Focus → Do Not Disturb (הפעל לפני הכנס)"

  if ask "לפתוח את System Settings → Displays?"; then
    open "x-apple.systempreferences:com.apple.preference.displays"
  fi
}

# ─────────────────────────────────────────────────────────────
# Caffeinate — להריץ ביום הכנס
# ─────────────────────────────────────────────────────────────
start_caffeinate() {
  section "מפעיל Caffeinate ברקע"
  if pgrep -x caffeinate >/dev/null; then
    ok "כבר רץ"
  else
    nohup caffeinate -d -i -m -s >/dev/null 2>&1 &
    disown
    ok "Caffeinate הופעל (PID $!). לעצור: pkill caffeinate"
  fi
}

# ─────────────────────────────────────────────────────────────
# צ'ק-ליסט סופי
# ─────────────────────────────────────────────────────────────
checklist() {
  section "✅ צ'ק-ליסט סופי לפני הכנס"
  cat <<'EOF'

  [ ] מסך חיצוני מחובר ב-HDMI (Extended, לא Mirror)
  [ ] True Tone + Night Shift = OFF
  [ ] NDI Scan Converter עם הרשאת Screen Recording
  [ ] NDI source נראה ב-Studio Monitor / Resolume
  [ ] Caffeinate רץ (pgrep caffeinate)
  [ ] Do Not Disturb פעיל
  [ ] Hot Corners מבוטלים ✓ (הסקריפט עשה)
  [ ] קליקר Bluetooth מחובר
  [ ] גיבוי מצגות:  cp -R ~/Documents/Presentations ~/Documents/BACKUP_$(date +%Y%m%d)
  [ ] Wi-Fi של האולם מחובר (לקבצי Canva)
  [ ] חשבונות Canva של המרצים מוכנים
  [ ] מתאם USB-C → HDMI איתך פיזית
  [ ] מטען של המק איתך פיזית

EOF
}

# ─────────────────────────────────────────────────────────────
# main
# ─────────────────────────────────────────────────────────────
main() {
  require_mac
  case "${1:-all}" in
    check)     sanity_check ;;
    install)   install_apps; install_ndi ;;
    settings)  apply_settings ;;
    ndi)       install_ndi ;;
    caffeine)  start_caffeinate ;;
    checklist) checklist ;;
    all)
      sanity_check
      echo ""
      ask "להמשיך להתקנות?" || exit 0
      install_apps
      install_ndi
      echo ""
      ask "להחיל הגדרות מערכת?" || exit 0
      apply_settings
      checklist
      ;;
    *)
      echo "Usage: $0 [check|install|settings|ndi|caffeine|checklist|all]"
      exit 1
      ;;
  esac
}

main "$@"
