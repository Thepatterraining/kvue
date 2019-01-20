class KVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data() || {}
        this.proxyDatas()
        this.$methods = options.methods || {}
        this.$name = options.name
        this.$el = options.el
        this.$dom = document.querySelector(this.$el)
        this.$template = options.template
        if (this.$template) {
            this.temp()
        }

        //监听数据
        this.$observe = new Observe(this.$data)

        //编译 
        this.$compile = new Compile(this.$dom, this)
    }

    temp() {
        this.$dom.innerHTML =this.$template
    }

    proxyDatas() {
        Object.keys(this.$data).forEach(k => {
            Object.defineProperty(this, k, {
                get() {
                    return this.$data[k]
                },
                set(newValue) {
                    this.$data[k] = newValue
                }
            })
        })
    }
}

class Observe {
    constructor(data) {
        Object.keys(data).forEach((k) => {
            this.defineReactive(data, k, data[k])
        })
    }


    defineReactive(data, key, value) {
        const dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,    // 可枚举
            configurable: true,  // 可配置
            get() {
                Dep.target && dep.addDep(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue !== value) {
                    value = newValue

                    //数据更新了，通知dep
                    dep.notify()
                }
                
            }
        })
    }
}

class Dep {
    constructor() {
        this.deps = []
    }

    addDep(dep) {
        this.deps.push(dep)
        console.log(this.deps)
    }

    notify() {
        this.deps.map((watcher) => {
            watcher.update()
        })
    }
}

class Watcher {
    constructor(vm, key, cb) {
        this.$vm = vm
        this.$cb = cb
        this.$key = key

        Dep.target = this
        this.$vm[this.$key]
        Dep.target = null
    }

    update() {
        //调用 updater 去更新视图
        console.log('更新试图')
        this.$cb.call(this.$vm, this.$vm[this.$key])
    }
}