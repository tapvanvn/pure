//duy.nguyen <tapvanvn@gmail.com>
//Pure ver 1.0

/*<Tlinker>*/
function Tlinker() {
    var t = new TlinkE();
    this.begin = t;
    this.end = t;
    this.count = 0;
    this.addElement = function(e) {
        var t = this.end;
        this.end.body = e;
        this.end.next = new TlinkE();
        this.end = this.end.next;
        this.count++;
        return t;
    };
    this.addFirst = function(e) {
        var t = new TlinkE();
        t.body = e;
        t.next = this.begin;
        this.begin = t;
        this.count++;
        return t;
    };
    this.getElementByOrder = function(order) {
        if (this.count > -1 && order < this.count) {
            var t = this.begin;
            var m = 0;
            while (m < order) {
                t = t.next;
                m++;
            }
            return t.body;
        }
        return false;
    };
    this.removeFirst = function() {
        if (this.count > 0) {
            this.begin = this.begin.next;
            this.count--;
        }
    };
    this.removeLast = function() {
        var t = this.begin,
            m = this.begin;
        var f = true;
        if (t.next)
            while (f) {
                m = t;
                t = t.next;
                if (t.next == this.end) {
                    f = false;
                    m.next = this.end;
                    t = null;
                    this.count--;
                }
            }
    };
    this.removeElement = function(tlinke) {
        var t = this.begin;
        var f = true;
        while (f) {
            if (t.next == tlinke) {
                t.next = tlinke.next;
                this.count--;
                f = false;
            }
            t = t.next;
        }
    };
    this.removeElementByOrder = function(order) {
        if (this.count > -1 && order < this.count) {
            var t = this.begin;
            order--;
            var m = 0;
            while (m < order) {
                t = t.next;
                m++;
            }
            t.next = t.next.next;
            this.count--;
        }
    };
    this.removeElementByObject = function(obj) {
        var t = this.begin;
        while (t.next) {
            if (t.next.body == obj) {
                t.next = t.next.next;
                return;
            }
            t = t.next;
        }
    };
    this.removeElementAll = function() {
        this.begin = this.end;
    };
}

