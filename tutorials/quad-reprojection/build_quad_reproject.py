# ─────────────────────────────────────────────────────────────
#  QuadReprojection / Anamorphosis — Auto-builder for TouchDesigner
# ─────────────────────────────────────────────────────────────
#  איך להריץ:
#    1. פתח TouchDesigner. תוודא שיש לך קונטיינר בשם project1
#       (בדרך כלל יש כברירת מחדל - /project1)
#    2. פתח את ה-Textport:  Alt+T
#    3. הדבק את כל הקובץ הזה ל-Textport ולחץ Enter
#    4. הסקריפט יבנה את כל הרשת בתוך /project1
#
#  אם אתה רוצה לבנות במיקום אחר — שנה את PARENT_PATH למטה.
# ─────────────────────────────────────────────────────────────

PARENT_PATH = '/project1'   # איפה לבנות. שנה אם רוצה
PANEL_W     = 1.6           # רוחב הפנל הפיזי במטרים (1.6 = 16:9 ב-90cm גובה)
PANEL_H     = 0.9           # גובה הפנל הפיזי במטרים
PANEL_TY    = 0.9           # גובה תחתית הפנל מהרצפה
SWEET_X     = 0.0           # מיקום הצופה (X)
SWEET_Y     = 1.7           # גובה עיניים של הצופה
SWEET_Z     = 3.0           # מרחק הצופה מהפנל
RES_W       = 1920
RES_H       = 1080


def _safe_create(parent, op_type, name):
    """יוצר OP, או מחזיר את הקיים אם כבר יש כזה בשם הזה"""
    existing = parent.op(name)
    if existing is not None:
        print(f'  → {name} כבר קיים, מדלג על יצירה')
        return existing
    return parent.create(op_type, name)


def build():
    parent = op(PARENT_PATH)
    if parent is None:
        print(f'✗ אין {PARENT_PATH}. צור אותו או שנה את PARENT_PATH למעלה.')
        return

    print(f'▶ בונה QuadReprojection בתוך {PARENT_PATH}...')

    # ───── שכבה 1: סצנה ─────
    scene = _safe_create(parent, geometryCOMP, 'scene')
    torus = _safe_create(scene, torusSOP, 'torus1')
    torus.render = True
    light = _safe_create(scene, lightCOMP, 'light1')
    light.par.tx, light.par.ty, light.par.tz = 3, 3, 3
    print('  ✓ scene + torus + light')

    # ───── שכבה 2: הפנל כ-SOP ─────
    panel_sop = _safe_create(parent, rectangleSOP, 'panel_sop')
    panel_sop.par.sizex = PANEL_W
    panel_sop.par.sizey = PANEL_H
    try:
        panel_sop.par.orient = 'zx'
    except Exception:
        pass

    panel_xform = _safe_create(parent, transformSOP, 'panel_xform')
    panel_xform.inputConnectors[0].connect(panel_sop)
    panel_xform.par.ty = PANEL_TY
    print('  ✓ panel_sop + panel_xform')

    # ───── שכבה 3: קאמרות ─────
    cam_ss = _safe_create(parent, cameraCOMP, 'cam_sweetspot')
    cam_ss.par.tx, cam_ss.par.ty, cam_ss.par.tz = SWEET_X, SWEET_Y, SWEET_Z
    try:
        cam_ss.par.lookat = panel_xform.path
    except Exception:
        pass

    cam_rp = _safe_create(parent, cameraCOMP, 'cam_reproject')
    # שמות הפרמטרים של Quad Reproject משתנים בין גרסאות TD —
    # ננסה את שניהם
    for sop_param in ('quadreprojectsop', 'quadreprojectsoppath'):
        if hasattr(cam_rp.par, sop_param):
            setattr(cam_rp.par, sop_param, panel_xform.path)
            break
    for pts_param in ('quadreprojectpoints', 'quadreprojectindices'):
        if hasattr(cam_rp.par, pts_param):
            setattr(cam_rp.par, pts_param, '0 1 2 3')
            break
    for cam_param in ('quadreprojectcamera', 'quadreprojectcamerapath'):
        if hasattr(cam_rp.par, cam_param):
            setattr(cam_rp.par, cam_param, cam_ss.path)
            break
    print('  ✓ cam_sweetspot + cam_reproject')

    # ───── שכבה 4: רינדור ─────
    render = _safe_create(parent, renderTOP, 'render1')
    render.par.camera = cam_rp.path
    render.par.geometry = scene.path
    render.par.lights = light.path
    render.par.resolutionw = RES_W
    render.par.resolutionh = RES_H

    out = _safe_create(parent, outTOP, 'out1')
    out.inputConnectors[0].connect(render)
    print('  ✓ render1 + out1')

    # ───── שכבה 5: חלון ─────
    window = _safe_create(parent, windowCOMP, 'window1')
    window.par.operator = out.path
    try:
        window.par.winw = RES_W
        window.par.winh = RES_H
        window.par.borders = False
    except Exception:
        pass
    print('  ✓ window1')

    # ───── סידור ב-network ─────
    layout = [
        (scene,       0,    0),
        (panel_sop,   2,    0),
        (panel_xform, 2,   -1),
        (cam_ss,      4,    0),
        (cam_rp,      4,   -1),
        (render,      6,    0),
        (out,         8,    0),
        (window,      10,   0),
    ]
    for op_obj, nx, ny in layout:
        try:
            op_obj.nodeX = nx * 150
            op_obj.nodeY = ny * 150
        except Exception:
            pass

    print('')
    print('✅ הכול מוכן. דברים שכדאי לבדוק:')
    print('   1. פתח את render1 ב-viewer — אתה אמור לראות את הטורוס מעוות')
    print('   2. הזז את cam_sweetspot ב-X — הטורוס יזוז בהתאם (אנמורפי)')
    print('   3. window1 לא פתוח עדיין — לחץ Open Window כשתחבר פרויקטור')
    print('')
    print('אם 4 הנקודות בסדר הלא נכון (התמונה הפוכה) —')
    print('שנה את cam_reproject.par.quadreprojectpoints ל:')
    print('   "3 2 1 0"   או  "1 0 3 2"   או  "2 3 0 1"')


build()
