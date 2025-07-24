import styled from 'styled-components';
import { Upload as UploadComponent } from 'antd';

export const ContainerSeletorArquivos = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem;
  padding: 2rem;
  border: 2px solid #ffc039;
  border-radius: 1rem;
  overflow: scroll;
  button {
    width: fit-content;
  }
`;

export const Upload = styled(UploadComponent)`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  border: 2px solid black;

  button {
    height: 60%;
    width: 90%;
    white-space: normal;
    border: 2px solid blue
  }
`