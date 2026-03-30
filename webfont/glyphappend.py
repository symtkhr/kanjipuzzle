#!/bin/python3

import fontforge
import os
import json

f = open("glyphappend.json","r")
glyphs = json.load(f)

def add_svgs_to_font(output_path):
    font = fontforge.open("glyphwikiCDP.woff")
        
    for i, g in enumerate(glyphs):
        filename = "svg/" + g["gw"] + ".svg"
        if not os.path.isfile(filename):
            print(f"-- {filename} is not found.")
            continue
        #if (i == 2): break
        
        unicode_val = int(g["u"],16)
        try:
            font.removeGlyph(unicode_val)
        except:
            print("new")
        glyph = font.createChar(unicode_val, g["gw"])
        
        # SVGをインポート(座標の正規化・スケーリング・整数に丸め)
        glyph.importOutlines(filename)
        glyph.width = 1000
        glyph.simplify()
        glyph.removeOverlap()
        glyph.correctDirection()
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
add_svgs_to_font("glyphwiki.v2.woff")