function TlinkE() {
    this.body = null;
    this.next = null;
}
/*</Tlinker>*/
/*<Ttemp>*/
function TvarCtrl() {
    this.container = new Tlinker();
    this.alloc = function(e) {
        this.container.addElement(e);
        return (this.container.count - 1); //return order number						
    };
    this.get = function(t) {
        return this.container.getElementByOrder(t);
    };
    this.deleteByOrder = function(t) { //delete by order number
        //document.getElementById('log').innerHTML += "<div>delete"+t+"</div>";
        if (this.container.count - 1 == t) { //if t is the last element.
            var b = this.container.begin;
            current = 0;
            mark = -1; // mark the active element
            while (b.next != this.container.end) {
                if ((typeof b.body == 'object') || (typeof b.body != 'object') && b.body != -1) { //if(b.body!=-1){<old define>
                    //if met an active element not mark
                    if (current == t) break;
                    if (current > mark) {
                        mark = -1;
                    }
                } else {
                    // else if met an unactive element mark.
                    if (current == t) break; //end while when met t(last element).
                    if (mark == -1) mark = current;
                }
                b = b.next;
                current++;
            }
            if (mark > -1) {
                b = this.container.begin;
                for (var m = 0; m < (mark); m++) {
                    b = b.next;
                }
                b.next = this.container.end;
                this.container.count = mark + 1;
            } else {
                b = this.container.begin;
                for (var m = 0; m < t - 1; m++) {
                    b = b.next;
                }
                b.next = b.next.next;
                this.container.count--;
                if (this.container.begin.next == this.container.end.next) {
                    this.container.begin = this.container.end;
                }
            }
        } else {
            var b = this.container.begin;
            for (var m = 0; m < t; m++) {
                b = b.next;
            }
            b.body = -1;
        }
    };
}
/*</Ttemp>*/
var Pure = {
    info: {
        about: 'Pure by Duy Nguyen <tapvanvn@gmail.com>',
        version: '1.0'
    },

    string: {
        replace: function(str, find_str, replace_str) {
            find_str = '' + find_str;
            replace_str = '' + replace_str;
            if (find_str.length == 0 || replace_str.indexOf(find_str) >= 0) return str;
            while (str.indexOf(find_str) >= 0) {
                str = str.replace(find_str, replace_str);
            }
            return str;
        },

        trim: function(str) {
            return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '');
        },

        getXmlStr: function(str, tag_name) {
            str = str.replace(/\/\s+\>/i, '/\>');
            str = str.replace(/\<\s*\/\s*(\w+)\s*\>/i, '\</$1\>');
            var currentpos = 0;
            var resurt = Array();
            var flag = true;
            var end = -1;
            while (flag) {
                var begin = str.indexOf('<' + tag_name, currentpos);
                if (begin > -1) {
                    end = (str.indexOf('</' + tag_name + '>', begin) > -1) ? str.indexOf('</' + tag_name + '>', begin) + tag_name.length + 3 : str.indexOf('/\>', begin) + 2;
                    resurt[resurt.length] = str.substring(begin, end);
                    currentpos = end;
                } else {
                    flag = false;
                }
            }
            return resurt;
        }
    },

    xml: {
        getDoc: function(xml_str) {
            var XMLdoc;
            if (Pure.browser._bIE) {
                XMLdoc = new ActiveXObject('Microsoft.XMLDOM');
                XMLdoc.async = false;
                var c = XMLdoc.loadXML(xml_str);
                if (!c) {
                    return false;
                }
                return XMLdoc.firstChild;
            } else {
                var XMLparser = new DOMParser();
                XMLdoc = XMLparser.parseFromString(xml_str, 'text/xml');
                var error = (XMLdoc.documentElement.nodeName == 'parsererror');
                if (error) {
                    return false;
                }
                XMLdoc = XMLdoc.documentElement;
            }
            return XMLdoc;
        },

        getNodeText: function(node) {

            if (node.childNodes && node.childNodes.length > 0) {
                var data = '';
                for (var i = 0; i < node.childNodes.length; i++) {
                    data += node.childNodes[i].nodeValue;
                }
                return data;
            } else {
                return node.nodeValue;
            }
        }
    },

    browser: {
        _bIE: navigator.appName == 'Microsoft Internet Explorer',
        isIE: function() {
            return Pure.browser._bIE;
        },
        getSize: function() {
            var w, h;
            // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
            if (typeof window.innerWidth != 'undefined') {
                w = window.innerWidth;
                h = window.innerHeight;
            }
            // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
            else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
                w = document.documentElement.clientWidth;
                h = document.documentElement.clientHeight;
            } else {
                w = document.getElementsByTagName('body')[0].clientWidth;
                h = document.getElementsByTagName('body')[0].clientHeight;
            }
            return { 'w': w, 'h': h };
        },
    },

    extend: function(class_name, feature) {

        function child_proto(build) {}
        child_proto.prototype = this.prototype;

        function child() {
            if (this.init) {
                this.init.apply(this, arguments);
            }
        }

        child.prototype = new child_proto();
        child.prototype["_pure_class_name"] = class_name;
        child.prototype["base"] = child.prototype;
        child.prototype["base_proto"] = child.prototype;

        if (this.prototype && this.prototype["_pure_class_name"]) {
            var base_name = this.prototype["_pure_class_name"];
            child.prototype[base_name] = this.prototype;
            child.prototype["_pure_base_class"] = base_name;
        }

        if (typeof feature != "undefined") {
            for (var fname in feature) {
                child.prototype[fname] = (this.prototype && typeof(this.prototype[fname]) == 'function') ?
                    (function(fname, fn) {
                        return function() {
                            var curr_proto = this.base_proto;
                            if (curr_proto["_pure_base_class"]) {
                                var base_name = curr_proto["_pure_base_class"];
                                var base_proto = curr_proto[base_name];
                                if (typeof(base_proto[fname]) == 'function') {
                                    var last_base = this.base;
                                    this.base_proto = base_proto;
                                    this.base = base_proto[fname];
                                    var rs = fn.apply(this, arguments);
                                    this.base_proto = curr_proto;
                                    this.base = last_base;
                                    return rs;
                                }
                            }
                            var rs = fn.apply(this, arguments);
                            return rs;

                        };
                    })(fname, feature[fname]) : feature[fname];
            }
        }
        child.extend = Pure.extend;
        return child;
    },

    isNull: function(obj) {
        return (typeof obj === 'undefined' || obj == null);
    },

    isArray: function(obj) {
        if (!obj) {
            return false;
        }
        return Object.prototype.toString.call(obj) === '[object Array]';
    },

    each: function(obj, fn) {
        if (Pure.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (fn.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (fn.call(obj[key], key, obj[key]) === false) {
                        break;
                    }
                }
            }
        }
    },

    copyAttr: function(to, attrs) {
        Pure.each(attrs, function(aname, attr) {
            if (Pure.isArray(aname) && Pure.isArray(attr)) {
                Pure.each(to[aname], attr);
            } else {
                to[aname] = attr;
            }
        });
    },

    event: {
        bind: function(ename, dom, fn) {
            if (dom.addEventListener) {
                dom.addEventListener(ename, fn, true);
            } else if (dom.attachEvent) {
                dom.attachEvent('on' + ename, fn);
            }
        },
        unbind: function(ename, dom, fn) {
            if (dom.removeEventListener) {
                dom.removeEventListener(ename, fn, true);
            } else if (dom.detachEvent) {
                dom.detachEvent('on' + ename, fn);
            }
        },
        getActor: function(evt) {
            return (evt && evt.target) || (window.event && window.event.srcElement);
        },
        stop: function(evt) {
            if (Pure.browser._bIE) {
                window.event.cancelBubble = true;
            } else {
                evt.stopPropagation();
            }
        },
        getKey: function(evt) {
            if (Pure.browser._bIE) {
                return { 'key': window.event.keyCode, 'shift': window.event.shiftKey, 'ctrl': window.event.ctrlKey };
            } else {
                return { 'key': evt.which, 'shift': evt.shiftKey, 'ctrl': evt.ctrlKey };
            }
        },
        getMousePos: function(evt) {
            var mX, mY;
            if (Pure.browser._bIE) {
                mX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                mY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            } else {
                mX = evt.pageX;
                mY = evt.pageY;
            }
            return { 'x': mX, 'y': mY };
        }
    },

    resource: {
        //callback is an instanceof Callback class.
        load: function(fname, ftype, callback) {
            if (ftype == "js") { //if filename is a external JavaScript file
                var fref = document.createElement('script');
                fref.setAttribute("type", "text/javascript");
                fref.setAttribute("src", fname);
            } else if (ftype == "css") { //if filename is an external CSS file
                var fref = document.createElement("link");
                fref.setAttribute("rel", "stylesheet");
                fref.setAttribute("type", "text/css");
                fref.setAttribute("href", fname);
            }
            if (typeof fref != "undefined") {
                if (callback && callback instanceof Callback) {
                    Pure.dictionary.add(fref, callback);
                    callback.result = fref;
                    if (Pure.browser._bIE) {
                        fref.onreadystatechange = function() {
                            callback = Pure.dictionary.get(this);
                            Pure.dictionary.remove(this);
                            if (callback) {
                                if (fref.readyState == "loaded" || fref.readyState == "complete") {
                                    fref.onreadystatechange = null;
                                    callback.fn.call(callback.context, callback.data);
                                }
                            }
                        }
                    } else {
                        fref.onload = function() {
                            callback = Pure.dictionary.get(this);
                            Pure.dictionary.remove(this);
                            if (callback) {
                                callback.fn.call(callback.context, callback.data);
                            }
                        }
                    }

                }
                document.getElementsByTagName("head")[0].appendChild(fref);
                return fref;
            }
            return null;
        },
        unload: function(fref) {
            if (fref) {
                document.getElementsByTagName("head")[0].removeChild(fref);
            }
        }
    },
    dom: {
        appendRoot: function(element) {
            (document.body) ? document.body.appendChild(element): document.documentElement.appendChild(element);
        },
        getPos: function(element, parent) {
            var mleft = element.offsetLeft;
            var mtop = element.offsetTop;
            if (element.offsetParent) {
                do {
                    if (element.offsetParent == parent) {
                        return { 'left': mleft, 'top': mtop };
                    }
                    mleft += element.offsetLeft;
                    mtop += element.offsetTop;
                } while (element = element.offsetParent);
            }
            return { 'left': mleft, 'top': mtop };
        },
        getSize: function(element) {
            var width = 0;
            var height = 0;

            if (element.clientWidth) {
                width = element.clientWidth;
                height = element.clientHeight;

            } else if (element.offsetWidth) {
                width = element.offsetWidth;
                height = element.offsetHeight;
            } else if (element.style) {
                width = parseInt(element.style.width);
                height = parseInt(element.style.height);
            }
            return { 'w': width, 'h': height };
        },

        hasStyle: function(dom, style) {
            var class_name = dom.className ? dom.className.toString() : "";
            return class_name.indexOf(' ' + style + ' ') >= 0;
        },

        bindStyle: function(dom, style) {
            var class_name = dom.className ? dom.className.toString() : "";
            if (class_name.indexOf(' ' + Pure.string.trim(style) + ' ') < 0) {
                class_name += ' ' + Pure.string.trim(style) + ' ';
                dom.className = class_name;
            }
        },

        unbindStyle: function(dom, style) {
            var class_name = dom.className ? dom.className.toString() : "";
            if (class_name.indexOf(' ' + Pure.string.trim(style) + ' ') >= 0) {
                dom.className = class_name.replace(Pure.string.trim(style), '').replace('  ', ' ');
            }
        },

        requestFullScreen: function() {
            var element = document.body;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },

        runChildren:function(node, fn){

            node.childNodes.forEach((n)=>{

                Pure.dom.run(n, fn)
            })
        },

        run: function(node, fn) {

            fn(node);

            node.childNodes.forEach((n)=>{
                
                Pure.dom.run(n, fn)
            })
        }
    },
    array: {
        removeItem: function(array) {
            var what, a = arguments,
                l = a.length,
                ax;
            while (l > 1 && array.length) {
                what = a[--l];
                while ((ax = array.indexOf(what)) !== -1) {
                    array.splice(ax, 1);
                }
            }
            return array;
        }
    },
    css: {
        append: function(css_element) {
            document.getElementsByTagName('head')[0].appendChild(css_element);
        },
        remove: function(css_element) {
            document.getElementsByTagName('head')[0].removeChild(css_element);
        },
        changeContent: function(css_element, content) {
            if (css_element.styleSheet)
                css_element.styleSheet.cssText = content;
            else
                css_element.appendChild(document.createTextNode(content));
        }
    },
    dictionary: {
        _gen_id: 1,
        _container: {},
        add: function(key, value) {
            if (key instanceof Object) {
                if (!key.__pure__dic__) key['__pure__dic__'] = this._gen_id++;
                this._container['_key_' + key.__pure__dic__] = value;
            }
        },
        //get object by object key
        get: function(key) {
            if (key instanceof Object) {
                if (key.__pure__dic__) {
                    return this._container['_key_' + key.__pure__dic__];
                }
            }
            return null;
        },
        //remove object by object key
        remove: function(key) {
            if (key instanceof Object) {
                if (key.__pure__dic__) {
                    delete this._container['_key_' + key.__pure__dic__];
                }
            }
        }
    },
    keyHolder: new TvarCtrl()
};

