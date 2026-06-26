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

module.exports = {
  rows,
  columns,
  tableRows,
  basicKana
}
