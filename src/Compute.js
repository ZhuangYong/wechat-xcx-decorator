/**
 * watch for key
 * @param target
 * @param key
 * @constructor
 */
export default function Compute(target, key) {
    !target.computed && (target.computed = {});
    target[key] && (target[key].type = "compute");
    (key || "").split(",").forEach(subKey => !target.computed.hasOwnProperty(subKey) && (target.computed[key] = target[key]));
}