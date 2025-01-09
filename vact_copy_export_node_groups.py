import bpy, json, mathutils, pickle

def _to_id(val):
    return str(val)
    #return f'{val.as_pointer():x}'.upper()
    #return val.as_pointer()

def _arr_or_val(val, desc):
    return [x for x in val] if desc.is_array else val

def _enum_resolve(val, desc, enum_lot):
    b_add = enum_lot and desc.identifier not in enum_lot
    if b_add: enum_lot[desc.identifier] = [x.identifier for x in desc.enum_items]
    return val

def _to_val(val, desc, enum_lot=None):
    _val = None

    if val == None: pass
    elif isinstance(val, mathutils.Quaternion): _val = [val.x, val.y, val.z, val.w]
    elif isinstance(val, mathutils.Euler): _val = [val.x, val.y, val.z, str(val.order)]
    elif desc.type == 'BOOLEAN': _val = _arr_or_val(val, desc)
    elif desc.type == 'INT':  _val = _arr_or_val(val, desc)
    elif desc.type == 'FLOAT': _val = _arr_or_val(val, desc)
    elif desc.type == 'STRING': _val = val
    elif desc.type == 'ENUM': _val = _enum_resolve(val, desc, enum_lot)
    elif desc.type == 'POINTER': _val = _to_id(val)
    elif desc.type == 'COLLECTION': _val = str(val) #[_to_val(x, val.fixed_type, k - 1) for x in val] 
    else: _val = str(val)
    
    return _val
        
class _Settings:
    def __init__(self):
        self.name = "GN_Wireframe"
        
class BLOEF:
    DEFAULT_NO_ID = "00000000000"
    DEFAULT_INDENT = None

    class Encoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, BLOEF.Group):
                obj._default()
                return obj.properties
            elif isinstance(obj, BLOEF.Node):
                obj._default()
                return obj.properties
            elif isinstance(obj, BLOEF.Collection):
                obj._default()
                return obj.items
            elif isinstance(obj, BLOEF.Object):
                obj._default()
                return obj.properties
                
            return super().default(obj)
    
    class Collection:        
        def __init__(self, context=[], desc=None, enum_lot=None):
            self.items = [_to_val(x) for x in context]

        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOEF.DEFAULT_INDENT)
            
        def _default(self):
            pass

    class Group:
        _EXCLUDE = ['interface','nodes', 'links']
        def __init__(self, context, enum_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v) for k,v in context.rna_type.properties.items() if k not in BLOEF.Group._EXCLUDE}
            self.nodes = BLOEF.Collection()
            self.links = BLOEF.Collection()
            self.interface = BLOEF.Collection()
            
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOEF.DEFAULT_INDENT, cls=BLOEF.Encoder)
            
        def _default(self):
            self.properties['_id'] = self.id
            self.properties['nodes'] = self.nodes
            self.properties['links'] = self.links
            self.properties['interface'] = self.interface
    
    class Node:
        _EXCLUDE = ['inputs', 'outputs', 'internal_links']
        def __init__(self, context, enum_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v) for k,v in context.rna_type.properties.items() if k not in BLOEF.Node._EXCLUDE}
            self.inputs = BLOEF.Collection()
            self.outputs = BLOEF.Collection()
            self.internal_links = BLOEF.Collection()
    
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOEF.DEFAULT_INDENT, cls=BLOEF.Encoder)
        
        def _default(self):
            self.properties['_id'] = self.id
            self.properties['inputs'] = self.inputs
            self.properties['outputs'] = self.outputs
            self.properties['internal_links'] = self.internal_links

    class Object:
        _EXCLUDE = []
        def __init__(self, context, enum_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v) for k,v in context.rna_type.properties.items() if k not in BLOEF.Object._EXCLUDE}
    
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOEF.DEFAULT_INDENT, cls=BLOEF.Encoder)
        
        def _default(self):
            self.properties['_id'] = self.id
            
    def __init__(self, enum_lot=None):
        self.root = {}
        self.groups = []
        #self.enums = {}
    
    def _default(self):
        self.root["groups"] = self.groups
        #self.root["enums"] = self.enums
    
    def serialize(self):
        self._default()
        return json.dumps(self.root, indent=BLOEF.DEFAULT_INDENT, cls=BLOEF.Encoder)
    
        
class VActCopyExportNodeGroups:
    def do_execute(self, context, settings):
        group = bpy.data.node_groups[settings.name]
        lot = {}
        scope = BLOEF()
        self.from_node_groups([group], scope, lot, settings)
        text = scope.serialize()
        bpy.context.window_manager.clipboard = text
        print(text)
        
    def from_node_groups(self, context, scope, lot, settings):
        for group in context:
            _group = BLOEF.Group(group)
            self.from_node_group_nodes(group.nodes, _group.nodes, lot, settings)
            self.from_node_group_links(group.links, _group.links, lot, settings)
            self.from_node_group_interface(group.interface, _group.interface, lot, settings)
            lot[_group.id] = _group
            scope.groups.append(_group)
    
    def from_node_group_interface(self, context, scope, lot, settings):
        self.from_node_group_sockets(context.items_tree, scope, lot, settings)
    
    def from_node_group_nodes(self, context, scope, lot, settings):
        for node in context:
            _node = BLOEF.Node(node)
            self.from_node_group_sockets(node.inputs, _node.inputs, lot, settings)
            self.from_node_group_sockets(node.outputs, _node.outputs, lot, settings)
            self.from_node_group_links(node.internal_links, _node.internal_links, lot, settings)
            #lot[_node.id] = _node
            scope.items.append(_node)
    
    def from_node_group_links(self, context, scope, lot, settings):
        for link in context:
            _link = {k:_to_val(getattr(link, k, None), v) for k,v in link.rna_type.properties.items()}
            scope.items.append(_link)
            return
    
    def from_node_group_sockets(self, context, scope, lot, settings):
        print (context)
        for socket in context:
            _socket = BLOEF.Object(socket)
            #lot[_socket.id] = _socket
            scope.items.append(_socket)


settings = _Settings()

layer = bpy.context.view_layer
active = layer.objects.active
selection = bpy.context.selected_objects

operator = VActCopyExportNodeGroups()
operator.do_execute(selection, settings)