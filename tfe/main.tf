terraform {
  cloud {
    organization = "ClashBot"

    workspaces {
      name = "ClashBot"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.21.0"
    }
  }
}

provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region

  default_tags {
    tags = {
      Application = "Clash-Bot-Discord-Bot"
      Type        = "Bot"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available_zones" {
  state = "available"
}

data "aws_iam_policy_document" "clash-bot-secret-policy" {
  statement {
    actions = [
      "secretsmanager:GetSecret",
      "secretsmanager:GetSecretValue"
    ]
    principals {
      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${aws_iam_role_policy_attachment.clash_bot_policy_attachment.role}"
      ]
      type = "AWS"
    }
    resources = ["*"]
  }
}

resource "aws_iam_role_policy_attachment" "clash_bot_policy_attachment" {
  policy_arn = aws_iam_policy.clash-bot-iam-policy.arn
  role       = aws_iam_role.clash-bot-exec-role.name
}

resource "aws_iam_policy" "clash-bot-iam-policy" {
  name = "secrets-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = var.iam_secret_policies,
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "secrets_iam_policy" {
  name = "ecs-secrets-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = var.ecs_iam_secret_policies,
        Resource = [
          "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:*"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "ecr_iam_policy" {
  name = "ecr-ecs-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = var.registry_ecr_iam_policies,
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_policy" "ecr_registry_iam_policy" {
  name = "ecr-ecs-registry-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = var.ecr_specific_iam_policies,
        Resource = [
          "arn:aws:ecr:${var.region}:${data.aws_caller_identity.current.account_id}:repository/${var.repository_name}"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "logs_iam_policy" {
  name = "ecs-logs-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = var.ecs_cloudwatch_policies,
        Resource = [
          "${aws_cloudwatch_log_group.clash-bot-task-logs.arn}:log-stream:*"
        ]
      }
    ]
  })
}

resource "aws_iam_role" "clash-bot-exec-role" {
  name = "${var.prefix}-exec-role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ecs-tasks.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs-secrets-policy-attachment" {
  role       = aws_iam_role.clash-bot-exec-role.name
  policy_arn = aws_iam_policy.secrets_iam_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs-ecr-policy-attachment" {
  role       = aws_iam_role.clash-bot-exec-role.name
  policy_arn = aws_iam_policy.ecr_iam_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs-ecr-repository-policy-attachment" {
  role       = aws_iam_role.clash-bot-exec-role.name
  policy_arn = aws_iam_policy.ecr_registry_iam_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs-logs-policy-attachment" {
  role       = aws_iam_role.clash-bot-exec-role.name
  policy_arn = aws_iam_policy.logs_iam_policy.arn
}

resource "aws_secretsmanager_secret" "one" {
  name                    = var.one["name"]
  policy                  = data.aws_iam_policy_document.clash-bot-secret-policy.json
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "one_version" {
  secret_id     = aws_secretsmanager_secret.one.id
  secret_string = var.one["value"]
}

resource "aws_secretsmanager_secret" "two" {
  name                    = var.two["name"]
  policy                  = data.aws_iam_policy_document.clash-bot-secret-policy.json
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "two_version" {
  secret_id     = aws_secretsmanager_secret.two.id
  secret_string = var.two["value"]
}

resource "aws_secretsmanager_secret" "three" {
  name                    = var.three["name"]
  policy                  = data.aws_iam_policy_document.clash-bot-secret-policy.json
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "three_version" {
  secret_id     = aws_secretsmanager_secret.three.id
  secret_string = var.three["value"]
}

resource "aws_secretsmanager_secret" "four" {
  name                    = var.four["name"]
  policy                  = data.aws_iam_policy_document.clash-bot-secret-policy.json
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "four_version" {
  secret_id     = aws_secretsmanager_secret.four.id
  secret_string = var.four["value"]
}

resource "aws_vpc" "clash-bot-vpc" {
  cidr_block = "172.0.0.0/20"
  tags = {
    Name = "${var.prefix}-vpc"
  }
}

resource "aws_subnet" "clash-bot-subnet-public" {
  count                   = 2
  cidr_block              = cidrsubnet(aws_vpc.clash-bot-vpc.cidr_block, 8, 2 + count.index)
  availability_zone       = data.aws_availability_zones.available_zones.names[count.index]
  vpc_id                  = aws_vpc.clash-bot-vpc.id
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.prefix}-${count.index}-public"
  }
}

resource "aws_subnet" "clash-bot-subnet-private" {
  count             = 2
  cidr_block        = cidrsubnet(aws_vpc.clash-bot-vpc.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available_zones.names[count.index]
  vpc_id            = aws_vpc.clash-bot-vpc.id
  tags = {
    Name = "${var.prefix}-${count.index}-private"
  }
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.clash-bot-vpc.id
  tags = {
    Name = "${var.prefix}-ig"
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.clash-bot-vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gateway.id
}

resource "aws_eip" "clash-bot-eip-gateway" {
  count      = 2
  vpc        = true
  depends_on = [aws_internet_gateway.gateway]
  tags = {
    Name = "${var.prefix}-eip"
  }
}

resource "aws_nat_gateway" "clash-bot-gateway" {
  count         = 2
  subnet_id     = element(aws_subnet.clash-bot-subnet-public.*.id, count.index)
  allocation_id = element(aws_eip.clash-bot-eip-gateway.*.id, count.index)
  tags = {
    Name = "${var.prefix}-nat-gateway"
  }
}

resource "aws_route_table" "clash-bot-rt-private" {
  count  = 2
  vpc_id = aws_vpc.clash-bot-vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = element(aws_nat_gateway.clash-bot-gateway.*.id, count.index)
  }

  tags = {
    Name = "${var.prefix}-rt"
  }
}

resource "aws_route_table_association" "clash-bot-rta-private" {
  count          = 2
  subnet_id      = element(aws_subnet.clash-bot-subnet-private.*.id, count.index)
  route_table_id = element(aws_route_table.clash-bot-rt-private.*.id, count.index)
}

resource "aws_security_group" "clash-bot-discord-bot-sg" {
  name   = "${var.prefix}-alb-sg"
  vpc_id = aws_vpc.clash-bot-vpc.id

  ingress {
    protocol    = "tcp"
    from_port   = 8080
    to_port     = 8080
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}-alb-sg"
  }
}

resource "aws_lb" "clash-bot-discord-bot-lb" {
  name            = "${var.prefix}-lb"
  subnets         = aws_subnet.clash-bot-subnet-public.*.id
  security_groups = [aws_security_group.clash-bot-discord-bot-sg.id]

  tags = {
    Name = "${var.prefix}-lb"
  }
}

resource "aws_lb_target_group" "clash-bot-discord-bot-tg" {
  name        = "${var.prefix}-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.clash-bot-vpc.id
  target_type = "ip"

  tags = {
    Name = "${var.prefix}-ecs-tg"
  }
}

resource "aws_lb_listener" "clash-bot-discord-bot-lb-listener" {
  load_balancer_arn = aws_lb.clash-bot-discord-bot-lb.id
  port              = "8080"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.clash-bot-discord-bot-tg.id
    type             = "forward"
  }
}

resource "aws_security_group" "clash-bot-discord-bot-task-sg" {
  name   = "${var.prefix}-ecs-task-sg"
  vpc_id = aws_vpc.clash-bot-vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = 8080
    to_port         = 8080
    security_groups = [aws_security_group.clash-bot-discord-bot-sg.id]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    security_groups = [aws_security_group.clash-bot-discord-bot-sg.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}-ecs-task-sg"
  }
}

resource "aws_cloudwatch_log_group" "clash-bot-task-logs" {
  name              = "${var.prefix}-ecs-task-logs"
  retention_in_days = 120
}

resource "aws_ecs_task_definition" "clash-bot-discord-bot-task-def" {
  family                   = var.prefix
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.clash-bot-exec-role.arn
  container_definitions = jsonencode([
    {
      name        = var.prefix
      image       = var.image_id
      cpu         = 10
      memory      = 512
      essential   = true
      networkMode = "awsvpc"
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.clash-bot-task-logs.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "${var.prefix}-ecs"
        }
      }
      secrets = [
        {
          name : var.one["name"]
          valueFrom : aws_secretsmanager_secret_version.one_version.arn
        },
        {
          name = var.two["name"]
          valueFrom : aws_secretsmanager_secret_version.two_version.arn
        },
        {
          name = var.three["name"]
          valueFrom : aws_secretsmanager_secret_version.three_version.arn
        },
        {
          name = var.four["name"]
          valueFrom : aws_secretsmanager_secret_version.four_version.arn
        }
      ]
      portMappings = [
        {
          containerPort = 8080
          protocol      = "tcp"
          hostPort      = 8080
        }
      ]
    }
  ])

  tags = {
    Name = "${var.prefix}-task"
  }
}

resource "aws_ecs_service" "clash-bot-discord-bot-service" {
  name            = "${var.prefix}-service"
  cluster         = aws_ecs_cluster.clash-bot-ecs.id
  task_definition = aws_ecs_task_definition.clash-bot-discord-bot-task-def.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = [aws_security_group.clash-bot-discord-bot-task-sg.id]
    subnets         = aws_subnet.clash-bot-subnet-private.*.id
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.clash-bot-discord-bot-tg.id
    container_name   = aws_ecs_task_definition.clash-bot-discord-bot-task-def.family
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.clash-bot-discord-bot-lb-listener]

  tags = {
    Name = "${var.prefix}-ecs-service"
  }
}

resource "aws_ecs_cluster" "clash-bot-ecs" {
  name = "${var.prefix}-ecs"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.prefix}-ecs"
  }
}

