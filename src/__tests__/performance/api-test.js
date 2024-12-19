import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, PATHS, SLEEP_DURATION } from "./config.js";

export const options = {
  vus: 10, // 10个虚拟用户
  duration: "30s" // 测试持续30秒
};

export default function () {
  // 测试搜索API
  const searchRes = http.get(`${BASE_URL}${PATHS.API.SEARCH}?q=test`);
  check(searchRes, {
    "search api status is 200": (r) => r.status === 200
  });

  // 测试评论API
  const commentData = JSON.stringify({
    bookId: 1,
    content: "Test comment"
  });

  const commentRes = http.post(
    `${BASE_URL}${PATHS.API.COMMENTS}`,
    commentData,
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(commentRes, {
    "comment api status is 200": (r) => r.status === 200
  });

  sleep(SLEEP_DURATION);
}
