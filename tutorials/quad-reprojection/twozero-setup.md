# התקנת TWOZERO MCP ב-TouchDesigner

> **TWOZERO** של 404.zero — תוסף ל-TouchDesigner שמפעיל MCP server פנימי, מאפשר לקלוד לקרוא את הפרויקט ולבנות אופרטורים בעצמו דרך שיחה בשפה טבעית.
>
> **בחינם.** דורש: TD 2025.32280 ומעלה.

---

## שלב 1: התקנת התוסף ב-TouchDesigner

1. הורד את **`twozero.tox`**:
   ```
   https://www.404zero.com/pisang/twozero.tox
   ```
2. פתח TouchDesigner (גרסה 2025.32280+).
3. גרור את `twozero.tox` ישירות לתוך ה-network — הוא יופיע כ-component.
4. ב-component הזה יש panel הגדרות — **הפעל את ה-MCP** (כפתור / toggle).
5. ודא שהשרת רץ: הפתחת לדפדפן `http://localhost:40404/mcp` צריכה להחזיר משהו (לא 404).

---

## שלב 2: חיבור Claude Code אל TWOZERO

על המק שלך, פתח Terminal:

```bash
claude mcp add --transport http --scope user twozero_td http://localhost:40404/mcp
```

ואז בדוק:

```bash
claude mcp list
```

צריך לראות `twozero_td  ✓ connected`.

### לחילופין — Cursor

אם אתה משתמש ב-Cursor, ערוך את `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "twozero_td": {
      "url": "http://localhost:40404/mcp"
    }
  }
}
```

ואז הפעל מחדש את Cursor.

---

## שלב 3: בדיקת חיים

פתח קלוד בתיקייה כלשהי, ושאל:

> "Are you connected to twozero_td? What tools do you have available from it?"

קלוד אמור לענות עם רשימה של כלים (יצירת OPs, קריאת רשת, הרצת Python ב-TD, וכו').

אם הוא לא רואה את ה-MCP:
- ודא ש-TouchDesigner פתוח עם `twozero.tox` ב-network
- ודא שה-MCP toggle מופעל
- ודא ש-port 40404 לא חסום (firewall)
- בדוק לוגים של TouchDesigner (Window → Textport)

---

## שלב 4: שימוש בסיסי

כשהחיבור עובד, פתח את הפרויקט שבו תרצה לבנות את ה-QuadReprojection בתוך TouchDesigner, ופנה לקלוד עם הפרומפטים מ-[`twozero-prompts.md`](./twozero-prompts.md).

---

## 🔗 לינקים

- **TWOZERO official:** https://www.404zero.com/twozero
- **GitHub repo:** https://github.com/404dotzero/twozero-td-mcp
- **404.zero homepage:** https://www.404zero.com
