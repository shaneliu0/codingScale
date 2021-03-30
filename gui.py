import tkinter as tk
from unzipFiles import *
#https://storage.googleapis.com/codingscale-aa52f.appspot.com/Lab%205.4%20-%20Vending%20Machines%20(fixed).zip
inputList = []

def delet():
    delete(fp.get()+r"\unzipped")

def run():
    
    for x in range(int(inputs.get())):
        print((frm.grid_slaves(4+x,1))[0])
        entry = frm.grid_slaves(4+x,1)[0].get()
        print(entry)
        inputList.append(entry) 
    
    
    print("running")
    createPath(fp.get(), r"\unzipped")
    unzip(fp.get(), url.get())
    directory = fp.get() + r"\unzipped"
    x=6+int(inputs.get())
    #for n in getNames():
    for f in os.listdir(directory):
            print(f)
            #if int(inputs.get())>1:
                #output = getOutput(directory+"\\"+f, inputList)
            #else:
                #output = runFiles( directory+"\\"+f, inputList)
            output = getOutput(directory+"\\"+f, inputList)
            print(output)
            print(x)
            out = tk.Label(frm, text = output, bg ="black", fg="white" )
            filename = tk.Label(frm, text = f, bg ="black", fg="white" )
            filename.grid(row = x, column = 1, padx =5, pady =5)
            out.grid(row = x, column = 2, padx =5, pady=5)
            x+=1
            tfile = open("output.txt", "a")
            tfile.write(f+":\n"+output+"\n\n\n")
            tfile.close()
    bdelete.grid(row = x, column = 2, padx=5, pady=5)
    
    
def nextButtons():
    if inputs.get() != '0':
        l4 = tk.Label(frm, text = "Pre-enter the inputs in the text fields below")
        l4.grid(row = 3, column=0, padx=5, pady=5)

    for x in range(int(inputs.get())):
        inpLabel = tk.Label(frm, text = "input"+str(x+1))
        inpLabel.grid(row = 3+x+1, column =0, padx=5, pady=5)
        inpEntry = tk.Entry(frm, width = 30)
        inpEntry.grid(row=3+x+1, column =1, padx=5, pady=5)
    bdone = tk.Button(frm, text = "Done", command = run)
    bdone.grid(row=(5+int(inputs.get())), column=1, padx=5, pady=5) 
    
  
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


l3 = tk.Label(frm, text = "Enter the number of inputs you'd like to send: ")
l3.grid(row=2, column=0, padx=5, pady=5)
inputs = tk.Entry(frm)
inputs.grid(row=2, column=1, padx=5, pady=5)

bok = tk.Button(frm, text = "Ok", command = nextButtons)
bok.grid(row=2, column=2, padx=5, pady=5)



bdelete = tk.Button(frm, text = "Delete files", command = delet)

#frm.destroy()

resultsfrm = tk.Frame(window)
frm.grid(row=1, column=0)


#window.mainloop()

