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
        
class _Settings:
    def __init__(self):
        self.name = "GN_Wireframe"
        
class UEOEF:
    DEFAULT_NO_ID = "00000000000"
    
    class Property:
        fm_set = "="
        
        def __init__(self, name="", value="", flag = 0):
            self.flag = 0
            self.name = name
            self.value = value
            
        def serialize(self):
            self._default()
            text = self.name + UEOEF.Property.fm_set
            text += str(self.value if not self.flag else json.dumps(self.value))
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
        
        def __init__(self, type="", subtype="", name="", enum=""):
            self.id = UEOEF.DEFAULT_NO_ID
            self.type = type
            self.subtype = subtype
            self.name = name
            self.enum = enum
            self.direction = 0
            self.description = ""
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
            #self.properties.append(UEOEF.Property("PersistentGuid", UEOEF.DEFAULT_NO_ID))
            self.properties.append(UEOEF.Property("Direction", json.dumps("EGPD_Input" if self.direction == 0 else "EGPD_Output")))
            
            self.properties.append(UEOEF.Property("PinName", json.dumps(self.name)))
            
            #self.properties.append(UEOEF.Property("PinToolTip", json.dumps(self.description)))
            #self.properties.append(UEOEF.Property("PinAttributeDomain", json.dumps(self.description)))
            #self.properties.append(UEOEF.Property("PinDefaultAttributeName", json.dumps(self.description)))
            #self.properties.append(UEOEF.Property("PinDefaultInput", json.dumps(self.description)))
            #self.properties.append(UEOEF.Property("PinValue", json.dumps(self.value)))
            #self.properties.append(UEOEF.Property("PinMinValue", json.dumps(self.description)))
            #self.properties.append(UEOEF.Property("PinMaxValue", json.dumps(self.description)))
            
            self.properties.append(UEOEF.Property("PinType.PinCategory", json.dumps(self.enum)))
            self.properties.append(UEOEF.Property("PinType.PinSubCategory", json.dumps(self.subtype)))
            self.properties.append(UEOEF.Property("PinType.PinSubCategoryObject", self.type))
 
            self.properties.append(UEOEF.Property("bHidden", False))
            self.properties.append(UEOEF.Property("bNotConnectable", False))
            self.properties.append(UEOEF.Property("bForceNoneField", False))
            self.properties.append(UEOEF.Property("bLayerSelection", False))
            self.properties.append(UEOEF.Property("bHideInModifier", False))
            
            #self.properties.append(UEOEF.Property("PinFriendlyName", json.dumps(self.subtype)))
            #self.properties.append(UEOEF.Property("PinType.PinSubCategoryMemberReference", "None"))
            #self.properties.append(UEOEF.Property("PinType.PinValueType", "()"))
            #self.properties.append(UEOEF.Property("PinType.ContainerType", "None"))
            #self.properties.append(UEOEF.Property("PinType.bIsReference", False))
            #self.properties.append(UEOEF.Property("PinType.bIsConst", False))
            #self.properties.append(UEOEF.Property("PinType.bIsWeakPointer", False))
            #self.properties.append(UEOEF.Property("PinType.bIsUObjectWrapper", False))
            #self.properties.append(UEOEF.Property("PinType.bSerializeAsSinglePrecisionFloat", False))
            #self.properties.append(UEOEF.Property("bDefaultValueIsReadOnly", False))
            #self.properties.append(UEOEF.Property("bDefaultValueIsIgnored", False))
            #self.properties.append(UEOEF.Property("bAdvancedView", False))
            #self.properties.append(UEOEF.Property("bOrphanedPin", False))
            
            self.properties.append(UEOEF.Property("LinkedTo", self.links.serialize()))
    
    class Object:
        fm_begin = "\nBegin Object Class=%X% Name=%Y%"
        fm_end = "\nEnd Object"
        fm_property = "\n\t"
        
        def __init__(self, type="", name="", enum=""):
            self.reference = UEOEF.Tuple()
            self.id = UEOEF.DEFAULT_NO_ID
            self.type = type
            self.enum = enum
            self.name = name
            self.position = mathutils.Vector((0.0, 0.0, 0.0))
            self.properties = []
            self.pins = []
            
        def serialize(self):
            self._default()
            text = UEOEF.Object.fm_begin.replace("%X%", self.type).replace("%Y%", json.dumps(self.name))
            for property in self.properties:
                text += UEOEF.Object.fm_property + property.serialize()
            for pin in self.pins:
                text += UEOEF.Object.fm_property + pin.serialize()
            text += UEOEF.Object.fm_end
            return text
        
        def _default(self):
            self.properties.append(UEOEF.Property("NodeGuid", _to_uid(self.id)))
            self.properties.append(UEOEF.Property("NodeType", json.dumps(self.enum)))
            self.properties.append(UEOEF.Property("NodePosX", int(self.position.x)))
            self.properties.append(UEOEF.Property("NodePosY", int(self.position.y)))
            #Do something with reference
            
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
            _node = UEOEF.Object(type(node).__name__, node.name, node.type)
            _node.position = node.location
            _node.id = node.as_pointer()
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
                type(socket).__name__, 
                socket.bl_subtype_label, 
                socket.name,
                socket.type)
            _pin.direction = dir
            _pin.id = socket.as_pointer()
            _pin.description = socket.description
            lot[_pin.id] = _pin
            scope.pins.append(_pin)
            #print(_pin.serialize())


settings = _Settings()

layer = bpy.context.view_layer
active = layer.objects.active
selection = bpy.context.selected_objects

operator = VActCopyExportNodeGroups()
operator.do_execute(selection, settings)