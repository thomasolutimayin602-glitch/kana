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

const modeLabels = {
  all: "整体训练",
  row: "按行训练",
  column: "按列训练"
}

const optionCount = 4
const audioBase = "assets/audio/kana"

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
    if (!kana) {
      return
    }

    const column = row.id === "n" ? null : columns[columnIndex]
    items.push({
      kana,
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
  mode: "all",
  activeFilter: "",
  deck: [],
  deckIndex: 0,
  current: null,
  options: [],
  answered: false,
  selectedKana: "",
  stats: {
    answered: 0,
    correct: 0
  }
}

const elements = {
  correctCount: document.getElementById("correctCount"),
  answeredCount: document.getElementById("answeredCount"),
  filterScroll: document.getElementById("filterScroll"),
  filterTrack: document.getElementById("filterTrack"),
  scopeLabel: document.getElementById("scopeLabel"),
  progressText: document.getElementById("progressText"),
  playButton: document.getElementById("playButton"),
  answerGrid: document.getElementById("answerGrid"),
  feedbackText: document.getElementById("feedbackText"),
  resetButton: document.getElementById("resetButton"),
  nextButton: document.getElementById("nextButton"),
  kanaTable: document.getElementById("kanaTable"),
  modeTabs: Array.from(document.querySelectorAll(".mode-tab"))
}

const audio = new Audio()
audio.preload = "auto"

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

function getFilters(mode) {
  if (mode === "row") {
    return rows.map((row) => ({ id: row.id, label: row.label }))
  }

  if (mode === "column") {
    return columns.map((column) => ({ id: column.id, label: column.label }))
  }

  return []
}

function getDefaultFilter(mode) {
  if (mode === "row") {
    return rows[0].id
  }

  if (mode === "column") {
    return columns[0].id
  }

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
    return row ? `${modeLabels.row} · ${row.label}` : modeLabels.row
  }

  if (state.mode === "column") {
    const column = columns.find((item) => item.id === activeFilter)
    return column ? `${modeLabels.column} · ${column.label}` : modeLabels.column
  }

  return modeLabels.all
}

function updateStats() {
  elements.correctCount.textContent = String(state.stats.correct)
  elements.answeredCount.textContent = `/${state.stats.answered}`
}

function renderModeTabs() {
  elements.modeTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode)
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
      if (state.activeFilter === filter.id) {
        return
      }

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
    button.textContent = option.kana
    button.disabled = state.answered

    if (state.answered && option.kana === state.current.kana) {
      button.classList.add("is-correct")
    }

    if (state.selectedKana === option.kana && option.kana !== state.current.kana) {
      button.classList.add("is-wrong")
    }

    button.addEventListener("click", () => chooseAnswer(option.kana))
    elements.answerGrid.appendChild(button)
  })
}

function renderTable() {
  elements.kanaTable.innerHTML = ""

  tableRows.forEach((row) => {
    const rowElement = document.createElement("div")
    rowElement.className = "table-row"

    const label = document.createElement("span")
    label.textContent = row.label
    rowElement.appendChild(label)

    row.cells.forEach((cell) => {
      const cellElement = document.createElement("span")
      cellElement.className = "kana-cell"
      cellElement.textContent = cell.kana

      if (state.current && state.current.kana === cell.kana) {
        cellElement.classList.add("is-current")
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
  elements.scopeLabel.textContent = getScopeLabel()
  elements.progressText.textContent = `${state.deckIndex + 1} / ${state.deck.length}`
  elements.nextButton.disabled = !state.answered
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
  state.answered = false
  state.selectedKana = ""
  setFeedback("待作答")
  renderCard()
}

function startSession(options = {}) {
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

function chooseAnswer(kana) {
  if (state.answered) {
    return
  }

  const isCorrect = kana === state.current.kana
  state.answered = true
  state.selectedKana = kana
  state.stats.answered += 1
  state.stats.correct += isCorrect ? 1 : 0

  setFeedback(
    isCorrect
      ? "正确"
      : `答案是 ${state.current.kana}，读音 ${state.current.romaji}`,
    isCorrect ? "correct" : "wrong"
  )
  renderCard()
}

function nextCard() {
  if (!state.answered) {
    return
  }

  const nextIndex = state.deckIndex + 1
  if (nextIndex >= state.deck.length) {
    startSession({ keepStats: true })
    return
  }

  setCard(nextIndex)
}

function playCurrentAudio() {
  if (!state.current) {
    return
  }

  audio.pause()
  audio.currentTime = 0
  audio.src = `${audioBase}/${state.current.romaji}.mp3`
  audio.play().catch(() => {
    setFeedback("音频播放失败", "notice")
  })
}

elements.modeTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const nextMode = button.dataset.mode
    if (nextMode === state.mode) {
      return
    }

    state.mode = nextMode
    state.activeFilter = getDefaultFilter(nextMode)
    startSession()
  })
})

elements.playButton.addEventListener("click", playCurrentAudio)
elements.nextButton.addEventListener("click", nextCard)
elements.resetButton.addEventListener("click", () => startSession())

audio.addEventListener("error", () => {
  setFeedback("音频文件未加载", "notice")
})

startSession()
