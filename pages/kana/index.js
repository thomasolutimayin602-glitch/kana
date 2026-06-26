const { rows, columns, tableRows, basicKana } = require("../../data/kana")

const MODE_LABELS = {
  all: "整体训练",
  row: "按行训练",
  column: "按列训练"
}

const AUDIO_BASE = "/assets/audio/kana"
const OPTION_COUNT = 4

function shuffle(items) {
  const result = items.slice()
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    const value = result[index]
    result[index] = result[target]
    result[target] = value
  }
  return result
}

function pickRandom(items, count) {
  return shuffle(items).slice(0, count)
}

Page({
  data: {
    rows,
    columns,
    tableRows,
    mode: "all",
    filters: [],
    activeFilter: "",
    scopeLabel: MODE_LABELS.all,
    deck: [],
    deckIndex: 0,
    current: {},
    options: [],
    answered: false,
    selectedKana: "",
    feedbackType: "",
    feedbackText: "点击播放，听读音后选择对应的平假名。",
    stats: {
      answered: 0,
      correct: 0
    }
  },

  onLoad() {
    this.audio = wx.createInnerAudioContext()
    this.audio.obeyMuteSwitch = false
    this.audio.onError(() => {
      this.setData({
        feedbackType: "",
        feedbackText: "音频加载失败，请检查 assets/audio/kana 目录里的读音文件。"
      })
    })
    this.startSession()
  },

  onUnload() {
    if (this.audio) {
      this.audio.destroy()
    }
  },

  changeMode(event) {
    const mode = event.currentTarget.dataset.mode
    if (mode === this.data.mode) {
      return
    }

    const nextFilter = this.getDefaultFilter(mode)
    this.setData(
      {
        mode,
        filters: this.getFilters(mode),
        activeFilter: nextFilter
      },
      () => this.startSession()
    )
  },

  changeFilter(event) {
    const activeFilter = event.currentTarget.dataset.id
    if (activeFilter === this.data.activeFilter) {
      return
    }

    this.setData({ activeFilter }, () => this.startSession())
  },

  chooseAnswer(event) {
    if (this.data.answered) {
      return
    }

    const selectedKana = event.currentTarget.dataset.kana
    const isCorrect = selectedKana === this.data.current.kana
    const stats = {
      answered: this.data.stats.answered + 1,
      correct: this.data.stats.correct + (isCorrect ? 1 : 0)
    }

    this.setData({
      answered: true,
      selectedKana,
      stats,
      feedbackType: isCorrect ? "correct" : "wrong",
      feedbackText: isCorrect
        ? "正确。继续保持读音到假名的直接反应。"
        : `不对，答案是 ${this.data.current.kana}，读音 ${this.data.current.romaji}。`
    })
  },

  nextCard() {
    if (!this.data.answered) {
      return
    }

    const nextIndex = this.data.deckIndex + 1
    if (nextIndex >= this.data.deck.length) {
      this.startSession({ keepStats: true })
      return
    }

    this.setCard(nextIndex)
  },

  resetSession() {
    this.startSession()
  },

  playCurrentAudio() {
    const current = this.data.current
    if (!current || !current.romaji || !this.audio) {
      return
    }

    this.audio.stop()
    this.audio.src = `${AUDIO_BASE}/${current.romaji}.mp3`
    this.audio.play()
    wx.vibrateShort({ type: "light" })
  },

  startSession(options = {}) {
    const deck = shuffle(this.getActiveKana())
    const deckIndex = 0
    const scopeLabel = this.getScopeLabel()

    this.setData(
      {
        filters: this.getFilters(this.data.mode),
        activeFilter: this.data.activeFilter || this.getDefaultFilter(this.data.mode),
        scopeLabel,
        deck,
        deckIndex,
        stats: options.keepStats ? this.data.stats : { answered: 0, correct: 0 }
      },
      () => this.setCard(deckIndex)
    )
  },

  setCard(deckIndex) {
    const current = this.data.deck[deckIndex]
    const distractors = pickRandom(
      basicKana.filter((item) => item.kana !== current.kana),
      OPTION_COUNT - 1
    )
    const options = shuffle([current].concat(distractors))

    this.setData({
      deckIndex,
      current,
      options,
      answered: false,
      selectedKana: "",
      feedbackType: "",
      feedbackText: "点击播放，听读音后选择对应的平假名。"
    })
  },

  getFilters(mode) {
    if (mode === "row") {
      return rows.map((row) => ({ id: row.id, label: row.label }))
    }

    if (mode === "column") {
      return columns.map((column) => ({ id: column.id, label: column.label }))
    }

    return []
  },

  getDefaultFilter(mode) {
    if (mode === "row") {
      return rows[0].id
    }

    if (mode === "column") {
      return columns[0].id
    }

    return ""
  },

  getActiveKana() {
    const mode = this.data.mode
    const activeFilter = this.data.activeFilter || this.getDefaultFilter(mode)

    if (mode === "row") {
      return basicKana.filter((item) => item.rowId === activeFilter)
    }

    if (mode === "column") {
      return basicKana.filter((item) => item.columnId === activeFilter)
    }

    return basicKana
  },

  getScopeLabel() {
    const mode = this.data.mode
    const activeFilter = this.data.activeFilter || this.getDefaultFilter(mode)

    if (mode === "row") {
      const row = rows.find((item) => item.id === activeFilter)
      return row ? `${MODE_LABELS.row} · ${row.label}` : MODE_LABELS.row
    }

    if (mode === "column") {
      const column = columns.find((item) => item.id === activeFilter)
      return column ? `${MODE_LABELS.column} · ${column.label}` : MODE_LABELS.column
    }

    return MODE_LABELS.all
  }
})
