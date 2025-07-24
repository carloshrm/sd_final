#!/bin/bash

# Source Hadoop environment
source ${HADOOP_HOME}/etc/hadoop/hadoop-env.sh

# Ensure log directory exists
mkdir -p ${HADOOP_HOME}/logs

# Wait for NameNode to be ready
while ! nc -z namenode 9000; do
  echo "Waiting for NameNode..."
  sleep 2
done

echo "Starting DataNode..."
${HADOOP_HOME}/bin/hdfs --daemon start datanode > ${HADOOP_HOME}/logs/datanode.log 2>&1

# Keep container running
tail -f ${HADOOP_HOME}/logs/datanode.log