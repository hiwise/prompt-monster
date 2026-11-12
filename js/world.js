// 场景：符文石板路 + 三个主题区域（紫晶迷雾森林 / 卷轴沼泽 / 铜色工坊）+ 金色传送门。
(function () {
  'use strict';
  var T = THREE, PM = window.PM, P = PM.P, G = PM.G, toon = PM.toon, basic = PM.basic, rnd = PM.rnd;

  // 战斗镜头（相对怪物位置的偏移）。场景摆放时要给这两个机位让出视野。
  PM.BATTLE = {
    dist: 4.4,
    land: { pos: [10.5, 3.4, 3.0], look: [0, 0.6, 2.2], tan: 0.95 },
    port: { pos: [12.4, 3.8, 3.2], look: [0, 0.4, 2.2], tan: 0.36 }
  };
  var Z1 = -18, Z2 = -34;   // 三个区域的分界
  PM.zoneMix = function (z, a, b, c, out) {
    var s1 = PM.clamp((Z1 + 2.5 - z) / 5, 0, 1), s2 = PM.clamp((Z2 + 2.5 - z) / 5, 0, 1);
    return out.copy(a).lerp(b, s1).lerp(c, s2);
  };

  PM.buildWorld = function (scene, monsterZ, gateZ) {
    var ups = [], i;

    // 这个位置会不会挡住战斗镜头
    function blocked(x, z, pad) {
      if (x < 0) return false;
      for (var m = 0; m < monsterZ.length; m++) {
        for (var n = 0; n < 2; n++) {
          var c = n ? PM.BATTLE.port : PM.BATTLE.land;
          var cx = c.pos[0], cz = monsterZ[m] + c.pos[2], tz = monsterZ[m] + c.look[2];
          var fx = -cx, fz = tz - cz, len = Math.hypot(fx, fz);
          fx /= len; fz /= len;
          var vx = x - cx, vz = z - cz, along = vx * fx + vz * fz;
          if (along < -2.5) continue;
          var perp = Math.abs(vx * fz - vz * fx);
          if (perp < Math.max(0, along) * c.tan + (pad || 1.8)) return true;
        }
      }
      return false;
    }

    // ---------- 地面 ----------
    var gg = new T.PlaneGeometry(240, 160, 1, 80);
    gg.rotateX(-Math.PI / 2);
    gg.translate(0, -0.12, -22);
    var gp = gg.attributes.position, col = new Float32Array(gp.count * 3), c = new T.Color();
    var gc = [new T.Color(0x2a1f66), new T.Color(0x134236), new T.Color(0x44302a)];
    for (i = 0; i < gp.count; i++) {
      PM.zoneMix(gp.getZ(i), gc[0], gc[1], gc[2], c);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    gg.setAttribute('color', new T.BufferAttribute(col, 3));
    scene.add(new T.Mesh(gg, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 })));

    // ---------- 符文石板路 ----------
    var stone = [[toon(0x5b54a8), toon(0x6a63bb)], [toon(0x4a807a), toon(0x579088)], [toon(0x8c6c5c), toon(0x9b7a69)]];
    var rune = basic(0x58e0c8);
    var n = 0;
    for (var z = 7; z > gateZ - 3; z -= 2) {
      var zi = z > Z1 ? 0 : z > Z2 ? 1 : 2;
      P(scene, G.box(5.3, 0.2, 1.9), stone[zi][n % 2], [0, -0.08, z]);
      if (n % 2 === 0) {
        var s = n % 4 === 0 ? -1 : 1;
        P(scene, G.box(0.5, 0.03, 0.07), rune, [s * 1.9, 0.03, z + 0.2], [0, 0.5, 0]);
        P(scene, G.box(0.07, 0.03, 0.4), rune, [s * 1.75, 0.03, z - 0.2]);
        P(scene, G.box(0.24, 0.03, 0.07), rune, [s * 2.05, 0.03, z - 0.3], [0, -0.7, 0]);
      }
      n++;
    }
    [-1, 1].forEach(function (s) {
      P(scene, G.box(0.14, 0.12, 68), rune, [s * 2.72, 0.04, -24]);
      PM.glow(scene, 0x58e0c8, 3, [s * 2.72, 0.2, 7], 0.25);
    });

    // ---------- 路灯 ----------
    var postM = toon(0x2d2757), lampM = basic(0xffdc8f);
    function lantern(x, z) {
      var g = new T.Group();
      g.position.set(x, 0, z);
      scene.add(g);
      P(g, G.cyl(0.06, 0.09, 1.9, 6), postM, [0, 0.95, 0]);
      P(g, G.box(0.3, 0.36, 0.3), lampM, [0, 2.05, 0]);
      P(g, G.cone(0.28, 0.2, 4), postM, [0, 2.33, 0], [0, Math.PI / 4, 0]);
      var gl = PM.glow(g, 0xffc766, 2.4, [0, 2.05, 0], 0.7);
      var ph = rnd() * 6;
      ups.push(function (t) { gl.material.opacity = 0.6 + 0.12 * Math.sin(t * 5 + ph); });
    }
    for (z = 2; z > gateZ + 4; z -= 8) {
      lantern(-3.4, z);
      if (!blocked(3.4, z - 4, 1.2)) lantern(3.4, z - 4);
    }
    lantern(3.4, 5);

    // ---------- 区域一：紫晶迷雾森林 ----------
    var trunkM = toon(0x3b2470);
    var leafM = [0x9a63f5, 0xc58bff, 0x6f7dff].map(function (h) { return toon(h, { emissive: h, emissiveIntensity: 0.22 }); });
    var cryM = toon(0xd7b8ff, { emissive: 0x9a5cff, emissiveIntensity: 0.9 });
    var pageM = toon(0xfff6dc), coverM = [toon(0x7a3fe0), toon(0xd84f9a), toon(0x2fb3a8)];
    function tree(x, z) {
      var g = new T.Group(), h = 2 + rnd() * 1.8;
      g.position.set(x, 0, z);
      scene.add(g);
      P(g, G.cyl(0.14, 0.32, h, 6), trunkM, [0, h / 2, 0], [0, 0, (rnd() - 0.5) * 0.3]);
      var k = 2 + Math.floor(rnd() * 2);
      for (var j = 0; j < k; j++) {
        P(g, G.ico(0.8 + rnd() * 0.6), leafM[Math.floor(rnd() * 3)], [(rnd() - 0.5) * 1.3, h + rnd() * 0.9, (rnd() - 0.5) * 1.3], [rnd() * 3, rnd() * 3, 0]);
      }
    }
    function crystals(x, z, big) {
      var g = new T.Group();
      g.position.set(x, 0, z);
      scene.add(g);
      for (var j = 0; j < 3; j++) {
        var h = (0.6 + rnd() * 0.9) * (big || 1);
        P(g, G.cone(0.2 * (big || 1) + rnd() * 0.12, h, 5), cryM, [(j - 1) * 0.3, h / 2 - 0.05, (rnd() - 0.5) * 0.4], [(rnd() - 0.5) * 0.5, rnd() * 3, (j - 1) * -0.35]);
      }
      PM.glow(g, 0x9a5cff, 2.2 * (big || 1), [0, 0.5, 0], 0.35);
    }
    function book(x, z) {
      var g = new T.Group(), y = 1.6 + rnd() * 2.4, ph = rnd() * 6, cm = coverM[Math.floor(rnd() * 3)];
      g.position.set(x, y, z);
      scene.add(g);
      P(g, G.box(0.7, 0.04, 0.5), cm, [0, 0.07, 0]);
      P(g, G.box(0.7, 0.04, 0.5), cm, [0, -0.07, 0]);
      P(g, G.box(0.05, 0.18, 0.5), cm, [-0.35, 0, 0]);
      P(g, G.box(0.62, 0.1, 0.46), pageM, [0.02, 0, 0]);
      g.rotation.set(rnd() * 0.8, rnd() * 3, rnd() * 0.5);
      ups.push(function (t) { g.position.y = y + Math.sin(t + ph) * 0.3; g.rotation.y += 0.004; });
    }
    function mist(x, z, color, scale) { PM.glow(scene, color, scale, [x, 0.9, z], 0.12); }
    for (i = 0; i < 60; i++) {
      var sd = rnd() < 0.5 ? -1 : 1, x = sd * (4.3 + rnd() * 15), zz = 7 - rnd() * 24, r = rnd();
      if (blocked(x, zz)) { if (r < 0.4) crystals(x, zz, 0.45); continue; }
      if (r < 0.42) tree(x, zz);
      else if (r < 0.68) crystals(x, zz, 1 + rnd());
      else if (r < 0.88) book(x, zz);
      else mist(x, zz, 0x8a4dff, 9);
    }
    // 出发点身后的远景
    for (i = 0; i < 16; i++) {
      var bx = -15 + i * 2 + rnd(), bz = 19 + rnd() * 6;
      if (i % 3 === 2) crystals(bx, bz, 1.8); else tree(bx, bz);
    }
    [[-7, 11], [7.5, 12], [-9.5, 15], [10, 16]].forEach(function (p) { tree(p[0], p[1]); });

    // ---------- 区域二：卷轴沼泽 ----------
    var paperM = [toon(0xf6e7c1), toon(0xe6d3a0)], ribbon = toon(0xd84f6a);
    var slimeM = toon(0x4fc24a, { emissive: 0x1e7a22, emissiveIntensity: 0.35 });
    var poolM = basic(0x35c46f, { transparent: true, opacity: 0.45, depthWrite: false });
    var pools = [];
    function pool(x, z) {
      var r0 = 1.4 + rnd() * 2;
      P(scene, G.circ(r0, 22), poolM, [x, 0.02, z], [-Math.PI / 2, 0, 0], [1, 0.75, 1]);
      pools.push([x, z, r0]);
    }
    function stack(x, z) {
      var k = 3 + Math.floor(rnd() * 8), g = new T.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rnd() * 3;
      scene.add(g);
      for (var j = 0; j < k; j++) P(g, G.box(0.9, 0.11, 1.15), paperM[j % 2], [(rnd() - 0.5) * 0.12, 0.055 + j * 0.11, (rnd() - 0.5) * 0.12], [0, (rnd() - 0.5) * 0.5, 0]);
    }
    function scrolls(x, z) {
      var g = new T.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rnd() * 3;
      scene.add(g);
      for (var j = 0; j < 3; j++) {
        var s = P(g, G.cyl(0.17, 0.17, 1.2, 10), paperM[0], [j === 2 ? 0.02 : 0, j === 2 ? 0.46 : 0.17, j === 2 ? 0.18 : j * 0.36], [0, 0, Math.PI / 2]);
        P(s, G.cyl(0.18, 0.18, 0.14, 10), ribbon);
      }
    }
    function reeds(x, z) {
      for (var j = 0; j < 4; j++) {
        var h = 0.9 + rnd() * 1.1;
        P(scene, G.cone(0.07, h, 5), slimeM, [x + (rnd() - 0.5) * 0.8, h / 2, z + (rnd() - 0.5) * 0.8], [(rnd() - 0.5) * 0.3, 0, (rnd() - 0.5) * 0.3]);
      }
    }
    function mound(x, z) {
      var r0 = 0.6 + rnd() * 0.8;
      P(scene, G.sph(r0, 14, 10), slimeM, [x, r0 * 0.15, z], null, [1.2, 0.75, 1.1]);
    }
    for (i = 0; i < 56; i++) {
      sd = rnd() < 0.5 ? -1 : 1; x = sd * (4.2 + rnd() * 15); zz = Z1 + 1 - rnd() * 18; r = rnd();
      if (r < 0.2) { pool(x, zz); continue; }
      if (blocked(x, zz, 1.2)) continue;
      if (r < 0.48) stack(x, zz);
      else if (r < 0.64) scrolls(x, zz);
      else if (r < 0.8) reeds(x, zz);
      else if (r < 0.93) mound(x, zz);
      else mist(x, zz, 0x35e08a, 8);
    }
    var bubM = basic(0x8dffb0, { transparent: true, opacity: 0.6, depthWrite: false });
    pools.slice(0, 8).forEach(function (p, k) {
      if (blocked(p[0], p[1], 1.2)) return;
      var b = P(scene, G.sph(0.14, 8, 6), bubM, [p[0], 0.1, p[1]]), ph = rnd(), ox = (rnd() - 0.5) * p[2];
      ups.push(function (t) {
        var q = (t * 0.35 + ph + k * 0.13) % 1;
        b.position.set(p[0] + ox + Math.sin(q * 9) * 0.1, 0.1 + q * 1.5, p[1]);
        b.scale.setScalar(0.6 + q * 0.9);
      });
    });

    // ---------- 区域三：铜色工坊 ----------
    var copM = toon(0xb8693c), copD = toon(0x7d4526), steelM = toon(0x6f7a90), plateM = toon(0x4b4250);
    function machine(x, z) {
      var g = new T.Group(), side = x < 0 ? 1 : -1;
      g.position.set(x, 0, z);
      scene.add(g);
      P(g, G.box(1.9, 1.7, 1.7), copM, [0, 0.85, 0]);
      P(g, G.box(1.3, 0.6, 1.2), steelM, [0, 2.0, 0]);
      P(g, G.cyl(0.2, 0.26, 1.6, 8), copD, [-0.4 * side, 3.0, -0.3]);
      var gear = new T.Group();
      gear.position.set(side * 0.99, 1.0, 0.1);
      gear.rotation.y = Math.PI / 2;
      g.add(gear);
      P(gear, G.tor(0.5, 0.13, 6, 10), steelM);
      P(gear, G.box(1.0, 0.12, 0.1), steelM);
      P(gear, G.box(0.12, 1.0, 0.1), steelM);
      var sp = 0.8 + rnd() * 1.2;
      var lights = [0, 1, 2].map(function (j) { return P(g, G.sph(0.09, 8, 6), basic(0x58ff8c), [side * 0.66, 2.0, -0.35 + j * 0.35]); });
      var ph = rnd() * 6;
      ups.push(function (t) {
        gear.rotation.z = t * sp;
        lights.forEach(function (l, j) { l.material.color.setHex(Math.sin(t * 4 + ph + j * 2) > 0 ? 0x58ff8c : 0x1c5a34); });
      });
    }
    function pipe(x, z) {
      var len = 3 + rnd() * 3;
      var p = P(scene, G.cyl(0.26, 0.26, len, 10), copD, [x, 0.3, z], [Math.PI / 2, 0, rnd() < 0.5 ? 0 : Math.PI / 2]);
      P(p, G.cyl(0.32, 0.32, 0.2, 10), copM, [0, len * 0.3, 0]);
      P(p, G.cyl(0.32, 0.32, 0.2, 10), copM, [0, -len * 0.3, 0]);
    }
    function barrel(x, z) {
      P(scene, G.cyl(0.45, 0.45, 0.95, 12), steelM, [x, 0.475, z]);
      P(scene, G.tor(0.46, 0.04, 4, 14), copD, [x, 0.7, z], [Math.PI / 2, 0, 0]);
      P(scene, G.tor(0.46, 0.04, 4, 14), copD, [x, 0.25, z], [Math.PI / 2, 0, 0]);
    }
    function coil(x, z) {
      var g = new T.Group();
      g.position.set(x, 0, z);
      scene.add(g);
      P(g, G.cyl(0.14, 0.3, 2.4, 8), steelM, [0, 1.2, 0]);
      [0.9, 1.4, 1.9].forEach(function (y) { P(g, G.tor(0.3, 0.05, 4, 14), copM, [0, y, 0], [Math.PI / 2, 0, 0]); });
      P(g, G.sph(0.24, 10, 8), basic(0xfff07a), [0, 2.6, 0]);
      var gl = PM.glow(g, 0xffd84a, 2.4, [0, 2.6, 0], 0.7), ph = rnd() * 9;
      ups.push(function (t) { gl.material.opacity = 0.25 + 0.6 * Math.abs(Math.sin(t * 11 + ph)) * (Math.sin(t * 2.3 + ph) > -0.2 ? 1 : 0.2); });
    }
    function plate(x, z) { P(scene, G.box(2.4, 0.06, 2.4), plateM, [x, 0.0, z], [0, rnd() * 0.4, 0]); }
    for (i = 0; i < 52; i++) {
      sd = rnd() < 0.5 ? -1 : 1; x = sd * (4.6 + rnd() * 14); zz = Z2 + 1 - rnd() * 18; r = rnd();
      if (r < 0.18) { plate(x, zz); continue; }
      if (blocked(x, zz, 1.4)) { if (r < 0.5) pipe(x, zz); continue; }
      if (r < 0.46) machine(x, zz);
      else if (r < 0.62) pipe(x, zz);
      else if (r < 0.82) barrel(x, zz);
      else coil(x, zz);
    }

    // ---------- 终点：金色传送门 ----------
    var gate = new T.Group();
    gate.position.set(0, 0, gateZ);
    scene.add(gate);
    var pillarM = toon(0x4a4390), goldM = toon(0xf2c14e, { emissive: 0xc58a1a, emissiveIntensity: 0.5 });
    [-1, 1].forEach(function (s) {
      P(gate, G.box(0.9, 4.4, 0.9), pillarM, [s * 2.9, 2.2, 0]);
      P(gate, G.box(1.1, 0.25, 1.1), goldM, [s * 2.9, 4.5, 0]);
      P(gate, G.box(1.1, 0.25, 1.1), goldM, [s * 2.9, 0.12, 0]);
      P(gate, G.cone(0.3, 0.8, 4), basic(0xffe9a8), [s * 2.9, 5.1, 0]);
      PM.glow(gate, 0xffc766, 2.6, [s * 2.9, 5.1, 0], 0.7);
    });
    var ringG = P(gate, G.tor(2.0, 0.18, 8, 36), goldM, [0, 2.5, 0]);
    var swirl = P(gate, G.circ(1.9, 32), new T.MeshBasicMaterial({ map: PM.spiralTex, color: 0xffd98a, transparent: true, opacity: 0.75, side: T.DoubleSide, depthWrite: false }), [0, 2.5, 0]);
    var gateGlow = PM.glow(gate, 0xffc766, 9, [0, 2.5, 0.2], 0.55);
    var motes = [];
    for (i = 0; i < 10; i++) motes.push(P(gate, G.ico(0.07), basic(0xfff0b8)));
    ups.push(function (t) {
      ringG.rotation.z = t * 0.6;
      swirl.rotation.z = -t * 1.4;
      gateGlow.material.opacity = 0.45 + 0.15 * Math.sin(t * 2.4);
      motes.forEach(function (o, i) {
        var q = (t * 0.25 + i * 0.1) % 1, a = i * 2.4 + t * 0.5;
        o.position.set(Math.cos(a) * (2.4 - q * 1.6), 0.4 + q * 4.2, Math.sin(a) * 0.8 + 0.6);
      });
    });

    // ---------- 远景：浮岛和星空 ----------
    var rockM = toon(0x3b3477), topM = [toon(0x8f6bf0), toon(0x49b87a), toon(0xb8693c)];
    [[-27, 9, -4, 0], [25, 11, -18, 0], [-31, 12, -30, 1], [29, 8, -40, 1], [-22, 14, -56, 2], [18, 12, -66, 2], [-12, 17, -78, 2], [8, 15, 30, 0]].forEach(function (d, k) {
      var g = new T.Group();
      g.position.set(d[0], d[1], d[2]);
      scene.add(g);
      P(g, G.cone(3, 4.2, 6), rockM, [0, -2.1, 0], [Math.PI, 0, 0]);
      P(g, G.cyl(3.1, 3, 0.5, 6), topM[d[3]], [0, 0.25, 0]);
      P(g, G.cone(0.45, 2.2, 5), cryM, [0.6, 1.5, 0.2], [0, 0, -0.2]);
      P(g, G.cone(0.3, 1.4, 5), cryM, [-0.5, 1.1, -0.3], [0, 0, 0.3]);
      ups.push(function (t) { g.position.y = d[1] + Math.sin(t * 0.5 + k) * 0.5; });
    });
    var sp = new Float32Array(360 * 3);
    for (i = 0; i < 360; i++) {
      var th = rnd() * Math.PI * 2, ph = 0.08 + rnd() * 1.2, R = 150;
      sp[i * 3] = Math.cos(th) * Math.cos(ph) * R;
      sp[i * 3 + 1] = Math.sin(ph) * R;
      sp[i * 3 + 2] = Math.sin(th) * Math.cos(ph) * R - 24;
    }
    var sg = new T.BufferGeometry();
    sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0xdfe6ff, size: 0.75, fog: false, transparent: true, opacity: 0.85 })));

    // 背景和雾的颜色跟着区域变
    var bg = [new T.Color(0x1b1747), new T.Color(0x0f2a38), new T.Color(0x2a1a30)];
    return {
      update: function (t, z) {
        for (var k = 0; k < ups.length; k++) ups[k](t);
        PM.zoneMix(z, bg[0], bg[1], bg[2], scene.background);
        scene.fog.color.copy(scene.background);
      }
    };
  };
})();