//base class
var Class = Pure.extend("Class", {
    //init:function(){}
});

var Callback = Class.extend("ClassCallback", {

    init: function(def) {
        if (def) {
            this.context = def.context ? def.context : this;
            this.data = def.data ? def.data : {};
            this.fn = def.fn ? def.fn : null;
        } else {
            this.context = this;
            this.data = {};
            this.fn = null;
        }
        this.result = null;
    },

    run: function(callback) {
        if (callback && callback instanceof Callback && callback.fn) {
            callback.fn.call(callback.context, callback.data, callback.result);
        } else {
            if (this instanceof Callback && this.fn) {
                this.fn.call(this.context, this.data, this.result);
            }
        }
    }
});

var Event = Class.extend("ClassEvent", {

});

var EventHandle = Class.extend("ClassEventHandle", {
    Context: this,
    fn: function(evt) {},
    init: function(def) {
        if (def) {
            if (def.fn) this.fn = def.fn;
            if (def.Context) this.Context = def.Context;
            else if (def.context) this.Context = def.context;
        } else {
            this.Context = this;
            this.fn = function(evt) {};
        }
    }
});


var Delegate = Class.extend("ClassDelegate", {
    init: function() {
        this._fns = [];
    },
    add: function(evt_handler) {
        if (evt_handler instanceof EventHandle) {
            this._fns[this._fns.length] = evt_handler;
        }
    },
    remove: function(evt_handler) {
        var tmp_arr = new Array();
        for (var d = 0; d < this._fns.length; d++) {
            if (this._fns[d] !== evt_handler) {
                tmp_arr[tmp_arr.length] = this._fns[d];
            }
        }
        this._fns = tmp_arr;
    },
    callDo: function(evt) {
        for (var d = 0; d < this._fns.length; d++) {
            this._fns[d].fn.call(this._fns[d].Context, evt);
        }
    },
    count: function() {
        return this._fns.length;
    }
});

