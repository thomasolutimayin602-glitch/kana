const rows = [
  { id: "a", label: "あ行", kana: ["あ", "い", "う", "え", "お"] },
  { id: "ka", label: "か行", kana: ["か", "き", "く", "け", "こ"] },
  { id: "sa", label: "さ行", kana: ["さ", "し", "す", "せ", "そ"] },
  { id: "ta", label: "た行", kana: ["た", "ち", "つ", "て", "と"] },
  { id: "na", label: "な行", kana: ["な", "に", "ぬ", "ね", "の"] },
  { id: "ha", label: "は行", kana: ["は", "ひ", "ふ", "へ", "ほ"] },
  { id: "ma", label: "ま行", kana: ["ま", "み", "む", "め", "も"] },
  { id: "ya", label: "や行", kana: ["や", "", "ゆ", "", "よ"] },
  { id: "ra", label: "ら行", kana: ["ら", "り", "る", "れ", "ろ"] },
  { id: "wa", label: "わ行", kana: ["わ", "", "", "", "を"] },
  { id: "n", label: "ん", kana: ["ん", "", "", "", ""] }
]

const columns = [
  { id: "a", label: "あ段", index: 0 },
  { id: "i", label: "い段", index: 1 },
  { id: "u", label: "う段", index: 2 },
  { id: "e", label: "え段", index: 3 },
  { id: "o", label: "お段", index: 4 }
]

const romajiMap = {
  "あ": "a",
  "い": "i",
  "う": "u",
  "え": "e",
  "お": "o",
  "か": "ka",
  "き": "ki",
  "く": "ku",
  "け": "ke",
  "こ": "ko",
  "さ": "sa",
  "し": "shi",
  "す": "su",
  "せ": "se",
  "そ": "so",
  "た": "ta",
  "ち": "chi",
  "つ": "tsu",
  "て": "te",
  "と": "to",
  "な": "na",
  "に": "ni",
  "ぬ": "nu",
  "ね": "ne",
  "の": "no",
  "は": "ha",
  "ひ": "hi",
  "ふ": "fu",
  "へ": "he",
  "ほ": "ho",
  "ま": "ma",
  "み": "mi",
  "む": "mu",
  "め": "me",
  "も": "mo",
  "や": "ya",
  "ゆ": "yu",
  "よ": "yo",
  "ら": "ra",
  "り": "ri",
  "る": "ru",
  "れ": "re",
  "ろ": "ro",
  "わ": "wa",
  "を": "wo",
  "ん": "n"
}

const katakanaMap = {
  "あ": "ア",
  "い": "イ",
  "う": "ウ",
  "え": "エ",
  "お": "オ",
  "か": "カ",
  "き": "キ",
  "く": "ク",
  "け": "ケ",
  "こ": "コ",
  "さ": "サ",
  "し": "シ",
  "す": "ス",
  "せ": "セ",
  "そ": "ソ",
  "た": "タ",
  "ち": "チ",
  "つ": "ツ",
  "て": "テ",
  "と": "ト",
  "な": "ナ",
  "に": "ニ",
  "ぬ": "ヌ",
  "ね": "ネ",
  "の": "ノ",
  "は": "ハ",
  "ひ": "ヒ",
  "ふ": "フ",
  "へ": "ヘ",
  "ほ": "ホ",
  "ま": "マ",
  "み": "ミ",
  "む": "ム",
  "め": "メ",
  "も": "モ",
  "や": "ヤ",
  "ゆ": "ユ",
  "よ": "ヨ",
  "ら": "ラ",
  "り": "リ",
  "る": "ル",
  "れ": "レ",
  "ろ": "ロ",
  "わ": "ワ",
  "を": "ヲ",
  "ん": "ン"
}

const columnKana = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お"
}

const modeLabels = {
  all: "整体训练",
  row: "按行训练",
  column: "按列训练"
}

const optionCount = 4
const audioBase = "assets/audio/kana"
const kanaAudioCacheName = "nihon-kana-audio-v1"

const tableRows = rows.map((row) => ({
  id: row.id,
  label: row.label,
  cells: row.kana.map((kana, columnIndex) => ({
    id: `${row.id}-${columnIndex}`,
    kana
  }))
}))

