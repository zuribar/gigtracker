# איך מריצים את QuadReprojection ב-TouchDesigner שלך

## דרך 1 — הדבק לטקסטפורט (5 דקות, הכי פשוט)

1. פתח TouchDesigner.
2. ודא שיש לך `/project1` (יש כברירת מחדל).
3. לחץ **Alt+T** (Windows) או **Option+T** (Mac) — נפתח Textport.
4. פתח את הקובץ [`build_quad_reproject.py`](./build_quad_reproject.py)
   בעורך טקסט, העתק **הכול** עם Ctrl+A, Ctrl+C.
5. הדבק ב-Textport ולחץ Enter.

הסקריפט ידפיס:
```
▶ בונה QuadReprojection בתוך /project1...
  ✓ scene + torus + light
  ✓ panel_sop + panel_xform
  ✓ cam_sweetspot + cam_reproject
  ✓ render1 + out1
  ✓ window1
✅ הכול מוכן.
```

עכשיו לך ל-`/project1`, פתח את **render1** ב-viewer, ותראה את הטורוס מעוות (פרספקטיבה אנמורפית מנקודת ה-Sweet Spot).

---

## דרך 2 — Text DAT (לפיתוח חוזר)

אם אתה רוצה לערוך פרמטרים ולהריץ שוב ושוב:

1. ב-`/project1`, צור **Text DAT** בשם `builder`.
2. פתח אותו (double-click).
3. הדבק את כל התוכן של `build_quad_reproject.py`.
4. סגור את הדיאלוג.
5. לחץ ימני על `builder` → **Run Script**.

לכל פעם שתרצה לבנות מחדש — פשוט Run Script.

---

## אם הסקריפט מתלונן

| הודעה | מה לעשות |
|---|---|
| `אין /project1` | צור Container COMP בשם `project1` ברמה העליונה, או שנה את `PARENT_PATH` בראש הסקריפט |
| `AttributeError: 'Par' object has no attribute 'quadreproject...'` | יש לך גרסת TD ישנה. עדכן ל-TD 2023.11290 ומעלה |
| כל OP מודפס "כבר קיים, מדלג" | רוצה ניקיון? מחק את ה-OPs ידנית ב-`/project1` והרץ שוב |

---

## אחרי שזה עובד

עכשיו אתה יכול:

1. **לשנות את התוכן**: החלף `torus1` ב-Sphere SOP / Text SOP / Geometry import של מודל
2. **לשנות פנל פיזי**: ערוך `PANEL_W`, `PANEL_H`, `PANEL_TY` בראש הסקריפט והרץ שוב
3. **לשנות מיקום צופה**: ערוך `SWEET_X/Y/Z`
4. **להוסיף פנל שני**: שכפל את `panel_sop` / `panel_xform` / `cam_reproject` / `render1` (או השתמש ב-`quadReproject` COMP מה-Palette שעושה את זה אוטומטית)
