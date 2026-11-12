import fs from "node:fs";
import { CORE_SCHEMA, load as parseYaml } from "js-yaml";

const raw = fs.readFileSync(new URL("../../curriculum.yml", import.meta.url), "utf8");
const data = parseYaml(raw, { schema: CORE_SCHEMA });

const published = data.days.filter((day) => day.status === "published");
const next = data.days.find((day) => day.status !== "published");

data.published_count = published.length;
data.total = data.days.length;
data.computed_next_day = next ? next.day : null;

export default data;
