// 公共工具：卡通材质、描边、贴图、发光、音效。统一挂在 window.PM 上给其他文件用。
(function () {
  'use strict';
  var T = THREE;
  var PM = window.PM = {};

  PM.$ = function (id) { return document.getElementById(id); };
  PM.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  PM.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  var seed = 7;
  PM.rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

  // ---------- 材质 ----------
  // 四段式明暗，做出手游常见的卡通渲染感
  var grad = new T.DataTexture(new Uint8Array([105, 170, 228, 255]), 4, 1, T.RedFormat);
  grad.minFilter = grad.magFilter = T.NearestFilter;
  grad.needsUpdate = true;

  PM.toon = function (color, o) {
    var p = { color: color, gradientMap: grad };
    if (o) for (var k in o) p[k] = o[k];
    return new T.MeshToonMaterial(p);
  };
  PM.basic = function (color, o) {
    var p = { color: color };
    if (o) for (var k in o) p[k] = o[k];
    return new T.MeshBasicMaterial(p);
  };

  // 描边：把同一个模型放大一圈、只画背面
  var olMat = new T.MeshBasicMaterial({ color: 0x151033, side: T.BackSide });
  var size = new T.Vector3();
  PM.outline = function (o, t) {
    var g = o.geometry;
    if (!g.boundingBox) g.computeBoundingBox();
    g.boundingBox.getSize(size);
    var k = new T.Mesh(g, olMat);
    k.scale.set(
      1 + 2 * t / Math.max(size.x * o.scale.x, 0.05),
      1 + 2 * t / Math.max(size.y * o.scale.y, 0.05),
      1 + 2 * t / Math.max(size.z * o.scale.z, 0.05));
    o.add(k);
    return o;
  };

  // ---------- 几何体简写 ----------
  PM.G = {
    box: function (w, h, d) { return new T.BoxGeometry(w, h, d); },
    sph: function (r, ws, hs) { return new T.SphereGeometry(r, ws || 16, hs || 12); },
    cyl: function (rt, rb, h, s) { return new T.CylinderGeometry(rt, rb, h, s || 12); },
    cone: function (r, h, s) { return new T.ConeGeometry(r, h, s || 12); },
    tor: function (r, t, rs, ts, arc) { return new T.TorusGeometry(r, t, rs || 8, ts || 20, arc || Math.PI * 2); },
    cap: function (r, l) { return new T.CapsuleGeometry(r, l, 4, 10); },
    ico: function (r) { return new T.IcosahedronGeometry(r, 0); },
    circ: function (r, s) { return new T.CircleGeometry(r, s || 20); }
  };

  // 放一个零件：父节点、几何体、材质、位置、旋转、缩放、是否描边
  PM.P = function (parent, geo, m, p, r, s, ol) {
    var o = new T.Mesh(geo, m);
    if (p) o.position.set(p[0], p[1], p[2]);
    if (r) o.rotation.set(r[0], r[1], r[2]);
    if (s) { if (typeof s === 'number') o.scale.setScalar(s); else o.scale.set(s[0], s[1], s[2]); }
    parent.add(o);
    if (ol) PM.outline(o, ol === true ? 0.035 : ol);
    return o;
  };

  // ---------- 贴图 ----------
  PM.canvasTex = function (px, draw) {
    var c = document.createElement('canvas');
    c.width = c.height = px;
    draw(c.getContext('2d'), px);
    var t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  };
  PM.glowTex = PM.canvasTex(64, function (x, s) {
    var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
  });
  PM.ringTex = PM.canvasTex(128, function (x, s) {
    x.strokeStyle = '#fff';
    x.lineWidth = 9;
    x.beginPath();
    x.arc(s / 2, s / 2, s / 2 - 8, 0, Math.PI * 2);
    x.stroke();
  });
  PM.spiralTex = PM.canvasTex(128, function (x, s) {
    x.fillStyle = '#f4ecff';
    x.beginPath();
    x.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = '#7a3fe0';
    x.lineWidth = 9;
    x.lineCap = 'round';
    x.beginPath();
    for (var a = 0; a < Math.PI * 5; a += 0.1) {
      var r = 4 + a * 3.3, px = s / 2 + Math.cos(a) * r, py = s / 2 + Math.sin(a) * r;
      if (a === 0) x.moveTo(px, py); else x.lineTo(px, py);
    }
    x.stroke();
  });
  PM.markTex = PM.canvasTex(64, function (x, s) {
    x.font = 'bold 54px sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.lineWidth = 7;
    x.strokeStyle = 'rgba(40,20,90,.9)';
    x.strokeText('?', s / 2, s / 2 + 3);
    x.fillStyle = '#fff';
    x.fillText('?', s / 2, s / 2 + 3);
  });

  // 发光小精灵（叠加混合）
  PM.glow = function (parent, color, scale, p, opacity, tex) {
    var sp = new T.Sprite(new T.SpriteMaterial({
      map: tex || PM.glowTex, color: color, transparent: true, opacity: opacity == null ? 1 : opacity,
      blending: T.AdditiveBlending, depthWrite: false
    }));
    sp.scale.setScalar(scale);
    if (p) sp.position.set(p[0], p[1], p[2]);
    parent.add(sp);
    return sp;
  };
  PM.shadow = function (parent, r) {
    var s = PM.P(parent, PM.G.circ(r, 24), PM.basic(0x05031a, { transparent: true, opacity: 0.38, depthWrite: false }), [0, 0.05, 0], [-Math.PI / 2, 0, 0]);
    return s;
  };

  // 受击闪白
  PM.flashWhite = function (g, ms) {
    var mats = [];
    g.traverse(function (o) {
      if (o.material && o.material.emissive && mats.indexOf(o.material) < 0) mats.push(o.material);
    });
    mats.forEach(function (m) {
      if (!m.userData.e) m.userData.e = { c: m.emissive.getHex(), i: m.emissiveIntensity };
      m.emissive.setHex(0xffffff);
      m.emissiveIntensity = 0.85;
    });
    setTimeout(function () {
      mats.forEach(function (m) { m.emissive.setHex(m.userData.e.c); m.emissiveIntensity = m.userData.e.i; });
    }, ms || 110);
  };

  // ---------- 音效（WebAudio 现场合成，不需要音频文件） ----------
  var AC = null, muted = false;
  try { muted = localStorage.getItem('pm-muted') === '1'; } catch (e) {}
  function ac() {
    if (muted) return null;
    try {
      if (!AC) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        AC = new C();
      }
      if (AC.state === 'suspended') AC.resume();
      return AC;
    } catch (e) { return null; }
  }
  function tone(f0, f1, dur, type, vol, delay) {
    var a = ac();
    if (!a) return;
    var t = a.currentTime + (delay || 0), o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  function noise(dur, vol) {
    var a = ac();
    if (!a) return;
    var n = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = a.createBufferSource(), g = a.createGain();
    s.buffer = buf;
    g.gain.value = vol;
    s.connect(g);
    g.connect(a.destination);
    s.start();
  }
  PM.sfx = {
    pick: function () { tone(620, 980, 0.09, 'triangle', 0.12); },
    cast: function () { tone(380, 1300, 0.3, 'sine', 0.1); },
    hit: function () { noise(0.16, 0.22); tone(190, 60, 0.22, 'square', 0.12); tone(880, 1320, 0.12, 'triangle', 0.1, 0.02); },
    miss: function () { tone(320, 130, 0.28, 'sawtooth', 0.08); },
    hurt: function () { noise(0.22, 0.2); tone(150, 48, 0.32, 'sawtooth', 0.13); },
    kill: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, 0.18, 'triangle', 0.13, i * 0.08); }); },
    win: function () { [523, 659, 784, 1047, 1319, 1568].forEach(function (f, i) { tone(f, 0, 0.26, 'triangle', 0.13, i * 0.11); }); },
    lose: function () { [392, 330, 262, 196].forEach(function (f, i) { tone(f, 0, 0.3, 'sine', 0.13, i * 0.16); }); }
  };
  PM.isMuted = function () { return muted; };
  PM.setMuted = function (v) {
    muted = !!v;
    try { localStorage.setItem('pm-muted', muted ? '1' : '0'); } catch (e) {}
  };
})();