const basicKana = rows.reduce((items, row) => {
  row.kana.forEach((kana, columnIndex) => {
    if (!kana) return
    const column = row.id === "n" ? null : columns[columnIndex]
    items.push({
      kana,
      katakana: katakanaMap[kana],
      romaji: romajiMap[kana],
      rowId: row.id,
      rowLabel: row.label,
      columnId: column ? column.id : "special",
      columnLabel: column ? column.label : "特殊"
    })
  })
  return items
}, [])

const state = {
  section: "chart",
  script: "hiragana",
  mode: "all",
  activeFilter: "",
  deck: [],
  deckIndex: 0,
  current: null,
  options: [],
  completed: false,
  selectedKana: "",
  wrongSelections: new Set(),
  autoNext: false,
  stats: {
    answered: 0,
    correct: 0
  }
}

const elements = {
  scriptButtons: Array.from(document.querySelectorAll(".script-button")),
  sectionTabs: Array.from(document.querySelectorAll(".section-tab")),
  chartSection: document.getElementById("chartSection"),
  flashcardSection: document.getElementById("flashcardSection"),
  cacheStatus: document.getElementById("cacheStatus"),
  answerEffect: document.getElementById("answerEffect"),
  correctCount: document.getElementById("correctCount"),
  answeredCount: document.getElementById("answeredCount"),
  filterScroll: document.getElementById("filterScroll"),
  filterTrack: document.getElementById("filterTrack"),
  scopeLabel: document.getElementById("scopeLabel"),
  progressText: document.getElementById("progressText"),
  soundMark: document.getElementById("soundMark"),
  playButton: document.getElementById("playButton"),
  answerGrid: document.getElementById("answerGrid"),
  feedbackText: document.getElementById("feedbackText"),
  resetButton: document.getElementById("resetButton"),
  nextButton: document.getElementById("nextButton"),
  autoNextToggle: document.getElementById("autoNextToggle"),
  kanaTable: document.getElementById("kanaTable"),
  modeTabs: Array.from(document.querySelectorAll(".mode-tab"))
}

const audio = new Audio()
audio.preload = "auto"
let audioContext = null
let autoNextTimer = 0
let sequenceToken = 0
const audioSources = new Map()

function shuffle(items) {
  const result = items.slice()
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

function pickRandom(items, count) {
  return shuffle(items).slice(0, count)
}

function displayKana(item) {
  return state.script === "katakana" ? item.katakana : item.kana
}

function displayKanaValue(kana) {
  return state.script === "katakana" ? katakanaMap[kana] : kana
}

function displayRowLabel(row) {
  if (row.id === "n") return displayKanaValue("ん")
  const firstKana = row.kana.find(Boolean)
  return firstKana ? `${displayKanaValue(firstKana)}行` : row.label
}

function displayColumnLabel(column) {
  return `${displayKanaValue(columnKana[column.id])}段`
}

function getFilters(mode) {
  if (mode === "row") return rows.map((row) => ({ id: row.id, label: displayRowLabel(row) }))
  if (mode === "column") return columns.map((column) => ({ id: column.id, label: displayColumnLabel(column) }))
  return []
}

function getDefaultFilter(mode) {
  if (mode === "row") return rows[0].id
  if (mode === "column") return columns[0].id
  return ""
}

function getActiveKana() {
  const activeFilter = state.activeFilter || getDefaultFilter(state.mode)
  if (state.mode === "row") {
    return basicKana.filter((item) => item.rowId === activeFilter)
  }
  if (state.mode === "column") {
    return basicKana.filter((item) => item.columnId === activeFilter)
  }
  return basicKana
}

function getScopeLabel() {
  const activeFilter = state.activeFilter || getDefaultFilter(state.mode)
  if (state.mode === "row") {
    const row = rows.find((item) => item.id === activeFilter)
    return row ? `${modeLabels.row} · ${displayRowLabel(row)}` : modeLabels.row
  }
  if (state.mode === "column") {
    const column = columns.find((item) => item.id === activeFilter)
    return column ? `${modeLabels.column} · ${displayColumnLabel(column)}` : modeLabels.column
  }
  return modeLabels.all
}

function updateStats() {
  elements.correctCount.textContent = String(state.stats.correct)
  elements.answeredCount.textContent = `/${state.stats.answered}`
}

function renderScriptButtons() {
  elements.scriptButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.kanaScript === state.script)
  })
}