var _task_id = 0;
//Task for executing something
var Task = Class.extend("ClassTask", {
    fn: function() {},
    Context: this,
    Param: null,
    onDone: null,
    init: function() {
        this._id = _task_id++;
        this.onDone = new Delegate();
    },
    callDo: function() {
        if (this.fn) {
            this.fn.call(this.Context, this, this.Param);
        }
    }
});

var TaskResourceLoad = Task.extend("ClassTaskResourceLoad", {
    init: function(res_def) {
        this.base();
        this.Param = { url: "", type: "" };
        if (res_def) {
            if (res_def.url) {
                this.Param.url = res_def.url;
            }
            if (res_def.type) {
                this.Param.type = res_def.type;
            }
        }
        this.fn = function(task, param) {
            var callback = new Callback({
                context: task,
                data: param,
                fn: function(data) {
                    //this is task
                    this.onDone.callDo(this.result);
                }
            });
            Pure.resource.load(param.url, param.type, callback);
        };
    }
});

var _task_queue_id = 0;

var TaskQueue = Class.extend("ClassTaskQueue", {
    _queue: null,
    _ehandle: null,

    init: function() {
        this._id = _task_queue_id++;
        this._queue = new Array();
        this._ehandle = new EventHandle({
            Context: this,
            fn: function(evt) {
                //this is TaskQueue
                var task = this._queue.shift();
                if (task) {
                    task.onDone.remove(this._ehandle);
                }
                if (this._queue.length > 0) this._queue[0].callDo();
            }
        });
    },

    add: function(task) {
        if (task instanceof Task) {
            task.onDone.add(this._ehandle);
            this._queue[this._queue.length] = task;
            if (this._queue.length == 1) this._queue[0].callDo();
        }
    },
    isEmpty: function() {
        return this._queue.length == 0;
    },

    remain: function() {
        return this._queue.length;
    }
});

