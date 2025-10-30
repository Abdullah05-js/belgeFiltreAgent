# hakanhoca_proje

## Project Structure (Repository Pattern)
The codebase implements the repository pattern for maintainable and scalable service logic. Main folders include:

- `service/`         — Business logic for domain models
- `repository/`      — Handles data access logic
- `repository/interface/` — Abstraction for repositories
- `controller/`      — Orchestrates incoming requests
- `route/`           — Routing logic (connects HTTP endpoints to controllers)
- `route/schema/`    — Validation schemas, DTOs

Example here uses a `Document` entity for demonstration.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
# belgeFiltreAgent
