*** Settings ***
Library    Browser

Suite Setup    Do Something
Suite Teardown    Browser.Close Browser

*** Keywords ***
Do Something
    New Page    https://playwright.dev/

*** Test Cases ***
Has Title
    Get Title    contains    Playwright2

Get Started Link
    ${element}=    Get Element By Role    LINK    name=Get started
    Click    ${element}
    ${heading}=    Get Element By Role    HEADING    name=Installation
    Get Element States    ${heading}    contains    visible
