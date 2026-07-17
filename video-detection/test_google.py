from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Open Chrome
driver = webdriver.Chrome()

# Go to Google
driver.get("https://www.google.com")

# Find the search box and type something
search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("Selenium Python tutorial")
search_box.send_keys(Keys.RETURN)

# Wait a bit so you can see the results
time.sleep(3)

# Check that results loaded
assert "Selenium" in driver.title
print("Test passed! Page title:", driver.title)

# Close the browser
driver.quit()