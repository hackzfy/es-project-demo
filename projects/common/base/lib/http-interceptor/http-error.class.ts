/**
 * http 请求出错后，在中间件中封闭为统一的格式。
 */
export class HttpError<T = any> {
  constructor(
    // 错误码
    public code: number,
    // 错误消息
    public message: string,
    // 返回数据
    public body: T = null
  ) {}
}
