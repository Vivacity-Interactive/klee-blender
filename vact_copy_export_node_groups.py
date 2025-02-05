import bpy, json, mathutils

def _rna_x(val):
    return {k:_to_val(getattr(val, k, None), v, None) for k,v in val.rna_type.properties.items()}

#def _rna_y(val):
#     return {k:str(v) for k,v in val.properties.items()}

def _print_x(val):
    print(json.dumps(_rna_x(val),indent=2))
    
#def _print_y(val):
#    print(json.dumps(_rna_y(val),indent=2))
    
#def _print_diff(rna_a, rna_b):
#    _set = set(rna_b.properties.keys());
#    print(json.dumps({ k: str(v)  for k,v in rna_a.properties.items() if k not in _set },indent=2))

def _to_id(val):
    return f'0x{val.as_pointer():016X}'
    #return str(val)
    #return hex(val.as_pointer());
    #return val.as_pointer()

def _arr_or_val(val, desc):
    return [x for x in val] if desc.is_array else val

def _opt_resolve(desc, enum_lot):
    #_print_y(desc)
    #return { k:_to_val(getattr(desc, k, None), v, enum_lot, 1 if not k in ['rna_type'] else 1) for k,v in desc.rna_type.properties.items() if not k in BLOF._PROPS_X}
    return { k:_to_val(getattr(desc, k, None), v, enum_lot, 6 if not k in ['rna_type'] else 1) for k,v in desc.rna_type.properties.items() if k in BLOF.PROPS_INCLUDE}

def _enum_resolve(val, desc, enum_lot):
    b_items = len(desc.enum_items) > 0
    _id = _to_id(desc.enum_items[0] if b_items else desc)
    
    b_add = b_items and (enum_lot is not None) and (desc.identifier not in BLOF.ENUM_EXCLUDE) and (_id not in enum_lot)
    if b_add: enum_lot[_id] = { x.identifier: x.name  for x in desc.enum_items } # maybe add is_enum_flag
    
    return [val,_id]

def _id_resolve(val, desc, enum_lot, n=1):
    return { k:_to_val(getattr(val, k, None), v, enum_lot, n if not k in ['rna_type'] else 1) for k,v in val.rna_type.properties.items() if k in BLOF.ID_INCLUDE}

def _ptr_resolve(val, desc, enum_lot, n=1):
    return { k:_to_val(getattr(val, k, None), v, enum_lot, n if not k in ['rna_type'] else 1) for k, v in val.rna_type.properties.items() } if not isinstance(val, BLOF.PTR_CLASS_EXCLUDE) and n > 0 else _to_id(val)

def _coll_resolve(val, desc, enum_lot, n):
    return [_to_val(x, None, enum_lot, n) for x in val if x is not None] if n > 0 else _to_id(desc)

def _to_val(val, desc, enum_lot=None, n=1):
    _val = None
    b_desc = not desc is None

    if val == None: pass
    elif isinstance(val, mathutils.Quaternion): _val = [val.x, val.y, val.z, val.w]
    elif isinstance(val, mathutils.Euler): _val = [val.x, val.y, val.z, str(val.order)]
    elif isinstance(val, set): _val = _coll_resolve(val, None, enum_lot, n - 1) if len(val) > 0 else {}
    elif isinstance(val, bpy.types.ID): _val = _id_resolve(val, desc, enum_lot, n - 1)
    elif b_desc and desc.type == 'BOOLEAN': _val = _arr_or_val(val, desc)
    elif b_desc and desc.type == 'INT':  _val = _arr_or_val(val, desc)
    elif b_desc and desc.type == 'FLOAT': _val = _arr_or_val(val, desc)
    elif b_desc and desc.type == 'STRING': _val = val
    elif b_desc and desc.type == 'ENUM': _val = _enum_resolve(val, desc, enum_lot)
    elif b_desc and desc.type == 'POINTER': _val = _ptr_resolve(val, desc, enum_lot, n - 1)
    elif b_desc and desc.type == 'COLLECTION': _val = _coll_resolve(val,desc, enum_lot, n - 1)
    elif isinstance(val, bpy.types.bpy_struct): _val = _ptr_resolve(val, None, enum_lot, n - 1)
    else: _val = str(val)
    
    return _val
        
