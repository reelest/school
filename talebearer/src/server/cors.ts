import { createCors } from "itty-router";

export const { preflight, corsify } = createCors({
  methods: ["PUT", "PATCH", "POST", "GET"],
});
