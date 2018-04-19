declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.json" {
  export let data: any
}

declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (
    paths: string[],
    callback: (require: <T>(path: string) => T) => void
  ) => void;
}
