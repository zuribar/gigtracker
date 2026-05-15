# פרומפטים לבנייה אוטומטית עם TWOZERO MCP

> השתמש בפרומפטים האלה **לפי הסדר**, אחד אחרי השני. בין כל פרומפט תן לקלוד לסיים, בדוק ב-TouchDesigner שהדבר נוצר, ורק אז עבור הלאה.
>
> **דרישות קדם:**
> - TouchDesigner פתוח עם `twozero.tox` ב-network ו-MCP מופעל
> - קלוד מחובר ל-`twozero_td` MCP (ראה [`twozero-setup.md`](./twozero-setup.md))
> - אתה ב-network ריק או בקונטיינר ריק שיועד לפרויקט

---

## 🎬 פרומפט 0 — אימות חיבור והקשר

```
You're connected to twozero_td MCP. Confirm by listing the tools you have
from it. Then read my current TouchDesigner network and tell me what's
already there. Don't create anything yet.
```

**ציפייה:** קלוד עונה עם רשימת כלים, ומה רואה ב-network.

---

## 🏗️ פרומפט 1 — שלד הסצנה

```
I want to build a QuadReprojection / anamorphosis setup. Start by creating
the scene to be rendered:

1. Create a Geo COMP named `scene` at position (0, 0) in /project1.
2. Inside `scene`, add a Torus SOP named `torus1` with default parameters
   so I have something to look at.
3. Add a Light COMP named `light1` inside `scene`, positioned at (3, 3, 3).

After creating, show me the path tree of /project1 so I can verify.
```

**בדוק ב-TD:** `/project1/scene` קיים, בפנים יש torus1 ו-light1.

---

## 📐 פרומפט 2 — הפנל הפיזי כ-SOP

```
Now create the geometry that represents the physical LED panel.

1. At /project1 create a Rectangle SOP named `panel_sop`.
2. Set its Size X = 1.6 and Size Y = 0.9 (a 16:9 panel, in meters).
3. Set the Orientation to ZX plane (so it stands vertically).
4. Add a Transform SOP `panel_xform` connected to its output. Translate Y by
   0.9 (so the bottom of the panel sits at the floor).

After creating, read the points of `panel_xform` and confirm there are 4
points (indices 0, 1, 2, 3) in the order: top-left, bottom-left,
bottom-right, top-right.
```

**בדוק ב-TD:** panel_sop קיים, panel_xform מחובר אליו, 4 קודקודים בסדר הנכון.

---

## 📷 פרומפט 3 — שתי הקאמרות

```
Now create the two cameras:

1. Create Camera COMP `cam_sweetspot` at /project1.
   - Translate to (0, 1.7, 3).  This is the viewer's eye position.
   - Look-At: point it at panel_xform.

2. Create a second Camera COMP `cam_reproject` at /project1.
   - On the View page, find the Quad Reproject parameters.
   - Set "Quad Reproject SOP" parameter to `/project1/panel_xform`.
   - Set "Quad Reproject Points" to "0 1 2 3".
   - Set "Quad Reproject Camera" to `/project1/cam_sweetspot`.

Read back the parameters of cam_reproject to confirm.
```

**בדוק ב-TD:** קאמרה אחת רגילה, השנייה עם Quad Reproject מוגדר.

---

## 🎨 פרומפט 4 — רינדור

```
Set up the render pipeline:

1. Create a Render TOP `render1` at /project1.
   - Camera = /project1/cam_reproject
   - Geometry = /project1/scene
   - Lights = /project1/scene/light1
   - Resolution = 1920 x 1080

2. Create an Out TOP `out1` connected to render1.

3. View the render1 in viewer mode and tell me what you see.
```

**בדוק ב-TD:** render1 מציג את הטורוס, אבל מעוות לפי הפרספקטיבה של ה-sweet spot.

---

## 🪟 פרומפט 5 — חלון פלט

```
Create a Window COMP `window1` at /project1 to send the output to a physical
monitor or projector.

- Operator = /project1/out1
- Resolution = 1920 x 1080
- Borders = Off
- Monitor = Primary  (we'll change this when we have the projector)

Don't open it yet — just configure.
```

---

## ✅ פרומפט 6 — בדיקה ויזואלית

```
To validate the setup before connecting to a physical panel:

1. Create a Constant TOP `test_pattern` with red color.
2. Create a Composite TOP with `test_pattern` and a Text TOP that displays
   the numbers 0, 1, 2, 3 in the four corners of the image.
3. Connect this as the texture of the torus inside /project1/scene.

Then move cam_sweetspot left and right by 0.5 in X — does the torus warp
in a way that suggests anamorphic perspective? Confirm what you observe.
```

**בדוק ב-TD:** המספרים בפינות צריכים להיות בסדר 0=TL, 1=BL, 2=BR, 3=TR. אם הם הפוכים — תן לקלוד את פרומפט 7.

---

## 🔧 פרומפט 7 — תיקון סדר נקודות (רק אם צריך)

```
The corners of the projected image are not in the right order. The expected
mapping is: point 0 → top-left, 1 → bottom-left, 2 → bottom-right,
3 → top-right.

Try the following permutation of cam_reproject's "Quad Reproject Points":
"3 2 1 0" — and tell me if the image flips correctly.
If still wrong, try "1 0 3 2", then "2 3 0 1".
```

---

## 🚀 פרומפט 8 — הוספת מסכים נוספים (אופציונלי)

אם יש לך כמה פנלים (קוביית LED 3 פנים, וכו'):

```
I need to add a second LED panel. Duplicate the setup:

1. Clone panel_sop → panel_sop2, panel_xform → panel_xform2.
   Position panel_xform2 90 degrees rotated around Y, touching the right
   edge of the first panel (forming a corner).

2. Clone cam_reproject → cam_reproject2. Point its Quad Reproject SOP to
   panel_xform2, same camera, same points order.

3. Clone render1 → render2 using cam_reproject2. Same resolution.

4. Add window2 for the second monitor.

Both renders should be rendering FROM the same sweet spot, but each to its
own panel. Confirm by showing me the network structure.
```

---

## 💡 טיפים לעבודה עם TWOZERO

- **אם קלוד טועה ב-path:** הגד `Use absolute paths from /` ותסגור את הבעיה.
- **אם הוא יוצר את ה-OP במקום הלא נכון:** הזכר לו `current network is /project1` בתחילת השיחה.
- **לקריאת מצב נוכחי:** `What's in /project1 right now? Show parents and children.`
- **לאיפוס:** `Delete everything inside /project1.` (זהירות!)
- **לשמירה:** TWOZERO לא שומר אוטומטית את ה-.toe — תזכור `File → Save` ידני בסיום.

---

## 🎓 מה ללמוד הלאה

אחרי שהבסיס עובד:
1. **שילוב Kinect/MediaPipe לעיניים אמיתיות** — Sweet Spot שזז עם הצופה
2. **תוכן GLSL/Notch-style** במקום Torus
3. **Multi-projector blending** עם quadReproject palette COMP
4. **Calibration אוטומטית** עם ChArUco patterns ו-OpenCV
