# Conference Presentation Machine — Mac Setup

> **תפקיד המחשב הזה:** ה-Mac של המשתמש (VJ) שישמש בתור **מחשב המצגות** בכנס. יריץ את כל 12 המצגות של המרצים — Keynote, PowerPoint, Canva, PDF. מתחבר למערך VJ דרך HDMI + NDI.

---

## 📅 הקשר הפרויקט

- **תאריך כנס:** 2026-05-11 (מחר)
- **המשתמש:** VJ מקצועי, דובר עברית
- **המחשב הזה לא נפתח זמן מה** → **תתחיל בבדיקת תקינות מלאה לפני התקנות**
- **תפקידו בכנס:** מחשב המצגות שמריץ 12 מצגות בפורמטים מעורבים
- **למה Mac?** יש מצגות בפורמט **Keynote (.key)** של Apple שלא רצות על Windows

---

## 🚨 כללי זהב — לפני שאתה נוגע במשהו

1. **אל תערוך את 12 המצגות עצמן.** כשהן יגיעו (הלילה) — צור גיבוי לפני כל פעולה: `cp -R ~/Documents/Presentations ~/Documents/BACKUP_מצגות_מקור_DO_NOT_TOUCH_$(date +%Y%m%d)`
2. **אל תפעיל אוטומטית עדכוני macOS גדולים** — אם יש Sequoia → Sequoia.X update קטן, סבבה. אם יש קפיצת מייג'ור (כמו Sonoma → Sequoia) — עצור ושאל את המשתמש קודם.
3. **גבה Time Machine** לפני התקנות גדולות (אם יש דיסק חיצוני).

---

## 🩺 שלב 1: בדיקת תקינות (התחל פה!)

### 1.1 גרסת macOS וזמינות עדכונים
```bash
sw_vers                                    # גרסה נוכחית
softwareupdate -l                          # רשימת עדכונים זמינים
```
- **אם יש עדכון מינור** (XX.X.Y → XX.X.Z) — מומלץ להתקין.
- **אם יש מייג'ור** (כמו Sonoma → Sequoia) — שאל את המשתמש לפני!

### 1.2 שטח דיסק
```bash
df -h /                                    # שטח זמין
du -sh ~/Library/Caches                    # מטמון שאפשר לפנות
du -sh ~/.Trash                            # אשפה
```
- **דרוש לפחות 20GB פנויים** למצגות + תוכנות + מקום לעדכונים.

### 1.3 בריאות סוללה (אם זה MacBook)
```bash
system_profiler SPPowerDataType | grep -E "Cycle Count|Condition|Maximum Capacity"
```
- **Condition: Normal** = בסדר
- **Condition: Service Recommended** = הסוללה גוועת. **שלך הלפטופ למתאם בכנס**, אל תסמוך על סוללה.

### 1.4 RAM וטמפ'
```bash
top -l 1 -s 0 | head -10                   # מה רץ ברקע
```
- סגור אפליקציות מיותרות שמשאירות RAM תפוס.

### 1.5 חיבורים פיזיים
- **HDMI/USB-C output** — חבר את ה-Mac לטלוויזיה/מסך כדי לוודא שהיציאה עובדת
- **רוב ה-MacBook המודרניים צריכים מתאם USB-C → HDMI.** אם אין למשתמש — צריך לקנות (~50-100₪)
- **Wi-Fi:** `networksetup -getairportnetwork en0`
- **Bluetooth (לקליקר):** `system_profiler SPBluetoothDataType | grep -A 2 "Connected:"`

### 1.6 דווח למשתמש
לפני שתעבור לשלב הבא — תן סיכום קצר:
- גרסת macOS
- שטח דיסק זמין
- מצב סוללה
- האם יש מתאם HDMI

---

## 📦 שלב 2: התקנת תוכנות

### 2.1 ודא ש-Homebrew מותקן
```bash
which brew
# אם לא קיים:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew update
```

### 2.2 התקנות חיוניות (Homebrew Cask)
```bash
brew install --cask google-chrome           # Canva web, Google Slides, Prezi web
brew install --cask adobe-acrobat-reader    # PDFs
brew install --cask vlc                     # וידאו
brew install --cask rectangle               # ניהול חלונות (חינם, מצוין למסכים כפולים)
brew install --cask raycast                 # אופציונלי - השקה מהירה של אפליקציות
```

### 2.3 Microsoft PowerPoint (מטלת Office)
**אופציה A — Microsoft 365 (מומלץ אם יש לו מנוי):**
```bash
brew install --cask microsoft-office
# אחרי התקנה: פתח Word/PowerPoint, התחבר עם החשבון של המשתמש
```

