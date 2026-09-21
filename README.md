# 10alytics DevOps Assessment

A monorepo demonstrating an end-to-end DevOps workflow: infrastructure provisioning with Terraform, server configuration with Ansible, containerisation with Docker, and CI/CD with GitHub Actions — deploying a Node.js task manager API to an Azure VM.

> This is an assessment project. The focus is the pipeline and the infrastructure, not a production-hardened application.

## Repository Layout

```
.
├── .github/workflows/     # CI/CD pipelines
│   ├── build-deploy.yaml  # Terraform + Ansible (infrastructure)
│   ├── taskmanger.yaml    # Build, push and deploy the app image
│   ├── rollback.yaml      # Roll back to a previous image tag
│   ├── destroy.yaml       # Tear down all Azure resources
│   └── trivy-scan.yaml    # Trivy security scans (IaC, deps, image)
├── infrastructure/
│   ├── terraform/         # Azure VM, network, NSG, Cloudflare DNS
│   └── ansible/           # Server bootstrap + app deployment roles
├── task-app/              # Node.js / TypeScript application source
├── docker-compose.yaml    # Runtime stack deployed to the server
└── Caddyfile              # Reverse proxy + automatic TLS
```

## Architecture

```
GitHub Actions
      │
      ├── Terraform ──► Azure (RG, VNet, Subnet, NSG, Public IP, Ubuntu VM)
      │                 Cloudflare (A record ──► VM public IP)
      │
      ├── Ansible ────► VM: install Docker, yq, git; copy compose/.env/Caddyfile;
      │                 start the stack under /var/www/repo
      │
      └── Docker ─────► Docker Hub (oluchioraekwe/task-app:v<run_id>)
                              │
                              └── SSH into VM ──► yq updates image tag ──► docker compose up -d

On the VM:  Internet ──► Caddy (80/443, auto TLS) ──► taskmanager-app:4500 ──► MySQL 8.0
```

## The Application (`task-app/`)

Express + TypeScript REST API for user and task management, backed by MySQL via Sequelize, with JWT authentication and a small static frontend.

| Area | Detail |
|---|---|
| Routes | `/users` (register, login, CRUD), `/tasks` (CRUD, complete) |
| Auth | JWT middleware; `adminUser` guard on admin-only routes |
| Layers | `routes → controller → services → models` |
| Views | EJS templates + static pages under `public/` |
| Port | `4500` |

**Docker image** — multi-stage build: stage one compiles TypeScript (`npm run build`), stage two installs production dependencies only and copies `dist`, `bin`, `views` and `public`. Keeps the runtime image lean and free of build tooling.

## Infrastructure (`infrastructure/terraform/`)

Provisions on Azure, with state stored remotely in an Azure Storage backend:

