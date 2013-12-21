var Main, arraysEqual, backOneStep, can_be_put, clearGuide, judge, next_cells, playBGM, playClick, playNyah, playSound, refreshGuide, removeElem, replaceScene, reset, showMessage, showResult, startTimer, switchGuide, toggle, updateCountLabel, updateTimeLabel;

Main = {
  blocks: [[], [], [], [], [], [], [], []],
  queens: [],
  guides: [],
  guideEnabled: false,
  count: 0,
  time: 0,
  timer: null,
  result: false,
  dx: [-1, -2, -2, -1, 1, 2, 2, 1],
  dy: [-2, -1, 1, 2, 2, 1, -1, -2],
  nyahSound: null,
  clickSound: null
};

$(function() {
  var block, blocks_in_dom, i, j, _i, _j;
  playBGM();
  replaceScene('intro');
  blocks_in_dom = $('.block');
  for (i = _i = 0; _i < 8; i = ++_i) {
    for (j = _j = 0; _j < 8; j = ++_j) {
      block = blocks_in_dom[i * 8 + j];
      block.x = i;
      block.y = j;
      block.status = 0;
      block.onclick = function() {
        return toggle(this);
      };
      Main.blocks[i].push(block);
    }
  }
  updateCountLabel();
  $('#startbutton').click(function() {
    playSound('../sound/start.wav');
    replaceScene('main');
    Main.time = 0;
    startTimer();
    return updateTimeLabel();
  });
  $('#onestepbackbutton').click(function() {
    playClick();
    return backOneStep();
  });
  $('#resetbutton').click(function() {
    playSound('../sound/reset.wav');
    return reset();
  });
  $('#backbutton').click(function() {
    if (Main.result) {
      reset();
      Main.guideEnabled = true;
      switchGuide();
      replaceScene('intro');
      playClick();
    }
    return $('#message').hide();
  });
  return $('#guidebutton').click(function() {
    playClick();
    return switchGuide();
  });
});

replaceScene = function(id) {
  var i, s, scenes, _i, _len;
  scenes = ['intro', 'main', 'message'];
  for (i = _i = 0, _len = scenes.length; _i < _len; i = ++_i) {
    s = scenes[i];
    $('#' + s).hide();
  }
  return $('#' + id).show();
};

toggle = function(block) {
  var queen;
  if (can_be_put(block)) {
    $(block).addClass('active');
    block.status = 1;
    Main.count++;
    queen = {
      x: block.x,
      y: block.y
    };
    Main.queens.push(queen);
    playNyah();
  }
  if (Main.guideEnabled) {
    refreshGuide();
  }
  updateCountLabel();
  if (judge()) {
    return showResult();
  }
};

judge = function() {
  if (Main.count === 64) {
    return true;
  }
  return false;
};

updateCountLabel = function() {
  return $('#countlabel').html('×' + Main.count + '/64');
};

updateTimeLabel = function() {
  $('#timelabel').html(Main.time + '秒');
  return Main.time++;
};

startTimer = function() {
  Main.time = 0;
  if (Main.timer) {
    clearInterval(Main.timer);
  }
  return Main.timer = setInterval(updateTimeLabel, 1000);
};

reset = function() {
  var block, g, i, j, _i, _j, _k, _len, _ref;
  Main.count = 0;
  updateCountLabel();
  for (i = _i = 0; _i < 8; i = ++_i) {
    for (j = _j = 0; _j < 8; j = ++_j) {
      block = Main.blocks[i][j];
      block.status = 0;
      $(block).removeClass('active');
      $(block).removeClass('mark');
    }
  }
  Main.queens = [];
  _ref = Main.guides;
  for (i = _k = 0, _len = _ref.length; _k < _len; i = ++_k) {
    g = _ref[i];
    g.remove();
  }
  Main.guides = [];
  return console.log(Main.queens);
};

showMessage = function(mes) {
  $('.messagelabel').html(mes);
  return $('#message').show();
};

showResult = function() {
  playSound('../sound/correct.wav');
  clearInterval(Main.timer);
  showMessage("正解！<br>タイム: " + (Main.time - 1) + "秒");
  return Main.result = true;
};

backOneStep = function() {
  var block, last_queen;
  last_queen = Main.queens.pop();
  console.log(last_queen);
  block = Main.blocks[last_queen.x][last_queen.y];
  $(block).removeClass('active');
  block.status = 0;
  Main.count--;
  updateCountLabel();
  if (Main.guideEnabled) {
    return refreshGuide();
  }
};

