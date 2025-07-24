# docker build -t cliente-hadoop .
# hdfs --daemon start datanode
# hdfs dfsadmin -report

CURRENT_IP=$(hostname -I | awk '{print $1}')

docker run -d --name hadoop-worker-1 \
  --hostname hadoop-worker-1 \
  --network hadoop-net \
  --add-host="hadoop-resourcemanager:$CURRENT_IP" \
  --add-host="hadoop-namenode:$CURRENT_IP" \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w1/yarn-site.xml:/opt/hadoop/etc/hadoop/yarn-site.xml \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w1/hdfs-site.xml:/opt/hadoop/etc/hadoop/hdfs-site.xml \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w1/core-site.xml:/opt/hadoop/etc/hadoop/core-site.xml \
  -v /data/worker1:/hadoop/data \
  -p 8042:8042 \
  -p 45454:45454 \
  hadoop-worker \
  bash -c "hdfs datanode & yarn nodemanager"

docker run -d --name hadoop-worker-2 \
  --hostname hadoop-worker-2 \
  --network hadoop-net \
  --add-host="hadoop-resourcemanager:$CURRENT_IP" \
  --add-host="hadoop-namenode:$CURRENT_IP" \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w2/yarn-site.xml:/opt/hadoop/etc/hadoop/yarn-site.xml \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w2/hdfs-site.xml:/opt/hadoop/etc/hadoop/hdfs-site.xml \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w2/core-site.xml:/opt/hadoop/etc/hadoop/core-site.xml \
  -v /data/worker2:/hadoop/data \
  -p 8043:8042 \
  hadoop-worker \
  yarn nodemanager \
  bash -c "hdfs datanode & yarn nodemanager"

docker run -d --name hadoop-worker-3 \
  --hostname hadoop-worker-3 \
  --network hadoop-net \
  --add-host="hadoop-resourcemanager:$CURRENT_IP" \
  --add-host="hadoop-namenode:$CURRENT_IP" \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w3/yarn-site.xml:/opt/hadoop/etc/hadoop/yarn-site.xml \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w3/hdfs-site.xml:/opt/hadoop/etc/hadoop/hdfs-site.xml \
  -v /home/cm/Documents/sd-hadoop/hadoop-config/w3/core-site.xml:/opt/hadoop/etc/hadoop/core-site.xml \
  -v /data/worker3:/hadoop/data \
  -p 8044:8042 \
  hadoop-worker \
  bash -c "hdfs datanode & yarn nodemanager"

