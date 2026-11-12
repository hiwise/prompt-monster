// 角色模型：主角「提示词法师」和三只怪物。全部用基础几何体拼出来，不依赖外部模型文件。
(function () {
  'use strict';
  var T = THREE, PM = window.PM, P = PM.P, G = PM.G, toon = PM.toon, basic = PM.basic;

  // ---------- 主角 ----------
  PM.buildHero = function () {
    var root = new T.Group();   // 位置
    var body = new T.Group();   // 朝向和弹跳
    root.add(body);
    var h = new T.Group();      // 模型本体（建模时正面朝 +z，这里转过来朝前进方向）
    h.rotation.y = Math.PI;
    h.scale.x = -1;             // 镜像：法杖放在远离战斗镜头的一侧，不挡脸
    body.add(h);
    PM.shadow(root, 0.72);

    var indigo = toon(0x4b3fc0), indigoD = toon(0x33298c),
      teal = toon(0x3fe6cf, { emissive: 0x1fb9a5, emissiveIntensity: 0.8 }),
      skin = toon(0xffd3ae), hair = toon(0x7b4424), orange = toon(0xff9d2e),
      leather = toon(0x6a4630), dark = toon(0x2a2550), gold = toon(0xf2c14e);

    // 靴子和腿
    var feet = [-1, 1].map(function (s) {
      var f = new T.Group();
      f.position.set(s * 0.2, 0, 0);
      h.add(f);
      P(f, G.cyl(0.1, 0.11, 0.3, 8), dark, [0, 0.34, 0]);
      P(f, G.sph(0.17, 12, 8), dark, [0, 0.13, 0.05], null, [1, 0.72, 1.35], true);
      P(f, G.box(0.2, 0.05, 0.1), teal, [0, 0.1, 0.24]);
      return f;
    });

    // 长袍 + 电路纹
    P(h, G.cyl(0.3, 0.62, 0.98, 16), indigo, [0, 0.9, 0], null, null, true);
    P(h, G.tor(0.6, 0.04, 6, 24), teal, [0, 0.43, 0], [Math.PI / 2, 0, 0]);
    P(h, G.box(0.07, 0.96, 0.03), teal, [0, 0.9, 0.475], [-0.316, 0, 0]);
    [[-0.2, 0.45], [0, 0.72], [0.2, 0.45]].forEach(function (c) {
      var x = c[0], len = c[1], y = 1.3 - len / 2, r = 0.3 + (1.39 - y) / 0.98 * 0.32;
      var z = -Math.sqrt(r * r - x * x) - 0.012;
      P(h, G.box(0.035, len, 0.03), teal, [x, y, z], [0.316, 0, 0]);
      P(h, G.sph(0.045, 8, 6), teal, [x, y - len / 2 - 0.02, z - len / 2 * 0.33]);
    });
    // 腰带和三张技能卡
    P(h, G.tor(0.435, 0.05, 6, 20), leather, [0, 1.0, 0], [Math.PI / 2, 0, 0]);
    P(h, G.box(0.13, 0.13, 0.05), gold, [0, 1.0, 0.45]);
    [[-0.22, 0x7af5ff], [0.22, 0xc59bff]].forEach(function (c) {
      var k = new T.Group();
      k.position.set(c[0], 0.9, 0.42);
      k.rotation.set(-0.3, c[0] * 2.2, 0);
      h.add(k);
      P(k, G.box(0.16, 0.22, 0.02), gold);
      P(k, G.box(0.12, 0.18, 0.03), basic(c[1]));
    });
    // 兜帽领子
    P(h, G.tor(0.26, 0.11, 8, 16), indigoD, [0, 1.4, -0.04], [Math.PI / 2, 0, 0]);

    // 手臂（局部 -x 那只握法杖）
    var arms = [-1, 1].map(function (s) {
      var a = new T.Group();
      a.position.set(s * 0.34, 1.3, 0);
      h.add(a);
      P(a, G.cap(0.1, 0.28), indigo, [s * 0.12, -0.2, 0.05], [0, 0, s * 0.5], null, true);
      P(a, G.tor(0.1, 0.025, 6, 12), teal, [s * 0.2, -0.36, 0.06], [Math.PI / 2, s * 0.5, 0]);
      P(a, G.sph(0.1, 10, 8), dark, [s * 0.25, -0.44, 0.08], null, null, true);
      return a;
    });

    // 头
    var head = new T.Group();
    head.position.set(0, 1.78, 0);
    h.add(head);
    P(head, G.sph(0.4, 20, 16), skin, null, null, null, true);
    P(head, new T.SphereGeometry(0.43, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.56), hair, [0, 0.01, -0.02], [-0.5, 0, 0]);
    [-0.24, -0.12, 0, 0.12, 0.24].forEach(function (x, i) {
      P(head, G.cone(0.085, 0.24, 6), hair, [x, 0.2 - Math.abs(x) * 0.25, 0.37 - Math.abs(x) * 0.3], [Math.PI - 0.35, 0, (i - 2) * 0.16]);
    });
    [-1, 1].forEach(function (s) {
      P(head, G.cone(0.1, 0.3, 6), hair, [s * 0.38, -0.02, 0.08], [Math.PI, 0, s * -0.35]);
      P(head, G.sph(0.07, 10, 8), basic(0x3a2412), [s * 0.15, 0, 0.365], null, [1, 1.3, 0.5]);
      P(head, G.sph(0.022, 6, 5), basic(0xffffff), [s * 0.15 + 0.03, 0.04, 0.4]);
      P(head, G.box(0.12, 0.026, 0.02), hair, [s * 0.15, 0.135, 0.385], [0, 0, s * -0.14]);
      P(head, G.sph(0.06, 8, 6), basic(0xff9d9d, { transparent: true, opacity: 0.55 }), [s * 0.25, -0.11, 0.31], [0, s * 0.6, 0], [1, 0.6, 0.3]);
    });
    P(head, G.tor(0.06, 0.014, 4, 8, Math.PI), basic(0x9a4a3a), [0, -0.15, 0.378], [0, 0, Math.PI]);

    // 巫师帽 + 光标挂饰
    var hat = new T.Group();
    hat.position.set(0, 0.27, -0.02);
    hat.rotation.set(-0.1, 0, -0.06);
    head.add(hat);
    P(hat, G.cyl(0.42, 0.88, 0.13, 24), orange, [0, 0, 0], null, null, true);
    P(hat, G.cyl(0.4, 0.43, 0.13, 20), indigoD, [0, 0.12, 0]);
    P(hat, G.tor(0.415, 0.02, 4, 20), teal, [0, 0.19, 0], [Math.PI / 2, 0, 0]);
    P(hat, G.cyl(0.2, 0.4, 0.42, 16), orange, [0, 0.39, 0], null, null, true);
    P(hat, G.cone(0.205, 0.44, 12), orange, [0.08, 0.74, 0], [0, 0, -0.55], null, true);
    var charm = new T.Group();
    charm.position.set(0.2, 0.92, 0);
    hat.add(charm);
    P(charm, G.cyl(0.008, 0.008, 0.18, 4), dark, [0.05, -0.08, 0]);
    P(charm, G.cone(0.07, 0.16, 4), basic(0x8ff6ff), [0.08, -0.22, 0], [0, 0, 0.5]);
    PM.glow(charm, 0x55e8ff, 0.5, [0.08, -0.22, 0], 0.8);

    // 法杖 + 光标水晶
    var staff = new T.Group();
    staff.position.set(-0.6, 0, 0.12);
    h.add(staff);
    P(staff, G.cyl(0.035, 0.045, 1.75, 6), leather, [0, 0.875, 0], null, null, 0.02);
    P(staff, G.tor(0.13, 0.035, 6, 10, Math.PI * 1.3), leather, [0.02, 1.84, 0], [0, 0, -0.4]);
    P(staff, G.tor(0.05, 0.02, 4, 10), teal, [0, 1.3, 0], [Math.PI / 2, 0, 0]);
    var crystal = new T.Group();
    crystal.position.set(0.02, 2.1, 0);
    staff.add(crystal);
    P(crystal, G.cone(0.13, 0.3, 4), basic(0xa8f9ff), [0, 0.04, 0], [0, 0, 0.6]);
    P(crystal, G.box(0.05, 0.16, 0.05), basic(0xa8f9ff), [0.09, -0.13, 0], [0, 0, 0.6]);
    var halo = PM.glow(crystal, 0x55e8ff, 1.1, null, 0.85);

    var walkT = 0, cast = 0;
    return {
      root: root, body: body,
      setCast: function (k) { cast = k; },
      update: function (t, moving, dt) {
        if (moving) {
          walkT += dt * 11;
          var s = Math.sin(walkT);
          body.position.y = Math.abs(s) * 0.13;
          feet[0].position.z = s * 0.17;
          feet[1].position.z = -s * 0.17;
          arms[1].rotation.x = s * 0.55;
          h.rotation.z = s * 0.04;
        } else {
          body.position.y = Math.abs(Math.sin(t * 2.4)) * 0.035;
          feet[0].position.z *= 0.8;
          feet[1].position.z *= 0.8;
          arms[1].rotation.x *= 0.8;
          h.rotation.z *= 0.8;
        }
        h.rotation.x = cast * 0.2;
        staff.position.y = cast * 0.4;
        staff.rotation.x = cast * 0.75;
        arms[0].rotation.x = -cast * 1.1;
        crystal.position.y = 2.1 + Math.sin(t * 3) * 0.05;
        crystal.rotation.y = t * 1.6;
        halo.scale.setScalar(1.1 + cast * 2.2 + Math.sin(t * 5) * 0.08);
        charm.rotation.z = Math.sin(t * 4) * 0.3;
      }
    };
  };

  // ---------- 幻觉幽灵 ----------
  function buildGhost(g) {
    var inner = new T.Group();
    g.add(inner);
    var m = toon(0xb58cff, { transparent: true, opacity: 0.8, emissive: 0x6a35d0, emissiveIntensity: 0.55 });
    var prof = [[0.02, -1.8], [0.14, -1.55], [0.3, -1.25], [0.55, -0.85], [0.84, -0.35], [0.99, 0.15], [0.97, 0.55], [0.8, 0.92], [0.48, 1.18], [0.02, 1.28]];
    var geo = new T.LatheGeometry(prof.map(function (p) { return new T.Vector2(p[0], p[1]); }), 22);
    var pos = geo.attributes.position, i;
    for (i = 0; i < pos.count; i++) {
      var y = pos.getY(i);
      if (y < -0.5) { var k = -0.5 - y; pos.setX(i, pos.getX(i) + k * k * 0.42); pos.setZ(i, pos.getZ(i) - k * k * 0.15); }
    }
    geo.computeVertexNormals();
    PM.glow(inner, 0x8a4dff, 5.2, [0, 0, -0.4], 0.3);
    var body = P(inner, geo, m);
    [-1, 1].forEach(function (s) {
      P(inner, G.sph(0.24, 12, 8), m, [s * 1.02, 0, 0.3], [0, 0, s * -0.5], [1.5, 0.75, 0.8]);
    });
    var eyeM = new T.MeshBasicMaterial({ map: PM.spiralTex, transparent: true });
    var eyes = [-1, 1].map(function (s) { return P(inner, G.circ(0.27, 24), eyeM, [s * 0.37, 0.38, 0.94], [-0.12, s * 0.4, 0]); });
    P(inner, G.circ(0.11, 16), basic(0x3b1c78), [0, -0.04, 1.0], null, [1, 1.35, 1]);

    var pageM = toon(0xfff6dc, { emissive: 0x8a7fd0, emissiveIntensity: 0.25 });
    var pages = [];
    for (i = 0; i < 5; i++) pages.push(P(inner, G.box(0.36, 0.46, 0.02), pageM));
    var book = new T.Group();
    inner.add(book);
    var cover = toon(0x7a3fe0);
    P(book, G.box(0.62, 0.035, 0.46), cover, [0, 0.06, 0]);
    P(book, G.box(0.62, 0.035, 0.46), cover, [0, -0.06, 0]);
    P(book, G.box(0.04, 0.15, 0.46), cover, [-0.31, 0, 0]);
    P(book, G.box(0.56, 0.09, 0.42), pageM, [0.02, 0, 0]);
    var qs = [0x9af7ff, 0xe3c8ff, 0x9af7ff].map(function (c) {
      var sp = new T.Sprite(new T.SpriteMaterial({ map: PM.markTex, color: c, transparent: true, depthWrite: false }));
      sp.scale.setScalar(0.62);
      inner.add(sp);
      return sp;
    });

    return function (t) {
      inner.position.y = 2.3 + Math.sin(t * 2) * 0.22;
      body.scale.set(1 + Math.sin(t * 3) * 0.06, 1 + Math.sin(t * 2.2) * 0.05, 1 + Math.cos(t * 2.6) * 0.06);
      m.opacity = 0.74 + 0.12 * Math.sin(t * 1.7);
      eyes[0].rotation.z = t * 2.5;
      eyes[1].rotation.z = -t * 2.5;
      pages.forEach(function (o, i) {
        var a = t * 0.9 + i * 1.256;
        o.position.set(Math.cos(a) * 1.8, Math.sin(a * 1.7 + i) * 0.7, Math.sin(a) * 1.8);
        o.rotation.set(a, a * 0.7, i);
      });
      book.position.set(Math.cos(-t * 0.6) * 2.1, 0.9 + Math.sin(t * 1.3) * 0.2, Math.sin(-t * 0.6) * 2.1);
      book.rotation.set(0.3, t, 0.2);
      qs.forEach(function (o, i) {
        o.position.set(Math.sin(t * 0.8 + i * 2.1) * 1.35, 1.55 + Math.sin(t * 1.6 + i) * 0.25 + i * 0.14, Math.cos(t * 0.8 + i * 2.1) * 0.9);
        o.material.opacity = 0.6 + 0.4 * Math.sin(t * 3 + i * 2);
      });
    };
  }

  // ---------- 上下文溢出史莱姆 ----------
  function buildSlime(g) {
    var inner = new T.Group();
    g.add(inner);
    var m = toon(0x5fdc4e, { emissive: 0x1e8a1c, emissiveIntensity: 0.4 });
    P(inner, G.sph(1.35, 22, 16), m, [0, 1.0, 0], null, [1.15, 0.88, 1.05], true);
    P(inner, G.sph(0.85, 18, 14), m, [0.08, 1.95, -0.1], null, [1, 0.9, 1], true);
    [[-1.25, 0.42, 0.25, 0.62], [1.3, 0.4, 0.1, 0.58], [0.55, 0.35, 1.15, 0.5], [-0.6, 0.3, 1.2, 0.42], [0.2, 0.4, -1.2, 0.6]].forEach(function (b) {
      P(inner, G.sph(b[3], 14, 10), m, [b[0], b[1], b[2]], null, [1, 0.8, 1], true);
    });
    // 嘴、眼睛、高光
    P(inner, G.sph(0.6, 16, 12), basic(0x0f3312), [0, 1.05, 1.2], null, [1.15, 0.95, 0.6]);
    [-0.32, 0.3].forEach(function (x) { P(inner, G.cap(0.07, 0.22), m, [x, 1.5, 1.4]); });
    [[-0.42, 1], [0.42, 0.82]].forEach(function (e) {
      P(inner, G.sph(0.2, 12, 10), basic(0xffffff), [e[0], 1.95, 0.72], null, e[1]);
      P(inner, G.sph(0.1, 10, 8), basic(0x12240f), [e[0] * 0.95, 1.92, 0.88], null, e[1]);
    });
    P(inner, G.sph(0.2, 10, 8), basic(0xffffff, { transparent: true, opacity: 0.5 }), [-0.5, 2.42, 0.36], [0, 0, 0.5], [1.6, 0.6, 0.4]);
    P(inner, G.sph(0.16, 10, 8), basic(0xffffff, { transparent: true, opacity: 0.4 }), [-1.1, 1.5, 0.95], [0, 0, 0.8], [1.6, 0.6, 0.4]);

    // 塞满的卷轴和纸
    var paper = toon(0xf6e7c1), paperD = toon(0xd9c391);
    [[[-1.0, 1.8, 0.35], [0.3, 0, 0.9]], [[1.1, 1.6, 0.3], [0.2, 0, -0.8]], [[0.3, 2.7, 0], [0.2, 0, 0.25]],
      [[-0.15, 0.95, 1.4], [1.2, 0.3, 0.4]], [[1.25, 0.75, -0.6], [0.5, 0, -1.2]]].forEach(function (c) {
      var s = new T.Group();
      s.position.set(c[0][0], c[0][1], c[0][2]);
      s.rotation.set(c[1][0], c[1][1], c[1][2]);
      inner.add(s);
      P(s, G.cyl(0.13, 0.13, 0.95, 10), paper, null, null, null, true);
      P(s, G.cyl(0.155, 0.155, 0.08, 10), paperD, [0, 0.47, 0]);
      P(s, G.cyl(0.155, 0.155, 0.08, 10), paperD, [0, -0.47, 0]);
    });
    [[[-0.8, 1.15, 1.2], [-0.2, -0.5, 0.2]], [[1.0, 1.0, 1.02], [-0.1, 0.7, -0.15]], [[0.72, 2.25, 0.5], [-0.6, 0.5, 0.1]]].forEach(function (c) {
      P(inner, G.box(0.45, 0.56, 0.02), paper, c[0], c[1]);
    });

    // 往外溢的发光方块
    var cols = [0x5ee6ff, 0x4d8dff, 0x9dff6a], cubes = [];
    for (var i = 0; i < 6; i++) {
      var s0 = 0.18 + (i % 3) * 0.04;
      cubes.push(P(inner, G.box(s0, s0, s0), toon(cols[i % 3], { emissive: cols[i % 3], emissiveIntensity: 0.7 }), null, null, null, 0.02));
    }
    return function (t) {
      var s = 1 + 0.045 * Math.sin(t * 2.5);
      inner.scale.set(s, 2 - s, s);
      cubes.forEach(function (c, i) {
        var p = (t * 0.4 + i * 0.37) % 1, a = -0.9 + i * 0.36, r = 0.9 + p * 1.9;
        c.position.set(Math.sin(a) * r, Math.max(0.16, 1.0 + 1.8 * p - 4.4 * p * p), 0.6 + Math.cos(a) * r * 0.9);
        c.rotation.set(p * 6, p * 4, 0);
        c.scale.setScalar(p > 0.85 ? (1 - p) / 0.15 + 0.001 : 1);
      });
    };
  }

  // ---------- 「已修复」机器人 ----------
  function buildRobot(g) {
    var inner = new T.Group();
    g.add(inner);
    var copper = toon(0xcf7440), copperD = toon(0x8f4b27), tealM = toon(0x2f9a94), steel = toon(0x7a8499),
      darkM = basic(0x1c1210), tape = toon(0xe9dcc0);
    var RX = 0.95, RY = 1.026, RZ = 0.874, CY = 1.5;
    P(inner, G.sph(0.95, 22, 16), copper, [0, CY, 0], null, [1, 1.08, 0.92], true);
    P(inner, new T.SphereGeometry(0.965, 22, 8, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4), tealM, [0, CY, 0], null, [1, 1.08, 0.92]);
    P(inner, G.tor(0.925, 0.05, 6, 28), copperD, [0, 1.18, 0], [Math.PI / 2, 0, 0], [1, 0.92, 1]);
    // 贴在肚子曲面上的零件
    function stick(geo, mt, x, y, rz, lift) {
      var k = 1 - (x / RX) * (x / RX) - ((y - CY) / RY) * ((y - CY) / RY);
      var z = RZ * Math.sqrt(Math.max(0.01, k)) + (lift || 0.01);
      return P(inner, geo, mt, [x, y, z], [-(y - CY) * 0.7, x * 0.9, rz]);
    }
    [[-0.12, 1.98, 0.6, 0.42], [0.1, 1.74, -0.75, 0.4], [-0.08, 1.5, 0.7, 0.36], [0.22, 1.88, 0.1, 0.3], [-0.3, 1.72, -0.2, 0.26]].forEach(function (c) {
      stick(G.box(c[3], 0.06, 0.04), darkM, c[0], c[1], c[2]);
    });
    stick(G.box(0.55, 0.14, 0.03), tape, -0.45, 1.3, 0.7, 0.02);
    stick(G.box(0.55, 0.14, 0.03), tape, -0.45, 1.3, -0.7, 0.03);
    stick(G.box(0.5, 0.14, 0.03), tape, 0.5, 1.36, 0.3, 0.02);
    var core = stick(G.ico(0.1), basic(0xfff07a), 0.02, 1.73, 0, 0.05);
    var coreGlow = PM.glow(inner, 0xffd84a, 1.3, [0.02, 1.73, 1.0], 0.8);

    // 头
    P(inner, G.cyl(0.25, 0.3, 0.2, 12), steel, [0, 2.44, 0]);
    P(inner, G.sph(0.6, 20, 14), copper, [0, 2.8, 0], null, [1.12, 0.85, 1], true);
    var eyeGlow = [];
    [-1, 1].forEach(function (s) {
      P(inner, G.sph(0.15, 12, 8), basic(0xffe14d), [s * 0.26, 2.84, 0.5], null, [1, 1, 0.5]);
      eyeGlow.push(PM.glow(inner, 0xffd84a, 0.75, [s * 0.26, 2.84, 0.62], 0.6));
      P(inner, G.box(0.3, 0.06, 0.06), darkM, [s * 0.26, 3.02, 0.53], [0, 0, s * 0.4]);
    });
    P(inner, G.tor(0.22, 0.035, 4, 12, Math.PI), darkM, [0, 2.68, 0.56], [0, 0, Math.PI]);
    P(inner, G.cyl(0.02, 0.02, 0.3, 5), steel, [0, 3.42, 0]);
    P(inner, G.sph(0.07, 8, 6), basic(0xff5a4d), [0, 3.6, 0]);
    // 腿脚
    [-1, 1].forEach(function (s) {
      P(inner, G.cyl(0.13, 0.13, 0.4, 8), steel, [s * 0.4, 0.42, 0]);
      P(inner, G.sph(0.27, 12, 8), tealM, [s * 0.4, 0.16, 0.1], null, [1, 0.6, 1.3], true);
      P(inner, G.sph(0.2, 12, 10), copperD, [s * 0.98, 1.95, 0], null, null, true);
    });
    // 左臂垂着，右臂举着大对勾
    P(inner, G.cap(0.11, 0.5), steel, [-1.15, 1.5, 0.05], [0, 0, -0.3]);
    P(inner, G.sph(0.2, 12, 10), copper, [-1.27, 1.08, 0.1], null, null, true);
    P(inner, G.cap(0.11, 0.6), steel, [1.25, 2.4, 0], [0, 0, -0.55]);
    P(inner, G.sph(0.2, 12, 10), copper, [1.48, 2.82, 0], null, null, true);
    var check = new T.Group();
    check.position.set(1.6, 3.5, 0);
    inner.add(check);
    var green = basic(0x45ff7a);
    PM.glow(check, 0x3dff7a, 3.4, [0, 0, -0.1], 0.45);
    P(check, G.box(0.6, 0.22, 0.22), green, [-0.36, -0.14, 0], [0, 0, -0.79], null, 0.03);
    P(check, G.box(1.25, 0.22, 0.22), green, [0.2, 0.12, 0], [0, 0, 0.9], null, 0.03);

    // 冒烟和火花
    var smoke = [], sparks = [], i;
    for (i = 0; i < 5; i++) smoke.push(P(inner, G.sph(1, 8, 6), basic(0x3a3540, { transparent: true, opacity: 0.5, depthWrite: false })));
    for (i = 0; i < 5; i++) sparks.push(P(inner, G.box(0.06, 0.06, 0.06), basic(0xfff07a)));
    return function (t) {
      inner.position.y = Math.abs(Math.sin(t * 2.2)) * 0.05;
      inner.rotation.z = Math.sin(t * 1.6) * 0.03;
      check.position.y = 3.5 + Math.sin(t * 3) * 0.07;
      check.rotation.y = Math.sin(t * 1.5) * 0.45;
      var fl = Math.abs(Math.sin(t * 13)) * (Math.sin(t * 3.1) > 0 ? 1 : 0.3);
      core.scale.setScalar(0.8 + 0.6 * fl);
      coreGlow.material.opacity = 0.35 + 0.6 * fl;
      eyeGlow.forEach(function (e) { e.material.opacity = 0.45 + 0.2 * Math.sin(t * 6); });
      smoke.forEach(function (s, i) {
        var p = (t * 0.4 + i * 0.2) % 1, r = 0.14 + p * 0.34;
        s.position.set(-0.75 + Math.sin(p * 5 + i) * 0.2, 2.3 + p * 2.2, -0.2);
        s.scale.setScalar(r);
        s.material.opacity = 0.5 * (1 - p);
      });
      sparks.forEach(function (s, i) {
        var p = (t * 1.7 + i * 0.23) % 1, a = i * 1.9;
        s.position.set(0.02 + Math.cos(a) * p * 0.8, 1.73 + Math.sin(a) * p * 0.6 - p * p * 0.7, 0.95 + p * 0.5);
        s.scale.setScalar((1 - p) * (fl > 0.2 ? 1 : 0.001) + 0.001);
      });
    };
  }

  PM.MONSTERS = { hallucination: buildGhost, overflow: buildSlime, fakefix: buildRobot };
})();
