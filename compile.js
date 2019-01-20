class Compile {
    /**
     * 
     * @param {string} el 元素选择器
     * @param {Object} vm vue实例
     */
    constructor(dom, vm) {
        this.$vm = vm
        //获取dom 元素
        this.$el = dom
        console.log(this.$el)

        if (this.$el) {
            //把这个节点转换成 fragment
            this.$fragment = this.node2fragment()

            //编译
            this.compile(this.$fragment)

            //显示到页面上面
            console.log(this.$el)
            this.$el.appendChild(this.$fragment)
        }
    }

    node2fragment() {
        let fragment = document.createDocumentFragment()

        //把这个节点添加到fragment
        console.log(fragment)
        while (this.$el.firstChild) {
            fragment.appendChild(this.$el.firstChild)
            console.log(fragment)
        }
        
        return fragment
    }

    compile(node) {
        const childNodes = node.childNodes
        console.log(node)
        console.log('编译',childNodes)
        Array.from(childNodes).map(node => {
            console.log(node)
            //匹配类型
            if (this.isElementType(node)) {
                //元素节点
                console.log(node)
                this.compileElement(node)
            } else if (this.isTextType(node)) {
                //文本节点
                console.log(RegExp.$1)
                this.text(node, RegExp.$1)
            }
        })

    }

    isElementType(node) {
        return node.nodeType == 1
    }

    compileElement(element) {
        const attrs = element.attributes
        Object.values(attrs).forEach((attr) => {
            console.log(attr)
            let attrName = attr.name
            let attrValue = attr.value
            if (this.isDirective(attrName)) {
                //指令
                let dir = attrName.substr(2)
                console.log(dir)
                this[dir] && this[dir](element, attrValue)
            } else if (this.isEvent(attrName)) {
                //事件
                let event = attrName.substr(1)
                console.log(event)
                this.eventHandle(element, event, attrValue)
            } else {
                console.log(11)
            }
        })

        this.compile(element)
    }

    isDirective(name) {
        console.log(name)
        return name.indexOf('k-') == 0
    }

    isEvent(name) {
        return name.indexOf('@') == 0
    }

    isTextType(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    text(text, exp) {
        this.update(text, exp, 'text')
    }

    model(node, exp) {
        this.update(node, exp, 'model')

        node.addEventListener('input', (e) => {
            this.$vm[exp] = e.target.value
        })
    }

    update(node, exp, type) {
        const updater = new Updater()
        let fn = updater[type + 'Update']
        fn && fn(node, this.$vm[exp])
        const watcher = new Watcher(this.$vm, exp, (value) => {
            fn && fn(node, value)
        })
    }

    eventHandle(node, event, fnName) {
        if (event && this.$vm.$methods[fnName]) {
            node.addEventListener(event, this.$vm.$methods[fnName].bind(this.$vm))
        }
    }
}

class Updater {
    constructor() {

    }

    textUpdate(node, value) {
        console.log(node)
        node.textContent = value
    }

    modelUpdate(node, value) {
        console.log(node)
        node.value = value
    }
}