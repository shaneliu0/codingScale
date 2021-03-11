from bs4 import BeautifulSoup
import requests
import os, shutil, subprocess
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile

#creates a folder to unzip all files
def createPath(file_path):
    try:
        os.mkdir(file_path+r"\unzipped")
    except OSError:
        print("folder already exists")
    #return file_path
    
def unzip(file_path, theurl):
    domain = "https://github.com"#website domain
    #testing url: https://github.com/Whitetiger094/BetaAmazonShopping
    page = requests.get(theurl)


    html =page.text
    soup = BeautifulSoup(html, "html.parser")

    for link in soup.find_all('a'):
        url =link.get('href')
        if ".zip" in url:
            #file_name = url[url.rfind("/")+1:]
            zipurl = domain + url
            with urlopen(zipurl) as zipresp:
                with ZipFile(BytesIO(zipresp.read())) as zfile:
                    zfile.extractall(file_path+r"\unzipped")
    print("files have been downloaded")
    
def runFiles(file):
    if file.endswith('.py'):
        p = subprocess.Popen(['python', r"C:\Users\trish\Desktop\advsd\Python\OOP"+file], stdout = subprocess.PIPE)
        return p.stdout  
 
 
#rename files to student name
#Should create folder per name, then take renamed file and put it in there
def renameFilesC(file_path, projDict):
    projects = projDict.get("projects")
    x=0
    y = ""
    for f in os.listdir(file_path):
        os.rename(f, projects[x].get("name"))
        try:
            os.mkdir(file_path+r"\Name:"+projects[x].get("name"))
        except OSError:
            print("folder already exists")
        projects[x] = y
        y.extractall(file_path+r"\Name:"+projects[x].get("name"))
        x+=1
    

def getOutput(directory, f):
    if f.endswith(".py"):
        p = subprocess.run('python '+f, shell = True, capture_output = True, text=True, cwd = directory)
        return(p.stdout)
        
    
#delete unzipped files and zipfiles when done
def delete(file_path):
    shutil.rmtree(file_path)