#!/bin/bash
echo "Running..."
output=$(aws ecr describe-images --repository-name poss11111 --query 'sort_by(imageDetails,& imagePushedAt)[-1]')
echo "Timestamp for image: $($IMAGE_RESPONSE | jq -r '.imagePushedAt')"
echo "IMAGE=$ECR_REGISTRY/$ECR_REPOSITORY:$($IMAGE_RESPONSE | jq -r '.imageTags[0]')" >> $GITHUB_ENV
echo "Finished"