output "ecs-name" {
  value       = aws_ecs_cluster.clash-bot-ecs.name
  description = "ECS Name"
}

output "task_definition_version" {
  value       = aws_ecs_task_definition.clash-bot-discord-bot-task-def.revision
  description = "Task definition revision"
}
