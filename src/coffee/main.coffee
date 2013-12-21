Main = {
  blocks: [[],[],[],[],[],[],[],[]]
  queens: []
  guides: []
  guideEnabled: false
  count: 0
  time: 0
  timer: null
  result: false
  dx: [-1, -2, -2, -1, 1, 2, 2, 1]
  dy: [-2, -1, 1, 2, 2, 1, -1, -2]
  nyahSound: null
  clickSound: null
}

$ ->
  playBGM()
  replaceScene('intro')
  #ブロック要素を二次元配列に格納
  blocks_in_dom = $('.block')
  for i in [0...8]
    for j in [0...8]
      block = blocks_in_dom[i*8+j]
      block.x = i
      block.y = j
      block.status = 0
      block.onclick = ->
        toggle(this)
      Main.blocks[i].push(block)
  updateCountLabel()
  $('#startbutton').click ->
    playSound('../sound/start.wav')
    replaceScene('main')
    Main.time = 0
    startTimer()
    updateTimeLabel()
  $('#onestepbackbutton').click ->
    playClick()
    backOneStep()
  $('#resetbutton').click ->
    playSound('../sound/reset.wav')
    reset()

  $('#backbutton').click ->
    if Main.result
      reset()
      Main.guideEnabled = true
      switchGuide()
      replaceScene('intro')
      playClick()
    $('#message').hide()

  $('#guidebutton').click ->
    playClick()
    switchGuide()

replaceScene = (id) ->
  scenes = ['intro', 'main', 'message']
  for s, i in scenes
    $('#'+s).hide()
  $('#'+id).show()

toggle = (block) ->
  if can_be_put(block)
    $(block).addClass('active')
    block.status = 1
    Main.count++
    queen = {x:block.x, y:block.y}
    Main.queens.push(queen)
    playNyah()
  if Main.guideEnabled
    refreshGuide()
  updateCountLabel()
  if judge()
    showResult()

judge = ->
  if Main.count == 64
    return true
  return false

updateCountLabel = ->
  $('#countlabel').html('×' + Main.count + '/64')

updateTimeLabel = ->
  $('#timelabel').html(Main.time + '秒')
  Main.time++

startTimer = ->
  Main.time = 0
  if Main.timer
    clearInterval(Main.timer)
  Main.timer = setInterval(updateTimeLabel, 1000)

reset = ->
  Main.count = 0
  updateCountLabel()
  for i in [0...8]
    for j in [0...8]
      block = Main.blocks[i][j]
      block.status = 0
      $(block).removeClass('active')
      $(block).removeClass('mark')
  Main.queens = []
  for g, i in Main.guides
    g.remove()
  Main.guides = []
  console.log Main.queens

showMessage = (mes) ->
  $('.messagelabel').html(mes)
  $('#message').show()

showResult = ->
  playSound('../sound/correct.wav')
  clearInterval(Main.timer)
  showMessage("正解！<br>タイム: "+(Main.time-1)+"秒")
  Main.result = true

backOneStep = ->
  last_queen = Main.queens.pop()
  console.log last_queen
  block = Main.blocks[last_queen.x][last_queen.y]
  $(block).removeClass('active')
  block.status = 0
  Main.count--
  updateCountLabel()
  if Main.guideEnabled
    refreshGuide()

switchGuide = ->
  if Main.guideEnabled
    $('#guidebutton').removeClass('active')
    $('#guidebutton').html('ガイドON')
    clearGuide()
  else
    $('#guidebutton').addClass('active')
    $('#guidebutton').html('ガイドOFF')
    refreshGuide()

  Main.guideEnabled = !Main.guideEnabled

can_be_put = (block) ->
  if Main.queens.length == 0
    return true

  last_queen = Main.queens[Main.queens.length-1]
  for cell in next_cells(last_queen)
    if cell.x == block.x && cell.y == block.y
      return true
  return false

next_cells = (cell) ->
  console.log "calls next_cells"
  cells = []
  for i in [0...8]
    nx = cell.x + Main.dx[i]
    ny = cell.y + Main.dy[i]
    console.log "i:" + i + " now:" + cell.x + "," + cell.y
    if nx < 0 || 8 <= nx || ny < 0 || 8 <= ny
      continue
    if Main.blocks[nx][ny].status == 1
      continue
    new_cell = {x:nx, y:ny}
    console.log "Add" + nx + "," + ny
    cells.push new_cell
  return cells


refreshGuide = ->
  clearGuide()
  console.log Main.queens.length
  last_queen = Main.queens[Main.queens.length-1]
  console.log last_queen
  for cell in next_cells(last_queen)
    nx = cell.x
    ny = cell.y
    guide = $('<div>').addClass('guide')
    guide.x = nx
    guide.y = ny
    $(Main.blocks[nx][ny]).append(guide)
    $(Main.blocks[nx][ny]).addClass('mark')
    Main.guides.push(guide)

clearGuide = ->
  for g, i in Main.guides
        $(Main.blocks[g.x][g.y]).removeClass('mark')
        g.remove()
      Main.guides = []

playBGM = ->
  bgm = new Audio('../sound/bgm.wav')
  bgm.loop = true
  bgm.play()

playNyah = ->
  if !Main.nyahSound
    Main.nyahSound = new Audio('../sound/cat.wav')
  else
    Main.nyahSound.currentTime = 0
  Main.nyahSound.play();

playClick = ->
  if !Main.clickSound
    Main.clickSound = new Audio('../sound/click.wav')
  else
    Main.clickSound.currentTime = 0
  Main.clickSound.play();

playSound = (path) ->
  sound = new Audio(path)
  sound.play()

#Foundation
removeElem = (array, value) ->
  removeIndexes = []
  for elem, i in array
    if elem.isEqualToArray(value)
      removeIndexes.push(i)
  for val, i in removeIndexes
    array = array.splice(val-i, 1)

Array.prototype.isEqualToArray = (array) ->
  return arraysEqual(this, array)

arraysEqual = (arrayA, arrayB) ->
  if arrayA.length != arrayB.length
    return false
  for v, i in arrayA
    a = arrayA[i]
    b = arrayB[i]
    if (a instanceof Array) and (b instanceof Array)
      if !arraysEqual(a, b)
        return false
    else
      if a!=b
        return false 
  return true


