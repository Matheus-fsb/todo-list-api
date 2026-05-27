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
        <div className="container">
          <p className={styles.owner}>Projeto desenvolvido por Matheus</p>
          <Heading as="h1" className={styles.title}>
            Todo List API
          </Heading>
          <p className={styles.subtitle}>
            Uma API REST completa para gerenciamento de usuários, projetos e tarefas, com autenticação,
            verificação de email, notificações, soft delete, filtros, paginação, Docker e testes automatizados.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Abrir documentação
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/api/overview">
              Ver rotas
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section className="container">
          <div className={styles.intro}>
            <Heading as="h2">Sobre o projeto</Heading>
            <p>
              A Todo List API foi criada para funcionar como uma base backend bem estruturada:
              simples de entender, mas completa o bastante para representar desafios reais de uma API.
              O projeto organiza responsabilidades por módulos, usa Prisma para persistência,
              JWT para autenticação, emails para validação de conta e uma suíte de testes para proteger
              os principais fluxos.
            </p>
          </div>
          <div className={styles.grid}>
            <article>
              <Heading as="h2">Configuração Local</Heading>
              <p>Docker, PostgreSQL, Prisma migrations e comandos principais para desenvolvimento.</p>
            </article>
            <article>
              <Heading as="h2">API</Heading>
              <p>Rotas de autenticação, usuários, projetos e tarefas com exemplos de payloads e query params.</p>
            </article>
            <article>
              <Heading as="h2">Testes</Heading>
              <p>Unitários, services e e2e com Jest, Supertest e banco local.</p>
            </article>
          </div>
          <p className={styles.rights}>Todos os direitos reservados a Matheus.</p>
        </section>
      </main>
    </Layout>
  );
}