function renderSections() {
  elements.sectionTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.kanaSection === state.section)
  })
  elements.chartSection.classList.toggle("is-hidden", state.section !== "chart")
  elements.flashcardSection.classList.toggle("is-hidden", state.section !== "flashcard")
}

function renderModeTabs() {
  elements.modeTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.kanaMode === state.mode)
  })
}

function renderFilters() {
  const filters = getFilters(state.mode)
  elements.filterTrack.innerHTML = ""
  elements.filterScroll.classList.toggle("is-hidden", filters.length === 0)

  filters.forEach((filter) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "filter-chip"
    button.textContent = filter.label
    button.dataset.id = filter.id
    button.classList.toggle("is-active", filter.id === state.activeFilter)
    button.addEventListener("click", () => {
      if (state.activeFilter === filter.id) return
      state.activeFilter = filter.id
      startSession()
    })
    elements.filterTrack.appendChild(button)
  })
}

function renderAnswers() {
  elements.answerGrid.innerHTML = ""

  state.options.forEach((option) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "answer"
    button.textContent = displayKana(option)
    button.disabled = state.completed
    button.setAttribute("aria-label", `选择 ${displayKana(option)}`)

    if (state.completed && option.kana === state.current.kana) {
      button.classList.add("is-correct")
    }

    if (state.wrongSelections.has(option.kana)) {
      button.classList.add("is-wrong")
    }

    button.addEventListener("click", () => chooseAnswer(option.kana))
    elements.answerGrid.appendChild(button)
  })
}

function renderTable() {
  elements.kanaTable.innerHTML = ""

  const header = document.createElement("div")
  header.className = "table-row table-header"
  const corner = document.createElement("span")
  corner.textContent = "播放"
  header.appendChild(corner)

  columns.forEach((column) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "table-action table-column-action"
    button.textContent = displayColumnLabel(column)
    button.setAttribute("aria-label", `播放${displayColumnLabel(column)}`)
    button.addEventListener("click", () => playColumn(column.id))
    header.appendChild(button)
  })

  elements.kanaTable.appendChild(header)

  tableRows.forEach((row) => {
    const rowElement = document.createElement("div")
    rowElement.className = "table-row"

    const rowSource = rows.find((item) => item.id === row.id)
    const rowButton = document.createElement("button")
    rowButton.type = "button"
    rowButton.className = "table-action table-row-action"
    rowButton.textContent = displayRowLabel(rowSource)
    rowButton.setAttribute("aria-label", `播放${displayRowLabel(rowSource)}`)
    rowButton.addEventListener("click", () => playRow(row.id))
    rowElement.appendChild(rowButton)

    row.cells.forEach((cell) => {
      const cellElement = document.createElement("button")
      cellElement.type = "button"
      cellElement.className = "kana-cell"
      const kanaItem = basicKana.find((item) => item.kana === cell.kana)

      if (kanaItem) {
        cellElement.textContent = displayKana(kanaItem)
        cellElement.setAttribute("aria-label", `播放 ${displayKana(kanaItem)}`)
        cellElement.addEventListener("click", () => playKanaItem(kanaItem))
      } else {
        cellElement.textContent = ""
        cellElement.disabled = true
        cellElement.setAttribute("aria-hidden", "true")
      }

      rowElement.appendChild(cellElement)
    })

    elements.kanaTable.appendChild(rowElement)
  })
}

function setFeedback(text, type = "") {
  elements.feedbackText.textContent = text
  elements.feedbackText.className = `feedback${type ? ` ${type}` : ""}`
}

function renderCard() {
  renderScriptButtons()
  renderSections()
  elements.scopeLabel.textContent = getScopeLabel()
  elements.progressText.textContent = `${state.deckIndex + 1} / ${state.deck.length}`
  elements.soundMark.textContent = state.current ? state.current.romaji : "?"
  elements.nextButton.disabled = !state.completed
  elements.autoNextToggle.checked = state.autoNext
  renderModeTabs()
  renderFilters()
  renderAnswers()
  renderTable()
  updateStats()
}

