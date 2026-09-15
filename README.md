# Manipulador de Imagens

Projeto da Universidade Feevale para desenvolvimento de um manipulador de imagens. A aplicação permite carregar uma imagem e aplicar operações de processamento digital de imagens, exibindo o resultado da transformação na interface.

## Lógica das transformações

Os algoritmos de transformação estão na pasta `app/pdi/`:

- `filters.ts`: filtros de imagem, como escala de cinza, brilho, contraste, passa-baixa, passa-alta e limiarização.
- `geometric.ts`: transformações geométricas, como translação, rotação, espelhamento e redimensionamento.
- `morphology.ts`: operações morfológicas, como dilatação, erosão, abertura, fechamento e afinamento.
- `features.ts`: funcionalidades específicas adicionais da aplicação.
- `helpers.ts`: estrutura da imagem e funções auxiliares para leitura, criação, acesso e alteração de pixels.
- `index.ts`: exportação das operações utilizadas pela interface.

Os modais da interface ficam em `app/components/modals/` e coletam os parâmetros de cada operação. A tela principal, em `app/routes/home.tsx`, conecta esses parâmetros aos algoritmos da pasta `app/pdi/`.

## Como executar

### Pré-requisitos

- Node.js instalado.
- npm instalado.

### Instalação

Na pasta raiz do projeto, instale as dependências:

```bash
npm install
```

### Ambiente de desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois, acesse o endereço exibido no terminal, normalmente:

```text
http://localhost:5173
```

### Verificação de tipos

Para executar a geração de tipos e a verificação do TypeScript:

```bash
npm run typecheck
```

### Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Depois da compilação, execute o servidor de produção com:

```bash
npm run start
```

## Tecnologias

- React
- React Router
- TypeScript
- Tailwind CSS
