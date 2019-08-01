#!/usr/bin/env node
             
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');             
const {request:t} = https;
const {request:u} = http;
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
  }).filter(d => d.trim()).map(d => b ? d.replace(E, (f, h) => f.replace(h, h.replace(J, "~"))) : d).join("\n");
};
function L(a, b, c = !1) {
  return function(e) {
    var d = C(arguments), {stack:f} = Error();
    const h = A(f, 2, !0), l = (f = e instanceof Error) ? e.message : e;
    d = [`Error: ${l}`, ...null !== d && a === d || c ? [b] : [h, b]].join("\n");
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
    const {binary:b = !1, rs:c = null, ...e} = a || {}, {a:d = M(!0), proxyError:f} = a || {}, h = (l, n) => d(n);
    super(e);
    this.b = [];
    this.g = new Promise((l, n) => {
      this.on("finish", () => {
        let g;
        b ? g = Buffer.concat(this.b) : g = this.b.join("");
        l(g);
        this.b = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          h`${g}`;
        } else {
          const r = K(g.stack);
          g.stack = r;
          f && h`${g}`;
        }
        n(g);
      });
      c && P(this, c).pipe(this);
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
const R = async(a, b = {}) => {
  ({c:a} = new Q({rs:a, ...b, a:M(!0)}));
  return await a;
};
const {createGunzip:S} = zlib;
const T = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, U = (a, b, c = {}) => {
  const {justHeaders:e, binary:d, a:f = M(!0)} = c;
  let h, l, n, g, r = 0, v = 0;
  c = (new Promise((x, y) => {
    h = a(b, async k => {
      ({headers:l} = k);
      const {statusMessage:p, statusCode:q} = k;
      n = {statusMessage:p, statusCode:q};
      if (e) {
        k.destroy();
      } else {
        var m = T(k);
        k.on("data", z => r += z.byteLength);
        k = m ? k.pipe(S()) : k;
        g = await R(k, {binary:d});
        v = g.length;
      }
      x();
    }).on("error", k => {
      k = f(k);
      y(k);
    }).on("timeout", () => {
      h.abort();
    });
  })).then(() => ({body:g, headers:l, ...n, h:r, byteLength:v, f:null}));
  return {i:h, c};
};
const V = (a = {}) => Object.keys(a).reduce((b, c) => {
  const e = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(e)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), W = async(a, b, {data:c, justHeaders:e, binary:d, a:f = M(!0)}) => {
  const {i:h, c:l} = U(a, b, {justHeaders:e, binary:d, a:f});
  h.end(c);
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
const aa = w("aqt"), Y = async(a, b = {}) => {
  const {data:c, type:e = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${X}`}, compress:f = !0, binary:h = !1, justHeaders:l = !1, method:n, timeout:g} = b;
  b = M(!0);
  const {hostname:r, protocol:v, port:x, path:y} = N(a), k = "https:" === v ? t : u, p = {hostname:r, port:x, path:y, headers:{...d}, timeout:g, method:n};
  if (c) {
    var q = e;
    var m = c;
    switch(q) {
      case "json":
        m = JSON.stringify(m);
        q = "application/json";
        break;
      case "form":
        m = V(m), q = "application/x-www-form-urlencoded";
    }
    m = {data:m, contentType:q};
    ({data:q} = m);
    ({contentType:m} = m);
    p.method = n || "POST";
    "Content-Type" in p.headers || (p.headers["Content-Type"] = m);
    "Content-Length" in p.headers || (p.headers["Content-Length"] = Buffer.byteLength(q));
  }
  !f || "Accept-Encoding" in p.headers || (p.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:z, headers:ba, byteLength:F, statusCode:ca, statusMessage:da, h:G, f:H} = await W(k, p, {data:q, justHeaders:l, binary:h, a:b});
  aa("%s %s B%s", a, F, `${F != G ? ` (raw ${G} B)` : ""}`);
  return {body:H ? H : z, headers:ba, statusCode:ca, statusMessage:da};
};
async function Z(a, b, c = {}) {
  {
    const {headers:e = {}, ...d} = c;
    c = {...d, headers:{...a.headers, ...e, Cookie:a.Cookie}};
  }
  b = await Y(a.host ? `${a.host}${b}` : b, c);
  ({headers:c} = b);
  a.cookies = ea(a.cookies, c);
  return b;
}
class fa {
  constructor(a = {}) {
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
    this.cookies = {};
  }
  async rqt(a, b = {}) {
    ({body:a} = await Z(this, a, b));
    return a;
  }
  async bqt(a, b = {}) {
    ({body:a} = await Z(this, a, {...b, binary:!0}));
    return a;
  }
  async jqt(a, b = {}) {
    ({body:a} = await Z(this, a, b));
    return a;
  }
  async aqt(a, b = {}) {
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
  const c = {...a, ...b};
  return Object.keys(c).reduce((e, d) => {
    const f = c[d];
    return f ? {...e, [d]:f} : e;
  }, {});
}, ia = ({"set-cookie":a = []} = {}) => a.reduce((b, c) => {
  {
    const e = /^(.+?)=(.*?);/.exec(c);
    if (!e) {
      throw Error(`Could not extract a cookie from ${c}`);
    }
    const [, d, f] = e;
    c = {[d]:f};
  }
  return {...b, ...c};
}, {});
module.exports = {_rqt:async(a, b = {}) => {
  ({body:a} = await Y(a, b));
  return a;
}, _aqt:Y, _bqt:async(a, b) => {
  ({body:a} = await Y(a, {...b, binary:!0}));
  return a;
}, _jqt:async(a, b = {}) => {
  ({body:a} = await Y(a, b));
  return a;
}, _Session:fa};


//# sourceMappingURL=rqt.js.map