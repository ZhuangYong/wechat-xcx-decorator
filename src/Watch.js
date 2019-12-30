/**
 * watch for key
 * @param target
 * @param key
 * @constructor
 */
export default function Watch(target, key) {
    !target.watch && (target.watch = {});
    target[key] && (target[key].type = "watch");
    (key || "").split(",").forEach(subKey => !target.watch.hasOwnProperty(subKey) && (target.watch[key] = target[key]));
}