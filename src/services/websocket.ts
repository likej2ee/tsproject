import { env, constants } from '../core/ts/env';

/**
 * 默认的连接地址
 */
const DEFAULT_URL = 'ajaxchattest'

/**
 * WebSocket心跳检查
 */
interface HeartCheck {
  timeOut: number, // 心跳检测周期
  timeOutTimer: number, // 心跳检测定时器号
  reset: Function, // 重置心跳检测定时器
  start: Function, // 开启心跳检测
}

/**
 * 构造器参数
 */
interface WebSocketServiceOptions {
  url?: string, // ws连接地址
  isReConnection?: boolean, // 是否需要断线重连
  onopen?: (ev: Event) => any,  // ws连接成功
  onerror?: (ev: Event) => any, // ws连接失败
  onmessage: (ev: MessageEvent) => any, // ws接收到消息
}

class WebSocketService {
  /**
   * WebSocketService实例集合
   * 一个url对应一个实例，并且同一个实例只有首次创建实例时会被注册onopen onmessage onerror等事件
   * 因为在构造WebSocketService实例时才会真正创建WebSocket实例
   */
  static instances: Map<string, WebSocketService> = new Map<string, WebSocketService>()
  /**
   * WebSocket实例
   */
  private ws: WebSocket
  /**
   * WebSocket心跳检测
   */
  private heartCheck: HeartCheck = {
    timeOut: 55 * 1000,
    timeOutTimer: -1,
    reset(ws) {
      clearTimeout(this.timeOutTimer);
      this.start(ws);
    },
    start(ws) {
      this.timeOutTimer = setTimeout(() => {
        let heartbeat = JSON.stringify({ heartbeat: 1 })
        ws.send(heartbeat);
        this.start(ws);
      }, this.timeOut)
    }
  }
  /**
   * 标记客户端主动关闭WebSocket连接
   */
  private isClientClose = false
  /**
   * WebSocket重连次数
   */
  private reconnectCounts: number = 0
  /**
   * key: 资源id_消息组类型_标识id, value: 消息时间戳
   */
  private tokens: Map<string, number> = new Map<string, number>()

  constructor({ url = DEFAULT_URL, isReConnection = true, onopen, onerror, onmessage }: WebSocketServiceOptions) {
    this.ws = new WebSocket(env.getConfig().wsDomain + url);
    this.ws.onopen = (e: Event) => {
      console.log('WebSocket onopen', e)
      if (typeof onopen === 'function') {
        onopen(e);
      }
      this.heartCheck.start(this.ws);
    }

    this.ws.onmessage = (e: MessageEvent) => {
      // console.log('onmessage', e)
      this.heartCheck.reset(this.ws);
      if (typeof onmessage === 'function') {
        let data = JSON.parse(e.data)

        // 校验数据格式
        if (!data.message || !data.sourceId || !data.groupType) return

        // 消息key
        let messageKey = data.sourceId + '_' + data.groupType
        // 根据不同消息组获得唯一的消息key
        if (data.groupType === constants.WS_GROUP_TYPE.AUCTION) {
          messageKey += '_' + data.message.produtEntity.productId
        }

        // 获取缓存消息key对应的token
        let tokenCache = this.tokens.get(messageKey) || 0

        // 比较token，忽略过期的消息
        if (data.message.token > tokenCache) {
          this.tokens.set(messageKey, data.message.token)
          onmessage(data);
        }
      }
    }

    this.ws.onerror = (ev: Event) => {
      console.log('WebSocket onerror')
      if (typeof onerror === 'function') {
        onerror(ev);
      }
      this.ws.close();
    }

    this.ws.onclose = () => {
      const RECONNECT_TOTAL_NUM = 2 // 重连总次数
      const RECONNECT_INTERVAL = 15 * 1000 // 重连间隔
      // 停止心跳检测
      clearTimeout(this.heartCheck.timeOutTimer);

      // 若建立连接时不需要重连 or 客户端主动关闭连接 则不进行重连操作
      if (!isReConnection || this.isClientClose) {
        WebSocketService.instances.delete(url)
        console.log('WebSocket onclose instances', WebSocketService.instances)
        return
      }
      if (this.reconnectCounts < RECONNECT_TOTAL_NUM) {
        setTimeout(() => {
          WebSocketService.getInstance({ url, isReConnection, onopen, onerror, onmessage })
        }, RECONNECT_INTERVAL);
        this.reconnectCounts++;
      } else {
        this.reconnectCounts = 0;
      }
    }

    // 加入单例缓存
    WebSocketService.instances.set(url, this)
    console.log('WebSocket instances', WebSocketService.instances)
  }

  /**
   * 获取实例
   */
  static getInstance({ url, isReConnection, onopen, onerror, onmessage }: WebSocketServiceOptions): WebSocketService {
    let instance = WebSocketService.instances.get(url || DEFAULT_URL)
    return instance instanceof this ? instance : new WebSocketService({ url, isReConnection, onopen, onerror, onmessage })
  }

  /**
   * 发送数据
   * @param data
   */
  send(data: any) {
    let newData = JSON.stringify(data)
    this.ws.send(newData);
  }

  /**
   * 关闭WebSocket连接
   */
  close() {
    this.isClientClose = true
    this.ws.close()
  }
}

export default WebSocketService
