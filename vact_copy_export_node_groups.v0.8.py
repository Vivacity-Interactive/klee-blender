import bpy, json, mathutils, pickle

#node_socket_subclasses = [
#    cls for cls in dir(bpy.types) 
#    if isinstance(getattr(bpy.types, cls), type) 
#    and issubclass(getattr(bpy.types, cls), bpy.types.NodeInternal)
#]

#print("========")
#[print(x) for x in node_socket_subclasses]

def _to_uid(i):
    return f'{i:x}'.upper()

def _to_vec3x(c):
    return "#{:02x}{:02x}{:02x}".format(*(int(x * 255) for x in c))

def _to_vec4x(v):
    return "#{:02x}{:02x}{:02x}{:02x}".format(*(int(x * 255) for x in v))

def _to_vec3f(c):
    return "{:f}, {:f}, {:f}".format(*c)

def _to_vec4f(v):
    return "{:f}, {:f}, {:f}, {:f}".format(*v)

def _to_vec3i(c):
    return "{:d}, {:d}, {:d}".format(*(int(x * 255.0) for x in c))

def _to_vec4i(v):
    return "{:d}, {:d}, {:d}, {:d}".format(*(int(x * 255.0) for x in v))

def _to_str(val):
    _val = None
    _tag = int(not isinstance(val, bool))
    if isinstance(val, mathutils.Vector): _val = ', '.join([str(x) for x in val])
    elif isinstance(val, mathutils.Quaternion): _val = ', '.join([str(x) for x in val])
    elif isinstance(val, mathutils.Euler): _val = ', '.join([str(x) for x in val]+[val.order])
    elif isinstance(val, mathutils.Color): _val = ', '.join([str(x) for x in val])
    elif isinstance(val, str): _val = val
    #elif isinstance(val, bool): _val = val
    elif hasattr(val, '__iter__'): _val = ', '.join([str(x) for x in val])
    elif val is None: _tag = 0
    else: _val = str(val)
    return _val, _tag
        
class _Settings:
    def __init__(self):
        self.name = "GN_Wireframe"
        
