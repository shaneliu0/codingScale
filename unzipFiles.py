from bs4 import BeautifulSoup
import requests
import tkinter as tk
import os
import shutil
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile

#dictionary #contains name, file

def createPath():
    file_path = input("Enter the file path you would like to extract the files to: ")#r"C:\Users\name\directory\CodingScale"
    file_path = file_path + r"\unzipped"

    #creates a folder to unzip all files
    try:
        os.mkdir(file_path)
    except OSError:
        print("folder already exists")
    return file_path
    
def unzip(file_path):
    domain = "https://github.com"#website domain
    theurl = input("Enter the url for where all the zip files are uploaded: ")#testing url: https://github.com/Whitetiger094/BetaAmazonShopping
    page = requests.get(theurl)


    html =page.text
    soup = BeautifulSoup(html, "html.parser")

    for link in soup.find_all('a'):
        url =link.get('href')
        if ".zip" in url:
            #file_name = url[url.rfind("/")+1:]#can find student's name, then save name and file/url to dictionary
            zipurl = domain + url
            with urlopen(zipurl) as zipresp:
                with ZipFile(BytesIO(zipresp.read())) as zfile:
                    zfile.extractall(file_path)
                    #import index 
    print("files have been downloaded")
                    
def renameFiles(file_path, projDict):#projects is a dictionary
    projects = projDict.get("projects")
    x=0
    for f in os.listdir(file_path):
        os.rename(f, projects[x].get("name"))
        x++

                
#delete unzipped files and zipfiles when done
def delete(file_path):
    x = input("Would you like to delete the files now?(1=yes, 2= no)")#will have buttons for this in gui
    if x== 2:
        shutil.rmtree(file_path)


def main():
    fpath = createPath()
    unzip(fpath)
    #renameFiles(fpath, dictionary)
    delete(fpath)
    
main()



        
