# Change Log

## TODO

- [ ] change to use one of usehooks-ts/react-use/usehooks (useLocalStorage, useInterval...etc)
- [ ] refactor all useEffect block between return(render) and other code blocks
- [ ] change login response with user data from backend
- [ ] ?add "userState.isCheckedCompleted" state for backend check?
- [ ] product list to "detail" sample
- [ ] remove swr
- [ ] refactor infinite scroll sample
- [x] admin(dashboard) sidebar page layout + landing layout
- [ ] add notify hook
- [ ] ?[react hook chat](https://fokayx.com/2019/08/31/react-hooks-chat-app.html.html)

---

## FIXME

- [x] 240206 use-cart-state test demo link bug
- [ ] 240206 landing layout bug
- [x] 240201 use-cart-state localstorage not sync bug
- [x] tutorial panel link google login bug

---

## ChangeLog

> `u`: change/update `f`:fixed `a`: add `rm`: remove `!`: notice

### 240510

### 240415

- (i) update npm packages(no update to latest)
- (u) "images.domains" configuration is deprecated. use "images.remotePatterns" instead.

### 240412

- (u) next.js to v14.1.4
- (a) sweetalert2

### 240328

- [x] add drawer for test menu
- [x] remove mega-menu
- [x] remove unauthorized photos and logo files(NIKE)
- (u) fixed landing-layout Navbar bug

### 231120

- (a) add infinite-scroll example for product
- (r) swr example remove

### 231110

- (u) refactor product list and query tutorial
- (a) product cart grid list & list with placeholder example
- (a) react-paginate

### 231101

- (a) swr
- (a) react-bootstrap
- (a) axios instance
- (rm) all example for session-cookie and only jwt
- (a) move branch to v1.1
- (u) upgrade next.js to v14
- (rm) ssl and fb-login example

### 2310~

- connent with useCart hook
- landing page layout
- user pages (register/ login / forget-password)
- product pages (list, detail)
- shopping cart pages
- breadcrumb
- menu active css auto apply
- megamenu sample component
- fix NextBreadCrumb has flush bug
- breadcrumb
- separate product list, detail, cart components

### 230624

- +react-icons
- -remove fontawesome icons npm module

### 230622

- ^next-breadcrumb use router.isReady to check if dynamic route path is ready
- +next-breadcrumb add bgClass prop for custom bg css class
- ^dropdown menu change expand behavor from click to hover
- ^tune apply all active menu css class(custom class)
- +menuitem hover slide in animation

### 230618

- ^next-breadcrumb +home icon and with chevron divider style(refs: [bs5 official example](https://getbootstrap.com/docs/5.3/examples/breadcrumbs/))

### 230617

- +chinese font family globally
- ^replace react-bootstrap navbar to pure bs5 navbar
- +breadcrumb with useRouter

### 230616

- +fontawesome icons
- +bootstrap icons
- ^[bugs] change `400.js` to `404.js`

### past

- +proxy in `next.config.js` need for test
- +`"plugin:import/recommended"`ready to change env/files
- add `baseUrl` into `jsconfig.json` to enable vscode auto-suggestion for absoule import as `import '@/styles/globals.css`
- !!eslint rule errors will break build
