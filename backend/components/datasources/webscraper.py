from bs4 import BeautifulSoup
import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait 


url = 'https://www.purdue.edu/directory/'

driver = webdriver.Chrome(executable_path='./chromedriver')
driver.get(url)

search_input = driver.find_element_by_id('basicSearchInput')
search_button = driver.find_element_by_id('glass')
search_input.send_keys('PATRICIA M. WOLF')
##search_input.send_keys('CHIRAYU GARG')
search_button.click()

driver.implicitly_wait(10)

lists = driver.find_elements_by_class_name("more")
print(len(lists))
if (len(lists) > 1):
    for index in range(1, len(lists) + 1):
        name = driver.find_element_by_xpath('//*[@id="results"]/ul/li[' + str(index) + ']/table/thead/tr/th/h2').text
        alias = driver.find_element_by_xpath('//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[1]/td').text
        ##//*[@id="results"]/ul/li[1]/table/tbody/tr[1]/td
        ##//*[@id="results"]/ul/li[2]/table/tbody/tr[1]/td
        email = driver.find_element_by_xpath('//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[2]/td/a').text
        department = driver.find_element_by_xpath('//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[4]/td').text
        title = driver.find_element_by_xpath('//*[@id="results"]/ul/li[' + str(index)+ ']/table/tbody/tr[5]/td').text
        ##school = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/tbody/tr[6]/td').text
        info = [name, alias, email, department, title];
        ##info = [name, alias, email, department, title, school];
        print(info);
else:
    ##a = driver.find_elements_by_class_name("cn-name").get_attribute("textContent")
    name = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/thead/tr/th/h2').text
    alias = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/tbody/tr[1]/td').text
    email = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/tbody/tr[2]/td/a').text
    department = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/tbody/tr[4]/td').text
    title = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/tbody/tr[5]/td').text
    ##school = driver.find_element_by_xpath('//*[@id="results"]/ul/li/table/tbody/tr[6]/td').text
    info = [name, alias, email, department, title];
    ##info = [name, alias, email, department, title, school];

    print(info);

driver.quit()


##soup = BeautifulSoup(page.content, 'html.parser')
##print(page)

