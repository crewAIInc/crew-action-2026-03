# CrewAction - Março 2026

Bem-vindo ao repositório oficial dos projetos desenvolvidos pelos participantes da **primeira edição do CrewAction**! 🎉

## 📋 Sobre

Este repositório reúne todos os projetos criados pelos participantes do CrewAction, um evento focado no desenvolvimento de aplicações utilizando CrewAI. Todos os projetos são revisados e aprovados por [@danielfsbarreto](https://github.com/danielfsbarreto) antes de serem incluídos.

## 🚀 Como Adicionar Seu Projeto

Para adicionar seu projeto desenvolvido durante o CrewAction, siga os passos abaixo:

### 1. Fork do Repositório

Faça um fork deste repositório para sua conta do GitHub clicando no botão "Fork" no canto superior direito da página.

### 2. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/crew-action-2026-03.git
cd crew-action-2026-03
```

### 3. Crie uma Branch

Crie uma nova branch para seu projeto:

```bash
git checkout -b add-meu-projeto
```

### 4. Adicione Seu Projeto

Crie uma pasta **na raiz do repositório** com o nome do seu projeto. Esta pasta deve ser **auto-contida** com todo o código e arquivos necessários:

```bash
mkdir nome-do-seu-projeto
```

### 5. Arquivos Obrigatórios

Seu projeto **DEVE** incluir:

- ✅ **README.md**: Documentação explicando:
  - O que o projeto faz
  - Como instalar as dependências
  - Como executar o projeto
  - Exemplos de uso

- ✅ **.env.example**: Arquivo de exemplo mostrando quais variáveis de ambiente são necessárias (sem valores reais)

Exemplo de `.env.example`:
```bash
OPENAI_API_KEY=sua-chave-aqui
SERPER_API_KEY=sua-chave-aqui
```

### 6. ⚠️ IMPORTANTE - Arquivos que NÃO Devem Ser Enviados

**Seu PR será REJEITADO se você enviar:**

- ❌ `.env` - Arquivo com variáveis de ambiente reais
- ❌ `.venv/` ou `venv/` - Pasta do ambiente virtual Python
- ❌ Chaves de API ou informações sensíveis

**Dica**: Adicione estes arquivos ao `.gitignore` do seu projeto:

```gitignore
.env
.venv/
venv/
__pycache__/
*.pyc
```

### 7. Commit das Mudanças

```bash
git add nome-do-seu-projeto/
git commit -m "Adiciona projeto: nome-do-seu-projeto"
```

### 8. Push para o GitHub

```bash
git push origin add-meu-projeto
```

### 9. Abra um Pull Request

1. Acesse seu fork no GitHub
2. Clique em "Compare & pull request"
3. Preencha com as seguintes informações:
   - **Título**: "Adiciona projeto: [nome-do-seu-projeto]"
   - **Descrição**: Breve explicação do que seu projeto faz
4. Aguarde a revisão

### 10. Aguarde a Revisão

Seu PR será revisado por [@danielfsbarreto](https://github.com/danielfsbarreto). Você pode receber:

- ✅ **Aprovação**: Seu projeto será merged!
- 💬 **Comentários**: Sugestões de ajustes necessários
- ❌ **Rejeição**: Explicação do motivo

## 📝 Critérios de Aprovação

Para que seu projeto seja aprovado:

- [ ] Pasta criada na raiz do repositório
- [ ] Inclui `README.md` com instruções claras
- [ ] Inclui `.env.example` mostrando variáveis necessárias
- [ ] **NÃO** contém `.env` ou `.venv/`
- [ ] Projeto é funcional e relacionado ao CrewAction

## 📞 Contato

- **Mantenedor**: [@danielfsbarreto](https://github.com/danielfsbarreto)

---

**Parabéns por participar do CrewAction! 🚀**
