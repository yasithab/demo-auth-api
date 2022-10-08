#!/bin/bash

set -e

# You must have jq installed in your computer

# ======================================================================================================================================
# USER CONFIGURATIONS
# ======================================================================================================================================

export BASE_URL="http://localhost/api"
export DATA_FILE="./names.list"

# ======================================================================================================================================
# DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING
# ======================================================================================================================================

while IFS="" read -r NAME || [ -n "${NAME}" ]
do
    # Generate Random Age
    RANDOM_AGE=$(echo $[ ${RANDOM} % 90 + 10 ])

    ## GET-Token
    BEARER_TOKEN=$(curl -ks "${BASE_URL}/token" -H 'Content-Type: application/json' | jq -r '.token')

    ## POST-Request
    curl -X "POST" "${BASE_URL}/post" \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer ${BEARER_TOKEN}" \
        -d $"{
                \"name\": \"${NAME}\",
                \"age\": ${RANDOM_AGE}
            }"

    # Line Break                  
    printf "\n"
done < "${DATA_FILE}"

# ======================================================================================================================================