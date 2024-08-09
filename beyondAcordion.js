export default class beyondAcordion {
    constructor(triggers, lists) {
        this.triggers = triggers
        this.lists = lists

        this.set()
        this.listen()
    }

    set() {
        this.lists.forEach((list, i) => {
            let reversedIndex = this.lists.length - i - 1
            let currentElement = this.lists[reversedIndex]
            let currentElementHeight = currentElement.clientHeight

            currentElement.setAttribute('defaultHeight', currentElementHeight)
            currentElement.style.height = 0
        })
    }

    listen() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                this.handleClick(trigger)
            })
        })
    }

    handleClick(trigger) {
        let targetID = 'subcategory_' + trigger.getAttribute('ui-target')
        let targetElement = document.querySelector(`[ui-list="${targetID}"]`)
        let targetParents = this.reverseRecursiveElementSelector(targetElement, 'ui-list')

        trigger.classList.toggle('cat_opened')

        if (trigger.classList.contains('cat_opened')) {
            this.open(targetElement, targetParents)
        } else {
            this.close(targetElement, targetParents)
        }
    }

    open(te, tp) {
        te.style.height = `${te.getAttribute('defaultHeight')}px`

        tp.forEach((p, i) => {
            let current = tp[tp.length - i - 1]
            current.style.height = 'auto'
            setTimeout(() => {
                current.setAttribute('height', current.clientHeight)
                current.style.height = `${current.getAttribute('height')}px`
            }, 500);
        })
    }

    async close(te, tp) {
        let wait = new Promise(resolve => {
            te.querySelectorAll('[ui-list]').forEach((li, i) => {
                let reversedIndex = te.querySelectorAll('[ui-list]').length - i - 1
                let current = te.querySelectorAll('[ui-list]')[reversedIndex]

                current.style.height = 0
            })

            te.querySelectorAll('.cat_opened').forEach(e => {
                e.classList.remove('cat_opened')
            })

            te.style.height = 0
            resolve()
        })

        await wait.then(() => {
            tp.forEach((p, i) => {
                let current = tp[tp.length - i - 1]
                current.style.height = 'auto'

                setTimeout(() => {
                    current.setAttribute('defaultHeight', current.clientHeight)
                    current.style.height = `${current.getAttribute('defaultHeight')}px`
                }, 500);
            })
        })
    }

    reverseRecursiveElementSelector(e, s) {
        let re = e
        let rs = s
        let parents = []

        function getParents(re, rs) {
            if (re.tagName.toLowerCase() == 'body') {
                return
            } else {
                if (re.parentNode.hasAttribute(rs)) {
                    parents.push(re.parentNode)
                }
                getParents(re.parentNode, rs)
            }
        }
        getParents(re, rs)

        return parents
    }
}