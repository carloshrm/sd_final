#!/bin/bash

# Start SSH
sudo service ssh start

# Format HDFS (only on namenode)
if [ "$HOSTNAME" = "namenode" ]; then
    echo "Y" | hdfs namenode -format
    start-dfs.sh
    start-yarn.sh
    hdfs dfs -mkdir -p /user/hadoop
    hdfs dfs -chmod -R 777 /
fi

# Keep the container running
tail -f /dev/null