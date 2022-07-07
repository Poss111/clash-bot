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
}

resource "aws_ecs_cluster" "clash-bot-cluster" {
  name = "clash-bot-tfe-ecs"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = {
    Name = "ClashBotDiscordBot"
    Type = "Bot"
  }
}