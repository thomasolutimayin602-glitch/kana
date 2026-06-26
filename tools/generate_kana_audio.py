from pathlib import Path
import asyncio
import edge_tts

# 50音对照表
KANA = {
    "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
    "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
    "sa": "さ", "shi": "し", "su": "す", "se": "se", "so": "そ", # Note: 'se' corresponds to 'せ'
    "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
    "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "no", # Note: 'no' corresponds to 'の'
    "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
    "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "mo", # Note: 'mo' corresponds to 'も'
    "ya": "や", "yu": "ゆ", "yo": "よ",
    "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
    "wa": "わ", "wo": "を", "n": "ん"
}

# 修正部分假名映射错误
KANA.update({
    "se": "せ",
    "no": "の",
    "mo": "も"
})

async def generate_audio(voice="ja-JP-NanamiNeural", format_str="「{}」", rate="-8%"):
    output_dir = Path("assets/audio/kana")
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"开始使用 {voice} 生成五十音音频 (格式: '{format_str}', 语速: {rate})...")
    
    for name, text in KANA.items():
        output_path = output_dir / f"{name}.mp3"
        # 包装成独立字音格式
        formatted_text = format_str.format(text)
        
        print(f"正在生成: {name}.mp3 -> {formatted_text}")
        audio_comm = edge_tts.Communicate(
            formatted_text,
            voice,
            rate=rate,
        )
        try:
            await audio_comm.save(str(output_path))
        except Exception as e:
            print(f"生成 {name} 失败: {e}")
            
    print("生成完成！")

if __name__ == "__main__":
    # 默认使用 Nanami 声音，带引号包装（可以让发音饱满自然）
    asyncio.run(generate_audio(
        voice="ja-JP-NanamiNeural",
        format_str="「{}」",
        rate="-8%"
    ))
