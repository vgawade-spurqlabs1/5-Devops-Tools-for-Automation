# Terraform starter (demo)

This folder is intentionally lightweight. Its purpose is to show the **IaC pattern** used in CI/CD:

- Infrastructure is declared as code
- Output values can feed pipelines (URLs, endpoints, IDs)
- Environments can be created and destroyed deterministically

In real projects, replace the `random_pet` example with real infrastructure:
- managed databases (RDS, Cloud SQL)
- managed Kubernetes clusters (EKS, AKS, GKE)
- networking (VPC/subnets/security groups)
- IAM policies and service accounts

Pipeline idea:

1. `terraform apply` at pipeline start  
2. deploy + run tests  
3. `terraform destroy` in cleanup  

