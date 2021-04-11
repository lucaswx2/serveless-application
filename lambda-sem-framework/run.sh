aws iam create-role --role-name lambda-exemplo --assume-role-policy-document file://policies.json | tee logs/role.log


aws lambda create-function --function-name hello-cli --zip-file fileb://function.zip \
--handler index.handler \
--runtime nodejs14.x \
--role arn:aws:iam::372289676674:role/lambda-exemplo | tee logs/create.log


aws lambda invoke --function-name hello-cli --log-type Tail logs/lambda-exec.log


aws lambda update-function-code --zip-file fileb://function.zip --function-name hello-cli --publish | tee logs/update.log


aws lambda delete-function --function-name hello-cli


aws iam delete-role --role-name lambda-example