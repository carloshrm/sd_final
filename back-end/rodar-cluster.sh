#!/bin/bash

set -e

# Path configuration
INPUT_DIR="/user/hadoop/in"
OUTPUT_DIR="/user/hadoop/out"
LOCAL_INPUT_DIR="./imagens"  # On host machine
HADOOP_JAR="/opt/hadoop/jobs/JobProcessamentoImagens.jar"  # Inside container
MAIN_CLASS="ProcImgDriver"
SERVER_PATH="/resultados"
PROCESSING_TYPE="$1"  # cinza ou contraste

# Clean HDFS directories
echo "!! >> Cleaning HDFS directories..."
docker exec namenode hadoop fs -rm -r $INPUT_DIR || true
docker exec namenode hadoop fs -rm -r $OUTPUT_DIR || true
docker exec namenode hadoop fs -rm -r $SERVER_PATH || true

# Prepare local directories
mkdir -p ./resultados

# Create HDFS directories
echo "!! >> Creating HDFS directories..."
docker exec namenode hdfs dfs -mkdir -p $INPUT_DIR
docker exec namenode hdfs dfs -mkdir -p $SERVER_PATH

# Upload files to HDFS (fixed approach)
echo "!! >> Uploading images to HDFS..."
for file in $LOCAL_INPUT_DIR/*; do
  filename=$(basename "$file")
  docker cp "$file" namenode:/tmp/
  docker exec namenode hdfs dfs -put "/tmp/$filename" $INPUT_DIR/
  docker exec namenode rm "/tmp/$filename"
done

# Run Hadoop job
echo "!! >> Running Hadoop job..."
docker exec namenode hadoop jar $HADOOP_JAR \
  $PROCESSING_TYPE \
  $INPUT_DIR \
  $OUTPUT_DIR \
  $SERVER_PATH

# Get results
echo "!! >> Downloading results..."
docker exec namenode hdfs dfs -getmerge "$SERVER_PATH/*" "/tmp/resultados"
docker cp namenode:/tmp/resultados ./resultados/
docker exec namenode rm -f "/tmp/resultados"

echo "!! >> Processing complete! Results in ./resultados"