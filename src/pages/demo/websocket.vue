<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { utils, constants, env } from "core/ts/env";
import { errorHandler, WebSocketService } from "core/ts/services";
import { Input, Button } from "element-ui";

let wsServiceInstance: WebSocketService;

@Component
export default class MyComponent extends Vue {
  auctinId = 0;
  auctionIds = [6960528, 8647940, 8636913];
  created() {
    console.log("life cycle created");
  }
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter");
    next((vm: MyComponent) => {
      vm.initWebSocket();
      vm.auctinId = Number.parseInt(vm.$router.currentRoute.params.id);
      console.log("beforeRouteEnter next", vm.auctinId);
    });
  }
  beforeRouteUpdate(to, from, next) {
    next();
    this.auctinId = Number.parseInt(this.$router.currentRoute.params.id);
    wsServiceInstance.send({ auctionSiteId: this.auctinId });
    console.log("beforeRouteUpdate", this.auctinId);
  }
  destroyed() {
    wsServiceInstance.close();
  }
  initWebSocket() {
    wsServiceInstance = WebSocketService.getInstance({
      onopen: () => {
        wsServiceInstance.send({ auctionSiteId: this.auctinId });
      },
      onmessage: data => {
        console.log("onmessage", data);
      }
    });
  }
  render(h) {
    return (
      <ul style="height: 2000px">
        {this.auctionIds.map(item => {
          return (
            <li>
              <router-link to={"/demo/websocket/" + item}>{item}</router-link>
            </li>
          );
        })}
      </ul>
    );
  }
}
</script>

<style lang="scss" scoped>

</style>
