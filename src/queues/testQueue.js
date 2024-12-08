import Queue from "bull";

import redisconfig from "../config/redisconfig.js";

export default new Queue('testQueue', {
    redis: redisconfig
});