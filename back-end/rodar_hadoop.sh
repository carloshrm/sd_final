#!/bin/bash

set -e

INPUT_DIR="/user/hadoop/in"
OUTPUT_DIR="/user/hadoop/out"
LOCAL_INPUT_DIR="./imagens"
HADOOP_JAR="hadoop-mapreduce/JobProcessamentoImagens.jar"
MAIN_CLASS="ProcImgDriver"
SERVER_PATH="/resultados" 
PROCESSING_TYPE="$1" # cinza ou contraste

echo '!! >> Limpando os diretorios de entrada e saida...'

hadoop fs -rm -r $INPUT_DIR || true
hadoop fs -rm -r $OUTPUT_DIR || true
hadoop fs -rm -r $SERVER_PATH || true

if [ -d "./resultados" ]; then
  rm -rf ./resultados/*
else
  mkdir -p "./resultados"
fi


hdfs dfs -mkdir -p $INPUT_DIR
hdfs dfs -mkdir -p $SERVER_PATH

echo '!! >> Copiando as imagens para o HDFS...'
# 3. Upload images to HDFS
hdfs dfs -put $LOCAL_INPUT_DIR/* $INPUT_DIR/

echo '!! >> Executando o job do Hadoop...'
# 4. Run Hadoop job
hadoop jar $HADOOP_JAR \
  $PROCESSING_TYPE \
  $INPUT_DIR \
  $OUTPUT_DIR \
  $SERVER_PATH

# check if local server path exists, if not create it, if it does then clear it

hdfs dfs -get "$SERVER_PATH/*" "./resultados/"