var Dimension = Class.extend("ClassDimension", {
    init: function(def) {
        this._current_state = "normal";
        this._states = new Array();
    },
    addState: function(def) {
        if (!def || !def.name || !def.dimension) {
            console.log("unknown dimension:" + def);
            return;
        }
        this._states[def.name] = def.dimension;
    },
    getDimension: function(name) {
        if (!this._states[name]) name = "normal";
        return this._states[name];
    },
    getCurrentDimension: function() {
        return this.getDimension(this._current_state);
    },
    setState: function(state) {
        if (!this._states[state]) state = "normal";
        this._current_state = state;
    },
    getState: function() {
        return this._current_state;
    }
});

//Trigger
{
    var Trigger = Class.extend("ClassTrigger", {
        init: function(trigger_def) {
            if (trigger_def && trigger_def.name) {
                this.Name = trigger_def.name;
            }
            this._fired = 0;
            this.onTrigger = new Delegate();
        },
        callTrigger: function(evt) {
            this._fired ++;
            if (this.onTrigger) {
                this.onTrigger.callDo(evt);
            }
        },
        fired:function(){
            return this._fired;
        }
    });

    var TriggerManager = Class.extend("ClassTriggerManager", {
        init: function() {
            this._triggers = {};
        },
        add: function(trigger) {
            if (trigger instanceof Trigger && trigger.Name.length > 0) {
                this._triggers[trigger.Name] = trigger;
            }
        },
        remove: function(trigger_name) {
            if (this._triggers[trigger_name]) {
                delete this._triggers[trigger_name];
            }
        },
        trigger: function(trigger_name, evt) {
            if (!this._triggers[trigger_name]) {
                this.add(new Trigger({name:trigger_name}));
            }
            this._triggers[trigger_name].callTrigger(evt);
        },
        triggerFired: function(trigger_name){
            return this._triggers[trigger_name] ? this._triggers[trigger_name].fired() : -1;
        },
        bind: function(trigger_name, evt_handle) {
            if (!(evt_handle instanceof EventHandle)) return;
            if (!this._triggers[trigger_name]) {
                var trigger = new Trigger({ name: trigger_name });
                this.add(trigger);
                console.log("create triger:" + trigger_name);
            }
            this._triggers[trigger_name].onTrigger.add(evt_handle);
        },
        unbind: function(trigger_name, evt_handle) {
            if (this._triggers[trigger_name] && evt_handle instanceof EventHandle) {
                this._triggers[trigger_name].onTrigger.remove(evt_handle);
                if (this._triggers[trigger_name].onTrigger.count == 0) this.remove(trigger_name);
            }
        }
    });
}

