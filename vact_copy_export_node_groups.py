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
    return "{:f},{:f},{:f}".format(*c)

def _to_vec4f(v):
    return "{:f},{:f},{:f},{:f}".format(*v)

def _to_vec3i(c):
    return "{:d},{:d},{:d}".format(*(int(x * 255.0) for x in c))

def _to_vec4i(v):
    return "{:d},{:d},{:d},{:d}".format(*(int(x * 255.0) for x in v))

def _to_str(val):
    _val = None
    _tag = int(not isinstance(val, bool))
    if isinstance(val, mathutils.Vector): _val = ','.join([str(x) for x in val])
    elif isinstance(val, mathutils.Quaternion): _val = ','.join([str(x) for x in val])
    elif isinstance(val, mathutils.Euler): _val = ','.join([str(x) for x in val]+[val.order])
    elif isinstance(val, mathutils.Color): _val = ','.join([str(x) for x in val])
    elif isinstance(val, str): _val = val
    #elif isinstance(val, bool): _val = val
    elif hasattr(val, '__iter__'): _val = ','.join([str(x) for x in val])
    elif val is None: _tag = 0
    else: _val = str(val)
    return _val, _tag

def _arr_or_val(val, desc, tag):
    return (','.join([str(x) for x in val]), 1) if desc.is_array else (str(val), tag)

def _enum_to_str(val, desc):
    return val + str(tuple([x.identifier for x in desc.enum_items]))

def _enum_to_str2(val, desc, enums=None):
    if enums: enums.append(tuple([x.identifier for x in desc.enum_items]))
    return val

def _to_str2(val, desc, enums=None):
    _val = None
    _tag = 0
    
    if val == None: pass
    elif desc.type == 'BOOLEAN': _val, _tag = _arr_or_val(val, desc, 0)
    elif desc.type == 'INT':  _val, _tag = _arr_or_val(val, desc, 1)
    elif desc.type == 'FLOAT': _val, _tag = _arr_or_val(val, desc, 1)
    elif desc.type == 'STRING': _val, _tag = val, 1
    elif desc.type == 'ENUM': _val, _tag = str(val), 1 #_enum_to_str(val, desc), 0
    elif desc.type == 'POINTER': _val, _tag = str(val), 1 #needs reference fix
    elif desc.type == 'COLLECTION': _val, _tag = str(val), 1 #needs tuple fix 
    else: _val, _tag = str(val), 1
    
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
        
        def __init__(self, pin, enum_lot=0):
            self._properties = []
            self.links = UEOEF.Tuple()
            self.properties = []
            
            # include data for property where possible
            
            self.id = pin.as_pointer()
            self.color = pin.draw_color_simple()
            self.value = getattr(pin, 'default_value', None)
            for k, t in pin.rna_type.properties.items():
                self._properties.append((k,t,getattr(pin, k, None)))
            
        def serialize(self):
            self._default()
            text = UEOEF.Pin.fm_begin
            for property in self.properties:
                text += property.serialize() + UEOEF.Pin.fm_property
            text += UEOEF.Pin.fm_end
            return text
            
        def _default(self):
            self.properties.append(UEOEF.Property("Id", _to_uid(self.id)))
            self.properties.append(UEOEF.Property("color", *_to_str(self.color)))
            self.properties.append(UEOEF.Property("value", *_to_str(self.value)))
            
            for k, t, v in self._properties:
                if k == 'bl_idname': self.properties.append(UEOEF.Property(k, v, 0))
                else: self.properties.append(UEOEF.Property(k, *_to_str2(v, t)))
            
            self.properties.append(UEOEF.Property("links", self.links.serialize()))
    
    class Object:
        fm_begin = "\nBegin Object"
        fm_end = "\nEnd Object"
        fm_property = "\n\t"
        fm_attribute = " "
        
        def __init__(self, node):
            self._properties = []
            self.internals = UEOEF.Tuple()
            self.options = []
            self.attributes = []
            self.properties = []
            self.pins = []
            self.id = node.as_pointer()
            
            # find way to include color_tag enum type
            
            # seperate spesific optional parameter properties into options
            
            self.name = node.name
            self.type = node.bl_idname
            self.id_data = node.id_data
            
            for k, t in node.rna_type.properties.items():
                if k in ['inputs', 'outputs', 'internal_links' ]: continue
                self._properties.append((k,t,getattr(node, k, None)))
            
            
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
            
            self.properties.append(UEOEF.Property("Id", _to_uid(self.id), 0))
            self.properties.append(UEOEF.Property("id_data", str(self.id_data), 1))
            
            for k, t, v in self._properties:
                if k == 'bl_idname': self.properties.append(UEOEF.Property(k, v, 0))
                else: self.properties.append(UEOEF.Property(k, *_to_str2(v, t)))
            
            self.properties.append(UEOEF.Property("internal_links", self.internals.serialize()))
            
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
            _node = UEOEF.Object(node)
            #print([print(k,getattr(node, k, None),v) for k,v in node.rna_type.properties.items()])
            #lot[_node.id] = _node;
            
            self.from_node_group_ios(node.inputs, _node, 0, lot, settings)
            self.from_node_group_ios(node.outputs, _node, 1, lot, settings)
            
            for link in node.internal_links:
                _pin = lot[link.from_socket.as_pointer()]
                _link = UEOEF.Link(link.to_node.name, link.to_socket.as_pointer());
                _node.internals.properties.append(_link)

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
            _pin = UEOEF.Pin(socket)
            #print([print(k,getattr(socket, k, None),v) for k,v in socket.rna_type.properties.items()])
            lot[_pin.id] = _pin
            scope.pins.append(_pin)
            #print(_pin.serialize())


settings = _Settings()

layer = bpy.context.view_layer
active = layer.objects.active
selection = bpy.context.selected_objects

operator = VActCopyExportNodeGroups()
operator.do_execute(selection, settings)