class BLOF:
    DEFAULT_INDENT = None
    ENUM_EXCLUDE = ['id_type','bl_icon','bl_static_type', 'icon']
    PROPS_INCLUDE = ['name','identifier','description','type', 'subtype', 'is_hidden','fixed_type']
    #PROPS_INCLUDE = ['name','identifier','description','type', 'subtype','is_hidden', 'is_runtime', 'is_animatable']
    #_PROPS_X = ['enum_items','enum_items_static','enum_items_static_ui','rna_type']
    ID_INCLUDE = ['rna_type','id_type', 'name','name_full', 'users', 'use_fake_user','session_uid']
    PTR_CLASS_EXCLUDE = (bpy.types.Node, bpy.types.NodeSocket, bpy.types.NodeLinks, bpy.types.NodeTree, bpy.types.NodeTreeInterface, bpy.types.NodeTreeInterfaceItem)
    
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
        def __init__(self, context, enum_lot=None, opt_lot=None):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v, enum_lot, 6) for k,v in context.rna_type.properties.items() if k not in BLOF.Node._EXCLUDE}
            self.inputs = BLOF.Collection()
            self.outputs = BLOF.Collection()
            self.internal_links = BLOF.Collection()
            
            _id = _to_id(context.rna_type)
            b_add = not opt_lot is None and id not in opt_lot
            if b_add:
                _base = set(context.rna_type.base.properties.keys())
                _keys = context.rna_type.properties.items()
                _options = [ _opt_resolve(v, enum_lot) for k,v in _keys if k not in _base ];
                if _options: opt_lot[_id] = _options
            #_print_diff(context.rna_type, context.rna_type.base)
    
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
        def __init__(self, context, enum_lot=None, n=1):
            self.id = _to_id(context)
            self.properties = {k:_to_val(getattr(context, k, None), v, enum_lot,n) for k,v in context.rna_type.properties.items() if k not in BLOF.Object._EXCLUDE}
    
        def serialize(self):
            self._default()
            return json.dumps(self.properties, indent=BLOF.DEFAULT_INDENT, cls=BLOF.Encoder)
        
        def _default(self):
            self.properties['_id'] = self.id
            
    def __init__(self, enum_lot=None, opt_lot=None):
        self.root = {}
        self.enums = enum_lot
        self.options = opt_lot
    
    def _default(self):
        self.root.properties['_enums'] = self.enums
        self.root.properties['_options'] = self.options
        pass
    
    def serialize(self):
        self._default()
        return json.dumps(self.root, indent=BLOF.DEFAULT_INDENT, cls=BLOF.Encoder)

class _Settings:
    def __init__(self):
        self.name = "GN_Broken"
        #self.name = "GN_ALL"
        #self.name = "GN_Wireframe"
        #self.name = "GN_Contribute"
        #self.name = "GN_Test"
        #self.name = "Material"
        #self.name = "World"
        #self.name = "Scene"
        self.html_save = True
        
class VActCopyExportNodeGroups:
    def do_execute(self, context, settings):
        group = bpy.data.node_groups[settings.name]
        #group = bpy.data.materials[settings.name].node_tree
        #group = bpy.data.scenes[settings.name].node_tree
        #group = bpy.data.worlds[settings.name].node_tree
        lot = {}
        scope = BLOF({},{})
        self.from_node_groups(group, scope, lot, scope.enums, scope.options, settings)
        text = scope.serialize()
        #print(json.dumps({ 'enums':scope.enums, 'options':scope.options },indent=2))
        
        if settings.html_save:
            text = text.replace("<","&lt;").replace(">","&gt;")

        bpy.context.window_manager.clipboard = text
        #print(text)
        
    def from_node_groups(self, context, scope, lot, enums, options, settings):
        _group = BLOF.Group(context, enums)
        self.from_node_group_nodes(context.nodes, _group.nodes, lot, enums, options, settings)
        self.from_node_group_links(context.links, _group.links, lot, enums, settings)
        self.from_node_group_interface(context.interface, _group.interface, lot, enums, settings)
        scope.root = _group
        #lot[_group.id] = _group
    
    def from_node_group_interface(self, context, scope, lot, enums, settings):
        self.from_node_group_sockets(context.items_tree, scope, lot, enums, settings)
    
    def from_node_group_nodes(self, context, scope, lot, enums, options, settings):
        for node in context:
            _node = BLOF.Node(node, enums, options)
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