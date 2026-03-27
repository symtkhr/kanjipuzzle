
import fontforge
import os
import json

f = open("glyphappend.json","r")
glyphs = json.load(f)

def add_svgs_to_font(base_font_path, svg_dir, output_path, start_unicode=0xE000):
    font = fontforge.open(base_font_path)
    
    svg_files = [f for f in os.listdir(svg_dir) if f.endswith('.svg')]
    
    for i, g in enumerate(glyphs):
        filename = "svg/" + g["gw"] + "svg"
        unicode_val = int(g["u"],16)
        glyph = font.createChar(unicode_val, f"uni{unicode_val:04X}")
        
        # SVGをインポート(座標の正規化・スケーリング・整数に丸め)
        glyph.importOutlines(os.path.join(svg_dir, filename))
        glyph.simplify()
        glyph.round()
        
        print(f"Added {filename} as U+{unicode_val:04X}")

        # 「一」(U+4E00) + VS17 (U+E0100) が入力された時に 'my_svg_glyph' を出す設定
        #add_ivs_with_fontforge("glyphwikiCDP.woff", unicode_val, 0xE0100, "my_svg_glyph", "output.woff2")

    # WOFF2として保存
    font.generate(output_path)
    print(f"Saved to {output_path}")



def add_ivs_with_fontforge(font_path, base_unicode, selector_unicode, glyph_name, output_path):
    # フォントを開く
    font = fontforge.open(font_path)
    
    # 対象のグリフを取得（存在しない場合はエラーになるので注意）
    try:
        glyph = font[glyph_name]
    except:
        print(f"Error: Glyph '{glyph_name}' not found.")
        return

    # IVS (Variation Sequence) を追加
    # 引数: (セレクタのUnicode, 基底文字のUnicode)
    # 例: glyph.addVariationSequence(0xE0100, 0x4E00)
    glyph.addVariationSequence(selector_unicode, base_unicode)
    
    # 保存
    font.generate(output_path)
    print(f"Successfully linked {glyph_name} to IVS: <U+{base_unicode:X}, U+{selector_unicode:X}>")


# 実行
add_svgs_to_font("glyphwikiCDP.woff", "./svg", "output.woff2")
