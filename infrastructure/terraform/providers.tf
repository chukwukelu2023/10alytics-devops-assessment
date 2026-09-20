terraform {
  required_version = ">= 1.1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=5.0.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.13.0"
    }

    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }

  }

  backend "azurerm" {
    resource_group_name  = "rg-prod-test"
    storage_account_name = "tehcoopstaging"
    container_name       = "10alytics"
    key                  = "terraform.tfstate"
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  #   subscription_id = var.subscription-id
  features {
  }
}

provider "github" {
  #   token = var.github_token # or `GITHUB_TOKEN`
}

provider "cloudflare" {
  #   api_token = var.cloudflare_api_token
}
