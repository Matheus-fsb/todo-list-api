import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // Opcional, mas recomendado: evita que o Jest rode testes na pasta compilada
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], 
};

export default config;