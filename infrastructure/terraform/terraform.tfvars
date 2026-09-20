vm-specification = {
  "vm1" = {
    vm-location                      = "westeurope"
    environment                      = "develop"
    project                          = "lvtest"
    resource-group-name              = "lvtest-rg"
    vm-size                          = "Standard_B2ms"
    os-disk-caching                  = "ReadWrite"
    os-disk-storage-account-type     = "Standard_LRS"
    os-disk-size-gb                  = 30
    source-image-reference-publisher = "Canonical"
    source-image-reference-offer     = "0001-com-ubuntu-server-jammy"
    source-image-reference-sku       = "22_04-lts"
    source-image-reference-version   = "latest"
    computer-name                    = "lvtest-vm"
    repository                       = "10alytics-devops-assessment"
    tags = {
      "Environment" = "dev"
      "Project"     = "lvtest"
      "Deployment"  = "Terraform"
      "Location"    = "West Europe"
    }
  }
}

resource-group-name     = "lvtest-rg-1"
vnet-name               = "lvtest-vnet-1"
vm-location             = "westeurope"
vnet-address-space      = ["10.2.0.0/16"]
subnet-name             = "lvtest-subnet-1"
subnet-address-prefix   = ["10.2.0.0/24"]
storage-account-name    = "tehcoopstaging"
storage-account-rg-name = "rg-prod-test"
# storage-account-name                = "louisvilleadmin"
# storage-account-rg-name             = "general-rg"
# subscription-id = "d60e0c8d-4247-4345-8ec3-92de221c0934"
# subscription-id = "30d291f6-1368-4890-b6f6-1482361101fb"
# storage-account-name                = "tehcoopstaging"
# storage-account-rg-name             = "rg-prod-test"
# storage-account-name                = "louisvilleadmin"
# storage-account-rg-name             = "general-rg"
nsg-rules = {
  "ssh" = {
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source-port-range          = "*"
    destination-port-range     = "22"
    source-address-prefix      = "*"
    destination-address-prefix = "*"
  }
  "http" = {
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source-port-range          = "*"
    destination-port-range     = "80"
    source-address-prefix      = "*"
    destination-address-prefix = "*"
  }
  "https" = {
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source-port-range          = "*"
    destination-port-range     = "443"
    source-address-prefix      = "*"
    destination-address-prefix = "*"
  }
}
# cloudflare_zone_id = "0a6857c247a4b8639445e0aaee863708"
cloudflare_name        = "chukwukelu.name.ng"
cloudflare_record_type = "A"
cloudflare_comment     = "Create an A record dynamically from Terraform"
# github_repository = "10alytics-devops-assessment"