class UEOEF:
    DEFAULT_NO_ID = "00000000000"
    
    class Property:
        fm_set = "="
        
        def __init__(self, name="", value="", flag = 0):
            self.flag = flag
            self.name = name
            self.value = value
            
        def serialize(self):
            self._default()
            text = self.name + UEOEF.Property.fm_set
            text += str(self.value if self.flag == 0 else json.dumps(self.value))
            return text
        
        def _default(self):
            pass
            
    class Link:
        fm_pipe = " "
        
        def __init__(self, node="", pin=""):
            self.node = node
            self.pin = pin
        
        def serialize(self):
            self._default()
            text = json.dumps(self.node) + UEOEF.Link.fm_pipe + _to_uid(self.pin)
            return text
            
        def _default(self):
            pass
    
    class Tuple:
        fm_begin = "("
        fm_end = ")"
        fm_property = ","
        
        def __init__(self, node="", pin=""):
            self.properties = []
            
        def serialize(self):
            self._default()
            text = UEOEF.Tuple.fm_begin
            for property in self.properties:
                text += property.serialize() + UEOEF.Tuple.fm_property
            text += UEOEF.Tuple.fm_end
            return text
            
        def _default(self):
            pass
       
    class Pin:
        fm_begin = "CustomProperties Pin ("
        fm_end = ")"
        fm_property = ","
        
        def __init__(self, type="", subtype="", name="", enum="", data_type=""):
            self.id = UEOEF.DEFAULT_NO_ID
            self.data_type = data_type
            self.type = type
            self.subtype = subtype
            self.name = name
            self.enum = enum
            self.direction = 0
            self.description = ""
            self.icon = ""
            self.color = mathutils.Vector((0.0, 0.0, 0.0))
            self.value = None
            self.hidden = False
            self.hide_value = False
            self.enabled = True
            self.linked = False
            self.multi = False
            self.expanded = False
            self.unavailable = False
            
            self.links = UEOEF.Tuple()
            self.properties = []
            
        def serialize(self):
            self._default()
            text = UEOEF.Pin.fm_begin
            for property in self.properties:
                text += property.serialize() + UEOEF.Pin.fm_property
            text += UEOEF.Pin.fm_end
            return text
            
        def _default(self):
            self.properties.append(UEOEF.Property("PinId", _to_uid(self.id)))
            self.properties.append(UEOEF.Property("PinName", self.name, 1))
            
            self.properties.append(UEOEF.Property("PinIcon", self.icon, 1))
            self.properties.append(UEOEF.Property("PinColor", _to_vec3i(self.color), 1))
            
            self.properties.append(UEOEF.Property("PinToolTip", self.description, 1))
            self.properties.append(UEOEF.Property("DefaultValue", *_to_str(self.value)))
            
            self.properties.append(UEOEF.Property("PinType", self.data_type, 1))
            self.properties.append(UEOEF.Property("PinCategory", self.enum, 1))
            self.properties.append(UEOEF.Property("PinSubCategory", self.subtype, 1))
            self.properties.append(UEOEF.Property("PinSubCategoryObject", self.type))
 
            self.properties.append(UEOEF.Property("bHidden", self.hidden))
            self.properties.append(UEOEF.Property("bHideValue", self.hide_value))
            self.properties.append(UEOEF.Property("bEnabled", self.enabled))
            self.properties.append(UEOEF.Property("bLinked", self.linked))
            self.properties.append(UEOEF.Property("bMultiInput", self.multi))
            self.properties.append(UEOEF.Property("bUnavailable", self.unavailable))
            self.properties.append(UEOEF.Property("bExpanded", self.expanded))
            
            self.properties.append(UEOEF.Property("Direction", "EGPD_Input" if self.direction == 0 else "EGPD_Output", 1))
            self.properties.append(UEOEF.Property("LinkedTo", self.links.serialize()))
    
    class Object:
        fm_begin = "\nBegin Object"
        fm_end = "\nEnd Object"
        fm_property = "\n\t"
        fm_attribute = " "
        
        def __init__(self, type="", name="", title=""):
            self.id = UEOEF.DEFAULT_NO_ID
            self.type = type
            self.title = title
            self.name = name
            self.description = ""
            self.icon = ""
            self.position = mathutils.Vector((0.0, 0.0, 0.0))
            self.color = mathutils.Vector((0.0, 0.0, 0.0))
            self.width = 0
            self.height = 0
            self.hide = False
            self.mute = False
            self.show_options = False
            self.internals = UEOEF.Tuple()
            self.options = []
            self.attributes = []
            self.properties = []
            self.pins = []
            
        def serialize(self):
            self._default()
            text = UEOEF.Object.fm_begin
            for attribute in self.attributes:
                text += UEOEF.Object.fm_attribute + attribute.serialize()
            for property in self.properties:
                text += UEOEF.Object.fm_property + property.serialize()
            for pin in self.pins:
                text += UEOEF.Object.fm_property + pin.serialize()
            text += UEOEF.Object.fm_end
            return text
        
        def _default(self):
            self.attributes.append(UEOEF.Property("Class", self.type))
            self.attributes.append(UEOEF.Property("Name", self.name, 1))
            
            self.properties.append(UEOEF.Property("Description", self.description, 1))
            self.properties.append(UEOEF.Property("NodeIcon", self.icon, 1))
            self.properties.append(UEOEF.Property("NodeTitle", self.title, 1))
            #self.properties.append(UEOEF.Property("NodeColor", _to_vec3i(self.color), 1))
            self.properties.append(UEOEF.Property("NodeGuid", _to_uid(self.id)))
            self.properties.append(UEOEF.Property("NodePosX", int(self.position.x)))
            self.properties.append(UEOEF.Property("NodePosY", -int(self.position.y)))
            self.properties.append(UEOEF.Property("NodeWidth", int(self.width)))
            self.properties.append(UEOEF.Property("NodeHeight", int(self.height)))
            self.properties.append(UEOEF.Property("bOptions", self.show_options))
            self.properties.append(UEOEF.Property("bHidden", self.hide))
            self.properties.append(UEOEF.Property("bMuted", self.mute))
            self.properties.append(UEOEF.Property("InternalLinks", self.internals.serialize()))
            
    def __init__(self):
        self.objects = []
    
    def _default(self):
        pass
    
    def serialize(self):
        self._default()
        text = ""
        for object in self.objects:
            text += object.serialize()
        return text
    
        
