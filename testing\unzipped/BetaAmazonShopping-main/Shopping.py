#Project: Create python file that orders products and writes them to a file
#How: Using GUI and buttons, products from a set list will be chosen and in the end shown and added together to show final price(with tax)
#Who: Kunal A, Trisha M, Sri J, and Shane
#Tasks:
#   Kunal: GUI
#   Trisha: Creating product list and pricing
#   Sri: Writing and Reading files
#   Shane: ???

import tkinter as tk

def CreO():
    pass

def CleO():
    word1.set("Order Cleared")

def ViewP():
    pass

def ViewPO():
    pass

win = tk.Tk()
win.title("AMAZON SHOPPING BETA")

word1 = tk.StringVar()
word1.set("Click one of the buttons for your order")

title = tk.Label(textvariable = word1)
button1 = tk.Button(width = 20,text = "Create Order",command = CreO)
button2 = tk.Button(width = 20,text = "Clear Order",command = CleO)
button3 = tk.Button(width = 20,text = "View Products",command = ViewP)
button4 = tk.Button(width = 20,text = "View Previous Orders",command = ViewPO)

title.pack()
button1.pack()
button2.pack()
button3.pack()
button4.pack()

win.mainloop()