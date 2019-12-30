const TYPE = "paged";
export default function Paged(target) {
    target instanceof Function && (target = new target());
    const flitMethods = object => {
        Object.getOwnPropertyNames(object).forEach(key => {
            const prop = object[key];
            if (prop instanceof Function && key.indexOf("__") !== 0 && key !== "constructor") {
                if (!target.hasOwnProperty(key)) {
                    target[key] = prop;
                }
            }
        });
    };

    flitMethods(target);
    let proto = target.__proto__;
    while (proto && !(proto.hasOwnProperty("nv_constructor") && proto.nv_constructor === "Object")) {
        flitMethods(proto);
        proto = proto.__proto__;
    }

    if (target.computed || target.watch) {
        !(target.onLoad || !target.onLoad instanceof Function) && (target.onLoad = function () {});
        if (target.onLoad.type !== TYPE) {
            const oldFun = target.onLoad;
            target.onLoad = function () {
                const oldSetFun = this.setData;
                this.setData = function() {
                    oldSetFun.apply(this, arguments);
                    this.__updateWatch();
                    this.__updateComputed();
                };
                oldFun.apply(this, arguments);
            };
            target.__updateWatch = function () {
                Object.keys(this.watch || {}).forEach(key => {
                    const watchFunc = this.watch[key];
                    if (watchFunc && watchFunc.prototype) {
                        if (!watchFunc.prototype.hasOwnProperty("__watch__") || this.data.__webviewId__ != this.watch.__webviewId__) {
                            watchFunc.prototype.__watch__ = {};
                            this.watch.__webviewId__ = this.data.__webviewId__;
                        }
                        const watcher = watchFunc.prototype.__watch__;
                        const oldValue = watcher[key];
                        const newValue = this.data[key];
                        if (oldValue !== newValue && (oldValue || newValue)) {
                            watchFunc.prototype.__watch__[key] = newValue;
                            watchFunc.call(this);
                        }
                    }
                });
            };

            target.__updateComputed = function () {
                Object.keys(this.computed || {}).forEach(key => {
                    const computedFunc = this.computed[key];
                    if (computedFunc && computedFunc.prototype) {
                        if (!computedFunc.prototype.hasOwnProperty("__computed__") || this.data.__webviewId__ != this.computed.__webviewId__) {
                            computedFunc.prototype.__computed__ = {};
                            this.computed.__webviewId__ = this.data.__webviewId__;
                        }
                        const oldValue = this.data[key];
                        const newValue = computedFunc.call(this, {...this.data, ...this.properties});
                        if (oldValue !== newValue && (oldValue || newValue)) {
                            computedFunc.prototype.__computed__[key] = newValue;
                            const data = {};
                            data[key] = newValue;
                            this.setData(data);
                        }
                    }
                });
            };
            target.onLoad.type = TYPE;
        }
    }
    return Page(target);
}
