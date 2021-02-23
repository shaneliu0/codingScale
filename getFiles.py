from bs4 import BeautifulSoup
import requests
import tkinter as tk
import zipfile
import os
import shutil

file_path = r"C:\Users\trish\Desktop\advsd\CodingScale\unzip"
access_rights = 0o755
try:
    os.mkdir(file_path, access_rights)
except OSError:
    print("file already exists")
    
domain = "https://github.com"
page = requests.get("https://github.com/Whitetiger094/BetaAmazonShopping")#link here would be input by teacher

html =page.text
soup = BeautifulSoup(html, "html.parser")


for link in soup.find_all('a'):
    url =link.get('href')
    if ".zip" in url:
        file_name = url[url.rfind("/")+1:]
        with open(file_name, "wb") as file:
            response = requests.get(domain + url)
            file.write(response.content)
            
            #says permission denied, not really sure how to deal w it
            #with zipfile.ZipFile(r"C:\Users\trish\Desktop\advsd\CodingScale\main.zip","r") as zip_ref:
                #zip_ref.extractall(file_path)
                
                
#delete unzipped files and zipfiles when done?
#deleting unzipped:
#shutil.rmtree(file_path)




        