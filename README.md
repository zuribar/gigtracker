# Conference Presentation Machine — Mac Setup

ריפו של ה-Mac שמשמש כמחשב המצגות בכנס **2026-05-11**.

ההוראות המלאות לקלוד נמצאות ב-[`CLAUDE.md`](./CLAUDE.md).

## איך להשתמש

1. שכפל את הריפו על ה-Mac:
   ```bash
   git clone -b claude/touchdesigner-ai-analyzer-R7mqg https://github.com/zuribar/gigtracker.git ~/Desktop/Conference_Setup
   cd ~/Desktop/Conference_Setup
   ```
2. **הריצה אוטומטית** (מומלץ):
   ```bash
   bash setup.sh           # הכול בסדר: בדיקה → התקנות → הגדרות → צ'ק-ליסט
   bash setup.sh check     # רק בדיקת תקינות
   bash setup.sh install   # רק התקנות
   bash setup.sh settings  # רק הגדרות מערכת (sleep, hot corners, dock)
   bash setup.sh caffeine  # להפעיל Caffeinate ברקע ביום הכנס
   ```
3. **או** הפעל את Claude Code בתיקייה הזו — הוא יקרא אוטומטית את `CLAUDE.md` ויעבור איתך שלב-שלב.

## אירוע

- **תאריך:** 2026-05-11
- **תפקיד המחשב:** מריץ 12 מצגות (Keynote / PowerPoint / Canva / PDF)
- **התחברות:** HDMI + NDI ל-Resolume של ה-VJ