//GUI class
var gObject = Class.extend("ClassGuiObject", {
    _gen_id: 0,
    init: function(gAttr) {
        //console.log("here gObject");
        this._id = gObject.prototype._gen_id++;
        this.dimension = new Dimension();
        
        if (Pure.isNull(gAttr)) {
            gAttr = {
                dtype: "div"
            };
        } else if (Pure.isNull(gAttr.dtype)) {
            gAttr.dtype = "div";
        }
        if (gAttr.dimension) {
            this.dimension.addState({ name: "normal", "dimension": gAttr.dimension });
            delete gAttr.dimension;
        }
        if (gAttr.dimensions) {
            for (var dname in gAttr.dimensions) {
                this.dimension.addState({ name: dname, dimension: gAttr.dimensions[dname] });
            }
        }

        this.dom = document.createElement(gAttr.dtype);
        Pure.copyAttr(this.dom, gAttr);

        this.dom.gParent = this;
        this.parent = null;
        if (gAttr.css) {
            var css_className = "pure_gobj_" + this._id;
            var css_content = "";
            for (var cname in gAttr.css) {
                css_content += " ." + css_className + (cname == 'normal' ? '' : ":" + cname) + "{" + gAttr.css[cname] + "}";
            }
            this.css = document.createElement("style");
            Pure.css.append(this.css);
            Pure.css.changeContent(this.css, css_content);
            this.bindStyle(css_className);
        }

        if (gAttr.style) {
            for (var property in gAttr.style)
                this.dom.style[property] = gAttr.style[property];
        }

    },
    getDom: function() {
        return this.dom;
    },
    align: function() {
        var dimension = this.dimension.getCurrentDimension();
        if (dimension && dimension.length > 0) {
            var fomula = dimension.split(';');
            var parent = this.parent ? this.parent.dom : this.dom.parentNode;
            
            if (fomula && fomula.length > 0) {
                var pos = { 'top': 0, 'left': 0 };
                var size = { 'w': 0, 'h': 0 };
                if (parent) {
                    pos = Pure.dom.getPos(parent);
                    size = Pure.dom.getSize(parent);
                }
                var browser_size = Pure.browser.getSize();
                for (var i = 0; i < fomula.length; i++) {
                    var equation =
                        Pure.string.replace(
                            Pure.string.replace(
                                Pure.string.replace(
                                    Pure.string.replace(
                                        Pure.string.replace(
                                            Pure.string.replace(fomula[i], "parent.h", size.h),
                                            "page.h", browser_size.h
                                        ),
                                        "parent.w", size.w
                                    ),
                                    "page.w", browser_size.w
                                ),
                                "parent.x", pos.left
                            ),
                            "parent.y", pos.top
                        );
                    if (equation.indexOf("h:") >= 0) {
                        equation = equation.replace("h:", "");
                        this.dom.style.height = eval(equation) + 'px';

                    } else if (equation.indexOf("w:") >= 0) {
                        equation = equation.replace("w:", "");
                        this.dom.style.width = eval(equation) + 'px';

                    } else if (equation.indexOf('x:') >= 0) {
                        equation = equation.replace("x:", "");
                        this.dom.style.left = eval(equation) + 'px';
                    } else if (equation.indexOf('y:') >= 0) {
                        equation = equation.replace("y:", "");
                        this.dom.style.top = eval(equation) + 'px';
                    }
                }
            }
            //align childrent
            if (this.dom.childNodes) {
                for (var c = 0; c < this.dom.childNodes.length; c++) {
                    if (!Pure.isNull(this.dom.childNodes[c].gParent)) {
                        this.dom.childNodes[c].gParent.align();
                    }
                }
            }
        }
    },
    append: function(gobj) {
        if (gobj instanceof gObject) {
            gobj.parent = this;
            this.dom.appendChild(gobj.dom);
        }
    },
    remove: function(gobj) {
        if (gobj instanceof gObject && gobj.parent == this) {
            this.dom.removeChild(gobj.dom);
            gobj.parent = null;
        }
    },
    bindStyle: function(style) {
        var class_name = this.dom.className ? this.dom.className.toString() : "";
        if (class_name.indexOf(' ' + Pure.string.trim(style) + ' ') < 0) {
            class_name += ' ' + Pure.string.trim(style) + ' ';
            this.dom.className = class_name;
        }
    },
    unbindStyle: function(style) {
        var class_name = this.dom.className ? this.dom.className.toString() : "";
        if (class_name.indexOf(' ' + Pure.string.trim(style) + ' ') >= 0) {
            this.dom.className = class_name.replace(Pure.string.trim(style), '').replace('  ', ' ');
        }
    },
    bindEvent: function(ename, fn) {
        Pure.event.bind(ename, this.dom, fn);
    },
    unbindEvent: function(ename, fn) {
        Pure.event.unbind(ename, this.dom, fn);
    },
    findActor: function(evt) {
        var actor = Pure.event.getActor(evt);
        while (actor != null) {
            if (actor.gParent) return actor.gParent;
            actor = actor.parentNode;
        }
        return null;
    },
    findParentWithType:function (type)
    {
        var p = this;
        while(p instanceof gObject)
        {
            if(p instanceof type) return p;
            p = p.parent;
        }
        return null;
    }
});

