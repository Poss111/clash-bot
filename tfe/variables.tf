variable "access_key" {
  description = "Access Key"
  type        = string
  sensitive   = true
}

variable "secret_key" {
  description = "Secret Key"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "AWS Region"
  default     = "us-east-1"
  type        = string
  sensitive   = true
}

variable "app_count" {
  type    = number
  default = 1
}

variable "image_id" {
  type        = string
  description = "Image url to deploy"
}

variable "prefix" {
  type        = string
  description = "Prefix to set for the resources"
  default     = "clash-bot-discord-bot"
}

variable "one" {
  type      = map(string)
  sensitive = true
}

variable "two" {
  type      = map(string)
  sensitive = true
}

variable "three" {
  type      = map(string)
  sensitive = true
}

variable "four" {
  type      = map(string)
  sensitive = true
}

variable "repository_name" {
  default = ""
}

variable "iam_secret_policies" {
  type      = list(string)
  sensitive = true
}

variable "ecs_iam_secret_policies" {
  type      = list(string)
  sensitive = true
}

variable "ecs_cloudwatch_policies" {
  type      = list(string)
  sensitive = true
}

variable "registry_ecr_iam_policies" {
  type      = list(string)
  sensitive = true
}

variable "ecr_specific_iam_policies" {
  type      = list(string)
  sensitive = true
}