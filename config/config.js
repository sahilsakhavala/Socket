import { } from 'dotenv/config'

const config = {
    port: process.env.PORT || 3000,
    secretKey: process.env.SECRET_KEY || "S6MGXX3UF78KR4UMO5H7",
    url: process.env.BASE_URL
};

export {
    config
}