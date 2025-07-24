package mapreduce;

import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.conf.Configuration;

public class ProcImgMapper extends Mapper<Text, BytesWritable, Text, BytesWritable> {
  private String operation;
  private static final double FATOR_AUMENTO_CONTRASTE = 2.5;

  @Override
  protected void setup(Context context) {
    operation = context.getConfiguration().get("processing.type");
  }

  @Override
  public void map(Text key, BytesWritable value, Context context)
      throws IOException, InterruptedException {
    Configuration conf = context.getConfiguration();
    FileSystem fs = FileSystem.get(conf);

    try {
      byte[] imageBytes = value.copyBytes();
      ByteArrayInputStream bais = new ByteArrayInputStream(imageBytes);
      BufferedImage image = ImageIO.read(bais);

      if (image == null) {
        context.getCounter("Processamento de Imagens", "Imagem Invalida").increment(1);
        return;
      }

      String formatName = getFormatName(key.toString());
      System.out.println(":: !! Processando o arquivo >>" + key.toString());
      String originalFileName = new java.io.File(key.toString()).getName(); 

      // Generate output path
      Path outputPath = new Path(conf.get("output.dir") + "/" + originalFileName);

      BufferedImage processedImage = processarImagem(image);

      // Create output stream to HDFS
      try (FSDataOutputStream out = fs.create(outputPath, true)) {
        if (!ImageIO.write(processedImage, formatName, out)) {
          context.getCounter("Processamento de Imagens", "Formato invalido").increment(1);
        } else {
          context.getCounter("Processamento de Imagens", "Sucesso").increment(1);
        }
      }

    } catch (Exception e) {
      e.printStackTrace();
      context.getCounter("Processamento de Imagens", "Erro").increment(1);
    }
  }

  private BufferedImage processarImagem(BufferedImage original) {
    if ("cinza".equals(operation)) {
      return converterParaCinza(original);
    } else if ("contraste".equals(operation)) {
      return melhorarContraste(original);
    }
    return original;
  }

  private BufferedImage converterParaCinza(BufferedImage original) {
    BufferedImage imgCinza = new BufferedImage(
        original.getWidth(), original.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
    imgCinza.getGraphics().drawImage(original, 0, 0, null);
    return imgCinza;
  }

  private BufferedImage melhorarContraste(BufferedImage original) {
    BufferedImage imgContraste = new BufferedImage(
        original.getWidth(), original.getHeight(), original.getType());

    for (int y = 0; y < original.getHeight(); y++) {
      for (int x = 0; x < original.getWidth(); x++) {
        Color color = new Color(original.getRGB(x, y));
        int r = processarContraste(color.getRed());
        int g = processarContraste(color.getGreen());
        int b = processarContraste(color.getBlue());
        imgContraste.setRGB(x, y, new Color(r, g, b).getRGB());
      }
    }
    return imgContraste;
  }

  private int processarContraste(int value) {
    double normalizado = value / 255.0;
    double contrasteAplicado = (((normalizado - 0.5) * FATOR_AUMENTO_CONTRASTE) + 0.5);
    return (int) (Math.max(0, Math.min(1, contrasteAplicado)) * 255);
  }

  private String getFormatName(String filename) {
    String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    if (extension.isEmpty()) {
      return "png";
    }

    if (extension.equals("jpg")) {
      extension = "jpeg";
    } 
    return extension;
  }
}