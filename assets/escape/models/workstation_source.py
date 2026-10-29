"""Create one detailed office workstation and export it to glTF.

Run inside Blender. The new collection is isolated from the existing scene, and
the original selection and active object are restored after export.
"""
from pathlib import Path
import math
import bpy
import bmesh

NAME = 'AirportOpsEscape_Workstation_v2'
if bpy.data.collections.get(NAME):
    raise RuntimeError('Collection already exists; choose a new name before running again')

collection = bpy.data.collections.new(NAME)
bpy.context.scene.collection.children.link(collection)
root = bpy.data.objects.new(NAME, None)
collection.objects.link(root)
root.location = (7, 0, 0)  # Keep the preview clear of the user's existing scene.
objects = [root]
previous_selected = list(bpy.context.selected_objects)
previous_active = bpy.context.view_layer.objects.active

def material(name, color, roughness=.55, metallic=0):
    mat = bpy.data.materials.new(NAME + '_' + name)
    mat.use_nodes = True
    shader = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    return mat

wood = material('wood', (.56, .32, .14), .46)
cream = material('cream', (.84, .76, .60), .58)
fabric = material('divider', (.55, .52, .44), .9)
dark = material('chair', (.035, .047, .043), .64)
black = material('monitor', (.018, .028, .026), .4)
screen = material('screen', (.26, .46, .52), .3)
white = material('paper', (.9, .88, .80), .75)
gold = material('cup', (.74, .46, .19), .52)
green = material('plant', (.12, .37, .13), .72)
green2 = material('plant_light', (.27, .48, .14), .68)
metal = material('metal', (.22, .25, .23), .32, .65)
book_colors = [material('book_'+str(i), c, .75) for i,c in enumerate([(.48,.18,.11),(.32,.42,.31),(.74,.55,.28),(.21,.34,.40)])]

def add_mesh(name, bm, location, mat, bevel=0):
    mesh = bpy.data.meshes.new(NAME + '_' + name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(NAME + '_' + name, mesh)
    collection.objects.link(obj)
    obj.parent = root
    obj.location = location
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Soft edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
    objects.append(obj)
    return obj

def cuboid(name, location, size, mat, bevel=.008):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    return add_mesh(name, bm, location, mat, bevel)

def cylinder(name, location, radius, depth, mat, radius_top=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=radius,
                         radius2=radius if radius_top is None else radius_top, depth=depth)
    obj = add_mesh(name, bm, location, mat, .003)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj

def sphere(name, location, size, mat):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=1)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    obj = add_mesh(name, bm, location, mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj

def chair(x):
    cuboid('seat', (x,.39,.23), (.22,.23,.065), dark, .022)
    cuboid('chair_back', (x,.49,.38), (.22,.05,.30), dark, .024)
    cuboid('chair_back_inset', (x,.457,.39), (.16,.012,.22), fabric, .012)
    cylinder('chair_post', (x,.39,.12), .018, .20, metal)
    cylinder('chair_base', (x,.39,.045), .055, .025, metal)
    for angle in range(0,360,72):
        a=math.radians(angle)
        spoke=cuboid('chair_spoke', (x+math.cos(a)*.055,.39+math.sin(a)*.055,.035), (.12,.018,.018), metal, .003)
        spoke.rotation_euler.z=a
        sphere('wheel', (x+math.cos(a)*.105,.39+math.sin(a)*.105,.03), (.022,.022,.018), black)

def pot(x,y,z):
    cylinder('pot', (x,y,z+.055), .055, .11, cream, .07)
    cylinder('soil', (x,y,z+.113), .058, .008, dark)
    for i in range(7):
        a=2*math.pi*i/7
        leaf=sphere('leaf', (x+math.cos(a)*.045,y+math.sin(a)*.045,z+.17+(i%2)*.02), (.035,.023,.078), green if i%2 else green2)
        leaf.rotation_euler=(math.sin(a)*.45,-math.cos(a)*.45,a)

for index,x in enumerate((-.28,.28)):
    cuboid('desktop', (x,0,.36), (.50,.47,.055), wood, .013)
    cuboid('pedestal', (x+(-.18 if index==0 else .18),-.04,.17), (.11,.38,.34), cream, .01)
    for height in (.10,.20,.29):
        cuboid('drawer_front', (x+(-.18 if index==0 else .18),.158,height), (.095,.012,.075), cream, .004)
        cuboid('drawer_handle', (x+(-.18 if index==0 else .18),.166,height), (.04,.008,.008), metal, .003)
    cuboid('desk_leg', (x+(.19 if index==0 else -.19),-.17,.18), (.025,.025,.34), metal, .005)
    cuboid('monitor_base', (x,-.105,.40), (.15,.11,.012), metal, .004)
    cuboid('monitor_stand', (x,-.14,.49), (.025,.025,.18), metal, .004)
    cuboid('monitor_frame', (x,-.145,.61), (.31,.035,.22), black, .012)
    cuboid('monitor_screen', (x,-.122,.61), (.275,.008,.182), screen, .004)
    cuboid('screen_header', (x,-.115,.675), (.25,.005,.025), white, .002)
    for j in range(3):
        cuboid('screen_line', (x-.015,-.114,.645-j*.035), (.16,.005,.012), cream, .002)
    cuboid('keyboard', (x,.09,.396), (.27,.095,.014), black, .004)
    for row in range(3):
        for col in range(9):
            cuboid('key', (x-.11+col*.027,.062+row*.027,.405), (.018,.018,.004), cream, .001)
    sphere('mouse', (x+.18,.09,.407), (.022,.033,.012), dark)
    cuboid('papers', (x-.18,.14,.402), (.075,.10,.012), white, .002)
    cylinder('cup', (x+.18,-.02,.425), .025, .06, gold, .029)
    chair(x)
    for j in range(3):
        cuboid('binder', (x-.18+j*.025,-.19,.47), (.02,.08,.15), book_colors[(index+j)%len(book_colors)], .003)
pot(.48,-.16,.39)
cuboid('divider', (0,-.02,.52), (.035,.51,.36), fabric, .008)
cuboid('divider_cap', (0,-.02,.705), (.045,.52,.015), metal, .004)

target = Path(__file__).resolve().parent / 'workstation-v2.glb'
try:
    # Apply bevels and merge objects by material to keep game draw calls bounded.
    for mat in [wood, cream, fabric, dark, black, screen, white, gold, green, green2, metal, *book_colors]:
        members = [obj for obj in collection.objects if obj.type == 'MESH' and mat in obj.data.materials[:]]
        if not members:
            continue
        for obj in bpy.context.selected_objects:
            obj.select_set(False)
        for obj in members:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = members[0]
        bpy.ops.object.convert(target='MESH')
        if len(members) > 1:
            bpy.ops.object.join()
    objects = list(collection.objects)
    for obj in bpy.context.selected_objects:
        obj.select_set(False)
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(filepath=str(target), export_format='GLB', use_selection=True,
                              export_yup=True, export_apply=True)
finally:
    for obj in bpy.context.selected_objects:
        obj.select_set(False)
    for obj in previous_selected:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = previous_active
print('Exported', target, 'with', len(objects), 'objects')
