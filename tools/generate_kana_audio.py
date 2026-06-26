from pathlib import Path
import asyncio

import edge_tts


KANA = {
    "a": "あ",
    "i": "い",
    "u": "う",
    "e": "え",
    "o": "お",
    "ka": "か",
    "ki": "き",
    "ku": "く",
    "ke": "け",
    "ko": "こ",
    "sa": "さ",
    "shi": "し",
    "su": "す",
    "se": "せ",
    "so": "そ",
    "ta": "た",
    "chi": "ち",
    "tsu": "つ",
    "te": "て",
    "to": "と",
    "na": "な",
    "ni": "に",
    "nu": "ぬ",
    "ne": "ね",
    "no": "の",
    "ha": "は",
    "hi": "ひ",
    "fu": "ふ",
    "he": "へ",
    "ho": "ほ",
    "ma": "ま",
    "mi": "み",
    "mu": "む",
    "me": "め",
    "mo": "も",
    "ya": "や",
    "yu": "ゆ",
    "yo": "よ",
    "ra": "ら",
    "ri": "り",
    "ru": "る",
    "re": "れ",
    "ro": "ろ",
    "wa": "わ",
    "wo": "を",
    "n": "ん",
}


async def main():
    output_dir = Path("assets/audio/kana")
    output_dir.mkdir(parents=True, exist_ok=True)

    for name, text in KANA.items():
        output_path = output_dir / f"{name}.mp3"
        if output_path.exists() and output_path.stat().st_size > 0:
            continue

        audio = edge_tts.Communicate(
            text,
            "ja-JP-NanamiNeural",
            rate="-5%",
            pitch="+0Hz",
        )
        await audio.save(str(output_path))


if __name__ == "__main__":
    asyncio.run(main())
