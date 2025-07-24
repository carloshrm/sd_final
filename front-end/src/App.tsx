import { UploadFile, Select } from "antd";
import { RcFile } from "antd/es/upload";
import { useState } from "react";
import SeletorArquivos from "./components/SeletorArquivos";
import * as S from "./styles";

export enum Processamentos {
  Contraste = "contraste",
  Escala_de_cinza = "cinza",
}

function App() {
  const [listaArq, setListaArq] = useState<UploadFile<RcFile>[]>([]);
  const [processamento, setProcessamento] = useState<Processamentos>(Processamentos.Contraste);
  const [executando, setExecutando] = useState<boolean>(false);
  const [resultados, setResultados] = useState<string[]>([]);
  const [logs, setLogs] = useState<string>("");

  const executarUpload = async () => {
    const conteudo = new FormData();

    listaArq.forEach((arq) => conteudo.append("imagens", arq.originFileObj as File));
    setExecutando(true);
    conteudo.append("processamento", processamento);

    const resposta = await fetch("http://localhost:3001/api/processar", {
      method: "POST",
      body: conteudo,
    });

    const leitorDeStream = resposta.body?.getReader();
    const decodificador = new TextDecoder("utf-8");

    if (leitorDeStream) {
      let logCompleto = "";
      while (true) {
        const { done, value } = await leitorDeStream.read();

        if (done) break;

        logCompleto += decodificador.decode(value);
        setLogs(logCompleto);
      }
    }


    const result = await fetch('http://localhost:3001/api/resultados');
    const data = await result.json();
    setResultados(data.imagens);
    setExecutando(false);
  };

  return (
    <S.App>
      <h1>Processamento de Imagens via Apache Hadoop</h1>
      <S.ContainerPrincipal>
        <S.ContainerControles>
          <S.ContainerSelect>
            <h3>
              Selecione o processamento
            </h3>
            <Select
              defaultValue={Processamentos.Contraste}
              onChange={(value) => setProcessamento(value)}
              value={processamento}
            >
              <Select.Option value={Processamentos.Contraste}>
                Contraste
              </Select.Option>
              <Select.Option value={Processamentos.Escala_de_cinza}>
                Escala de cinza
              </Select.Option>
            </Select>
          </S.ContainerSelect>
          <SeletorArquivos listaArq={listaArq} setListaArq={setListaArq} />
          <S.UploadButton
            type="primary"
            size="large"
            onClick={executarUpload}
            disabled={listaArq.length === 0}
            loading={executando}
            style={{ marginTop: 16 }}
          >
            {executando ? "Processando..." : "Iniciar Processamento"}
          </S.UploadButton>


          {resultados.length > 0 && (
            <S.ContainerResultados>
              <h3>Resultados</h3>
              <S.ImgGroup>
                {resultados.map((urlImages, index) => (
                  <S.StyledImg
                    key={index}
                    src={`http://localhost:3001/resultados/${urlImages}`}
                  />
                ))}
              </S.ImgGroup>
            </S.ContainerResultados>
          )}
        </S.ContainerControles>
        <S.ContainerLogs>
          <h3>Logs do Hadoop</h3>
          <S.VisualizacaoLogs>{logs === "" ? "Sem logs ainda..." : logs}</S.VisualizacaoLogs>
        </S.ContainerLogs>
      </S.ContainerPrincipal>
    </S.App>
  );
}

export default App;
