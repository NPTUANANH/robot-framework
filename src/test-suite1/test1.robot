*** Settings ***
Library    Browser
Library    Selenium2Library
Resource   ${CURDIR}/../utils/email.js

Suite Setup    Setup Tabs
Suite Teardown    Browser.Close Browser

*** Keywords ***
Setup Tabs
    ${old_timeout} =    Set Browser Timeout    1m 30 seconds
    New Browser    chromium    headless=false
    ${mainPage}    Browser.New Page        wait_until=networkidle
    ${mailDev}    Browser.New Page    
    Browser.Switch Page    ${mainPage}
    Set Browser Timeout    ${old_timeout}
    Set Global Variable   ${mainPage}
    Set Global Variable   ${mailDev}

*** Test Cases ***
Has Title
    Get Title    contains    

Has Input email    
    Fill Text    css=input[id="email"]    
    Execute Async Javascript    
    
Get Started Link
    ${element}=    Get Element By Role    LINK    name=Get started
    Click    ${element}
    ${heading}=    Get Element By Role    HEADING    name=Installation
    Get Element States    ${heading}    contains    visible
