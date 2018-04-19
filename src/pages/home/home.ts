import { Vue, Component, Prop } from "vue-property-decorator";
import { utils, constants, env } from "core/ts/env";
import { errorHandler } from "core/ts/services";

@Component
export default class MyComponent extends Vue {
  message = "Welcome Home";
}
