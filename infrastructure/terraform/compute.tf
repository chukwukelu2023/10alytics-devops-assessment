resource "azurerm_resource_group" "this" {
  name     = var.resource-group-name
  location = var.vm-location
}

resource "azurerm_virtual_network" "this" {
  name                = var.vnet-name
  address_space       = var.vnet-address-space
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
}

resource "azurerm_subnet" "this" {
  name                 = var.subnet-name
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = var.subnet-address-prefix
}

resource "azurerm_public_ip" "this" {
  for_each            = var.vm-specification
  name                = "${each.key}-public-ip"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  allocation_method   = var.public-ip-allocation-method
}

module "virtual_machine" {
  for_each                           = var.vm-specification
  source                             = "git::https://github.com/chukwukelu2023/linux-server-module.git?ref=v1.0.0"
  vm-location                        = each.value.vm-location
  environment                        = each.value.environment
  project                            = each.value.project
  resource-group-name                = azurerm_resource_group.this.name
  vm-size                            = each.value.vm-size
  os_disk_caching                    = each.value.os-disk-caching
  os_disk_storage_account_type       = each.value.os-disk-storage-account-type
  os_disk_size_gb                    = each.value.os-disk-size-gb
  subnet_id                          = azurerm_subnet.this.id
  source_image_reference_publisher   = each.value.source-image-reference-publisher
  source_image_reference_offer       = each.value.source-image-reference-offer
  source_image_reference_sku         = each.value.source-image-reference-sku
  source_image_reference_version     = each.value.source-image-reference-version
  public_ip_address_id               = azurerm_public_ip.this[each.key].id
  parent-resource-group-id           = azurerm_resource_group.this.id
  bootdiagnostic-storage-account-uri = data.azurerm_storage_account.this.primary_blob_endpoint
  custom-data                        = filebase64("${path.module}/cloud-init.yaml")
  computer-name                      = each.value.computer-name
  tags                               = each.value.tags
}

resource "azurerm_network_security_group" "this" {
  name                = "${var.vnet-name}-nsg"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name

  dynamic "security_rule" {
    for_each = var.nsg-rules

    content {
      name                       = security_rule.key
      priority                   = security_rule.value.priority
      direction                  = security_rule.value.direction
      access                     = security_rule.value.access
      protocol                   = security_rule.value.protocol
      source_port_range          = security_rule.value.source-port-range
      destination_port_range     = security_rule.value.destination-port-range
      source_address_prefix      = security_rule.value.source-address-prefix
      destination_address_prefix = security_rule.value.destination-address-prefix
    }
  }
}

resource "azurerm_subnet_network_security_group_association" "this" {
  subnet_id                 = azurerm_subnet.this.id
  network_security_group_id = azurerm_network_security_group.this.id
}
