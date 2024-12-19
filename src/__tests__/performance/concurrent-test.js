import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, PATHS } from "./config.js";

export const options = {
  scenarios: {
    shared_iter_scenario: {
      executor: "shared-iterations",
      vus: 50, // 50个并发用户
      iterations: 100, // 总共执行100次
      maxDuration: "30s"
    }
  }
};

export default function () {
  // 随机选择一个页面访问
  const pages = [PATHS.HOME, PATHS.BOOKS, PATHS.LOGIN, `${PATHS.API.BOOKS}`];

  const randomPage = pages[Math.floor(Math.random() * pages.length)];
  const response = http.get(`${BASE_URL}${randomPage}`);

  check(response, {
    "status is 200": (r) => r.status === 200
  });

  sleep(Math.random() * 3); // 随机休眠1-3秒
}
