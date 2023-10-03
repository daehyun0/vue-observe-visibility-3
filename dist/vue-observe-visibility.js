function d(e) {
  let i;
  return typeof e == "function" ? i = {
    callback: e
  } : i = e, i;
}
function p(e, i, r = {}) {
  let t, s, n;
  const l = (o, ...a) => {
    if (n = a, t && o === s)
      return;
    let c = r.leading;
    typeof c == "function" && (c = c(o, s)), (!t || o !== s) && c && e(o, ...n), s = o, clearTimeout(t), t = setTimeout(() => {
      e(o, ...n), t = 0;
    }, i);
  };
  return l._clear = () => {
    clearTimeout(t), t = null;
  }, l;
}
function f(e, i) {
  if (e === i)
    return !0;
  if (typeof e == "object") {
    for (const r in e)
      if (!f(e[r], i[r]))
        return !1;
    return !0;
  }
  return !1;
}
class v {
  constructor(i, r, t) {
    this.el = i, this.observer = null, this.frozen = !1, this.createObserver(r, t);
  }
  get threshold() {
    return this.options.intersection && typeof this.options.intersection.threshold == "number" ? this.options.intersection.threshold : 0;
  }
  createObserver(i, r) {
    if (this.observer && this.destroyObserver(), !this.frozen) {
      if (this.options = d(i), this.callback = (t, s) => {
        this.options.callback(t, s), t && this.options.once && (this.frozen = !0, this.destroyObserver());
      }, this.callback && this.options.throttle) {
        const { leading: t } = this.options.throttleOptions || {};
        this.callback = p(this.callback, this.options.throttle, {
          leading: (s) => t === "both" || t === "visible" && s || t === "hidden" && !s
        });
      }
      this.oldResult = void 0, this.observer = new IntersectionObserver((t) => {
        let s = t[0];
        if (t.length > 1) {
          const n = t.find((l) => l.isIntersecting);
          n && (s = n);
        }
        if (this.callback) {
          const n = s.isIntersecting && s.intersectionRatio >= this.threshold;
          if (n === this.oldResult)
            return;
          this.oldResult = n, this.callback(n, s);
        }
      }, this.options.intersection), r.context.$nextTick(() => {
        this.observer && this.observer.observe(this.el);
      });
    }
  }
  destroyObserver() {
    this.observer && (this.observer.disconnect(), this.observer = null), this.callback && this.callback._clear && (this.callback._clear(), this.callback = null);
  }
}
function u(e, { value: i }, r) {
  if (i)
    if (typeof IntersectionObserver > "u")
      console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill");
    else {
      const t = new v(e, i, r);
      e._vue_visibilityState = t;
    }
}
function y(e, { value: i, oldValue: r }, t) {
  if (f(i, r))
    return;
  const s = e._vue_visibilityState;
  if (!i) {
    b(e);
    return;
  }
  s ? s.createObserver(i, t) : u(e, { value: i }, t);
}
function b(e) {
  const i = e._vue_visibilityState;
  i && (i.destroyObserver(), delete e._vue_visibilityState);
}
const O = {
  bind: u,
  update: y,
  unbind: b
};
function g(e) {
  e.directive("observe-visibility", O);
}
const k = {
  // eslint-disable-next-line no-undef
  version: VERSION,
  install: g
};
let h = null;
typeof window < "u" ? h = window.Vue : typeof global < "u" && (h = global.Vue);
h && h.use(k);
export {
  O as ObserveVisibility,
  k as default,
  g as install
};