**אופציה B — אם אין מנוי:**
- הורד את הגרסה החינמית של PowerPoint Online דרך הדפדפן ([powerpoint.com](http://powerpoint.com))
- או: `brew install --cask libreoffice` (קוד פתוח, פותח PPTX)

### 2.4 Keynote
- **כבר מותקן ב-Mac** (חלק מ-iWork)
- ודא שעדכון אחרון: App Store → Updates
- אם לא מותקן: `mas install 409183694` (דורש `brew install mas` קודם, ולהיות מחובר ל-App Store)

### 2.5 NDI Tools for Mac (חובה — אין דרך winget/brew)
**הורדה ידנית מ-[ndi.video/tools/mac/](https://ndi.video/tools/mac/):**
```bash
# הורד באופן ידני, אבל אפשר גם:
curl -L "https://downloads.ndi.tv/Tools/NDI%206%20Tools.pkg" -o /tmp/ndi-tools.pkg
sudo installer -pkg /tmp/ndi-tools.pkg -target /
```
**אחרי התקנה — חובה:**
- System Settings → Privacy & Security → **Screen Recording** → אפשר ל-**NDI Scan Converter** (שם החלופי של Screen Capture ב-Mac)
- בלי ההרשאה הזו, NDI לא יוכל ללכוד את המסך!

### 2.6 Canva (אופציונלי)
- יש [Canva.app](http://Canva.app) מ-[canva.com/download](https://www.canva.com/download/)
- או פשוט דפדפן — Chrome עובד מצוין

---

## ⚙️ שלב 3: הגדרות קריטיות

### 3.1 Display Settings — Extended (לא Mirror!)
1. **System Settings → Displays**
2. חבר HDMI חיצוני
3. ב-"Use as": בחר **"Extended Display"**
4. סדר את המסכים בחלון ה-Arrangement כך שהפנימי משמאל והחיצוני מימין (או להפך, מה שנוח)
5. **אל תסמן Mirror Displays!**

### 3.2 כיבוי טשטוש צבעים (קריטי לכנס!)
- System Settings → Displays → **כבה True Tone**
- System Settings → Displays → **Night Shift = Off**
- האלה שתי תכונות שמשנות את הצבעים בלי שתשים לב — לא טוב לקהל שרואה את המצגת.

### 3.3 Energy / Sleep — Never!
```bash
# מנע מהמסך לכבות
sudo pmset -a displaysleep 0
sudo pmset -a sleep 0
sudo pmset -a disksleep 0

# או מ-System Settings → Battery → Options → "Prevent automatic sleeping when display is off"
```
**או יותר פשוט — קפא:**
```bash
caffeinate -d &              # מונע שינה כל זמן שהפקודה רצה
# הפעל את זה ברקע לפני הכנס, kill כשגומרים
```

### 3.4 Notifications + Focus Mode
- **Control Center → Focus → Do Not Disturb** — הפעל לפני הכנס
- או: System Settings → Focus → Schedule → צור Focus "Conference" שנדלק אוטומטית

### 3.5 Hot Corners — כבה!
- System Settings → Desktop & Dock → Hot Corners → הסר הכל
- **למה?** סמן עכבר שזז בטעות לפינה יכול להפעיל Mission Control / Screen Saver באמצע הצגה.

### 3.6 הסתר Dock + Menu Bar בהצגה
- System Settings → Desktop & Dock → "Automatically hide and show the Dock" ✓
- בהצגות במסך מלא הם נעלמים ממילא, אבל לא רוצים הפתעות.

### 3.7 הרשאות שיכולות לעצור הכל
- **Screen Recording:** NDI Scan Converter, Screen Sharing
- **Accessibility:** קליקרים, Rectangle window manager
- **Bluetooth:** קליקרים אלחוטיים

---

## 🎬 שלב 4: הגדרות Per-Format

### 4.1 Keynote (Apple)
1. פתח קובץ `.key`
2. **Keynote → Settings → Slideshow → Presenter Display**
3. בחר אילו אלמנטים יוצגו: Current Slide, Next Slide, Notes, Timer
4. **Play → Customize Presenter Display** — סדר את הלייאאוט
5. **Play → Test Slideshow** — Presenter Display חייב להיות על המסך **הפנימי**, Slideshow על החיצוני

### 4.2 PowerPoint for Mac
1. פתח קובץ `.pptx`
2. **Slide Show → Set Up Slide Show**
3. סמן **"Use Presenter View"**
4. **Monitors → Slide Show on:** Display 2 (החיצוני)
5. הפעל F5 / Cmd+Enter

### 4.3 Canva
1. פתח Chrome → [canva.com](http://canva.com)
2. התחבר עם חשבון המרצה (המרצה ייתן לך את הקרדנציאלס)
3. פתח את המצגת → **Present → Presenter View** (כפתור עם ⋮)
4. בחר את המסך החיצוני להצגה

### 4.4 PDF
- פתח עם **Preview** או **Acrobat Reader**
- View → Slideshow (Cmd+Shift+F)
- אין Presenter View אמיתי — **בקש מהמרצה לייצא את הנוטים בנפרד**

---

## 📡 שלב 5: NDI Screen Capture — איך מתחילים

1. הפעל את **NDI Scan Converter** (מותקן עם NDI Tools)
2. בתפריט הסטטוס בצד למעלה (Menu Bar) — לחץ על האייקון של NDI
3. בחר את המסך **הפנימי** (איפה שיהיה Presenter View)
4. ה-NDI source יופיע ברשת בשם `[hostname] (NDI Scan Converter)` או `[hostname] (NDI Screen Capture)`
5. **בדוק עם NDI Studio Monitor** (או Resolume) שהמקור נראה
6. אם לא — בדוק שוב את הרשאות **Screen Recording**

---

## ✅ שלב 6: צ'ק-ליסט סופי לפני הכנס

- [ ] macOS מעודכן (לא חובה לאחרון, אבל בלי באגים ידועים)
- [ ] לפחות 20GB דיסק פנויים
- [ ] סוללה Healthy + מתאם איתך
- [ ] Keynote, PowerPoint, Chrome מותקנים ועובדים
- [ ] NDI Tools מותקן + Screen Recording permission ✓
- [ ] HDMI יוצא תקין (בדוק עם טלוויזיה)
- [ ] Extended Displays ✓ (לא Mirror)
- [ ] True Tone + Night Shift = OFF
- [ ] Sleep = Never (`caffeinate` רץ ברקע)
- [ ] Focus / Do Not Disturb מוכן
- [ ] Hot Corners מבוטלים
- [ ] קליקר התחבר ועובד (Bluetooth)
- [ ] גיבוי של 12 המצגות לתיקיית BACKUP
- [ ] Wi-Fi של האולם זוהה (לקבצי Canva online)
- [ ] חשבון Canva של המרצים מוכן (אם יש מצגות Canva)

---

## 🏗️ ארכיטקטורת הסטאפ הכוללת בכנס

```
═══════════════════ על הבמה ═══════════════════
┌─────────────────────────────┐
│ MAC הזה (מחשב המצגות)       │
│ • מסך פנימי = Presenter View │
│ • HDMI Out (USB-C → HDMI) = │
│   Slideshow                 │
│ • Ethernet → Switch         │
└─────────────────────────────┘
   │ HDMI                  │ NDI (Ethernet קצר)
   ↓                       ↓
┌────────────┐    ┌─────────────────────────┐
│ Splitter   │    │ Resolume #2 (על הבמה)   │
│   1×2      │    │ • לוכד NDI מהמק          │
└────────────┘    │ • Crop לאזור הנוטים      │
   │      │      │ • → פרומפטר #3 (נוטים)  │
   ↓      ↓      │ • → לד מאחורה (slideshow │
פרומפטר Capture │   + visuals)             │
#2 (מצגת)  Card └─────────────────────────┘

═══════════════════ ב-FOH ═══════════════════
Resolume #1 (של המשתמש) — טיימר OnTime → פרומפטר #1
+ TeamViewer לשליטה ברזולום #2
```

**4 מסכים סופיים בכנס:**
1. **לד מאחור** — Slideshow + Visuals (מ-Resolume #2)
2. **פרומפטר #1** — טיימר (מ-Resolume #1, OnTime via NDI)
3. **פרומפטר #2** — Slideshow ישיר (מהספליטר)
4. **פרומפטר #3** — Notes (מ-Resolume #2, NDI cropped)

---

## 🚨 Backup Plan

| תרחיש | פתרון |
|---|---|
| Keynote קורס | פתח שוב, חזור לסליייד הנכון מ-Slide Navigator |
| HDMI מנותק | בדוק מתאם USB-C, החלף יציאה אחרת |
| NDI נופל | פרומפטר #2 (סליידשואו דרך ספליטר) ממשיך לעבוד. הפעל NDI Scan Converter שוב |
| Wi-Fi נופל אבל מצגת ב-Canva | היה צריך להוריד גיבוי PDF מראש (סעיף 4.3) |
| מסך פנימי נדלק/כבה אקראי | בדוק שלא נכבה Caffeinate; או חבר עכבר נוסף ותזיז |
| הסוללה נגמרת | מתאם בידיים תמיד |

---

## 📞 אם משהו נשבר

המשתמש (VJ) יושב ב-FOH עם Resolume #1. הוא דובר עברית, מכיר את הסטאפ, ויכול לאבחן.

הקובץ המקביל ב-Resolume הראשי:
`C:\Users\User\Desktop\Conference_Setup_2026-05-11\[CLAUDE.md](http://CLAUDE.md)`

---

## 🎨 הקשרים על המשתמש

- **דובר עברית** — תקשר בעברית, מונחים טכניים באנגלית בסדר
- **VJ מקצועי** — מכיר את הכלים, לא צריך להסביר את היסודות
- **לחץ זמן** — הכנס מחר. תהיה ממוקד, מהיר, פרקטי.
- **Auto-mode ידידותי** — הוא לא רוצה אישור על כל פסיק. תפעל ותדווח.
- **Mac לא נפתח זמן רב** — אל תופתע אם משהו ישן או לא מעודכן. תתקן, תעדכן, תדווח.

---

**Last updated:** 2026-05-10
**Next event:** 2026-05-11 — Conference, 12 mixed-format presentations (Keynote/PowerPoint/Canva)