function setCard(deckIndex) {
  state.deckIndex = deckIndex
  state.current = state.deck[deckIndex]
  state.options = shuffle([
    state.current,
    ...pickRandom(
      basicKana.filter((item) => item.kana !== state.current.kana),
      optionCount - 1
    )
  ])
  state.completed = false
  state.selectedKana = ""
  state.wrongSelections = new Set()
  setFeedback("待作答")
  renderCard()
}

function startSession(options = {}) {
  clearAutoNextTimer()
  state.activeFilter = state.activeFilter || getDefaultFilter(state.mode)
  state.deck = shuffle(getActiveKana())

  if (!options.keepStats) {
    state.stats = {
      answered: 0,
      correct: 0
    }
  }

  setCard(0)
}

function clearAutoNextTimer() {
  if (!autoNextTimer) return
  window.clearTimeout(autoNextTimer)
  autoNextTimer = 0
}

function triggerAnswerEffect(type) {
  elements.answerEffect.className = `answer-effect ${type}`
  elements.answerEffect.textContent = type === "correct" ? "✓" : ""
  window.setTimeout(() => {
    elements.answerEffect.className = "answer-effect"
    elements.answerEffect.textContent = ""
  }, 760)
}

function getAudioContext() {
  if (!audioContext) {
    const Context = window.AudioContext || window.webkitAudioContext
    if (!Context) return null
    audioContext = new Context()
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {})
  }
  return audioContext
}

function playTone({ frequencies, duration = 0.34, type = "sine", gain = 0.13 }) {
  const context = getAudioContext()
  if (!context) return

  const start = context.currentTime
  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    const toneStart = start + index * 0.09

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, toneStart)
    envelope.gain.setValueAtTime(0.0001, toneStart)
    envelope.gain.exponentialRampToValueAtTime(gain, toneStart + 0.018)
    envelope.gain.exponentialRampToValueAtTime(0.0001, toneStart + duration)

    oscillator.connect(envelope)
    envelope.connect(context.destination)
    oscillator.start(toneStart)
    oscillator.stop(toneStart + duration + 0.03)
  })
}

function playCorrectSound() {
  playTone({ frequencies: [880, 1174.66, 1567.98], duration: 0.28, type: "sine", gain: 0.12 })
}

function playWrongSound() {
  playTone({ frequencies: [196, 146.83], duration: 0.18, type: "triangle", gain: 0.08 })
}

function chooseAnswer(kana) {
  if (state.completed) return

  const isCorrect = kana === state.current.kana
  state.selectedKana = kana

  if (!isCorrect) {
    state.wrongSelections.add(kana)
    setFeedback("不对，再试一次", "wrong")
    triggerAnswerEffect("wrong")
    playWrongSound()
    renderCard()
    return
  }

  state.completed = true
  state.stats.answered += 1
  state.stats.correct += 1
  setFeedback("正确", "correct")
  triggerAnswerEffect("correct")
  playCorrectSound()
  renderCard()

  if (state.autoNext) {
    clearAutoNextTimer()
    autoNextTimer = window.setTimeout(() => {
      if (state.completed) nextCard()
    }, 1000)
  }
}

function nextCard() {
  if (!state.completed) return
  clearAutoNextTimer()

  const nextIndex = state.deckIndex + 1
  if (nextIndex >= state.deck.length) {
    startSession({ keepStats: true })
    playCurrentAudio()
    return
  }

  setCard(nextIndex)
  playCurrentAudio()
}

function getAudioUrl(item) {
  return `${audioBase}/${item.romaji}.mp3`
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function playKanaAudio(item) {
  const url = getAudioUrl(item)

  audio.pause()
  audio.currentTime = 0
  audio.src = audioSources.get(url) || url

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
    const handleEnded = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      reject(new Error("音频文件未加载"))
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.play().catch((error) => {
      cleanup()
      reject(error)
    })
  })
}

