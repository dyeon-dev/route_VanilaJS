// Component //
export class Component {
    constructor(payload = {}) {
        const { tagName = 'div', state = {}, props ={} } = payload
        this.el = document.createElement(tagName)
        this.state = state
        this.props = props
        this.render()
    }
    render() {

    }
}

// Router //
function routeRender(routes) {
    if (!location.hash) {
        history.replaceState(null, '', '/#/')
    }
    const routerView = document.querySelector('router-view')
    // #/about
    const [hash, queryString = ''] = location.hash.split('?')

    // a=123&b=456
    // ['a=123', 'b=456']
    // { a: '123', b: '456' }
    const query = queryString
    .split('&')
    .reduce((acc, cur) => {
        const [key, value] = cur.split('=')
        acc[key] = value
        return acc
    }, {})
    history.replaceState(query, '')

   const currentRoute = routes.find(route => new RegExp(`${route.path}/?$`).test(hash))
   routerView.innerHTML =''
   routerView.append(new currentRoute.component().el)

   window.scrollTo(0, 0)
}


export function createRouter(routes) {
    return function() {
        window.addEventListener('popstate', () => {
            routeRender(routes)
        })
        routeRender(routes)
    }
}

// Store //
export class Store {
    constructor(state) {
        this.state = {}
        this.observers = {}

        for (const key in state) {
            // state 객체데이터에 지정하는 key값 지정, 할당
            Object.defineProperty(this.state, key, {
                get: () => state[key], // state['message']
                set: val => {
                    state[key] = val // 변경된 데이터 갱신
                    this.observers[key].forEach(observer => observer(val)) // 콜백함수에 새로운 값이 들어오고 실행
                }               
            })
        }
    }
    // 구독을 통해 데이터 변경 감지(key: 데이터(message), cb:데이터 변경 시 실행할 함수)
    subscribe(key, cb) {
        // message: [cb1, cb2, ch3, ...]
        Array.isArray(this.observers[key])
            ? this.observers[key].push(cb)
            : this.observers[key] = [cb] // 콜백함수로 할당해서 저장
    }
}