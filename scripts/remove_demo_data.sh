#!/bin/bash

set -e

# You must have jq installed in your computer

# ======================================================================================================================================
# USER CONFIGURATIONS
# ======================================================================================================================================

export BASE_URL="http://localhost/api"

# ======================================================================================================================================
# DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING
# ======================================================================================================================================

# Get User List
export USER_ID_LIST=$(curl -ks "${BASE_URL}/get" -H 'Content-Type: application/json' | jq -r '.[].id' | paste -sd, -)

IFS=',' read -ra ADDR <<< "${USER_ID_LIST}"
for USER_ID in "${ADDR[@]}"; do

    ## GET-Token
    BEARER_TOKEN=$(curl -ks "${BASE_URL}/token" -H 'Content-Type: application/json' | jq -r '.token')

    ## DELETE-Request
    curl -X "DELETE" "${BASE_URL}/delete/${USER_ID}" \
      -H 'Content-Type: application/json' \
      -H "Authorization: Bearer ${BEARER_TOKEN}"

    # Line Break                  
    printf "\n"
done

# ======================================================================================================================================