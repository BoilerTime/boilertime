from bs4 import BeautifulSoup
import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.common.by import By
import pandas as pd
import json

##professors = []
##professors = pd.read_json('../../professors.json') 

with open('../../professors.json', 'r') as f:
    professors = json.load(f)


url = 'https://www.purdue.edu/directory/'

driver = webdriver.Chrome(executable_path='./chromedriver')
driver.get(url)

search_input = driver.find_element(By.ID, 'basicSearchInput')
search_button = driver.find_element(By.ID, 'glass')

for professor in professors:
    print(professor)
    search_input = driver.find_element(By.ID, 'basicSearchInput')
    search_input.send_keys(professor)
    ##search_input.send_keys('CHIRAYU GARG')
    search_button = driver.find_element(By.ID, 'glass')
    search_button.click()

    ##driver.implicitly_wait(10)

    lists = driver.find_elements(By.CLASS_NAME, 'more')
    if (len(lists) > 1):
        for index in range(1, len(lists) + 1):
            try:
                name = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li[' + str(index) + ']/table/thead/tr/th/h2').text
            except Exception as e:
                name = "Name not found"
            try:
                alias = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[1]/td').text
            except Exception as e:
                alias = "Alias not found"
            try:
                email = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[2]/td/a').text
            except Exception as e:
                email = "Email not found"
            try:
                department = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[4]/td').text
            except Exception as e:
                department = "Department not found"
            try:
                title = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[5]/td').text
            except Exception as e:
                title = "Title not found"

            info = [name, alias, email, department, title]
            print(info)
    elif(len(lists) > 0):
        try:
            name = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li/table/thead/tr/th/h2').text
        except Exception as e:
            name = "Name not found"
            ##print(e)

        try:
            alias = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li/table/tbody/tr[1]/td').text
        except Exception as e:
            alias = "Alias not found"
            ##print(e)

        try:
            email = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li/table/tbody/tr[2]/td/a').text
            //*[@id="results"]/ul/li/table/tbody/tr[3]/td/a
        except Exception as e:
            email = "Email not found"
            ##print(e)

        try:
            department = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li/table/tbody/tr[4]/td').text
        except Exception as e:
            department = "Department not found"
            ##print(e)

        try:
            title = driver.find_element(By.XPATH, '//*[@id="results"]/ul/li/table/tbody/tr[5]/td').text
        except Exception as e:
            title = "Title not found"
            ##print(e)

        info = [name, alias, email, department, title]
        print(info)

    search_input = driver.find_element(By.ID, 'basicSearchInput')
    search_input.clear()

driver.quit()


##soup = BeautifulSoup(page.content, 'html.parser')
##print(page)

