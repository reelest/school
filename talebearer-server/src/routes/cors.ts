import {createCors} from "itty-router"

export const {preflight, corsify} = createCors({
    origins: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH"]
});
