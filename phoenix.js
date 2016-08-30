//duy.nguyen
//phoenix 1.0

var Resizer = gObject.extend("ClassResizer", {

    _drag_func: null,
    _stop_drag_func: null,
    _current_active: null,

    init: function(def) {
        if (!def) def = {};
        def.className = 'PhoenixResizer';

        this.LastX = 0;
        this.LastY = 0;
        this.Dx = 0;
        this.Dy = 0;

        this.base(def);
        this.bindEvent('mousedown', function(evt) {

            var resizer = gObject.prototype.findActor(evt);
            if (resizer instanceof Resizer) {
                resizer.LastX = evt.pageX;
                resizer.LastY = evt.pageY;

                Resizer.prototype._drag_func = resizer.doDrag;
                Resizer.prototype._stop_drag_func = resizer.stopDrag;
                Resizer.prototype._current_active = resizer;

                document.documentElement.addEventListener('mousemove', resizer.doDrag, false);
                document.documentElement.addEventListener('mouseup', resizer.stopDrag, false);

            }
        });

        this.dom.innerHTML = "&nbsp;";
    },
    doDrag: function(evt) {
        if (Resizer.prototype._current_active) {
            if (Resizer.prototype._current_active) {
                Resizer.prototype._current_active.Dx = evt.pageX - Resizer.prototype._current_active.LastX;
                Resizer.prototype._current_active.Dy = evt.pageY - Resizer.prototype._current_active.LastY;
                Resizer.prototype._current_active.LastX = evt.pageX;
                Resizer.prototype._current_active.LastY = evt.pageY;
                if (Resizer.prototype._current_active.dom.callback) {
                    Resizer.prototype._current_active.dom.callback.run();
                }
            }
        }
    },
    stopDrag: function(evt) {
        var resizer = gObject.prototype.findActor(evt);
        document.documentElement.removeEventListener('mousemove', Resizer.prototype._drag_func, false);
        document.documentElement.removeEventListener('mouseup', Resizer.prototype._stop_drag_func, false);
    }
});

var AppTitleBar = gObject.extend("ClassAppTitleBar", {
    init: function() {
        var gAttr = {
            dType: "div",
            className: "PhoenixAppTitle",
            dimension: "w:parent.w;h:40",
            style: {
                float: 'left'
            }
        };
        this.base(gAttr);
        var btngAttr = {
            dType: "div",
            className: "PhoenixAppBtnClose",
            'dimension': "w:40;h:parent.h",
            style: {
                float: 'left'
            }
        };
        var btnCallback = new Callback();
        btnCallback.context = this; //apptitle bar
        btnCallback.fn = function(data, result) {
            //this is apptitle bar
            var canvas = this.parent.parent;
            if (canvas instanceof AppCanvas) {
                var phoenix = canvas.parent;
                if (phoenix instanceof Phoenix) {
                    phoenix.unbindCanvas(canvas);
                }
            }
        };
        this.Label = new gObject({ dimension: 'w:parent.w-40;h:parent.h;', className: "label" });

        this.BtnClose = new Button({ callback: btnCallback }, btngAttr);
        this.append(this.Label);
        this.append(this.BtnClose);
    },
    setTitle: function(title) {
        this.Label.dom.innerHTML = title;
    }
});

var AppCanvas = gObject.extend("ClassAppCanvas", {
    init: function(attr) {
        var width = 100; //default
        var title = "";
        if (attr) {
            if (attr.width) {
                width = 0 + attr.width;
            }

            if (attr.title) {
                title = attr.title;
            }
        }

        var gAttr = {
            dType: "div",
            className: "PhoenixAppCanvas",
            dimension: "h:parent.h;",
            style: {
                'width': width + 'px'
            }
        };

        this.base(gAttr);
        this.onBind = new Delegate();
        this.onUnbind = new Delegate();

        if (attr) {
            if (attr.onBind && attr.onBind instanceof EventHandle) this.onBind.add(attr.onBind);
            if (attr.onUnbind && attr.onUnbind instanceof EventHandle) this.onUnbind.add(attr.onUnbind);
        }

        var content = new gObject({
            dimension: "w:parent.w-2;h:parent.h;",
            className: "PhoenixAppCanvasContent"

        });


        this.TitleBar = new AppTitleBar();
        this.TitleBar.setTitle(title);
        content.append(this.TitleBar);

        this.Canvas = new gObject({ dimension: "w:parent.w;h:parent.h-40" });
        content.append(this.Canvas);

        var resizer = new Resizer({
            dimension: "w:2;h:parent.h;",
            style: {
                cursor: 'ew-resize'
            },
            callback: new Callback({
                context: this,
                fn: function(data, result) {
                    var width = this.dom.clientWidth + Resizer.prototype._current_active.Dx;
                    this.dom.style.width = width + 'px';
                    this.align();
                }
            })
        });

        this.append(content);
        this.append(resizer);
    }
});



var Phoenix = gObject.extend("ClassPhoenix", {
    init: function(parent, id) {
        if (parent instanceof gObject) {
            var gAttr = {
                dType: "div",
                "className": "PhoenixGUI",
                'id': id,
                dimension: "w:parent.w;h:parent.h;"
            };
            this.base(gAttr);
        } else {
            console.log("Parent must be an instance of gObject class");
        }
        this.Container = parent;
        parent.append(this);
        //say welcome
        this.bindEvent('mousemove', function(evt) {
            var mpos = Pure.event.getMousePos(evt);
            //console.log("mousemove x:" + mpos.x + " y:" + mpos.y);
        });
    },
    bindCanvas: function(app_canvas) {
        if (app_canvas instanceof AppCanvas) {
            this.append(app_canvas);
            app_canvas.align();
            app_canvas.onBind.callDo(app_canvas);
        }
    },
    unbindCanvas: function(app_canvas) {
        this.remove(app_canvas);
        app_canvas.onUnbind.callDo(app_canvas);
    }
});