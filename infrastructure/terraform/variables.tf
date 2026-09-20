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
    repository                           = optional(string)
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

# variable "subscription-id" {
#   type        = string
#   description = "The subscription ID in which to create the virtual machine."
# }

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
variable "nsg-rules" {
  type = map(object({
    priority                   = number
    direction                  = string
    access                     = string
    protocol                   = string
    source-port-range          = string
    destination-port-range     = string
    source-address-prefix      = string
    destination-address-prefix = string
  }))
  description = "Network security group rules, keyed by rule name (e.g. ssh, http, https). Each entry becomes one security_rule block on the NSG; priorities must be unique."
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare Zone Id"
}

variable "cloudflare_name" {
  type        = string
  description = "(String) DNS record name (or @ for the zone apex) in Punycode."
}

variable "cloudflare_ttl" {
  type        = number
  description = "(Number) Time To Live (TTL) of the DNS record in seconds. Setting to 1 means 'automatic'. Value must be between 60 and 86400, with the minimum reduced to 30 for Enterprise zones."
  default     = 1
}

variable "cloudflare_record_type" {
  type        = string
  description = "(String) Record type. Available values: A, AAAA, CNAME, MX, NS, OPENPGPKEY, PTR, TXT, CAA, CERT, DNSKEY, DS, HTTPS, LOC, NAPTR, SMIMEA, SRV, SSHFP, SVCB, TLSA, URI."

  validation {
    condition     = contains(["A", "AAAA", "CNAME", "MX", "NS", "OPENPGPKEY", "PTR", "TXT", "CAA", "CERT", "DNSKEY", "DS", "HTTPS", "LOC", "NAPTR", "SMIMEA", "SRV", "SSHFP", "SVCB", "TLSA", "URI"], upper(var.cloudflare_record_type))
    error_message = "cloudflare_record_type must be one of: A, AAAA, CNAME, MX, NS, OPENPGPKEY, PTR, TXT, CAA, CERT, DNSKEY, DS, HTTPS, LOC, NAPTR, SMIMEA, SRV, SSHFP, SVCB, TLSA, or URI."
  }
}

variable "cloudflare_comment" {
  type    = string
  default = "Description of the dns record"
}

variable "cloudflare_proxy" {
  type        = bool
  description = "To show if cloudflare proxy setting will be turned on or off"
  default     = false
}

# variable "github_token" {
#   type        = string
#   description = "Github Authentication Token"
# }

# variable "github_repository" {
#   type        = string
#   description = "(Required) Name of the repository."
# }

# variable "github_secret_name" {
#   type        = string
#   description = "(Required) Name of the secret."
# }

# variable "github_secret_value" {
#   type        = string
#   description = "(Optional) Plaintext value of the secret to be encrypted. This conflicts with value_encrypted, encrypted_value & plaintext_value"
# }

# variable "cloudflare_api_token" {
#   type        = string
#   description = "Clouflare Token for Atuntication"
# }