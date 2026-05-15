"""
Standalone fallback: build the QuadReprojection / Anamorphosis network
WITHOUT the TWOZERO MCP, by running this script inside TouchDesigner's
Textport (Alt+T) or via a DAT Execute.

Usage in TD:
    1. Open TouchDesigner.
    2. Open the Textport (Alt+T).
    3. exec(open('/path/to/build_quad_reproject.py').read())

Or attach as a Text DAT and run with right-click -> Run Script.
"""

import td  # type: ignore


PARENT_PATH = '/project1'
PANEL_W = 1.6
PANEL_H = 0.9
SWEET_SPOT = (0.0, 1.7, 3.0)
PANEL_TY = 0.9
RENDER_RES = (1920, 1080)


def build():
    parent = op(PARENT_PATH)
    if parent is None:
        raise RuntimeError(f'Parent {PARENT_PATH} not found. Open project1 first.')

    # ── שכבה 1: סצנה ──
    scene = parent.create(geometryCOMP, 'scene')
    scene.par.t = (0, 0, 0)

    torus = scene.create(torusSOP, 'torus1')
    torus.viewer = True

    light = scene.create(lightCOMP, 'light1')
    light.par.tx, light.par.ty, light.par.tz = 3, 3, 3

    # ── שכבה 2: פנל פיזי כ-SOP ──
    panel_sop = parent.create(rectangleSOP, 'panel_sop')
    panel_sop.par.sizex = PANEL_W
    panel_sop.par.sizey = PANEL_H
    panel_sop.par.orient = 'zx'

    panel_xform = parent.create(transformSOP, 'panel_xform')
    panel_xform.inputConnectors[0].connect(panel_sop)
    panel_xform.par.ty = PANEL_TY

    # ── שכבה 3: קאמרות ──
    cam_ss = parent.create(cameraCOMP, 'cam_sweetspot')
    cam_ss.par.tx, cam_ss.par.ty, cam_ss.par.tz = SWEET_SPOT
    cam_ss.par.lookat = panel_xform.path

    cam_rp = parent.create(cameraCOMP, 'cam_reproject')
    # Quad Reproject params live on the "View" page in newer TD builds
    cam_rp.par.quadreprojectsop = panel_xform.path
    cam_rp.par.quadreprojectpoints = '0 1 2 3'
    cam_rp.par.quadreprojectcamera = cam_ss.path

    # ── שכבה 4: רינדור ──
    render = parent.create(renderTOP, 'render1')
    render.par.camera = cam_rp.path
    render.par.geometry = scene.path
    render.par.lights = light.path
    render.par.resolutionw, render.par.resolutionh = RENDER_RES

    out = parent.create(outTOP, 'out1')
    out.inputConnectors[0].connect(render)

    # ── שכבה 5: חלון ──
    window = parent.create(windowCOMP, 'window1')
    window.par.operator = out.path
    window.par.winw, window.par.winh = RENDER_RES
    window.par.borders = False
    window.par.monitor = 0

    print('✓ QuadReprojection network built at', PARENT_PATH)
    print('  Validate: open render1 viewer, move cam_sweetspot — torus should warp.')


if __name__ == '__main__':
    build()
