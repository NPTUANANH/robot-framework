*** Settings ***
Library    Browser

Suite Setup    Do Something
Suite Teardown    Browser.Close Browser

*** Keywords ***
Do Something
    New Page    https://playwright.dev/

*** Test Cases ***
Has Title 2
    Get Title    contains    Playwright

Get Started Link 2
    ${element}=    Get Element By Role    LINK    name=Get started
    Click    ${element}
    ${heading}=    Get Element By Role    HEADING    name=Installation
    Get Element States    ${heading}    contains    visible
