import tkinter as tk
from unzipFiles import *

def delet():
    delete(fp.get()+r"\unzipped")

def run():
    print("running")
    createPath(fp.get(), r"\unzipped")
    unzip(fp.get(), url.get())
    directory = fp.get() + r"\unzipped"
    x=3
    #input = popup()#call run files and return input each time, so maybe do like if input exists do runFile, else do whatever is there now
    for n in getNames():
        for f in os.listdir(directory+"\\"+n):
            print(f)
            output = getOutput(directory+f, f)
            print(output)
            print(x)
            out = tk.Label(frm, text = output, bg ="black", fg="white" )
            filename = tk.Label(frm, text = f, bg ="black", fg="white" )
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


#window.mainloop()