//Label 
//- def
//	+ title: content.
// 	+ dimension: dimension
var Label = gObject.extend("ClassLabel", {
    init: function(def, gAttr) {
        if (!def) def = {};
        if (!gAttr) gAttr = {};
        gAttr.dtype = "div";
        gAttr.innerHTML = def.title ? def.title : "label";
        this.base(gAttr);
    }
});

//TextBox
//-def
// + text: default text
var Textbox = gObject.extend("ClassTextbox", {
    init: function(def, gAttr) {
        if (!def) def = {};
        if (!gAttr) gAttr = {};
        gAttr.dtype = "input";
        gAttr.type = "text";
        gAttr.innerHTML = def.text ? def.text : "";
        this.base(gAttr);
    }
});

var Canvas = gObject.extend("ClassCanvas", {
    init: function(def, gAttr) {
        if (!def) def = {};
        if (!gAttr) gAttr = {};
        gAttr.dtype = "canvas";
        //console.log("here canvas");
        //alert(gAttr.dtype);
        this.base(gAttr);
    }
});

//Button
//-fndef:
var Button = gObject.extend("ClassButton", {
    init: function(fndef, gAttr) {
        if (!fndef) fndef = {};
        if (!gAttr) gAttr = {};
        gAttr.dtype = "button";
        gAttr.className = gAttr.className ? gAttr.className + " button " : "button";
        this.base(gAttr);
        if (fndef.callback) {
            this.callback = fndef.callback;
        }
        this.bindEvent("click", function(evt) {
            var actor = gObject.prototype.findActor(evt);
            if (actor != null) {
                if (actor.callback) actor.callback.run();
            }
        });
        if (fndef.caption) {
            this.dom.innerHTML = fndef.caption;
        }
    }
});

