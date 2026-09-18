terraform {
  required_version = ">= 1.1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=5.0.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~>1.5"
    }
  }

#   backend "azurerm" {
#     resource_group_name  = "general-rg"
#     storage_account_name = "louisvilleadmin"
#     container_name       = "10alytics"
#     key                  = "terraform.tfstate"
#   }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  subscription_id = var.subscription-id
  features {
  }
}