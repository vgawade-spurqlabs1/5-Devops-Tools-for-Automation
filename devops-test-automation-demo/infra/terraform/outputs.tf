output "env_name" {
  description = "Example environment name output that can be used by CI/CD."
  value       = random_pet.env.id
}
