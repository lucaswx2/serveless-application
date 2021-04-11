npm i -g serveless

serveless

#Fazer deploy
sls deploy

#Invocar na aws
sls invoke -f hello

#Invocar localmente
sls invoke local -f hello --log

#Configurar o dashboard do servemrless
sls dashboard

#logs 
sls logs -f hello -t

#Remover do serveless framework
sls remove