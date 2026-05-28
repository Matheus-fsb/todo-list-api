import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Documentação"
      description="Documentação completa da Todo List API desenvolvida por Matheus">
      <header className={styles.hero}>
        <div className={styles.heroContainer}>
          <p className={styles.owner}>Projeto desenvolvido por Matheus</p>
          <Heading as="h1" className={styles.title}>
            Todo List API
          </Heading>
          <p className={styles.subtitle}>
            Uma API REST de alta performance, modular e segura para gerenciamento de usuários, projetos e tarefas, com autenticação JWT (cookies HTTP-only), rate limiting e testes automatizados.
          </p>
          <div className={styles.buttons}>
            <Link className={`button button--lg ${styles.buttonPrimary}`} to="/docs/intro">
              Começar Agora
            </Link>
            <Link className={`button button--lg ${styles.buttonSecondary}`} to="/docs/api/overview">
              Referência da API
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.sectionContainer}>
          <div className={styles.intro}>
            <Heading as="h2">Sobre o Projeto</Heading>
            <p>
              A Todo List API foi projetada para ir além do CRUD convencional, incorporando requisitos reais de engenharia de software de nível de produção. Construída com TypeScript, Express e Prisma ORM, ela serve como uma excelente base de referência para arquitetura modular, controle de segurança refinado e práticas robustas de teste.
            </p>
          </div>
          <div className={styles.grid}>
            <article>
              <Heading as="h3">Ambiente & Setup</Heading>
              <p>Passo a passo para rodar localmente com Docker Compose (PostgreSQL), rodar migrations do Prisma e comandos para iniciar o servidor de desenvolvimento.</p>
            </article>
            <article>
              <Heading as="h3">API Referência</Heading>
              <p>Documentação detalhada com todos os endpoints, corpos de requisição baseados em esquemas do Zod, status de respostas HTTP e controle de acesso.</p>
            </article>
            <article>
              <Heading as="h3">Lógica & Testes</Heading>
              <p>Explicação das políticas de segurança, soft delete em cascata recursiva e suite de testes unitários e de integração/E2E com Jest e Supertest.</p>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
