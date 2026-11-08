"""Original parametric sculptures: gallery lighting and material studies, not sale products."""
import bpy, math, os
from mathutils import Vector
from math import sin,cos,pi
out='/workspace/sites/artist-studio/dist/assets'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def material(name,color,rough=.32,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=(*color,1);n.inputs['Roughness'].default_value=rough;n.inputs['Metallic'].default_value=metal;return m
ivory=material('Warm porcelain',(0.79,.75,.65),.29,.08)
clay=material('Soft terracotta',(.55,.21,.095),.33,.12)
chalk=material('Paper white',(.87,.855,.80),.4)
edge=material('Champagne edge',(.58,.40,.21),.3,.25)
ground=material('Warm gallery white',(.88,.865,.82),.72)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-1.62));floor=bpy.context.object;floor.data.materials.append(ground)
def point(u,v,k):
 twist=u*.5+.28
 if k==1:twist=u*.5+.7
 if k==2:twist=u*1+.45
 r=2.0+.15*sin(3*u)
 width=.63+.16*sin(u+.4)
 x=(r+width*v*cos(twist))*cos(u)
 y=(1.2+width*v*cos(twist))*sin(u)
 z=width*v*sin(twist)+.38*sin(2*u)
 # A standing, asymmetrically tilted surface, in Blender's Z-up space.
 a=.91
 return (x, y*cos(a)-z*sin(a), y*sin(a)+z*cos(a))
def mesh(k):
 U,V=240,24;vs=[];fs=[]
 for i in range(U+1):
  for j in range(V+1):vs.append(point(i/U*2*pi,j/V*2-1,k))
 for i in range(U):
  for j in range(V):a=i*(V+1)+j;fs.append((a,a+1,a+V+2,a+V+1))
 data=bpy.data.meshes.new('Continuous folded surface');data.from_pydata(vs,[],fs);data.update();o=bpy.data.objects.new('Flow study',data);bpy.context.collection.objects.link(o)
 for p in data.polygons:p.use_smooth=True
 o.data.materials.append([ivory,clay,chalk][k]);o.data.materials.append(edge)
 mod=o.modifiers.new('Fine physical edge','SOLIDIFY');mod.thickness=.045;mod.material_offset=1;mod.material_offset_rim=1
 bevel=o.modifiers.new('Softly finished edges','BEVEL');bevel.width=.014;bevel.segments=3
 o.rotation_euler.z=[-.3,.24,.9][k];o.location.z=.0
 return o
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=24;sc.cycles.use_denoising=False;sc.render.threads_mode='FIXED';sc.render.threads=2
sc.world.color=(.7,.7,.7);sc.world.use_nodes=True;sc.world.node_tree.nodes['Background'].inputs[0].default_value=(.88,.86,.80,1);sc.world.node_tree.nodes['Background'].inputs[1].default_value=.45
sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Medium High Contrast';sc.view_settings.exposure=.15
for name,loc,power,size in [('Large window',(-4,-4,7),1100,6),('Soft fill',(5,-1,4),750,5),('Rim',(1,5,6),1300,4)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(5.3,-8.2,3.5));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,-.1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=6.6;sc.camera=camera
sc.render.resolution_x=1100;sc.render.resolution_y=1180;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='JPEG';sc.render.image_settings.quality=91
for k,name in enumerate(['rest','form','light']):
 o=mesh(k);sc.render.filepath=f'{out}/study-{name}.jpg';bpy.ops.render.render(write_still=True);bpy.data.objects.remove(o,do_unlink=True)
print('Rendered three original sculpture studies.')
