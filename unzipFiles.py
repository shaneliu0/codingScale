from bs4 import BeautifulSoup
import requests
import os, shutil, subprocess
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile
import pexpect
#user has to enter google login
#creates a folder to unzip all files
names = []

def getNames():
    #names.append("test1")
    return names


def createPath(file_path, folder):
    try:
        os.mkdir(file_path+"\\"+folder)
    except OSError:
        print("folder already exists")
    return file_path + '\\' + folder
    
def unzip(file_path, theurl):
    domain = "https://github.com"#website domain
    #testing url: https://github.com/Whitetiger094/BetaAmazonShopping
    page = requests.get(theurl)


    html =page.text
    soup = BeautifulSoup(html, "html.parser")

    for link in soup.find_all('a'):
        url =link.get('href')
        
        if ".zip" in url:
            file_name = url[url.rfind("/")+1:]
            names.append(file_name)
            fp = createPath(file_path+r"\unzipped", file_name)
            zipurl = domain + url
            print(zipurl)
            with urlopen(zipurl) as zipresp:
                with ZipFile(BytesIO(zipresp.read())) as zfile:
                    zfile.extractall(fp)
    print("files have been downloaded") #https://github.com/Whitetiger094/BetaAmazonShopping/archive/main.zip

def runFiles(directory, inpu):
    for folder in os.listdir(directory):
        for f in os.listdir(directory+"\\"+folder):
            if f.endswith(".py"):
                pp = subprocess.Popen('python '+f, shell = True, capture_output=True, text=True, cwd = directory+"\\"+folder, stdin = subprocess.PIPE)#, stdout = PIPE)
                x = pp.communicate(inpu[0])
                """
                p = subprocess.run('python '+f, shell = True, capture_output = True, text=True, cwd = directory)
                return(p.stdout)
                """
        #import index
    return pp.stdout
#rename files to student name
def renameFiles(file_path, projDict):
    projects = projDict.get("projects")
    x=0
    for f in os.listdir(file_path):
        os.rename(f, projects[x].get("name"))
        x+=1


def getOutput(directory, inputList):
    childOutput = ""
    for folder in os.listdir(directory):
        for f in os.listdir(directory+"\\"+folder):
            if f.endswith(".py"):
                print(f)
                child = pexpect.spawn('python3 '+file)
                child.setwinsize(100,100)
    
                
    
                for x in inputList:
                    child.expect(" ")
                    child.sendLine(x)
                    childOutput += child.before.decode('utf-8').splitlines()+"\n"    
        
            if childOutput != "":
                return childOutput
    
        
    
        
    
#delete unzipped files and zipfiles when done
def delete(file_path):
    shutil.rmtree(file_path)

        