function playKanaItem(item) {
  sequenceToken += 1
  playKanaAudio(item).catch(() => {
    setFeedback("音频播放失败，请稍后重试", "notice")
  })
}

async function playKanaSequence(items, label) {
  const token = sequenceToken + 1
  sequenceToken = token
  elements.cacheStatus.textContent = `正在播放：${label}`

  for (const item of items) {
    if (token !== sequenceToken) return
    try {
      await playKanaAudio(item)
      await wait(120)
    } catch {
      elements.cacheStatus.textContent = "音频播放中断，请稍后重试。"
      return
    }
  }

  if (token === sequenceToken) {
    elements.cacheStatus.textContent = `播放完成：${label}`
  }
}

function playRow(rowId) {
  const row = rows.find((item) => item.id === rowId)
  const items = basicKana.filter((item) => item.rowId === rowId)
  if (!row || !items.length) return
  playKanaSequence(items, displayRowLabel(row))
}

function playColumn(columnId) {
  const column = columns.find((item) => item.id === columnId)
  const items = basicKana.filter((item) => item.columnId === columnId)
  if (!column || !items.length) return
  playKanaSequence(items, displayColumnLabel(column))
}

function playCurrentAudio() {
  if (!state.current) return

  sequenceToken += 1
  playKanaAudio(state.current).catch(() => {
    setFeedback("音频播放失败，请点播放按钮重试", "notice")
  })
}

async function cacheKanaAudio() {
  const urls = basicKana.map((item) => `${audioBase}/${item.romaji}.mp3`)

  if (!("caches" in window)) {
    elements.cacheStatus.textContent = "浏览器不支持本地缓存，使用直接播放。"
    return
  }

  try {
    const cache = await caches.open(kanaAudioCacheName)
    const missing = []

    for (const url of urls) {
      const cached = await cache.match(url)
      if (cached) {
        const blob = await cached.blob()
        audioSources.set(url, URL.createObjectURL(blob))
      } else {
        missing.push(url)
      }
    }

    if (!missing.length) {
      elements.cacheStatus.textContent = "音频已在本地缓存。"
      return
    }

    elements.cacheStatus.textContent = `正在缓存音频 0/${missing.length}`
    let loaded = 0
    let failed = 0

    for (const url of missing) {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`无法加载 ${url}`)
        const cachedResponse = response.clone()
        await cache.put(url, cachedResponse)
        const blob = await response.blob()
        audioSources.set(url, URL.createObjectURL(blob))
        loaded += 1
      } catch {
        failed += 1
      }
      elements.cacheStatus.textContent = `正在缓存音频 ${loaded}/${missing.length}`
    }

    elements.cacheStatus.textContent = failed
      ? `已缓存 ${loaded} 个音频，${failed} 个稍后重试。`
      : "音频已缓存完成。"
  } catch {
    elements.cacheStatus.textContent = "音频缓存失败，仍可在线播放。"
  }
}

elements.scriptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextScript = button.dataset.kanaScript
    if (nextScript === state.script) return
    state.script = nextScript
    renderCard()
  })
})

elements.sectionTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const nextSection = button.dataset.kanaSection
    if (nextSection === state.section) return
    state.section = nextSection
    renderCard()
    if (state.section === "flashcard") {
      playCurrentAudio()
    }
  })
})

elements.modeTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const nextMode = button.dataset.kanaMode
    if (nextMode === state.mode) return
    state.mode = nextMode
    state.activeFilter = getDefaultFilter(nextMode)
    startSession()
  })
})

elements.playButton.addEventListener("click", playCurrentAudio)
elements.nextButton.addEventListener("click", nextCard)
elements.resetButton.addEventListener("click", () => startSession())
elements.autoNextToggle.addEventListener("change", () => {
  state.autoNext = elements.autoNextToggle.checked
  if (!state.autoNext) {
    clearAutoNextTimer()
  } else if (state.completed) {
    clearAutoNextTimer()
    autoNextTimer = window.setTimeout(() => {
      if (state.completed) nextCard()
    }, 1000)
  }
})
audio.addEventListener("error", () => setFeedback("音频文件未加载", "notice"))

startSession()
cacheKanaAudio()
