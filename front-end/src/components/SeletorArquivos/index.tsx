import { UploadOutlined } from "@ant-design/icons";
import { Button, UploadFile } from "antd";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import * as S from "./styles";

export interface PropsSeletorArquivos {
    listaArq: UploadFile<RcFile>[];
    setListaArq: React.Dispatch<React.SetStateAction<UploadFile<RcFile>[]>>;
}

function SeletorArquivos({ listaArq, setListaArq }: PropsSeletorArquivos) {
    const verificarNome = (arquivo: UploadFile<RcFile>) => {
        if (arquivo.name.includes(" ")) {
            const blob = (arquivo.originFileObj as File).slice(0, arquivo.size, arquivo.type);
            const arqRenomeado = new File([blob], arquivo.name.replace(/\s+/g, "_"), {
                type: arquivo.type,
                lastModified: arquivo.lastModified,
            }) as RcFile;

            return {
                ...arquivo,
                originFileObj: arqRenomeado,
                name: arqRenomeado.name,
            };
        } else {
            return arquivo;
        }
    };

    const eventoAlteracaoArquivo = (evento: UploadChangeParam<UploadFile<RcFile>>) => {
        const arquivosRenomeados = evento.fileList.map((arquivo) => verificarNome(arquivo));
        setListaArq(arquivosRenomeados);
    };

    const eventoRemoverArquivo = (evento: UploadFile<RcFile>) => {
        const listaAtualizada = listaArq.filter((arquivoLista) => arquivoLista !== evento);
        setListaArq(listaAtualizada);
    };

    return (
        <S.ContainerSeletorArquivos>
            <h3>Selecione as imagens para upload</h3>
            <S.Upload
                accept=".jpg, .png, .bmp, .jpeg"
                beforeUpload={() => false}
                onRemove={eventoRemoverArquivo}
                onChange={eventoAlteracaoArquivo}
                fileList={listaArq}
                listType="picture-card"
                multiple
            >
                <Button icon={<UploadOutlined />}>Adicionar Imagens</Button>
            </S.Upload>
        </S.ContainerSeletorArquivos>
    );
}

export default SeletorArquivos;
