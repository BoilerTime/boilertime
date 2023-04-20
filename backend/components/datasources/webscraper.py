from bs4 import BeautifulSoup
import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.common.by import By
import pandas as pd
import json
import requests
import re
import time

##professors = []
##professors = pd.read_json('../../professors.json') 

with open('../../professors.json', 'r') as f:
    professors = json.load(f)


url = 'https://www.purdue.edu/directory/'

driver = webdriver.Chrome(executable_path='./chromedriver')
driver.get(url)

search_input = driver.find_element(By.ID, 'basicSearchInput')
search_button = driver.find_element(By.ID, 'glass')

f = open("../../professors_updated.json", "a")

jArray = []

##for professor in professors:
for i in range(len(professors)):
    professor = professors[i];
    json_object = {}
    print(professor + ' ' + str(i) + '/6697')
    search_input = driver.find_element(By.ID, 'basicSearchInput')
    search_input.send_keys(professor)
    ##search_input.send_keys('CHIRAYU GARG')
    search_button = driver.find_element(By.ID, 'glass')
    search_button.click()

    ##driver.implicitly_wait(10)

    lists = driver.find_elements(By.CLASS_NAME, 'more')
    ##more_button = driver.find_element(By.CLASS_NAME, 'more-toggle');
    ##more_button.click();
    ##print(str(len(lists)) + ' list of lengths')
    if (len(lists) > 1):
        split = professor.split(',')
        formatted_name = split[1].strip() + ' ' + split[0].strip()
        try:
            res = requests.get('https://api.purdue.io/odata/Instructors?$filter=contains(Name,%27' + formatted_name + '%27)')
            response = json.loads(res.text)
            email = response['value'][0]['Email']
        except Exception as e:
            json_object["name"] = professor
            jArray.append(json_object)
            continue

        for index in range(1, len(lists) + 1):
            should_continue = False
            ##rows = driver.find_elements(By.TAG_NAME, 'tr');
            more_button = driver.find_element(By.CLASS_NAME, 'more-toggle');
            more_button.click();
            rows = driver.find_elements(By.TAG_NAME, 'tr');
            for row in rows:
                split = row.text.split(' ')
                if split[0] == 'EMAIL':
                    if split[1] == email or split[1] == 'jeff@purdue.edu':
                        should_continue = True
                        break
                    else:
                        should_continue = False
            if should_continue:
                for index, row in enumerate(rows):
                    if (index == 0):
                        json_object["name"] = professor
                    else:
                        match = re.match(r'([A-Z]+(?: [A-Z]+)?)\s(.+)', row.text)
                        if match:
                            key, value = match.groups()
                            json_object[key.lower()] = value
                jArray.append(json_object)
                ##print(jArray)
            elif not should_continue and index == len(lists):
                json_object["name"] = professor
                jArray.append(json_object)
                ##print('this is index ' + str(index) + ' and this is the professor ' + professor)
                ##print(jArray)


    elif(len(lists) > 0):
        should_continue = False
        split = professor.split(',')
        formatted_name = split[1].strip() + ' ' + split[0].strip()
        try:
            res = requests.get('https://api.purdue.io/odata/Instructors?$filter=contains(Name,%27' + formatted_name + '%27)')
            response = json.loads(res.text)
            email = response['value'][0]['Email']
            should_continue = True
        except Exception as e:
            should_continue = False
        ##rows = driver.find_elements(By.TAG_NAME, 'tr');
        more_button = driver.find_element(By.CLASS_NAME, 'more-toggle');
        more_button.click();
        rows = driver.find_elements(By.TAG_NAME, 'tr');
        if should_continue:
            for row in rows:
                split = row.text.split(' ')
                if split[0] == 'EMAIL':
                    if split[1] == email:
                    ##if split[1] == 'jeff@purdue.edu':
                        should_continue = True
                    else:
                        should_continue = False
            if should_continue:
                for index, row in enumerate(rows):
                    if (index == 0):
                        json_object["name"] = professor 
                    elif 'OFFICE' in row.text and not 'OFFICE HOURS' in row.text:
                        try:
                            json_object['office'] = row.text.split(' ')[1] + + ' ' + row.text.split(' ')[2]
                        except Exception as e:
                            match = re.match(r'([A-Z]+(?: [A-Z]+)?)\s(.+)', row.text)
                            if match:
                                key, value = match.groups()
                                json_object[key.lower()] = value
                    else:
                        match = re.match(r'([A-Z]+(?: [A-Z]+)?)\s(.+)', row.text)
                        if match:
                            key, value = match.groups()
                            json_object[key.lower()] = value
                jArray.append(json_object)
                ##print(jArray)
            else:
                json_object["name"] = professor 
                jArray.append(json_object)
                ##print(jArray)
        else:
            json_object["name"] = professor 
            jArray.append(json_object)
            ##print(jArray)

    else:
        json_object["name"] = professor 
        jArray.append(json_object)
        ##print(jArray)

    json_string = json.dumps(json_object, ensure_ascii=False, separators=(',', ': '))
    f.write(json_string + ', ')

    search_input = driver.find_element(By.ID, 'basicSearchInput')
    search_input.clear()

##json_string = json.dumps(jArray, ensure_ascii=False, separators=(',', ': '))
##f.write(json_string)
##driver.quit()


##soup = BeautifulSoup(page.content, 'html.parser')
