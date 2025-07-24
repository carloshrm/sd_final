#!/bin/bash

mvn clean package
cp target/JobProcessamentoImagens-jar-with-dependencies.jar ../hadoop-mapreduce/JobProcessamentoImagens.jar