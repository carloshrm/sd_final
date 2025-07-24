import express from "express";
import multer from "multer";
import cors from "cors";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'imagens/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });

// este vetor vai armazenar os nomes e urls locais das imagens processadas
let imagensProcessadas = [];

// endpoint para testar se o servidor esta rodando
app.get("/api", (req, res) => {
    res.send("pronto para processar!");
});

// endpoint principal que recebe as imagens, o tipo de processamento e dispara a tarefa do Hadoop
app.post("/api/processar", upload.array("imagens"), (req, res) => {
    const tipo_processamento = req.body.processamento;
    const arquivos = req.files;

    if (!arquivos || arquivos.length === 0) {
        return res.status(500).send("Nenhum arquivo enviado!!");
    }
    
    const imagePaths = arquivos.map((file) => path.resolve(file.path));
    console.log("Tipo de processamento:", tipo_processamento);
    console.log("Arquivos recebidos:", imagePaths);

    // dispara um novo processo pra executar as tarefas de processamento pelo Hadoop
    console.log(`Executando o Hadoop para processar ${imagePaths.length} arquivos.`);
    const processo = spawn("bash", ["rodar_hadoop.sh", tipo_processamento]);

    res.setHeader("Content-Type", "text/plain");

    // res.write envia os dados aos fragmentos para o cliente, mantendo a conexão aberta
    processo.stdout.on("data", (data) => {
        res.write(data);
    });

    processo.stderr.on("data", (data) => {
        res.write(`Info: ${data}`);
    });

    // quando o processo termina, fecha a conexão e envia a resposta final
    processo.on("close", (code) => {
        res.end(`\n O Hadoop terminou o processamento, codigo: ${code}`);
        console.log(`O Hadoop terminou o processamento, codigo: ${code}`);
        imagensProcessadas = imagePaths.map((p) => path.basename(p));

        imagePaths.forEach((p) => {
            fs.unlink(p, (err) => {
                if (err) {
                    console.error(`Erro ao remover o arquivo ${p}:`, err);
                } else {
                    console.log(`Arquivo ${p} removido com sucesso.`);
                }
            });
        });
    });
});

// endpoint que retorna o vetor com as urls das imagens processadas
app.get("/api/resultados", (req, res) => {
    res.json({ imagens: imagensProcessadas });
});

app.use("/resultados", express.static(path.join(__dirname, "resultados")));

app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
