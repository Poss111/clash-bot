output "arn" {
  value       = aws_ecs_cluster.clash-bot-cluster.arn
  description = "The arn for Clash Bot's ECS cluster."
  sensitive   = true
}

output "name" {
  value       = aws_ecs_cluster.clash-bot-cluster.name
  description = "The name for Clash Bot's ECS cluster."
}

