/*!
 * dc-lite.js — рантайм шаблонов «Антикризисного радара».
 * Без зависимостей. Поддерживает:
 *   {{path.to.value}}                      — подстановка значений в текст и атрибуты
 *   <template data-dc="for" list as>        — цикл
 *   <template data-dc="if" value>           — условие
 *   <template data-dc="import" name ...>    — вложенный компонент (боковое меню, таб-бар)
 *   onClick / onChange / onSubmit / onPointerDown ... = "{{fn}}"  — события
 *   ref="{{fn}}"                            — доступ к DOM-элементу
 * Компонент: class Component extends DCLogic { constructor, renderVals, componentDidMount, componentWillUnmount }
 * Перерисовка — через setState, с минимальным патчем DOM (анимации и фокус не сбрасываются).
 */
(function () {
  'use strict';

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var SINGLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  // ---------- базовый класс ----------
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (u) {
    if (typeof u === 'function') u = u(this.state, this.props);
    if (!u) return;
    this.state = Object.assign({}, this.state, u);
    if (this.__root) this.__root.schedule();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__root) this.__root.schedule(); };
  DCLogic.prototype.renderVals = function () { return {}; };

  // ---------- компиляция шаблона ----------
  var uid = 0;
  function compileValue(str) {
    var m = SINGLE.exec(str);
    if (m) return { single: m[1] };
    if (str.indexOf('{{') < 0) return { lit: str };
    var parts = [], last = 0, r;
    HOLE.lastIndex = 0;
    while ((r = HOLE.exec(str))) {
      if (r.index > last) parts.push(str.slice(last, r.index));
      parts.push({ e: r[1] });
      last = HOLE.lastIndex;
    }
    if (last < str.length) parts.push(str.slice(last));
    return { parts: parts };
  }

  function kidsOf(node) {
    // HTML <template> хранит детей в .content, SVG-шаблон — в childNodes
    return node.content ? node.content.childNodes : node.childNodes;
  }

  function compileNodes(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var c = compileNode(list[i]);
      if (c) out.push(c);
    }
    return out;
  }

  function compileNode(n) {
    if (n.nodeType === 3) {
      if (!n.data) return null;
      return { k: 'text', v: compileValue(n.data) };
    }
    if (n.nodeType !== 1) return null;
    var tag = n.localName, kind = n.getAttribute && n.getAttribute('data-dc');
    if (tag === 'template' && kind) {
      var a = {};
      for (var i = 0; i < n.attributes.length; i++) {
        var at = n.attributes[i];
        if (at.name === 'data-dc' || at.name.indexOf('hint-') === 0) continue;
        a[at.name] = compileValue(at.value);
      }
      return { k: kind, a: a, kids: compileNodes(kidsOf(n)), id: ++uid };
    }
    var attrs = [], on = [], ref = null;
    for (var j = 0; j < n.attributes.length; j++) {
      var att = n.attributes[j], name = att.name, low = name.toLowerCase();
      if (low.indexOf('hint-') === 0) continue;
      var cv = compileValue(att.value);
      if (low === 'ref' && cv.single) { ref = cv.single; continue; }
      if (low.length > 2 && low.indexOf('on') === 0 && cv.single) {
        var ev = low.slice(2);
        if (ev === 'change' && (tag === 'input' || tag === 'textarea')) ev = 'input'; // как onChange в React
        on.push([ev, cv.single]);
        continue;
      }
      attrs.push([name, cv]);
    }
    return { k: 'el', tag: tag, ns: n.namespaceURI, attrs: attrs, on: on, ref: ref, kids: compileNodes(kidsOf(n)) };
  }

  // ---------- вычисление значений ----------
  function lookup(expr, scope) {
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return +expr;
    var p = expr.split('.'), v = scope[p[0]];
    for (var i = 1; i < p.length && v != null; i++) v = v[p[i]];
    return v;
  }
  function str(v) { return v == null || v === false ? '' : String(v); }
  function evalValue(cv, scope) {
    if (cv.lit !== undefined) return cv.lit;
    if (cv.single) return lookup(cv.single, scope);
    var s = '';
    for (var i = 0; i < cv.parts.length; i++) {
      var p = cv.parts[i];
      s += typeof p === 'string' ? p : str(lookup(p.e, scope));
    }
    return s;
  }

  // ---------- построение виртуального дерева ----------
  function build(nodes, scope, ctx, out) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.k === 'text') { out.push({ t: str(evalValue(n.v, scope)) }); continue; }
      if (n.k === 'if') {
        if (n.a.value && evalValue(n.a.value, scope)) build(n.kids, scope, ctx, out);
        continue;
      }
      if (n.k === 'for') {
        var list = n.a.list ? evalValue(n.a.list, scope) : null;
        var as = n.a.as ? n.a.as.lit : 'item';
        if (list && list.length) {
          for (var j = 0; j < list.length; j++) {
            var sc = Object.create(scope);
            sc[as] = list[j];
            sc[as + 'Index'] = j;
            build(n.kids, sc, ctx, out);
          }
        }
        continue;
      }
      if (n.k === 'import') {
        out.push(ctx.importComp(n, scope));
        continue;
      }
      var attrs = {}, on = {};
      for (var a = 0; a < n.attrs.length; a++) {
        var v = evalValue(n.attrs[a][1], scope);
        if (v === false || v == null) continue;
        attrs[n.attrs[a][0]] = v === true ? '' : String(v);
      }
      for (var e = 0; e < n.on.length; e++) {
        var fn = lookup(n.on[e][1], scope);
        if (typeof fn === 'function') on[n.on[e][0]] = fn;
      }
      var ref = n.ref ? lookup(n.ref, scope) : null;
      var kids = [];
      build(n.kids, scope, ctx, kids);
      out.push({ tag: n.tag, ns: n.ns, attrs: attrs, on: on, ref: typeof ref === 'function' ? ref : null, kids: kids });
    }
    return out;
  }

  // ---------- патч реального DOM ----------
  function handler(e) {
    var f = this.__on && this.__on[e.type];
    if (f) return f.call(this, e);
  }
  function setAttr(el, k, v) {
    if (k === 'value' && 'value' in el) { if (el.value !== v) el.value = v; }
    if (k === 'checked' && 'checked' in el) el.checked = true;
    try { el.setAttribute(k, v); } catch (err) { /* недопустимое имя — пропускаем */ }
  }
  function applyEl(el, v, refs) {
    var prev = el.__a || {};
    for (var k in v.attrs) if (prev[k] !== v.attrs[k]) setAttr(el, k, v.attrs[k]);
    for (var p in prev) if (!(p in v.attrs)) {
      el.removeAttribute(p);
      if (p === 'checked' && 'checked' in el) el.checked = false;
    }
    el.__a = v.attrs;
    el.__on = v.on;
    var t = el.__ont || (el.__ont = {});
    for (var ev in v.on) if (!t[ev]) { el.addEventListener(ev, handler); t[ev] = 1; }
    if (v.ref) refs.push([v.ref, el]);
    morph(el, v.kids, refs);
  }
  function create(v, refs) {
    if (v.t !== undefined) return document.createTextNode(v.t);
    var el = v.ns && v.ns !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(v.ns, v.tag) : document.createElement(v.tag);
    applyEl(el, v, refs);
    return el;
  }
  function same(d, v) {
    if (v.t !== undefined) return d.nodeType === 3;
    return d.nodeType === 1 && d.localName === v.tag && d.namespaceURI === (v.ns || d.namespaceURI);
  }
  function morph(parent, vk, refs) {
    var dk = parent.childNodes, i;
    for (i = 0; i < vk.length; i++) {
      var v = vk[i], d = dk[i];
      if (!d) { parent.appendChild(create(v, refs)); continue; }
      if (same(d, v)) {
        if (v.t !== undefined) { if (d.data !== v.t) d.data = v.t; }
        else applyEl(d, v, refs);
      } else parent.replaceChild(create(v, refs), d);
    }
    while (dk.length > vk.length) parent.removeChild(parent.lastChild);
  }

  // ---------- реестр компонентов и монтирование ----------
  var registry = {};
  function tplFrom(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return compileNodes(t.content.childNodes);
  }
  function defaultsOf(d) {
    var o = {};
    for (var k in (d || {})) if (k.charAt(0) !== '$' && d[k] && 'default' in d[k]) o[k] = d[k]['default'];
    return o;
  }

  function Root(comp, tpl, mountEl) {
    var self = this;
    this.el = mountEl;
    this.children = {};
    this.pendingMount = [];
    this.queued = false;
    this.schedule = function () {
      if (self.queued) return;
      self.queued = true;
      (window.requestAnimationFrame || setTimeout)(function () { self.queued = false; self.render(); });
    };
    this.root = this.instantiate(comp, {});
    this.tpl = tpl;
  }
  Root.prototype.instantiate = function (comp, props) {
    var inst = new comp.Cls(Object.assign({}, comp.defaults, props));
    if (!inst.state) inst.state = {};
    inst.__root = this;
    this.pendingMount.push(inst);
    return inst;
  };
  Root.prototype.render = function () {
    var self = this, seen = {}, count = {};
    var ctx = {
      importComp: function (n, scope) {
        var name = n.a.name ? evalValue(n.a.name, scope) : '';
        var comp = registry[name];
        if (!comp) { console.warn('[dc] нет компонента', name); return { t: '' }; }
        count[n.id] = (count[n.id] || 0) + 1;
        var key = n.id + ':' + count[n.id];
        var props = {};
        for (var k in n.a) if (k !== 'name') props[k] = evalValue(n.a[k], scope);
        var inst = self.children[key];
        if (!inst || inst.__comp !== comp) {
          inst = self.instantiate(comp, props);
          inst.__comp = comp;
          self.children[key] = inst;
        } else inst.props = Object.assign({}, comp.defaults, props);
        seen[key] = 1;
        var vals = safeVals(inst, name), kids = [];
        build(comp.tpl, vals, ctx, kids);
        return { tag: 'dc-import', ns: 'http://www.w3.org/1999/xhtml', attrs: { 'data-name': name }, on: {}, ref: null, kids: kids };
      }
    };
    var vals = safeVals(this.root, 'page'), vk = [], refs = [];
    build(this.tpl, vals, ctx, vk);
    morph(this.el, vk, refs);
    for (var key in this.children) if (!seen[key]) {
      var gone = this.children[key];
      if (gone.componentWillUnmount) try { gone.componentWillUnmount(); } catch (e) { console.error(e); }
      delete this.children[key];
    }
    refs.forEach(function (r) { try { r[0](r[1]); } catch (e) { console.error(e); } });
    var pm = this.pendingMount; this.pendingMount = [];
    pm.forEach(function (inst) { if (inst.componentDidMount) try { inst.componentDidMount(); } catch (e) { console.error(e); } });
  };
  function safeVals(inst, name) {
    try { return inst.renderVals() || {}; }
    catch (e) { console.error('[dc] ошибка в renderVals компонента ' + name, e); return {}; }
  }

  var DC = {
    DCLogic: DCLogic,
    // Регистрация вложенного компонента: шаблон строкой + фабрика класса
    component: function (name, html, factory, propsDef) {
      registry[name] = { tpl: tplFrom(html), Cls: factory(DCLogic), defaults: defaultsOf(propsDef) };
    },
    // Монтирование страницы: шаблон берётся из <template id="dc-root">
    page: function (factory, propsDef) {
      var start = function () {
        var t = document.getElementById('dc-root'), mount = document.getElementById('dc-app');
        var comp = { Cls: factory(DCLogic), defaults: defaultsOf(propsDef) };
        var r = new Root(comp, compileNodes(t.content.childNodes), mount);
        r.render();
        window.addEventListener('pagehide', function () {
          var all = [r.root]; for (var k in r.children) all.push(r.children[k]);
          all.forEach(function (i) { if (i.componentWillUnmount) try { i.componentWillUnmount(); } catch (e) {} });
        });
      };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
    }
  };

  var st = document.createElement('style');
  st.textContent = 'dc-import{display:contents}';
  (document.head || document.documentElement).appendChild(st);

  window.DC = DC;
  window.DCLogic = DCLogic;
})();