- Resource group, virtual network and subnet
- Static public IP
- Ubuntu 22.04 VM (`Standard_B2ms`) via the reusable [`linux-server-module`](https://github.com/chukwukelu2023/linux-server-module), pinned to `v1.0.3`
- NSG with rules for 22, 80 and 443, driven by a `dynamic` block over the `nsg-rules` map
- Cloudflare A record pointing at the VM's public IP
- `cloud-init.yaml` installs Python 3 so So that any app that requires it will run smoothly

VM sizing, image, tags and location are all declared in `terraform.tfvars` under a `vm-specification` map, so adding a second VM is a map entry rather than a new resource block.

## Configuration (`infrastructure/ansible/`)

Two roles run against the freshly provisioned host:

- **`dependencies`** — apt update, git, `yq`, Docker Engine + Compose plugin (via the official Docker apt repo and GPG key), ensures the docker service is running and adds the SSH user to the `docker` group.
- **`deploy`** — creates `/var/www/repo`, copies `docker-compose.yaml`, `.env` and `Caddyfile`, then brings the stack up with `community.docker.docker_compose_v2`.

The inventory is generated at runtime in CI from Terraform outputs — nothing is hardcoded or committed.

## Runtime Stack (`docker-compose.yaml`)

| Service | Image | Notes |
|---|---|---|
| `db` | `mysql:8.0` | Healthcheck gates app startup; named volume for persistence |
| `taskmanager-app` | `oluchioraekwe/task-app:v<run_id>` | `depends_on: db → service_healthy` |
| `caddy` | `caddy:latest` | Terminates TLS automatically, reverse proxies to the app |

## CI/CD Pipelines

### 1. `build-deploy.yaml` — Infrastructure
Triggered by pushes touching `infrastructure/**`, or manually.

`terraform` job: init → validate → plan → apply, then exports the VM host and admin user as job outputs.
`ansible` job: writes the SSH key and `.env` from secrets, generates the inventory from those outputs, retries `ansible -m ping` up to 30 times while the VM finishes booting, runs the playbook, and cleans up key/inventory/env files in an `if: always()` step.

### 2. `taskmanger.yaml` — Application
Triggered by pushes touching `task-app/**`, or manually.

1. **build-node** — `npm ci`, build, test
2. **docker** — Buildx + QEMU, build and push `oluchioraekwe/task-app:v${{ github.run_id }}`
3. **deploy** — reads the server address from Terraform state, SSHs in, uses `yq` to rewrite the image tag in `docker-compose.yaml`, then `docker compose pull && up -d` for that one service and prunes old images

Tagging by run ID means every deploy is uniquely identifiable and reversible.

### 3. `rollback.yaml` — Recovery
Manual dispatch taking a previous run ID. Verifies the tag actually exists on Docker Hub via the registry API before touching the server, then applies the same `yq` + compose swap to pin the old image.

### 4. `destroy.yaml` — Teardown
Manual dispatch running `terraform destroy -auto-approve` to release all Azure resources.

## Required Secrets and Variables

**Secrets:** `AZURE_CREDENTIALS`, `ARM_SUBSCRIPTION_ID`, `PUBLIC_KEY`, `PRIVATE_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `DOCKERHUB_TOKEN`, `GH_PAT`, and the app's database settings — `DIALECT`, `DATABASE`, `DATABASE_USERNAME`, `DB_PASSWORD`, `HOST`, `DB_PORT`, `TOKEN_KEY`.

**Variables:** `DOCKERHUB_USERNAME`, `PORT`.

## Running Locally

```bash
cd task-app
cp .env.example .env     # set DATABASE, DATABASE_USERNAME, DB_PASSWORD, HOST, DB_PORT, DIALECT, TOKEN_KEY, PORT
docker compose up --build
```

The app is then available on `http://localhost:4500`. `task-app/docker-compose.yaml` builds from source locally, whereas the root compose file pulls the published image — that is the only difference between them.

Without Docker:

```bash
cd task-app
npm install
npm run build
npm start
```

## Design Notes

- **Separate triggers for infra and app.** Path filters mean an application change never re-plans infrastructure, and vice versa.
- **No hardcoded server addresses.** The deploy and rollback workflows both read the host from Terraform state, so the pipeline survives the VM being recreated.
- **Remote Terraform state** in Azure Storage, shared by every workflow.
- **Rollback is a first-class path,** not a manual recovery procedure.
- **Secrets never land in the repo.** `.env` is generated in CI, copied with mode `0600`, and deleted from the runner afterwards.

>  **Note on repo structure.** Infrastructure and application code live together here so the whole workflow can be reviewed in one place. For a production-grade application it is better to separate them into their own repositories — they have different release cadences, different blast radius, and need different credentials (cloud admin vs. registry access only).

## Security Scanning

`.github/workflows/trivy-scan.yaml` runs [Trivy](https://github.com/aquasecurity/trivy) on every push to `main`, every pull request targeting `main`, and on manual dispatch:

| Job | Scans | Looking for |
|---|---|---|
| `terraform-scan` | `infrastructure/` | Terraform misconfigurations — open security groups, unencrypted storage, weak TLS |
| `app-scan` | `task-app/` | Vulnerable npm dependencies (via `package-lock.json`) and leaked secrets |
| `image-scan` | Built app image | OS and library CVEs in the final container, HIGH/CRITICAL only |

Results are uploaded as SARIF to GitHub's Security tab, so findings appear inline on pull requests. The scans report rather than block by default — flip `exit-code` to `1` on any job to make a finding fail the build.
