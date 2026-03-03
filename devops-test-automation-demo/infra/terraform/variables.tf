variable "env_prefix" {
  type        = string
  description = "Prefix for naming ephemeral environments (e.g., pr-245, staging, dev)."
  default     = "pr"
}
