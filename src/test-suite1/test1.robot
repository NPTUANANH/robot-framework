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
    ${mainPage}    Browser.New Page    https://incomeinsights.development.demo.verifier.me/?accessCode=FD6464&tusid=000008&intro=true    wait_until=networkidle
    ${mailDev}    Browser.New Page    https://notifications.development.demo.verifier.me/mail/#/
    Browser.Switch Page    ${mainPage}
    Set Browser Timeout    ${old_timeout}
    Set Global Variable   ${mainPage}
    Set Global Variable   ${mailDev}

*** Test Cases ***
Has Title
    Get Title    contains    Data View

Has Input email    
    Fill Text    css=input[id="email"]    anhnguyenautotest@test.com
    Execute Async Javascript    
    
Get Started Link
    ${element}=    Get Element By Role    LINK    name=Get started
    Click    ${element}
    ${heading}=    Get Element By Role    HEADING    name=Installation
    Get Element States    ${heading}    contains    visible
