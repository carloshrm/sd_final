FROM openjdk:8-jdk

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Set up Hadoop
ENV HADOOP_VERSION 3.3.6
ENV HADOOP_HOME /opt/hadoop
ENV PATH $HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH

RUN wget -O /tmp/hadoop.tar.gz https://dlcdn.apache.org/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzf /tmp/hadoop.tar.gz -C /opt && \
    rm /tmp/hadoop.tar.gz && \
    mv /opt/hadoop-${HADOOP_VERSION} ${HADOOP_HOME} && \
    mkdir -p /opt/hadoop/logs

# Create working directories
RUN mkdir -p /hadoop/dfs/name && \
    mkdir -p /hadoop/dfs/data

# Create startup scripts directory
RUN mkdir -p /opt/hadoop/scripts

# Copy all startup scripts
COPY start-*.sh /opt/hadoop/scripts/
RUN chmod +x /opt/hadoop/scripts/*.sh

# Ensure all log directories exist
RUN mkdir -p /opt/hadoop/logs

WORKDIR $HADOOP_HOME