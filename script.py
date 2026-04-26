import re

file_path = r'c:\Users\Shan Michael\GitHub\Qios\src\components\organisms\MenuInventory.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Grid Minmax
text = re.sub(r'minmax\(220px, 1fr\)', 'minmax(280px, 1fr)', text)

# 2. Update DishCard / IngredientCard
text = re.sub(r'height: 86,(\s+)background: sc\.band,', r'height: 110,\1background: sc.band,', text)
text = re.sub(r'bottom: -28,', r'bottom: -32,', text)
text = re.sub(r'width: 56,\s+height: 56,', r'width: 64,\n              height: 64,', text)
text = re.sub(r'fontSize: 26,', r'fontSize: 32,', text)
text = re.sub(r'padding: "38px 16px 0"', r'padding: "46px 20px 0"', text)
text = text.replace('fontSize: 14,\n            fontWeight: 800,\n            color: INK,\n            lineHeight: 1.25,', 'fontSize: 18,\n            fontWeight: 800,\n            color: INK,\n            lineHeight: 1.25,')
text = text.replace('padding: "10px 0 4px"', 'padding: "16px 0 8px"')
text = text.replace('marginTop: 12,\n          borderTop: 1.5px solid', 'marginTop: 18,\n          borderTop: 1.5px solid')

# In these specific contexts: text replacement for servings / stock text
text = re.sub(r'fontSize: 13, fontWeight: 500, color: MUTED \}\}>\n\s+\{data\.servings\}', r'fontSize: 15, fontWeight: 500, color: MUTED }}>\n          {data.servings}', text)
text = re.sub(r'fontSize: 13, fontWeight: 500, color: MUTED \}\}>\n\s+\{data\.stock\}', r'fontSize: 15, fontWeight: 500, color: MUTED }}>\n          {data.stock}', text)


# 3. Update CfBtn
text = re.sub(r'padding: "14px 0",\n\s+border: "none"', r'padding: "18px 0",\n        border: "none"', text)
text = re.sub(r'gap: 5,\n\s+fontSize: 13,', r'gap: 6,\n        fontSize: 15,', text)

# 4. Update AddDishCard / AddIngredientCard
text = re.sub(r'minHeight: 260,', r'minHeight: 310,', text)
text = re.sub(r'gap: 12,\n\s+cursor: "pointer"', r'gap: 16,\n        cursor: "pointer"', text)
text = re.sub(r'width: 52,\s+height: 52,', r'width: 64,\n          height: 64,', text)
text = text.replace('fontSize: 14,\n          fontWeight: 800,\n          color: hov ? ACCENT : AMBER_DARK,\n          transition: "color .2s",', 'fontSize: 18,\n          fontWeight: 800,\n          color: hov ? ACCENT : AMBER_DARK,\n          transition: "color .2s",')
text = text.replace('fontSize: 13, color: FAINT }}>Click to create</', 'fontSize: 15, color: FAINT }}>Click to create</')


# 5. Update DishListRow / IngredientListRow
text = re.sub(r'padding: "13px 18px",\n\s+cursor: "pointer"', r'padding: "18px 24px",\n          cursor: "pointer"', text)
text = re.sub(r'gap: 14,\n\s+padding: "18px', r'gap: 18,\n          padding: "18px', text)
text = re.sub(r'width: 36,\s+height: 36,', r'width: 48,\n            height: 48,', text)

text = re.sub(r'fontSize: 16,\n\s+\}\}', r'fontSize: 22,\n          }}', text)
text = text.replace('fontSize: 13,\n            fontWeight: 700,\n            color: INK,\n            minWidth: 0,', 'fontSize: 16,\n            fontWeight: 700,\n            color: INK,\n            minWidth: 0,')
text = re.sub(r'width: 100, display: "flex"', r'width: 140, display: "flex"', text)
text = text.replace('fontSize: 12,\n              fontWeight: 700,\n              width: 70', 'fontSize: 14,\n              fontWeight: 700,\n              width: 80')
text = text.replace('fontSize: 10,\n              fontWeight: 800,\n              padding: "3px 10px"', 'fontSize: 12,\n              fontWeight: 800,\n              padding: "4px 12px"')
text = text.replace('width: 62,\n              textAlign: "center"', 'width: 76,\n              textAlign: "center"')

# 6. Update AddDishRow / AddIngredientRow
text = re.sub(r'gap: 8,\n\s+padding: "12px 18px"', r'gap: 12,\n        padding: "18px 24px"', text)
text = re.sub(r'width: 26,\s+height: 26,', r'width: 36,\n          height: 36,', text)
text = re.sub(r'fontSize: 13,\n\s+fontWeight: 800,\n\s+color: hov \? ACCENT : AMBER_DARK', r'fontSize: 16,\n          fontWeight: 800,\n          color: hov ? ACCENT : AMBER_DARK', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Replaced')
