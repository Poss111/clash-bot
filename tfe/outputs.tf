output "ecs-name" {
  value       = aws_ecs_cluster.clash-bot-ecs.name
  description = "ECS Name"
}

output "task_definition_version" {
  value       = aws_ecs_task_definition.clash-bot-discord-bot-task-def.revision
  description = "Task definition revision"
}

output "vpc_id" {
  value = aws_vpc.clash-bot-vpc.id
  description = "Clash Bot's vpc"
}

output "public_subnet_ids" {
  value = aws_subnet.clash-bot-subnet-public.*.id
  description = "Public Subnet Ids"
}

output "private_subnet_ids" {
  value = aws_subnet.clash-bot-subnet-private.*.id
  description = "Private Subnet Ids"
}
