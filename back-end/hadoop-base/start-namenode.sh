#!/bin/bash

# Source Hadoop environment variables
source ${HADOOP_HOME}/etc/hadoop/hadoop-env.sh

# Ensure log directory exists
mkdir -p ${HADOOP_HOME}/logs

# Check if storage directory is empty (not formatted)
if [ ! -d /hadoop/dfs/name/current ]; then
  echo "Formatting NameNode..."
  ${HADOOP_HOME}/bin/hdfs namenode -format -nonInteractive ${CLUSTER_NAME} > ${HADOOP_HOME}/logs/namenode-format.log 2>&1
fi

echo "Starting NameNode..."
${HADOOP_HOME}/bin/hdfs --daemon start namenode > ${HADOOP_HOME}/logs/namenode.log 2>&1

# Keep container running
tail -f ${HADOOP_HOME}/logs/namenode.log