//Textarea
var Textarea = gObject.extend("ClassTextarea", {
    init: function(def, gAttr) {
        if (!def) def = {};
        if (!gAttr) gAttr = {};
        gAttr.dtype = "textarea";
        this.base(gAttr);
        if (def.text) this.dom.innerHTML = def.text;
    },
    getText: function() {
        return this.dom.value;
    },
    setText: function(text) {
        this.dom.value = text;
    }
});
//MODULE
if (typeof module !== 'undefined' ) {
    module.exports = {
        Pure: Pure ,
        Class: Class,
        Callback: Callback,
        Event: Event,
        EventHandle: EventHandle,
        Delegate: Delegate,
        Task: Task,
        TaskQueue: TaskQueue,
        Trigger: Trigger,
        TriggerManager: TriggerManager,
        GuiClass: gObject,
    }

    window.__pure__mod__ = module.exports;
    
} else {
    window.__pure__mod__ = {
        Pure: Pure,
        Class: Class,
        Callback: Callback,
        Event: Event,
        EventHandle: EventHandle,
        Delegate: Delegate,
        Task: Task,
        TaskQueue: TaskQueue,
        Trigger: Trigger,
        TriggerManager: TriggerManager,
        GuiClass: gObject
    }
}

var __pure__mod__ = window.__pure__mod__;

//RUNTIME
var __pure__ = window.__pure__ = {
    TriggerManager: new TriggerManager(),
    onTrigger:function(trigger_name, evt_handle)
    {
        this.TriggerManager.bind(trigger_name, evt_handle);
    },

    trigger: function(trigger_name, evt)
    {
        this.TriggerManager.trigger(trigger_name, evt);
    },

    triggerFired:function(trigger_name)
    {
        return this.TriggerManager.triggerFired(trigger_name);
    }
};

//auto execute waiting functions after load. 
if(typeof(window.__pure__waiting__fn) !== 'undefined')
{
    window.__pure__waiting__fn.push = function(e) {
        if(typeof e == 'function'){
            try{
                e();
            }
            catch(ex){
    
            }
        };
    };
    if(typeof(window.__pure__waiting__fn.forEach) !== 'undefined'){
        window.__pure__waiting__fn.forEach(function(fn){
            if(typeof fn == 'function'){
                try{
                    fn();
                }
                catch(ex){
                    console.log(ex);
                }
            };
        });
    }
}
else {
    window.__pure__waiting__fn = [];
    window.__pure__waiting__fn.push = function(e) {
        if(typeof e == 'function'){
            try {
                e();
            }
            catch(ex){
                console.log(ex);
            }
        };
    };
}

