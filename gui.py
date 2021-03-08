import tkinter as tk
from unzipFiles import *

def delet():
    delete(fp.get()+r"\unzipped")

def run():
    print("running")
    createPath(fp.get())
    unzip(fp.get(), url.get())
    directory = fp.get()+r"\unzipped"
    x=3
    for f in os.listdir(directory):
        print(f)
        output = getOutput(directory, f)
        print(output)
        print(x)
        out = tk.Label(frm, text = output)
        filename = tk.Label(frm, text = f)
        filename.grid(row = x, column = 1, padx =5, pady =5)
        out.grid(row = x, column = 2, padx =5, pady=5)
        x+=1
    bdelete.grid(row = x, column = 2, padx=5, pady=5)
    
  
window = tk.Tk()
frm = tk.Frame(window)
frm.grid(row=0, column=0)

window.geometry("1000x1000")
l1 = tk.Label(frm, text="Enter the file path you would like to extract the files to: ")
l1.grid(row=0,column=0, padx=5, pady=5)
fp = tk.Entry(frm, width=30)
fp.grid(row=0,column=1, padx=5, pady=5)

l2 = tk.Label(frm, text="Enter the url for where all the zip files are uploaded: ")
l2.grid(row=1,column=0, padx=5, pady=5)
url = tk.Entry(frm, width=30)
url.grid(row=1,column=1, padx=5, pady=5)

bdone = tk.Button(frm, text = "Done", command = run)
bdone.grid(row=2, column=1, padx=5, pady=5)

bdelete = tk.Button(frm, text = "Delete files", command = delet)

#frm.destroy()

resultsfrm = tk.Frame(window)
frm.grid(row=1, column=0)


window.mainloop()

