#!/bin/bash

set -e

# You must have jq installed in your computer

# ======================================================================================================================================
# USER CONFIGURATIONS
# ======================================================================================================================================

export BASE_URL="http://localhost/api"
export DATA_FILE="./data.json"

# ======================================================================================================================================
# DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING
# ======================================================================================================================================

jq -c '.[]' ${DATA_FILE} | while read USER; do

    ## GET-Token
    BEARER_TOKEN=$(curl -ks "${BASE_URL}/token" -H 'Content-Type: application/json' | jq -r '.token')

    ## POST-Request
    curl -X "POST" "${BASE_URL}/post" \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer ${BEARER_TOKEN}" \
        -d $"{
              \"name\": \"$(echo ${USER} | jq -r '.FullName')\",
              \"email\": \"$(echo ${USER} | jq -r '.Email')\",
              \"age\": $(echo ${USER} | jq -r '.Age')
            }"

    # Line Break
    printf "\n"
done

# ======================================================================================================================================