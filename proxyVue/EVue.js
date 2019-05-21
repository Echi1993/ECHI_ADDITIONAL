/**
 * @description ES6中proxy语法尝鲜及实现Vue双向绑定功能
 * @author Echi
 * @date 2019-05-21
 */

/**
 * @description 全局构造函数
 * @author Echi
 * @date 2019-05-21
 * @param {object} options 参数传递
 */
function EVue(options) {
    let vm = this;
    this.$options = options || {};
    this.$methods = this.$options.methods || {};
    const data = this.$options.data || {};
    const keys = Object.keys(data);
    let i = keys.length;
    let methods = this.$methods;
    // 确保没有属性冲突
    while (i--) {
        const key = keys[i];
        if (methods && methods.hasOwnProperty(key)) {
            console.warn(
                `Method "${key}" has already been defined as a data property.`
            );
        }
    }
    // 将data属性代理到vm对象中
    Object.keys(data).forEach((key) => {
        proxy(vm, key);
    });
    // 将methods属性添加到vm对象中
    for(let method in methods) {
        if(!vm.hasOwnProperty(method)) {
            vm[method] = methods[method];
        }
    }
    // observe data
    observe(data, vm);
    new Compile(options.el, vm);
}

/**
 * @description 将data上的属性代理到EVue上
 * @author Echi
 * @date 2019-05-21
 * @param {EVue} vm
 * @param {key} key
 * @returns 
 */
function proxy(vm, key) {
    Object.defineProperty(vm, key, {
        enumerable: false,
        configurable: true,
        get() {
            return vm.$data[key];
        },
        set(value) {
            vm.$data[key] = value;
        }
    });
}

/**
 * @description 拦截对象,添加监听
 * @author Echi
 * @date 2019-05-21
 * @param {object} data
 * @param {EVue} vm
 * @returns
 */
function observe(data, vm) {
    let dep = new Dep();
    let proxyHandler = {
        get(target, key) {
            if (Dep.target) {
                // 判断是否需要添加订阅者
                dep.addSub(Dep.target); // 在这里添加一个订阅者
            }
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            let oldVal = Reflect.get(target, key);
            if (oldVal === value) return;
            let res = Reflect.set(target, key, value);
            dep.notify(); // 如果数据变化，通知所有订阅者
            return res;
        }
    };
    vm.$data = new Proxy(data, proxyHandler);
}
/**
 * @description 观察者方法
 * @author Echi
 * @date 2019-05-21
 * @param {EVue} vm
 * @param {expression} exp
 * @param {function} cb
 */
function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get(); // 将自己添加到订阅器的操作
}

// 绑定原型上的方法
Watcher.prototype = {
    update() {
        this.run();
    },
    run() {
        let value = this.vm[this.exp];
        let oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get() {
        Dep.target = this; // 缓存自己
        let value = this.vm[this.exp]; // 强制执行监听器里的get函数
        Dep.target = null; // 释放自己
        return value;
    }
};

/**
 * @description 发布订阅方法
 * @author Echi
 * @date 2019-05-21
 */
function Dep() {
    this.subs = [];
}
Dep.target = null;
Dep.prototype = {
    addSub(sub) {
        this.subs.push(sub);
    },
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
};
/**
 * @description 模板编译方法
 * @author Echi
 * @date 2019-05-21
 * @param {HTMLElement} el
 * @param {EVue} vm
 */
function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init() {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log("Dom元素不存在");
        }
    },
    nodeToFragment(el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    compileElement(el) {
        let childNodes = el.childNodes;
        [].slice.call(childNodes).forEach(node => {
            let reg = /\{\{(.*)\}\}/; // 匹配{{ ... }}
            let text = node.textContent;
            if (this.isElementNode(node)) {
                this.compile(node);
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1]);
            }
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        });
    },
    compile(node) {
        let nodeAttrs = node.attributes;
        Array.prototype.forEach.call(nodeAttrs, attr => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                let exp = attr.value;
                // 将自定义指令分离 v-
                let [, dir] = attrName.split("-");
                if (this.isEventDirective(dir)) {
                    // 事件指令
                    this.compileEvent(node, this.vm, exp, dir);
                } else {
                    // v-model 指令
                    this.compileModel(node, this.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    },
    compileText(node, exp) {
        let initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, value => {
            this.updateText(node, value);
        });
    },
    compileEvent(node, vm, exp, dir) {
        let [, eventType] = dir.split(":");
        let cb = vm.$methods && vm.$methods[exp];
        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    compileModel(node, vm, exp, dir) {
        let val = vm[exp];
        this.modelUpdater(node, val);
        new Watcher(vm, exp, value => {
            this.modelUpdater(node, value);
        });
        node.addEventListener("input", e => {
            let newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            vm[exp] = newValue;
            val = newValue;
        });
    },
    updateText(node, value) {
        node.textContent = typeof value == "undefined" ? "" : value;
    },
    modelUpdater(node, value, oldValue) {
        node.value = typeof value == "undefined" ? "" : value;
    },
    isDirective(attr) {
        return attr.indexOf("v-") == 0;
    },
    isEventDirective(dir) {
        return dir.indexOf("on:") === 0;
    },
    isElementNode(node) {
        return node.nodeType == 1;
    },
    isTextNode(node) {
        return node.nodeType == 3;
    }
};
