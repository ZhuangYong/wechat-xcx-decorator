import computedBehavior from "miniprogram-computed";
export default function Componented(comp) {
    const flip =  target => {
        const lifetimes = ["created", "attached", "ready", "moved", "detached", "error"];
        const pageLifetimes = ["show", "hide", "resize"];
        const constructs = ["constructor"];
        const methodsExclude = lifetimes.concat(pageLifetimes).concat(constructs);
        let instance = target;
        instance instanceof Function && (instance = new target());
        !instance.methods && (instance.methods = {});
        !instance.lifetimes && (instance.lifetimes = {});
        !instance.pageLifetimes && (instance.pageLifetimes = {});
        const flitMethods = object => {
            Object.getOwnPropertyNames(object).forEach(key => {
                const prop = object[key];
                if (prop instanceof Function && key.indexOf("__") !== 0 && prop.type !== "compute" && prop.type !== "watch") {
                    if (pageLifetimes.indexOf(key) >= 0) {
                        instance.pageLifetimes[key] = prop;
                    } else if (lifetimes.indexOf(key) >= 0) {
                        instance.lifetimes[key] = prop;
                    } else if (methodsExclude.indexOf(key) < 0) {
                        instance.methods[key] = prop;
                    }
                }
            });
        };
        flitMethods(instance);
        let proto = instance.__proto__;
        while (proto && !(proto.hasOwnProperty("nv_constructor") && proto.nv_constructor === "Object")) {
            flitMethods(proto);
            proto = proto.__proto__;
        }
        instance.properties = {...instance.properties, ...comp.properties};
        !instance.behaviors && (instance.behaviors = []);
        !(instance.behaviors.indexOf(computedBehavior) >= 0) && (instance.behaviors.push(computedBehavior));
        return Component(instance);
    };

    if (comp instanceof Function) return flip(comp);
    return flip;
}
