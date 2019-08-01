#!/usr/bin/env node
             
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');             
const {request:u} = https;
const {request:v} = http;
const {debuglog:w} = util;
const A = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, B = (a, b = !1) => A(a, 2 + (b ? 1 : 0)), C = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:D} = os;
const E = /\s+at.*(?:\(|\s)(.*)\)?/, I = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, J = D(), K = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(I.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(E);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(E, (f, k) => f.replace(k, k.replace(J, "~"))) : d).join("\n");
};
function L(a, b, c = !1) {
  return function(e) {
    var d = C(arguments), {stack:f} = Error();
    const k = A(f, 2, !0), l = (f = e instanceof Error) ? e.message : e;
    d = [`Error: ${l}`, ...null !== d && a === d || c ? [b] : [k, b]].join("\n");
    d = K(d);
    return Object.assign(f ? e : Error(), {message:l, stack:d});
  };
}
;function M(a) {
  var {stack:b} = Error();
  const c = C(arguments);
  b = B(b, a);
  return L(c, b, a);
}
;const {parse:N} = url;
const {Writable:O} = stream;
const P = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Q extends O {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const e = void 0 === b.binary ? !1 : b.binary, d = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {a:f = M(!0), proxyError:k} = a || {}, l = (n, q) => f(q);
    super(b);
    this.b = [];
    this.g = new Promise((n, q) => {
      this.on("finish", () => {
        let g;
        e ? g = Buffer.concat(this.b) : g = this.b.join("");
        n(g);
        this.b = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          l`${g}`;
        } else {
          const t = K(g.stack);
          g.stack = t;
          k && l`${g}`;
        }
        q(g);
      });
      d && P(this, d).pipe(this);
    });
  }
  _write(a, b, c) {
    this.b.push(a);
    c();
  }
  get c() {
    return this.g;
  }
}
const R = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({c:a} = new Q(Object.assign({}, {rs:a}, b, {a:M(!0)})));
  return await a;
};
const {createGunzip:S} = zlib;
const T = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, U = (a, b, c) => {
  c = void 0 === c ? {} : c;
  const {justHeaders:e, binary:d, a:f = M(!0)} = c;
  let k, l, n, q, g = 0, t = 0;
  c = (new Promise((x, y) => {
    k = a(b, async h => {
      ({headers:l} = h);
      const {statusMessage:p, statusCode:r} = h;
      n = {statusMessage:p, statusCode:r};
      if (e) {
        h.destroy();
      } else {
        var m = T(h);
        h.on("data", z => g += z.byteLength);
        h = m ? h.pipe(S()) : h;
        q = await R(h, {binary:d});
        t = q.length;
      }
      x();
    }).on("error", h => {
      h = f(h);
      y(h);
    }).on("timeout", () => {
      k.abort();
    });
  })).then(() => Object.assign({}, {body:q, headers:l}, n, {h:g, byteLength:t, f:null}));
  return {i:k, c};
};
const V = (a = {}) => Object.keys(a).reduce((b, c) => {
  const e = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(e)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), W = async(a, b, {data:c, justHeaders:e, binary:d, a:f = M(!0)}) => {
  const {i:k, c:l} = U(a, b, {justHeaders:e, binary:d, a:f});
  k.end(c);
  a = await l;
  ({"content-type":b = ""} = a.headers);
  if ((b = b.startsWith("application/json")) && a.body) {
    try {
      a.f = JSON.parse(a.body);
    } catch (n) {
      throw f = f(n), f.response = a.body, f;
    }
  }
  return a;
};
let X;
try {
  const {version:a, name:b} = require("../package.json");
  X = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  X = "@aqt/rqt";
}
const aa = w("aqt"), Y = async(a, b) => {
  b = void 0 === b ? {} : b;
  const {data:c, type:e = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${X}`}, compress:f = !0, binary:k = !1, justHeaders:l = !1, method:n, timeout:q} = b;
  b = M(!0);
  const {hostname:g, protocol:t, port:x, path:y} = N(a), h = "https:" === t ? u : v, p = {hostname:g, port:x, path:y, headers:Object.assign({}, d), timeout:q, method:n};
  if (c) {
    var r = e;
    var m = c;
    switch(r) {
      case "json":
        m = JSON.stringify(m);
        r = "application/json";
        break;
      case "form":
        m = V(m), r = "application/x-www-form-urlencoded";
    }
    m = {data:m, contentType:r};
    ({data:r} = m);
    ({contentType:m} = m);
    p.method = n || "POST";
    "Content-Type" in p.headers || (p.headers["Content-Type"] = m);
    "Content-Length" in p.headers || (p.headers["Content-Length"] = Buffer.byteLength(r));
  }
  !f || "Accept-Encoding" in p.headers || (p.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:z, headers:ba, byteLength:F, statusCode:ca, statusMessage:da, h:G, f:H} = await W(h, p, {data:r, justHeaders:l, binary:k, a:b});
  aa("%s %s B%s", a, F, `${F != G ? ` (raw ${G} B)` : ""}`);
  return {body:H ? H : z, headers:ba, statusCode:ca, statusMessage:da};
};
async function Z(a, b, c) {
  c = void 0 === c ? {} : c;
  b = a.host ? `${a.host}${b}` : b;
  var e = a.headers;
  var d = c;
  c = a.Cookie;
  var f = Object.assign({}, d);
  d = void 0 === d.headers ? {} : d.headers;
  f = (delete f.headers, f);
  e = Object.assign({}, f, {headers:Object.assign({}, e, d, {Cookie:c})});
  b = await Y(b, e);
  ({headers:e} = b);
  a.cookies = ea(a.cookies, e);
  return b;
}
class fa {
  constructor(a) {
    a = void 0 === a ? {} : a;
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
    this.cookies = {};
  }
  async rqt(a, b) {
    b = void 0 === b ? {} : b;
    ({body:a} = await Z(this, a, b));
    return a;
  }
  async bqt(a, b) {
    b = void 0 === b ? {} : b;
    ({body:a} = await Z(this, a, Object.assign({}, b, {binary:!0})));
    return a;
  }
  async jqt(a, b) {
    b = void 0 === b ? {} : b;
    ({body:a} = await Z(this, a, b));
    return a;
  }
  async aqt(a, b) {
    b = void 0 === b ? {} : b;
    return await Z(this, a, b);
  }
  get Cookie() {
    return ha(this.cookies);
  }
}
const ha = a => Object.keys(a).reduce((b, c) => {
  c = `${c}=${a[c]}`;
  return [...b, c];
}, []).join("; "), ea = (a, b) => {
  b = ia(b);
  const c = Object.assign({}, a, b);
  return Object.keys(c).reduce((e, d) => {
    const f = c[d];
    return f ? Object.assign({}, e, {[d]:f}) : e;
  }, {});
}, ia = a => {
  ({"set-cookie":a = []} = void 0 === a ? {} : a);
  return a.reduce((b, c) => {
    {
      const e = /^(.+?)=(.*?);/.exec(c);
      if (!e) {
        throw Error(`Could not extract a cookie from ${c}`);
      }
      const [, d, f] = e;
      c = {[d]:f};
    }
    return Object.assign({}, b, c);
  }, {});
};
module.exports = {_rqt:async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await Y(a, b));
  return a;
}, _aqt:Y, _bqt:async(a, b) => {
  b = Object.assign({}, b, {binary:!0});
  ({body:a} = await Y(a, b));
  return a;
}, _jqt:async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await Y(a, b));
  return a;
}, _Session:fa};


//# sourceMappingURL=rqt.js.map