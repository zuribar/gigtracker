# QuadReprojection / Anamorphosis — TouchDesigner Tutorial Breakdown

> **מקור:** [TouchDesigner Tutorial - QuadReprojection (Anamorphosis)](https://www.youtube.com/watch?v=UBK9JD3lEM4)
> **טכניקה:** רינדור פרספקטיבי-נכון של תוכן 3D על משטח LED/הקרנה כך שמנקודת צפייה ספציפית ("Sweet Spot") נוצר אפקט אנמורפי (אובייקטים נראים תלת-ממדיים אמיתיים יוצאים מהמסך).
> **שימושים נפוצים:** קוביות LED בכניסות בניינים, "Whale on the screen" של Seoul, פרסומות אנמורפיות, סטייג'ים של הופעות.

---

## 🧠 הרעיון בקצרה

```
       [סצנה 3D — Geo COMP]
              │
              ▼
   ┌──────────────────────┐
   │  Sweet-Spot Camera   │  ← איפה הצופה עומד פיזית
   └──────────────────────┘
              │
   ┌──────────────────────┐
   │  Quad-Reproject Cam  │  ← מקבל את ה-Sweet Spot כקלט
   │  + 4 נקודות הפנל     │
   └──────────────────────┘
              │
              ▼
        [Render TOP]
              │
              ▼
        [פנל LED / מקרן]
```

**המפתח:** הקאמרה ה"אמיתית" שמרנדרת את התמונה לפנל מוגדרת כך שהפרספקטיבה תהיה נכונה **לעיני הצופה ב-Sweet Spot**, לא לעין של עצמה. הפנל הופך ל"חלון" אל הסצנה התלת-ממדית.

---

## 🏗️ מבנה הנטוורק ב-TD (Manual)

### שכבה 1: סצנת התוכן
| OP | Type | Why |
|---|---|---|
| `scene` | Geo COMP | מכיל את האובייקטים שצריך להציג (טקסט, פיגורה תלת-ממדית, סצנה מורכבת) |
| `scene/geo1` | Geometry COMP | הגיאומטריה עצמה (Torus / Sphere / model imported) |
| `scene/light1` | Light COMP | תאורת הסצנה |

### שכבה 2: הפנל הפיזי כ-SOP
| OP | Type | Parameters |
|---|---|---|
| `panel_sop` | Rectangle SOP | Size = יחס הפנל הפיזי (למשל 1.6×0.9 ל-16:9) |
| `panel_xform` | Transform SOP | מיקום הפנל במרחב התלת-ממדי, ביחס למיקום הצופה |

**הערה קריטית:** הקנה מידה והיחסים צריכים להיות **מטרים מציאותיים**. אם הפנל בעולם האמיתי 2m × 1m והצופה במרחק 3m — שים את אותם המספרים פה.

### שכבה 3: שתי הקאמרות
| OP | Type | Key Parameters |
|---|---|---|
| `cam_sweetspot` | Camera COMP | Translate = איפה הצופה (למשל `(0, 1.7, 3)` — גובה אדם 1.7m, 3m מהפנל) |
| `cam_reproject` | Camera COMP | • **Quad Reproject SOP** → `panel_sop`<br>• **Quad Reproject Points** → `0 1 2 3` (אינדקסי 4 פינות הפנל)<br>• **Quad Reproject Camera** → `cam_sweetspot` |

### שכבה 4: רינדור
| OP | Type | Parameters |
|---|---|---|
| `render1` | Render TOP | • Camera = `cam_reproject`<br>• Geometry = `scene`<br>• Lights = `scene/light1`<br>• Resolution = רזולוציית הפנל הפיזי (1920×1080 וכו') |

### שכבה 5: פלט
| OP | Type | Purpose |
|---|---|---|
| `out1` | Out TOP | הפלט שיוצא ל-Window COMP / NDI Out / projector |
| `window1` | Window COMP | חלון מסך מלא לפנל הפיזי |

---

## 🎯 דרך מהירה — `quadReproject` COMP מה-Palette

במקום להגדיר ידנית את כל ה-Camera COMP-ים, יש קומפ מוכן ב-Palette:

1. **Palette → Tools → `quadReproject`** — גרור ל-network
2. **Camera** = `cam_sweetspot`
3. **Geo** = `scene`
4. **Lights** = `scene/light1`
5. **Number of Screens** = 1 (או יותר אם יש כמה פנלים)
6. עבור כל מסך:
   - **Resolution** = רזולוציית הפנל
   - **SOP** = `panel_sop`
   - **Points** = `0 1 2 3`
7. הפלט: `quadReproject1/out1` (וכל "outN" לכל מסך נוסף)

זה למעשה אוטומציה של שכבות 3-4 לעיל.

---

## 📐 הצבת ה-Points נכון (החלק הקריטי!)

**זה איפה רוב אנשים נופלים.** ארבע הנקודות חייבות להיות בסדר הבא:

```
   0 ───── 3
   │       │
   │ פנל   │
   │       │
   1 ───── 2
```

- **0** = שמאל-עליון
- **1** = שמאל-תחתון
- **2** = ימין-תחתון
- **3** = ימין-עליון

אם הסדר הפוך → התמונה תיהפך / תתעוות. בדוק עם **Info SOP** או **Sop Viewer** את אינדקסי הקודקודים.

---

## 🧪 בדיקה ראשונה (Validation)

לפני שמחברים לפרויקטור פיזי:
1. הוסף `constant TOP` עם **רשת checkerboard** או תמונה עם **מספרים בפינות** כתוכן הסצנה.
2. צפה ב-Render TOP — אם הריבוע מעוות בצורה שמתאימה לפרספקטיבה של הצופה — מצוין.
3. הזז את ה-Sweet Spot Camera והסתכל איך הריבוע משתנה.
4. רק אחרי שזה עובד וירטואלית — חבר לפרויקטור.

---

## 🔧 Troubleshooting

| בעיה | סיבה | תיקון |
|---|---|---|
| התמונה הפוכה אנכית | סדר points הפוך (UV flip) | החלף 0↔1, 3↔2 או 0↔3, 1↔2 |
| התמונה לא מגיעה לפינות הפנל | SOP geometry לא במידה הנכונה | מדוד פיזית, עדכן ב-Rectangle SOP |
| התמונה מעוותת חזק גם מה-Sweet Spot | ה-Sweet Spot Camera לא במיקום הנכון | מדוד פיזית את מרחק הצופה והגובה |
| פנל אחד עובד, השני לא | Quad Reproject Camera מצביע על קאמרה שלא קיימת | ודא שכל cam_reproject מצביע על אותו `cam_sweetspot` |
| Frame rate נופל עם כמה מסכים | רינדור כפול של כל הסצנה | השתמש ב-`Render Pick CHOP` או חלק את הסצנה |

---

## 🤖 לבנות את זה עם TWOZERO MCP

ראה [`twozero-prompts.md`](./twozero-prompts.md) — שם יש את הפרומפטים המדויקים שאתה נותן לקלוד אחרי שחיברת את ה-MCP.

ראה [`twozero-setup.md`](./twozero-setup.md) — איך מתקינים את TWOZERO ב-TouchDesigner.
