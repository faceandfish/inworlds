import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, PATHS, SLEEP_DURATION } from "./config.js";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // 逐渐增加到20个用户
    { duration: "1m", target: 20 }, // 保持20个用户1分钟
    { duration: "20s", target: 0 } // 逐渐减少到0
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95%的请求要在500ms内完成
    http_req_failed: ["rate<0.01"] // 错误率小于1%
  }
};

export default function () {
  // 测试首页加载
  const homeRes = http.get(`${BASE_URL}${PATHS.HOME}`);
  check(homeRes, {
    "homepage status is 200": (r) => r.status === 200,
    "homepage duration < 500ms": (r) => r.timings.duration < 500
  });

  // 测试书籍列表API
  const booksRes = http.get(`${BASE_URL}${PATHS.API.BOOKS}`);
  check(booksRes, {
    "books api status is 200": (r) => r.status === 200,
    "books api duration < 200ms": (r) => r.timings.duration < 200
  });

  sleep(SLEEP_DURATION);
}