class VActCopyExportNodeGroups:
    def do_execute(self, context, settings):
        group = bpy.data.node_groups[settings.name]
        lot = {}
        scope = UEOEF()
        self.from_node_group(group, scope, lot, settings);
        text = scope.serialize()
        bpy.context.window_manager.clipboard = text;
        print(text)
        
    def _to_uid(self, object):
        return f'{self.id:x}'.upper()
        
    def from_node_group(self, context, scope, lot, settings):
        #self.from_node_group_interface(context.interface, scope, lot, settings)
        self.from_node_group_nodes(context.nodes, scope, lot, settings)
        self.from_node_group_links(context.links, scope, lot, settings)
    
    def from_node_group_interface(self, context, scope, lot, settings):
        tree = context.items_tree
        print("----Interface----")
        for socket in tree:
            print(socket)
        print("")
    
    def from_node_group_nodes(self, context, scope, lot, settings):
        for node in context:
            _node = UEOEF.Object(
                node.bl_idname, #type(node).__name__, 
                node.name,
                node.bl_label)
            _node.position = node.location
            _node.id = node.as_pointer()
            _dim = node.dimensions;
            _node.height = node.dimensions.y
            _node.width = node.dimensions.x
            _node.description = node.bl_description
            #_node.color = node.color
            _node.icon = node.bl_icon
            _node.hide = node.hide
            _node.mute = node.mute
            _node.show_options = node.show_options
            #lot[_node.id] = _node;
            self.from_node_group_ios(node.inputs, _node, 0, lot, settings)
            self.from_node_group_ios(node.outputs, _node, 1, lot, settings)
            scope.objects.append(_node)
            #print(_node.serialize())
    
    def from_node_group_links(self, context, scope, lot, settings):
        for link in context:
            #from_node_id = _to_uid(link.input.as_pointer())
            _pin = lot[link.from_socket.as_pointer()]
            _link = UEOEF.Link(link.to_node.name, link.to_socket.as_pointer());
            _pin.links.properties.append(_link)
    
    def from_node_group_ios(self, context, scope, dir, lot, settings):
        for socket in context:
            _pin = UEOEF.Pin(
                socket.bl_idname,#type(socket).__name__, 
                socket.bl_subtype_label, 
                socket.name,
                socket.bl_label,
                socket.type)
            _pin.direction = dir
            _pin.id = socket.as_pointer()
            _pin.description = socket.description
            _pin.icon = socket.display_shape
            _pin.color = socket.draw_color_simple()
            _pin.hidden = socket.hide
            _pin.hide_value = socket.hide_value
            _pin.enabled = socket.enabled
            _pin.linked = socket.is_linked
            _pin.multi = socket.is_multi_input
            _pin.unavailable = socket.is_unavailable
            _pin.expanded = socket.show_expanded
            _pin.value = getattr(socket, 'default_value', None)
            lot[_pin.id] = _pin
            scope.pins.append(_pin)
            #print(_pin.serialize())


settings = _Settings()

layer = bpy.context.view_layer
active = layer.objects.active
selection = bpy.context.selected_objects

operator = VActCopyExportNodeGroups()
operator.do_execute(selection, settings)