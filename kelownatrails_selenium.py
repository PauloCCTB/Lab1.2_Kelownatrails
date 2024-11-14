from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
driver.get("https://test-devops2lab11-phmunhoz.web.appl") 

try:
    firstname_field = driver.find_element(By.ID, "firstname")
    lastname_field = driver.find_element(By.ID, "lastname")
    group_size_field = driver.find_element(By.ID, "GroupSize")
    add_member_button = driver.find_element(By.ID, "addMemberBtn")
    disc_rate_field = driver.find_element(By.ID, "discRate")

    firstname_field.send_keys("John")
    lastname_field.send_keys("Doe")
    
    test_cases = [
        (4, "50.00"),   # No discount
        (6, "45.00"),   # 10% discount
        (15, "40.00"),  # 20% discount
        (30, "37.50")   # 25% discount
    ]

    for group_size, expected_rate in test_cases:
        group_size_field.clear()
        group_size_field.send_keys(str(group_size))

        add_member_button.click()

        time.sleep(1)

        actual_rate = disc_rate_field.get_attribute("value")
        assert actual_rate == expected_rate, f"Expected {expected_rate}, but got {actual_rate} for group size {group_size}"

        print(f"Test passed for group size {group_size}: Discounted rate is {actual_rate}")

finally:
    driver.quit()
