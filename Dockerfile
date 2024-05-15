FROM python:3.12.3-slim

ENV ROBOT_TESTS /robot/tests
ENV ROBOT_OPTIONS --outputdir /robot/reports --loglevel DEBUG

WORKDIR /robot

# Install nodejs 18.x. It is required to install robotframework-browser
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir --upgrade robotframework-browser
RUN rfbrowser init
RUN npx playwright install-deps

COPY src /robot/tests

COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]