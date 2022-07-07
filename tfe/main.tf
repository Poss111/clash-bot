terraform {
  cloud {
    organization = "ClashBot"

    workspaces {
      name = "ClashBot"
    }
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.21.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "clash-bot-cluster" {
  name = "clash-bot-tfe-ecs"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}