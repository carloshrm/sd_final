# base image

# FROM eclipse-temurin:8-jre-jammy

# # Hadoop version and paths
# ENV HADOOP_VERSION=3.3.6
# ENV HADOOP_HOME=/opt/hadoop
# ENV HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
# ENV PATH=$PATH:$HADOOP_HOME/bin

# # Install minimal dependencies (no SSH needed for client)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     curl \
#     net-tools \
#     && rm -rf /var/lib/apt/lists/*

# # Download and extract Hadoop
# RUN mkdir -p $HADOOP_HOME && \
#     curl -sL https://archive.apache.org/dist/hadoop/common/hadoop-$HADOOP_VERSION/hadoop-$HADOOP_VERSION.tar.gz | \
#     tar xz -C $HADOOP_HOME --strip-components=1

# # Create config dir (we'll bind-mount configs at runtime)
# RUN mkdir -p $HADOOP_CONF_DIR

# WORKDIR $HADOOP_HOME

# # Just keep the container alive
# CMD ["tail", "-f", "/dev/null"]

# client dockerfile

FROM cliente-hadoop

# Expose NodeManager ports
EXPOSE 8042 8088 45454

# Start NodeManager (override CMD)
CMD ["yarn", "nodemanager"]