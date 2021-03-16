from bs4 import BeautifulSoup
import requests
import os, shutil, subprocess
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile
#user has to enter google login
#creates a folder to unzip all files
names = []

def getNames():
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

def runFiles(file):
    if file.endswith('.py'):
        pp = subprocess.Popen('python '+f, shell = True, text=True, cwd = r"C:\Users\trish\Desktop\advsd\CodingScale\unzipped", stdin = PIPE)#, stdout = PIPE)
        x = pp.communicate("5X^2 +6X^1+2X^0")  
    print(pp.stdout)
#rename files to student name
def renameFiles(file_path, projDict):
    projects = projDict.get("projects")
    x=0
    for f in os.listdir(file_path):
        os.rename(f, projects[x].get("name"))
        x+=1


def getOutput(directory, f):
    if f.endswith(".py"):
        p = subprocess.run('python '+f, shell = True, capture_output = True, text=True, cwd = directory)
        return(p.stdout)
        
    
#delete unzipped files and zipfiles when done
def delete(file_path):
    shutil.rmtree(file_path)




        
