# CORS Bypass

O CORS Bypass é um serviço proxy que permite contornar as restrições de CORS (Cross-Origin Resource Sharing) ao acessar recursos de origens diferentes em aplicações web. Ele fornece uma solução simples e eficaz para contornar as políticas de segurança do navegador e facilitar o acesso a recursos de diferentes domínios.

![Imagem de https://desenvolvimentoparaweb.com/miscelanea/cors/](https://storage.googleapis.com/dpw/app/uploads/2020/07/lqtoobekf1h1d08lcl56.gif)
Image de [https://desenvolvimentoparaweb.com/miscelanea/cors/](https://desenvolvimentoparaweb.com/miscelanea/cors/)

Este serviço, baseado em um proxy hospedado, permite que os desenvolvedores realizem solicitações HTTP a partir de um domínio diferente, evitando erros de bloqueio do CORS. Ele atua como um intermediário entre o cliente e o servidor de destino, adicionando os cabeçalhos apropriados para permitir a comunicação entre origens diferentes.

#### Recursos principais:

- Contorne restrições de CORS facilmente em suas aplicações web.
- Acesse recursos de diferentes domínios a partir do seu domínio atual.
- Suporte a vários tipos de solicitações HTTP, incluindo imagens, vídeos, APIs de terceiros e muito mais.
- Fácil integração em seus projetos, com uma API simples de usar.

## Como usar

Para usar o serviço, você só precisa passar a URL do recurso que deseja acessar após o URL do serviço "https://corsbypass-5jyi.onrender.com".

Exemplo:
![Exemplo](./.github/example.png)

Isso solicitará a página principal do Google por meio do serviço "CORS Bypass" e retornará a resposta para o seu navegador, contornando as restrições de CORS. Certifique-se de incluir o protocolo completo (por exemplo, "https://") na URL que você deseja acessar através do serviço.

#### Exemplos de requisições

- https://corsbypass-5jyi.onrender.com/https://example.com
- https://corsbypass-5jyi.onrender.com/https://example.com/image.jpg
- https://corsbypass-5jyi.onrender.com/https://example.com/video.mp4
- https://corsbypass-5jyi.onrender.com/https://api.weather.com/v1/current?location=NewYork&apiKey=YOUR_API_KEY

## Executando localmente

Se você deseja executar o serviço "CORS Bypass" em sua máquina local para fins de desenvolvimento ou teste, siga as etapas abaixo:

### Pré-requisitos

1. Certifique-se de ter o Node.js instalado em seu sistema. Você pode baixar o Node.js em https://nodejs.org.

### Passos

1. Faça o download ou clone o repositório do "CORS Bypass" do GitHub: https://github.com/jefferson-calmon/corsbypass.

2. Navegue até o diretório do projeto no seu terminal.

3. Instale as dependências do projeto executando o seguinte comando:

   ```
   npm install
   ```

4. Após a conclusão da instalação das dependências, inicie o servidor local executando o seguinte comando:

   ```
   npm run dev
   ```

5. O servidor "CORS Bypass" estará em execução localmente. Você poderá acessá-lo em seu navegador usando o seguinte URL:
   ```
   http://localhost:9090
   ```

Certifique-se de ajustar as configurações do servidor local, se necessário, como a porta em que deseja executar o serviço.

Lembre-se de que, ao executar o serviço "CORS Bypass" localmente, você será responsável pela segurança e pelo uso adequado do serviço. Certifique-se de entender as implicações de segurança e as políticas aplicáveis antes de usar o serviço em um ambiente de produção.

## Limitações

O serviço "CORS Bypass" permite o acesso a recursos de qualquer origem, pois não possui uma lista de origens permitidas. No entanto, algumas restrições podem ser aplicadas aos cabeçalhos da solicitação. O serviço remove os cabeçalhos "cookie" e "cookie2" da solicitação para evitar o envio de informações confidenciais do cliente.

## Importante

É essencial entender que o contorno das restrições de CORS pode ter implicações de segurança. Certifique-se de usar o serviço "CORS Bypass" apenas para fins legítimos e com recursos confiáveis. O uso inadequado ou malicioso do serviço pode violar políticas de segurança e leis aplicáveis.
