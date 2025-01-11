import bpy, json, mathutils

def _to_id(val):
    return str(val)
    #return f'{val.as_pointer():x}'.upper()
    #return val.as_pointer()

def _arr_or_val(val, desc):
    return [x for x in val] if desc.is_array else val

def _enum_resolve(val, desc, enum_lot):
    b_add = not enum_lot is None and desc.identifier not in enum_lot
    if b_add: enum_lot[desc.identifier] = { x.identifier: x.name  for x in desc.enum_items }
    return val
 
def _to_val(val, desc, enum_lot=None):
    _val = None
    b_desc = not desc is None

    if val == None: pass
    elif isinstance(val, mathutils.Quaternion): _val = [val.x, val.y, val.z, val.w]
    elif isinstance(val, mathutils.Euler): _val = [val.x, val.y, val.z, str(val.order)]
    elif b_desc and desc.type == 'BOOLEAN': _val = _arr_or_val(val, desc)
    elif b_desc and desc.type == 'INT':  _val = _arr_or_val(val, desc)
    elif b_desc and desc.type == 'FLOAT': _val = _arr_or_val(val, desc)
    elif b_desc and desc.type == 'STRING': _val = val
    elif b_desc and desc.type == 'ENUM': _val = _enum_resolve(val, desc, enum_lot)
    elif b_desc and desc.type == 'POINTER': _val = _to_id(val)
    elif b_desc and desc.type == 'COLLECTION': _val = str(val) #[_to_val(x, val.fixed_type, k - 1) for x in val] 
    else: _val = str(val)
    
    return _val
        
class BLOF:
    DEFAULT_NO_ID = "00000000000"
    DEFAULT_INDENT = None

    class Encoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, BLOF.Group):
                obj._default()
                return obj.properties
            elif isinstance(obj, BLOF.Node):
                obj._default()
                return obj.properties
            elif isinstance(obj, BLOF.Collection):
                obj._default()
                return obj.items
            elif isinstance(obj, BLOF.Object):
                obj._default()
                return obj.properties
                
            return super().default(obj)
    
    class Collection:        
        def __init__(self, context=[], desc=None, enum_lot=None):
            self.items = [_to_val(x, desc, enum_lot) for x in context]

        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOF.DEFAULT_INDENT)
            
        def _default(self):
            pass

    class Group:
        _EXCLUDE = ['interface','nodes', 'links']
        def __init__(self, context, enum_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v, enum_lot) for k,v in context.rna_type.properties.items() if k not in BLOF.Group._EXCLUDE}
            self.nodes = BLOF.Collection()
            self.links = BLOF.Collection()
            self.interface = BLOF.Collection()
            
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOF.DEFAULT_INDENT, cls=BLOF.Encoder)
            
        def _default(self):
            self.properties['_id'] = self.id
            self.properties['nodes'] = self.nodes
            self.properties['links'] = self.links
            self.properties['interface'] = self.interface
    
    class Node:
        _EXCLUDE = ['inputs', 'outputs', 'internal_links']
        def __init__(self, context, enum_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v, enum_lot) for k,v in context.rna_type.properties.items() if k not in BLOF.Node._EXCLUDE}
            self.inputs = BLOF.Collection()
            self.outputs = BLOF.Collection()
            self.internal_links = BLOF.Collection()
    
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOF.DEFAULT_INDENT, cls=BLOF.Encoder)
        
        def _default(self):
            self.properties['_id'] = self.id
            self.properties['inputs'] = self.inputs
            self.properties['outputs'] = self.outputs
            self.properties['internal_links'] = self.internal_links

    class Object:
        _EXCLUDE = []
        def __init__(self, context, enum_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v, enum_lot) for k,v in context.rna_type.properties.items() if k not in BLOF.Object._EXCLUDE}
    
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOF.DEFAULT_INDENT, cls=BLOF.Encoder)
        
        def _default(self):
            self.properties['_id'] = self.id
            
    def __init__(self, enum_lot=None):
        self.root = {}
        self.enums = enum_lot
    
    def _default(self):
        self.root.properties['_enums'] = self.enums
        pass
    
    def serialize(self):
        self._default()
        return json.dumps(self.root, indent=BLOF.DEFAULT_INDENT, cls=BLOF.Encoder)

class _Settings:
    def __init__(self):
        self.name = "GN_Wireframe"
        self.html_save = False
        self.enums = { 'bl_icon': {} }
        
class VActCopyExportNodeGroups:
    def do_execute(self, context, settings):
        group = bpy.data.node_groups[settings.name]
        lot = {}
        scope = BLOF(settings.enums)
        self.from_node_groups(group, scope, lot, scope.enums, settings)
        text = scope.serialize()
        
        if settings.html_save:
            text = text.replace("<","&lt;").replace(">","&gt;")

        bpy.context.window_manager.clipboard = text
        #print(text)
        
    def from_node_groups(self, context, scope, lot, enums, settings):
        _group = BLOF.Group(context, enums)
        self.from_node_group_nodes(context.nodes, _group.nodes, lot, enums, settings)
        self.from_node_group_links(context.links, _group.links, lot, enums, settings)
        self.from_node_group_interface(context.interface, _group.interface, lot, enums, settings)
        scope.root = _group
        #lot[_group.id] = _group
    
    def from_node_group_interface(self, context, scope, lot, enums, settings):
        self.from_node_group_sockets(context.items_tree, scope, lot, enums, settings)
    
    def from_node_group_nodes(self, context, scope, lot, enums, settings):
        for node in context:
            _node = BLOF.Node(node, enums)
            self.from_node_group_sockets(node.inputs, _node.inputs, lot, enums, settings)
            self.from_node_group_sockets(node.outputs, _node.outputs, lot, enums, settings)
            self.from_node_group_links(node.internal_links, _node.internal_links, lot, enums, settings)
            #lot[_node.id] = _node
            scope.items.append(_node)
    
    def from_node_group_links(self, context, scope, lot, enums, settings):
        for link in context:
            #_link = {k:_to_val(getattr(link, k, None), v, enums) for k,v in link.rna_type.properties.items()}
            _link = BLOF.Object(link, enums)
            scope.items.append(_link)
    
    def from_node_group_sockets(self, context, scope, lot, enums, settings):
        for socket in context:
            _socket = BLOF.Object(socket, enums)
            #lot[_socket.id] = _socket
            scope.items.append(_socket)


settings = _Settings()

layer = bpy.context.view_layer
active = layer.objects.active
selection = bpy.context.selected_objects

operator = VActCopyExportNodeGroups()
operator.do_execute(selection, settings)