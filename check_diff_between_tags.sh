#!/bin/bash
echo "Running..."
srcCode=false
tfCode=false
for i in $(git diff --name-only $(git tag --sort version:refname | tail -n 2 | head -n 1) $(git tag --sort version:refname | tail -n 1))
do
  if [[ "$i" == *"src/"*  && !$srcCode ]];
  then
    srcCode=true
  fi
  if [[ "$i" == *"tfe/"* && !$tfCode ]];
  then
    tfCode=true
  fi
done

parsedTag=${GITHUB_REF##*/}

echo "::set-output name=srcCode::$srcCode"
echo "::set-output name=tfCode::$tfCode"
echo "::set-output name=parsedTag::$parsedTag"
echo "Finished"


