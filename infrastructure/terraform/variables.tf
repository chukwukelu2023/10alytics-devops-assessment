## VM Creation
variable "vm-specification" {
  type = map(object({
    vm-location                          = string
    environment                          = string
    project                              = string
    vm-name                              = optional(string)
    network-interface-ids                = optional(list(string))
    resource-group-name                  = optional(string)
    vm-size                              = string
    admin-username                       = optional(string, null)
    public-ssh-key                       = optional(string, null)
    admin-password                       = optional(string)
    computer-name                        = optional(string)
    custom-data                          = optional(string)
    user-data                            = optional(string)
    boot-diagnostics-storage-account-uri = optional(string)
    os-disk-caching                      = string
    os-disk-storage-account-type         = string
    os-disk-size-gb                      = number
    os-disk-name                         = optional(string)
    source-image-reference-publisher     = string
    source-image-reference-offer         = string
    source-image-reference-sku           = string
    source-image-reference-version       = string
    tags                                 = optional(map(string))
    subnet-id                            = optional(string)
    ip-configuration-name                = optional(string)
    private-ip-allocation                = optional(string)
    public-ip-address-id                 = optional(string)
  }))
}

variable "resource-group-name" {
  type        = string
  description = "The name of the resource group in which to create the virtual machine."
}

variable "vm-location" {
  type        = string
  description = "The Azure region in which to create the virtual machine."
}

variable "vnet-name" {
  type        = string
  description = "The name of the virtual network in which to create the virtual machine."
}

variable "subscription-id" {
  type        = string
  description = "The subscription ID in which to create the virtual machine."
}

variable "vnet-address-space" {
  type        = list(string)
  description = "The address space of the virtual network."
}

variable "subnet-name" {
  type        = string
  description = "The name of the subnet in which to create the virtual machine."
}

variable "subnet-address-prefix" {
  type        = list(string)
  description = "The address prefix of the subnet."
}

variable "public-ip-allocation-method" {
  type        = string
  description = "The allocation method of the public IP address. Possible values are Static and Dynamic."
  default     = "Static"
}

variable "storage-account-name" {
  type        = string
  description = "The name of the storage account to use for boot diagnostics."
  default     = null
}

variable "storage-account-rg-name" {
  type        = string
  description = "The name of the resource group in which to create the storage account for boot diagnostics."
  default     = null
}
variable "nsg-rule-name" {
  type        = string
  description = "The name of the network security group rule."
}

variable "nsg-rule-priority" {
  type        = number
  description = "The priority of the network security group rule. Lower numbers are evaluated first."
}

variable "nsg-rule-direction" {
  type        = string
  description = "The direction of the network security group rule. Possible values are Inbound and Outbound."
}

variable "nsg-rule-access" {
  type        = string
  description = "Whether traffic matching the rule is allowed or denied. Possible values are Allow and Deny."
}

variable "nsg-rule-protocol" {
  type        = string
  description = "The network protocol the rule applies to. Possible values are Tcp, Udp, Icmp, Esp, Ah and *."
}

variable "nsg-rule-source-port-range" {
  type        = string
  description = "The source port or port range the rule applies to. A single port, a range such as 1000-2000, or * for any."
}

variable "nsg-rule-destination-port-range" {
  type        = string
  description = "The destination port or port range the rule applies to. A single port, a range such as 1000-2000, or * for any."
}

variable "nsg-rule-source-address-prefix" {
  type        = string
  description = "The source address prefix the rule applies to. A CIDR, an Azure service tag, or * for any."
}

variable "nsg-rule-destination-address-prefix" {
  type        = string
  description = "The destination address prefix the rule applies to. A CIDR, an Azure service tag, or * for any."
}
