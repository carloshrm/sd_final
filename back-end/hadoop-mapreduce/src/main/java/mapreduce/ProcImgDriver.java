package mapreduce;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class ProcImgDriver {
  public static void main(String[] args) throws Exception {
    if (args.length < 3) {
      System.err.println("Erro no comando, exemplo:  <tipo_processamento> <dir_entrada> <dir_saida> <dir_servidor>");
      System.exit(2);
    }


    String processingType = args[0]; 
    String inputPath = args[1]; 
    String outputPath = args[2]; 
    String serverPath = args[3]; 
    System.out.println("Tipo de processamento: " + processingType);
    System.out.println("Diretorio de entrada: " + inputPath);
    System.out.println("Diretorio de saida: " + outputPath);
    System.out.println("Diretorio do servidor: " + serverPath);
    Configuration conf = new Configuration();
    conf.set("processing.type", processingType);
    conf.set("output.dir", serverPath); 

    Job job = Job.getInstance(conf, "Processamento de Imagens");
    job.setJarByClass(ProcImgDriver.class);
    job.setMapperClass(ProcImgMapper.class);
    job.setNumReduceTasks(0);

    job.getConfiguration().set("mapreduce.output.fileoutputformat.outputdir.overwrite", "true");
    job.setInputFormatClass(FormatoArquivoInteiro.class);

    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(BytesWritable.class);

    FileInputFormat.addInputPath(job, new Path(inputPath));
    FileOutputFormat.setOutputPath(job, new Path(outputPath));

    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}
