#!/bin/bash

DEPLOY_SERVER=10.3.12.70

echo "Deploying to ${DEPLOY_SERVER}"
ssh root@${DEPLOY_SERVER} 'bash' < ./deploy/server.sh
