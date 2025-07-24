import styled from 'styled-components';
import { Button, Image } from 'antd';

export const App = styled.div`
  color: white;
  padding: 2rem;
`;

export const ContainerPrincipal = styled.div`
  height: 100vh;
  display: flex;
  margin: 1rem;
  justify-content: space-between;
`;

export const ContainerSelect = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border: 2px solid #ffc039;
  border-radius: 1rem;
  margin: 2rem;
  gap: 1rem;
`;

export const VisualizacaoLogs = styled.pre`
  font-family: monospace;
  width: 60vw;
  height: 60vh;
  background-color: #3a3a3a;
  color: #00ff00;
  font-weight: bold;
  overflow: scroll;
  padding: 1rem;
`;

export const ContainerControles = styled.div`
  width: 30vw;
`;

export const ContainerLogs = styled.div``;

export const ContainerResultados = styled.div``;

export const ImgGroup = styled(Image.PreviewGroup)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const StyledImg = styled(Image)`
  width: 200px;
  height: 200px;
  margin: 10px;
`;

export const UploadButton = styled(Button)`
  background-color: #ffc039!important;
  color: black !important;
  font-weight: bold !important; 
  border: 2px solid #270a3f !important;
  &:hover {
    background-color: #ffc039;
    color: black;
    border: 2px solid #ffc039;
  }

  &:disabled{
    background-color: #3a3a3a !important;
    color: white !important;
    border: 2px solid #3a3a3a !important;
  }
  
`;