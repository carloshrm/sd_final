# hdfs --daemon stop namenode
# hdfs --daemon stop datanode

$HADOOP_HOME/sbin/stop-yarn.sh
$HADOOP_HOME/sbin/stop-dfs.sh

# rm -rf /tmp/hadoop-$(whoami)/*

$HADOOP_HOME/sbin/start-dfs.sh
$HADOOP_HOME/sbin/start-yarn.sh

# hdfs --daemon start namenode
# hdfs --daemon start datanode
# hdfs dfsadmin -report

# hdfs --daemon stop namenode
# $HADOOP_HOME/bin/yarn --daemon stop resourcemanager
# hdfs --daemon start namenode
# $HADOOP_HOME/bin/yarn --daemon start resourcemanager
hdfs dfsadmin -safemode leave