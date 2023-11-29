import pyautogui

# スクショ範囲
left = 120
top = 150
width = 150
height = 500

# スクショ取得
pyautogui.screenshot('img.png', region=(left,top,width,height))
