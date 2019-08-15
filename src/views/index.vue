<template>
  <div class="index">
    <template v-if="!loading">
      <my-nav />
      <div class="index-right">
        <my-header />
        <div class="main-router">
          <route-layout />
        </div>
      </div>
      <button ref="charge" type="button" @click="broadcast('/voice/charge.mp3')" v-show="false">充值</button>
      <button
        ref="withdraw"
        type="button"
        @click="broadcast('/voice/withdraw.mp3')"
        v-show="false"
      >提现</button>
    </template>
    <template v-else>
      <div class="loading">
        <Spin></Spin>
        <p>加载中...</p>
      </div>
    </template>
  </div>
</template>

<script>
import MyNav from "@/components/my-nav/index";
import MyHeader from "@/components/my-header/index";
import RouteLayout from "@/components/route-layout/index";
import { get_user_permission } from "@/service/index";

const generate_tree = (result, tree) => {
  if (tree.length === 0) {
    return;
  }
  if (result.length === 0) {
    tree.forEach(v => {
      if (v.parentId === 0) {
        const obj = {
          name: v.name,
          path: v.code,
          children: [],
          id: v.id
        };

        if (v.code === "system") {
          obj.icon = "icon_lgdbs_system";
        } else if (v.code === "game") {
          obj.icon = "icon_lgdbs_game";
        } else if (v.code === "user") {
          obj.icon = "icon_lgdbs_user";
        } else if (v.code === "finance") {
          obj.icon = "icon_lgdbs_finance";
        } else if (v.code === "operation") {
          obj.icon = "icon_lgdbs_operation";
        }
        result.push(obj);
      }
    });
    if (result.length === 0) {
      return;
    }
    generate_tree(result, tree);
  } else {
    result.forEach(v1 => {
      v1.children = [];
      tree.forEach(v2 => {
        if (v2.parentId === v1.id) {
          const obj = {
            name: v2.name,
            path: v2.code,
            children: [],
            id: v2.id,
            parentId: v2.parentId
          };
          v1.children.push(obj);
          generate_tree(v1.children, tree);
        }
      });
    });
  }
};

const find_last_child = (value, obj) => {
  console.log("进入");
  if (value.children.length === 0) {
    obj.path = value.path;
    return;
  }

  find_last_child(value.children[0], obj);
};

const signalR = require("@aspnet/signalr");

export default {
  data() {
    return {
      route_list: ["unauthorized", "login", "main"],
      loading: true
    };
  },
  components: {
    MyNav,
    MyHeader,
    RouteLayout
  },
  methods: {
    decodeAudioData(audioContext, url) {
      return new Promise(resolve => {
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
          audioContext.decodeAudioData(request.response, buffer => {
            if (!buffer) {
              alert("error decoding file data: " + url);
              return;
            } else {
              resolve(buffer);
            }
          });
        };
        request.onerror = function() {
          alert("BufferLoader: XHR error");
        };
        request.send();
      });
    },
    async broadcast(url) {
      let isStart = false;
      let audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      let bufferSource = audioContext.createBufferSource();
      let buffer = await this.decodeAudioData(audioContext, url);
      bufferSource.buffer = buffer;
      bufferSource.loop = false;
      bufferSource.onended = () => {
        bufferSource = null;
      };
      bufferSource.connect(audioContext.destination);
      bufferSource.start();
    }
  },
  async mounted() {
    const token = localStorage.getItem("token");
    const BASE_URL = process.env.VUE_APP_REQUEST_URL;
    let connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${BASE_URL}/chathub?appid=${process.env.VUE_APP_APPID}&appSecret=${process.env.VUE_APP_APPSECRECT}&scope=default&terminal=Merchant&Origin=${window.location.origin}`,
        {
          accessTokenFactory: () => token
        }
      )
      .build();

    connection
      .start()
      .then(() => {
        console.log("连接成功!");

        connection.on("RechargeMessage", data => {
          console.log(data);
          //充值
          this.$refs.charge.click();
          const self = this;
          const name = new Date().getTime().toString();
          this.$Notice.success({
            title: "充值提示",
            name: name,
            duration: 0,
            render: h => {
              return h("span", [
                data,
                h(
                  "a",
                  {
                    on: {
                      click() {
                        const d = new Date();
                        self.$Notice.close(name);
                        self.$router.push(
                          "/finance/charge-verify?t=" + d.getTime()
                        );
                      }
                    }
                  },
                  "点击查看"
                )
              ]);
            }
          });
        });

        connection.on("WithDrawalMessage", data => {
          console.log(data);
          //提现
          this.$refs.withdraw.click();
          const self = this;
          const name = new Date().getTime().toString();
          this.$Notice.success({
            title: "提现提示",
            name: name,
            duration: 0,
            render: h => {
              return h("span", [
                data,
                h(
                  "a",
                  {
                    on: {
                      click() {
                        const d = new Date();
                        self.$Notice.close(name);
                        self.$router.push(
                          "/finance/draw-verify?t=" + d.getTime()
                        );
                      }
                    }
                  },
                  "点击查看"
                )
              ]);
            }
          });
        });
      })
      .catch(e => {
        console.log(e);
      });

    const res = await get_user_permission();
    if (res.status < 400) {
      const tree = res.data;
      const route_list = ["unauthorized", "login", "main"];
      tree.forEach(v => {
        if (v.permissionMode === 1) {
          route_list.push(v.code);
        }
      });
      this.route_list = route_list;
      let result = [];
      generate_tree(result, tree);
      this.$store.commit("permission_set_tree_list", result);
      this.loading = false;
      const name = this.$route.name;
      console.log(name);
      const ok = this.route_list.indexOf(name) > -1;
      if (ok) {
        if (name === "main") {
          let obj = {
            path: ""
          };
          find_last_child(result[0], obj);
          console.log(obj);
          this.$router.push({ name: obj.path });
        }
      } else {
        this.$router.push("/unauthorized");
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    const name = to.name;
    const ok = this.route_list.indexOf(name) > -1;
    if (ok) {
      next();
    } else {
      next("/unauthorized");
    }
  }
};
</script>

<style lang="less">
.index {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #f6f7f9;

  .index-right {
    width: calc(100% - 152px);
  }

  .main-router {
    width: 100%;
    height: calc(100% - 60px);
  }

  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
