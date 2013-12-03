var Main, arraysEqual, clearGuide, judge, refreshGuide, removeElem, replaceScene, reset, showMessage, showResult, startTimer, switchGuide, toggle, updateCountLabel, updateJudgeButtonState, updateTimeLabel;

Main = {
  blocks: [[], [], [], [], [], [], [], []],
  queens: [],
  guides: [],
  guideEnabled: false,
  count: 0,
  time: 0,
  timer: null,
  result: false
};

$(function() {
  var block, blocks, i, j, _i, _j;
  replaceScene('intro');
  blocks = $('.block');
  for (i = _i = 0; _i < 8; i = ++_i) {
    for (j = _j = 0; _j < 8; j = ++_j) {
      block = blocks[i * 8 + j];
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
    replaceScene('main');
    Main.time = 0;
    startTimer();
    return updateTimeLabel();
  });
  $('#judgebutton').click(function() {
    if (!$('#judgebutton').hasClass('disabled')) {
      return showResult();
    }
  });
  $('#resetbutton').click(function() {
    return reset();
  });
  $('#backbutton').click(function() {
    if (Main.result) {
      reset();
      Main.guideEnabled = true;
      switchGuide();
      replaceScene('intro');
    }
    return $('#message').hide();
  });
  return $('#guidebutton').click(function() {
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
  if (block.status) {
    $(block).removeClass('active');
    block.status = 0;
    Main.count--;
    removeElem(Main.queens, [block.x, block.y]);
  } else if (Main.count < 8) {
    $(block).addClass('active');
    block.status = 1;
    Main.count++;
    Main.queens.push([block.x, block.y]);
  }
  if (Main.guideEnabled) {
    refreshGuide();
  }
  updateCountLabel();
  return updateJudgeButtonState();
};

updateJudgeButtonState = function() {
  if (Main.count === 8) {
    return $('#judgebutton').removeClass('disabled');
  } else {
    return $('#judgebutton').addClass('disabled', 'disabled');
  }
};

judge = function() {
  var i, j, q, queens, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2, _ref3;
  queens = Main.queens;
  for (i = _i = 0, _len = queens.length; _i < _len; i = ++_i) {
    q = queens[i];
    for (j = _j = _ref = i + 1, _ref1 = queens.length; _ref <= _ref1 ? _j < _ref1 : _j > _ref1; j = _ref <= _ref1 ? ++_j : --_j) {
      if (q[0] === queens[j][0] || q[1] === queens[j][1]) {
        return false;
      }
    }
  }
  for (i = _k = 0, _len1 = queens.length; _k < _len1; i = ++_k) {
    q = queens[i];
    for (j = _l = _ref2 = i + 1, _ref3 = queens.length; _ref2 <= _ref3 ? _l < _ref3 : _l > _ref3; j = _ref2 <= _ref3 ? ++_l : --_l) {
      if ((queens[j][1] === -queens[j][0] + q[1] + q[0]) || (queens[j][1] === queens[j][0] + q[1] - q[0])) {
        return false;
      }
    }
  }
  return true;
};

updateCountLabel = function() {
  return $('#countlabel').html('×' + Main.count + '/8');
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
  updateJudgeButtonState();
  return console.log(Main.queens);
};

showMessage = function(mes) {
  $('.messagelabel').html(mes);
  return $('#message').show();
};

showResult = function() {
  if (!$(this).hasClass('disabled')) {
    if (judge()) {
      clearInterval(Main.timer);
      showMessage("正解！<br>✌(’ω’✌ )三✌(’ω’)✌三( ✌’ω’)✌<br><br>タイム: " + (Main.time - 1) + "秒");
      return Main.result = true;
    } else {
      showMessage("不正解<br>('ω'乂)");
      return Main.result = false;
    }
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

refreshGuide = function() {
  var guide, i, q, queens, x, y, _i, _len, _results;
  clearGuide();
  queens = Main.queens;
  _results = [];
  for (i = _i = 0, _len = queens.length; _i < _len; i = ++_i) {
    q = queens[i];
    _results.push((function() {
      var _j, _results1;
      _results1 = [];
      for (x = _j = 0; _j < 8; x = ++_j) {
        if (x !== q[1]) {
          guide = $('<div>').addClass('guide');
          guide.x = q[0];
          guide.y = x;
          $(Main.blocks[q[0]][x]).append(guide);
          $(Main.blocks[q[0]][x]).addClass('mark');
          Main.guides.push(guide);
        }
        if (x !== q[0]) {
          guide = $('<div>').addClass('guide');
          guide.x = x;
          guide.y = q[1];
          $(Main.blocks[x][q[1]]).append(guide);
          $(Main.blocks[x][q[1]]).addClass('mark');
          Main.guides.push(guide);
        }
        if (x !== q[0]) {
          y = -x + q[1] + q[0];
          if ((0 <= y && y < 8)) {
            guide = $('<div>').addClass('guide');
            guide.x = x;
            guide.y = y;
            $(Main.blocks[x][y]).append(guide);
            $(Main.blocks[x][y]).addClass('mark');
            Main.guides.push(guide);
          }
          y = x + q[1] - q[0];
          if ((0 <= y && y < 8)) {
            guide = $('<div>').addClass('guide');
            guide.x = x;
            guide.y = y;
            $(Main.blocks[x][y]).append(guide);
            $(Main.blocks[x][y]).addClass('mark');
            _results1.push(Main.guides.push(guide));
          } else {
            _results1.push(void 0);
          }
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    })());
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
    console.log(a + ',' + b);
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
