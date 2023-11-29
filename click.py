import pyautogui

# 計算結果取得
file = open(R'click.txt', 'r')
data = file.read().splitlines()

# 入力位置
x = 300
y = 190
add = 0

# 計算結果入力
for item in data:
    pyautogui.moveTo(x, y + add)
    pyautogui.click()
    pyautogui.write(item)
    add = add + 48 # 次入力時の高さ調節

# 送信ボタン押下
pyautogui.moveTo(35, 665)
pyautogui.click()