switchGuide = function() {
  if (Main.guideEnabled) {
    $('#guidebutton').removeClass('active');
    $('#guidebutton').html('ガイドON');
    clearGuide();
  } else {
    $('#guidebutton').addClass('active');
    $('#guidebutton').html('ガイドOFF');
    refreshGuide();
  }
  return Main.guideEnabled = !Main.guideEnabled;
};

can_be_put = function(block) {
  var cell, last_queen, _i, _len, _ref;
  if (Main.queens.length === 0) {
    return true;
  }
  last_queen = Main.queens[Main.queens.length - 1];
  _ref = next_cells(last_queen);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    cell = _ref[_i];
    if (cell.x === block.x && cell.y === block.y) {
      return true;
    }
  }
  return false;
};

next_cells = function(cell) {
  var cells, i, new_cell, nx, ny, _i;
  console.log("calls next_cells");
  cells = [];
  for (i = _i = 0; _i < 8; i = ++_i) {
    nx = cell.x + Main.dx[i];
    ny = cell.y + Main.dy[i];
    console.log("i:" + i + " now:" + cell.x + "," + cell.y);
    if (nx < 0 || 8 <= nx || ny < 0 || 8 <= ny) {
      continue;
    }
    if (Main.blocks[nx][ny].status === 1) {
      continue;
    }
    new_cell = {
      x: nx,
      y: ny
    };
    console.log("Add" + nx + "," + ny);
    cells.push(new_cell);
  }
  return cells;
};

refreshGuide = function() {
  var cell, guide, last_queen, nx, ny, _i, _len, _ref, _results;
  clearGuide();
  console.log(Main.queens.length);
  last_queen = Main.queens[Main.queens.length - 1];
  console.log(last_queen);
  _ref = next_cells(last_queen);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    cell = _ref[_i];
    nx = cell.x;
    ny = cell.y;
    guide = $('<div>').addClass('guide');
    guide.x = nx;
    guide.y = ny;
    $(Main.blocks[nx][ny]).append(guide);
    $(Main.blocks[nx][ny]).addClass('mark');
    _results.push(Main.guides.push(guide));
  }
  return _results;
};

clearGuide = function() {
  var g, i, _i, _len, _ref;
  _ref = Main.guides;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    g = _ref[i];
    $(Main.blocks[g.x][g.y]).removeClass('mark');
    g.remove();
  }
  return Main.guides = [];
};

playBGM = function() {
  var bgm;
  bgm = new Audio('../sound/bgm.wav');
  bgm.loop = true;
  return bgm.play();
};

playNyah = function() {
  if (!Main.nyahSound) {
    Main.nyahSound = new Audio('../sound/cat.wav');
  } else {
    Main.nyahSound.currentTime = 0;
  }
  return Main.nyahSound.play();
};

playClick = function() {
  if (!Main.clickSound) {
    Main.clickSound = new Audio('../sound/click.wav');
  } else {
    Main.clickSound.currentTime = 0;
  }
  return Main.clickSound.play();
};

playSound = function(path) {
  var sound;
  sound = new Audio(path);
  return sound.play();
};

removeElem = function(array, value) {
  var elem, i, removeIndexes, val, _i, _j, _len, _len1, _results;
  removeIndexes = [];
  for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
    elem = array[i];
    if (elem.isEqualToArray(value)) {
      removeIndexes.push(i);
    }
  }
  _results = [];
  for (i = _j = 0, _len1 = removeIndexes.length; _j < _len1; i = ++_j) {
    val = removeIndexes[i];
    _results.push(array = array.splice(val - i, 1));
  }
  return _results;
};

Array.prototype.isEqualToArray = function(array) {
  return arraysEqual(this, array);
};

arraysEqual = function(arrayA, arrayB) {
  var a, b, i, v, _i, _len;
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  for (i = _i = 0, _len = arrayA.length; _i < _len; i = ++_i) {
    v = arrayA[i];
    a = arrayA[i];
    b = arrayB[i];
    if ((a instanceof Array) && (b instanceof Array)) {
      if (!arraysEqual(a, b)) {
        return false;
      }
    } else {
      if (a !== b) {
        return false;
      }
    }
  }
  return true;
};
