// 游戏主流程：走路 → 遇怪 → 出技能卡 → 讲解 → 通关结算。
(function () {
  'use strict';
  var T = THREE, PM = window.PM, $ = PM.$, clamp = PM.clamp, shuffle = PM.shuffle, sfx = PM.sfx, P = PM.P, G = PM.G;
  var QUESTIONS = window.QUESTIONS, SKILLS = window.PM_SKILLS, ICONS = window.PM_ICONS;

  // ---------- 场景 ----------
  var canvas = $('scene');
  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new T.Scene();
  scene.background = new T.Color(0x1b1747);
  scene.fog = new T.Fog(0x1b1747, 24, 82);
  var camera = new T.PerspectiveCamera(50, 1, 0.1, 400);
  scene.add(new T.HemisphereLight(0xdfe6ff, 0x4a3a80, 2.3));
  var sun = new T.DirectionalLight(0xfff1dc, 2.5);
  sun.position.set(7, 12, 9);
  scene.add(sun);

  var DEFS = [
    { id: 'hallucination', name: '幻觉幽灵', z: -10, color: 0xb58cff, hitY: 2.3 },
    { id: 'overflow', name: '上下文溢出史莱姆', z: -26, color: 0x5fdc4e, hitY: 1.4 },
    { id: 'fakefix', name: '「已修复」机器人', z: -42, color: 0xcf7440, hitY: 1.8 }
  ];
  var GATE_Z = -54, MAX_MHP = 3, MAX_HP = 5, B = PM.BATTLE, START_Z = 4;

  var world = PM.buildWorld(scene, DEFS.map(function (d) { return d.z; }), GATE_Z);
  var hero = PM.buildHero();
  scene.add(hero.root);
  hero.root.position.set(0, 0, START_Z);
  var monsters = DEFS.map(function (def) {
    var g = new T.Group();
    g.position.set(0, 0, def.z);
    scene.add(g);
    PM.shadow(g, 1.45);
    var ring = P(scene, new T.RingGeometry(1.75, 1.95, 48), PM.basic(def.color, { transparent: true, opacity: 0.75, depthWrite: false }), [0, 0.06, def.z], [-Math.PI / 2, 0, 0]);
    return { def: def, g: g, hp: MAX_MHP, update: PM.MONSTERS[def.id](g), ring: ring };
  });

  // 点击移动的目标标记
  var mark = P(scene, new T.RingGeometry(0.28, 0.4, 24), PM.basic(0xfff27a, { transparent: true, opacity: 0.9, depthWrite: false }), [0, 0.07, 0], [-Math.PI / 2, 0, 0]);
  mark.visible = false;

  // ---------- 特效 ----------
  var tweens = [], parts = [], fades = [], shake = 0, freeze = 0;
  function tween(dur, fn, done) { tweens.push({ t: 0, d: dur, fn: fn, done: done }); }
  function burst(p, color, n, size, speed) {
    var m = PM.toon(color, { emissive: color, emissiveIntensity: 0.6 });
    for (var i = 0; i < n; i++) {
      var o = P(scene, i % 2 ? G.box(size, size, size) : G.ico(size * 0.7), m, [p.x, p.y, p.z]);
      var sp = speed || 8;
      parts.push({ o: o, v: new T.Vector3((Math.random() - 0.5) * sp, 2 + Math.random() * sp * 0.8, (Math.random() - 0.5) * sp), life: 1.3 });
    }
  }
  function fadeSprite(p, color, s0, s1, dur, tex, opacity) {
    var sp = PM.glow(scene, color, s0, [p.x, p.y, p.z], opacity || 1, tex);
    fades.push({ o: sp, t: 0, d: dur, s0: s0, s1: s1, o0: opacity || 1 });
  }
  var v3 = new T.Vector3();
  function floatText(text, cls, p, dy) {
    v3.set(p.x, p.y + (dy || 0), p.z).project(camera);
    var el = document.createElement('div');
    el.className = 'float ' + cls;
    el.textContent = text;
    el.style.left = clamp((v3.x * 0.5 + 0.5) * window.innerWidth, 60, window.innerWidth - 60) + 'px';
    el.style.top = Math.max(70, (-v3.y * 0.5 + 0.5) * window.innerHeight) + 'px';
    $('fx').appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1150);
  }
  function flash(gold) {
    var f = $('flash');
    f.className = gold ? 'gold on' : 'on';
    setTimeout(function () { f.classList.remove('on'); }, 60);
  }

  function throwCard(m, done) {
    var c = new T.Group();
    scene.add(c);
    P(c, G.box(0.56, 0.78, 0.04), PM.basic(0xf2c14e));
    P(c, G.box(0.46, 0.68, 0.06), PM.basic(0x1d7a86));
    P(c, G.cyl(0.14, 0.14, 0.08, 14), PM.basic(0xa8f9ff), null, [Math.PI / 2, 0, 0]);
    PM.glow(c, 0x7af5ff, 2, null, 0.8);
    var pp = hero.root.position;
    var a = new T.Vector3(pp.x, 2.0, pp.z - 0.6), b = new T.Vector3(m.g.position.x, m.def.hitY, m.g.position.z + 0.7), n = 0;
    tween(0.42, function (k) {
      c.position.lerpVectors(a, b, k);
      c.position.y += Math.sin(k * Math.PI) * 1.1;
      c.rotation.set(k * 9, k * 13, 0);
      if (n++ % 2 === 0) fadeSprite(c.position, 0x7af5ff, 0.8, 0.2, 0.3, null, 0.7);
    }, function () { scene.remove(c); done(b); });
  }
  function hurt(m) {
    PM.flashWhite(m.g);
    tween(0.34, function (k) {
      var s = Math.sin(k * Math.PI);
      m.g.scale.set(1 + s * 0.2, 1 - s * 0.2, 1 + s * 0.2);
      m.g.position.z = m.def.z - s * 0.7;
      m.g.rotation.x = -s * 0.22;
    }, function () { m.g.scale.set(1, 1, 1); m.g.position.z = m.def.z; m.g.rotation.x = 0; });
  }
  function lunge(m, done) {
    var z0 = m.def.z, hit = false;
    tween(0.55, function (k) {
      m.g.position.z = z0 + Math.sin(k * Math.PI) * (B.dist - 1.5);
      if (k > 0.5 && !hit) { hit = true; done(); }
    }, function () { m.g.position.z = z0; });
  }
  function explode(m) {
    var p = new T.Vector3(0, m.def.hitY, m.def.z);
    m.g.visible = false;
    m.ring.visible = false;
    burst(p, m.def.color, 26, 0.3, 10);
    burst(p, 0xffe27a, 14, 0.14, 12);
    fadeSprite(p, 0xffffff, 1, 9, 0.45, PM.ringTex, 0.9);
    fadeSprite(p, m.def.color, 2, 8, 0.5, null, 0.9);
    shake = 0.55;
    flash(true);
    floatText('击败！', 'ko', p, 1.2);
    sfx.kill();
  }

  // ---------- 状态与界面 ----------
  var state = 'title', hp = MAX_HP, cur = 0, wrong = 0, score = 0, combo = 0, maxCombo = 0, learned = [];
  var queue = [], q = null, battleM = null, locked = false, moveTarget = null, moving = false, toastTimer = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function icon(name) { return '<span class="ico"><svg viewBox="0 0 24 24">' + (ICONS[name] || '') + '</svg></span>'; }
  function renderHud() {
    $('hearts').innerHTML = '<b>' + '♥'.repeat(hp) + '</b><i>' + '♥'.repeat(MAX_HP - hp) + '</i>';
    $('progress').textContent = '已击败 ' + cur + ' / ' + monsters.length;
    $('score').textContent = score;
  }
  function renderCombo() {
    var c = $('combo');
    if (combo >= 2) {
      c.innerHTML = combo + '<small>连击</small>';
      c.classList.add('on');
      c.classList.remove('pop');
      void c.offsetWidth;
      c.classList.add('pop');
    } else c.classList.remove('on');
  }
  function setMhp() { $('mhp').style.width = (Math.max(0, battleM.hp) / MAX_MHP * 100) + '%'; }
  function toast(text) {
    var t = $('toast');
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1500);
  }
  function renderSnd() { $('snd').textContent = PM.isMuted() ? '音效 关' : '音效 开'; }
  $('snd').onclick = function () { PM.setMuted(!PM.isMuted()); renderSnd(); if (!PM.isMuted()) sfx.pick(); };
  renderSnd();

  function startBattle(m) {
    state = 'battle';
    battleM = m;
    moveTarget = null;
    moving = false;
    mark.visible = false;
    queue = shuffle(QUESTIONS.filter(function (x) { return x.monster === m.def.id; }));
    $('mname').textContent = m.def.name;
    setMhp();
    $('mplate').classList.remove('hidden');
    $('battle').classList.remove('hidden');
    $('hint').classList.add('hidden');
    toast(m.def.name + ' 出现了！');
    nextQuestion();
  }
  function nextQuestion() {
    q = queue.shift();
    locked = false;
    $('qscene').textContent = q.scene;
    $('explain').classList.add('hidden');
    $('battle').classList.remove('done');
    var box = $('opts');
    box.innerHTML = '';
    shuffle([0, 1, 2, 3]).forEach(function (ci, n) {
      var c = q.cards[ci], sk = SKILLS[c[0]], b = document.createElement('button');
      b.type = 'button';
      b.className = 'skill';
      b.dataset.i = ci;
      b.innerHTML = '<span class="num">' + (n + 1) + '</span>' + icon(sk.icon) + '<span class="nm">' + esc(sk.name) + '</span><span class="ds">' + esc(c[1]) + '</span>';
      b.onclick = function () { choose(ci, b); };
      box.appendChild(b);
    });
  }
  function choose(ci, btn) {
    if (locked || state !== 'battle') return;
    locked = true;
    var m = battleM, ok = ci === q.answer, sk = SKILLS[q.cards[ci][0]];
    Array.prototype.forEach.call($('opts').children, function (b) { b.disabled = true; });
    if (ok) {
      combo++;
      maxCombo = Math.max(maxCombo, combo);
      score += 100 * combo;
      learned.push(q);
      btn.classList.add('played');
      toast('打出技能卡：' + sk.name);
      sfx.cast();
      tween(0.4, function (k) { hero.setCast(Math.sin(k * Math.PI)); }, function () { hero.setCast(0); });
      throwCard(m, function (p) {
        m.hp--;
        setMhp();
        renderHud();
        renderCombo();
        hurt(m);
        fadeSprite(p, 0xfff2a8, 0.8, 5.5, 0.35, PM.ringTex, 0.95);
        fadeSprite(p, 0xffffff, 2.5, 0.5, 0.22, null, 0.9);
        burst(p, 0xffe27a, 10, 0.13, 9);
        burst(p, m.def.color, 6, 0.18, 7);
        shake = 0.3;
        freeze = 0.07;
        floatText(combo >= 2 ? combo + ' 连击！' : '命中！', 'hit', p, 1.1);
        sfx.hit();
        if (m.hp <= 0) tween(0.4, function () {}, function () { explode(m); showExplain(true); });
        else showExplain(true);
      });
    } else {
      combo = 0;
      wrong++;
      renderCombo();
      queue.push(q);
      btn.classList.add('wrong');
      sfx.miss();
      floatText('没对症', 'miss', new T.Vector3(0, m.def.hitY, m.def.z), 1.4);
      lunge(m, function () {
        hp--;
        renderHud();
        var h = $('hearts');
        h.classList.remove('hit');
        void h.offsetWidth;
        h.classList.add('hit');
        shake = 0.6;
        flash(false);
        sfx.hurt();
        var pp = hero.root.position;
        burst(new T.Vector3(pp.x, 1.3, pp.z), 0xff5d73, 8, 0.11, 6);
        floatText('-1 ♥', 'hurt', pp, 2.9);
        tween(0.3, function (k) { hero.body.rotation.x = Math.sin(k * Math.PI) * 0.35; }, function () { hero.body.rotation.x = 0; });
        showExplain(false);
      });
    }
  }
  function showExplain(ok) {
    Array.prototype.forEach.call($('opts').children, function (b) {
      b.classList.remove('played');
      if (+b.dataset.i === q.answer) b.classList.add('right');
    });
    $('extext').innerHTML = (ok ? '<b class="tag ok">命中</b>' : '<b class="tag no">被反击</b>') + esc(q.explain);
    $('next').textContent = hp <= 0 ? '查看结果' : (battleM.hp <= 0 ? '继续前进' : '下一题');
    $('battle').classList.add('done');
    $('explain').classList.remove('hidden');
  }
  $('next').onclick = function () {
    if (state !== 'battle' || $('explain').classList.contains('hidden')) return;
    sfx.pick();
    if (hp <= 0) return endGame(false);
    if (battleM.hp <= 0) {
      $('battle').classList.add('hidden');
      $('mplate').classList.add('hidden');
      $('hint').classList.remove('hidden');
      $('hint').textContent = cur + 1 < monsters.length ? '继续往前走，下一只怪物在等你' : '怪物清空了！走进前面的金色传送门';
      cur++;
      renderHud();
      battleM = null;
      state = 'walk';
      return;
    }
    nextQuestion();
  };
  function endGame(win) {
    state = 'end';
    $('battle').classList.add('hidden');
    $('mplate').classList.add('hidden');
    $('hint').classList.add('hidden');
    $('combo').classList.remove('on');
    var seen = {}, items = '';
    learned.forEach(function (x) {
      var id = x.cards[x.answer][0], sk = SKILLS[id];
      if (seen[id]) return;
      seen[id] = true;
      items += '<li>' + icon(sk.icon) + '<div><b>' + esc(sk.name) + '</b>' + esc(x.explain) + '</div></li>';
    });
    var stars = win ? (wrong === 0 ? 3 : wrong <= 2 ? 2 : 1) : 0;
    $('otitle').textContent = win ? '通关！' : '被怪物打败了';
    $('obody').innerHTML =
      (win ? '<div class="stars"><b>' + '★'.repeat(stars) + '</b><i>' + '★'.repeat(3 - stars) + '</i></div>' : '') +
      '<p>' + (win ? '三只怪物全部击败，' + (wrong ? '中途打错 ' + wrong + ' 张牌。' : '一张牌都没打错！') : '击败了 ' + cur + ' 只怪物。看看已经学会的技能，再来一次。') + '</p>' +
      '<p class="score">得分 <b>' + score + '</b>　最高连击 <b>' + maxCombo + '</b></p>' +
      (items ? '<p class="sub">这一局收集到的技能卡</p><ul class="skills">' + items + '</ul>' : '');
    $('obtn').textContent = '再玩一次';
    $('overlay').classList.remove('title');
    $('overlay').classList.remove('hidden');
    if (win) sfx.win(); else sfx.lose();
  }
  $('obtn').onclick = function () {
    if (state === 'title') { state = 'walk'; $('overlay').classList.add('hidden'); sfx.pick(); }
    else window.location.reload();
  };

  // ---------- 输入 ----------
  var keys = {};
  window.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    keys[k] = true;
    if (k.indexOf('arrow') === 0) e.preventDefault();
    if (state === 'battle') {
      if (k.length === 1 && k >= '1' && k <= '4') { var b = $('opts').children[+k - 1]; if (b) b.click(); }
      if (k === 'enter') { e.preventDefault(); $('next').click(); }
    } else if (state === 'title' && k === 'enter') { e.preventDefault(); $('obtn').click(); }
  });
  window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
  window.addEventListener('blur', function () { keys = {}; });

  var ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hitPt = new T.Vector3();
  canvas.addEventListener('pointerdown', function (e) {
    if (state !== 'walk') return;
    ndc.set(e.clientX / window.innerWidth * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hitPt)) {
      moveTarget = { x: clamp(hitPt.x, -2.1, 2.1), z: clamp(hitPt.z, GATE_Z, 6) };
      mark.position.set(moveTarget.x, 0.07, moveTarget.z);
      mark.visible = true;
    }
  });

  // ---------- 主循环 ----------
  var camPos = new T.Vector3(1.2, 2.3, START_Z - 5.6), camLook = new T.Vector3(-2, 1.45, START_Z), wantPos = new T.Vector3(), wantLook = new T.Vector3();
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 62 : 50;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  renderHud();

  function turn(cur0, target, f) {
    var d = target - cur0;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return cur0 + d * f;
  }
  function updateWalk(dt) {
    var pos = hero.root.position, dx = 0, dz = 0;
    if (keys.w || keys.arrowup) dz -= 1;
    if (keys.s || keys.arrowdown) dz += 1;
    if (keys.a || keys.arrowleft) dx -= 1;
    if (keys.d || keys.arrowright) dx += 1;
    if (dx || dz) { moveTarget = null; mark.visible = false; }
    else if (moveTarget) {
      dx = moveTarget.x - pos.x;
      dz = moveTarget.z - pos.z;
      if (Math.hypot(dx, dz) < 0.15) { moveTarget = null; mark.visible = false; dx = dz = 0; }
    }
    var len = Math.hypot(dx, dz);
    var next = cur < monsters.length ? monsters[cur] : null;
    var minZ = next ? next.def.z + B.dist - 0.1 : GATE_Z + 1;
    moving = len > 0;
    if (moving) {
      dx /= len; dz /= len;
      pos.x = clamp(pos.x + dx * 6 * dt, -2.1, 2.1);
      pos.z = clamp(pos.z + dz * 6 * dt, minZ, 6);
      hero.body.rotation.y = turn(hero.body.rotation.y, Math.atan2(-dx, -dz), 1 - Math.exp(-dt * 14));
    }
    if (next && pos.z <= next.def.z + B.dist) startBattle(next);
    else if (!next && pos.z <= GATE_Z + 1.5) endGame(true);
  }

  var last = performance.now(), time = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (freeze > 0) { freeze -= dt; dt = 0.0001; }   // 命中时的顿帧
    time += dt;

    var pos = hero.root.position;
    if (state === 'walk') updateWalk(dt);
    else moving = false;
    if (state === 'battle' && battleM) {
      var f0 = 1 - Math.exp(-dt * 8);
      hero.body.rotation.y = turn(hero.body.rotation.y, -0.6, f0);
      pos.x += (0 - pos.x) * f0;
      pos.z += (battleM.def.z + B.dist - pos.z) * f0;
      if (battleM.g.visible) battleM.g.rotation.y += (0.55 - battleM.g.rotation.y) * f0;
    }
    hero.update(time, moving, dt);
    monsters.forEach(function (m) {
      if (!m.g.visible) return;
      m.update(time);
      m.ring.rotation.z = time * 0.6;
      m.ring.material.opacity = 0.55 + 0.25 * Math.sin(time * 3);
    });
    world.update(time, pos.z);
    if (mark.visible) mark.scale.setScalar(1 + Math.sin(time * 8) * 0.12);

    var i;
    for (i = tweens.length - 1; i >= 0; i--) {
      var tw = tweens[i];
      tw.t += dt;
      var k = Math.min(1, tw.t / tw.d);
      tw.fn(k);
      if (k >= 1) { tweens.splice(i, 1); if (tw.done) tw.done(); }
    }
    for (i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.v.y -= 18 * dt;
      p.o.position.addScaledVector(p.v, dt);
      if (p.o.position.y < 0.12) { p.o.position.y = 0.12; p.v.y *= -0.4; p.v.x *= 0.7; p.v.z *= 0.7; }
      p.o.rotation.x += dt * 6;
      p.o.rotation.z += dt * 4;
      p.life -= dt;
      p.o.scale.setScalar(Math.max(0.001, Math.min(1, p.life / 0.5)));
      if (p.life <= 0) { scene.remove(p.o); p.o.geometry.dispose(); parts.splice(i, 1); }
    }
    for (i = fades.length - 1; i >= 0; i--) {
      var fd = fades[i];
      fd.t += dt;
      var fk = Math.min(1, fd.t / fd.d);
      fd.o.scale.setScalar(fd.s0 + (fd.s1 - fd.s0) * fk);
      fd.o.material.opacity = fd.o0 * (1 - fk);
      if (fk >= 1) { scene.remove(fd.o); fd.o.material.dispose(); fades.splice(i, 1); }
    }

    // 镜头
    var portrait = window.innerWidth < window.innerHeight;
    if (state === 'title') {
      if (portrait) { wantPos.set(0.9, 2.9, START_Z - 6.4); wantLook.set(0, -0.4, START_Z); }
      else { wantPos.set(1.2 + Math.sin(time * 0.4) * 0.3, 2.3, START_Z - 5.6); wantLook.set(-2, 1.45, START_Z); }
    } else if (state === 'battle' && battleM) {
      var c = portrait ? B.port : B.land, z0 = battleM.def.z;
      wantPos.set(c.pos[0], c.pos[1], z0 + c.pos[2]);
      wantLook.set(c.look[0], c.look[1], z0 + c.look[2]);
    } else {
      wantPos.set(pos.x * 0.5, 7.5, pos.z + 9.5);
      wantLook.set(pos.x * 0.5, 1, pos.z - 3);
    }
    var f = 1 - Math.exp(-dt * 4);
    camPos.lerp(wantPos, f);
    camLook.lerp(wantLook, f);
    camera.position.copy(camPos);
    if (shake > 0) {
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
      shake = Math.max(0, shake - dt * 1.6);
    }
    camera.lookAt(camLook);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();
