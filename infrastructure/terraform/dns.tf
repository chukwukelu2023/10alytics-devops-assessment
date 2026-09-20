locals {
  github_vm_secrets = flatten([
    for vm_key, vm_config in var.vm-specification : [
      {
        vm_key      = vm_key
        repository  = vm_config.repository
        secret_name = "SERVER_USER"
        value       = module.virtual_machine[vm_key].admin_username
      },
      {
        vm_key      = vm_key
        repository  = vm_config.repository
        secret_name = "SERVER_HOST"
        value       = module.virtual_machine[vm_key].public_ip_address
      }
    ]
  ])
  github_vm_secrets_map = {
    for secret in local.github_vm_secrets :
    "${secret.repository}-${secret.vm_key}-${secret.secret_name}" => secret
  }
}


resource "cloudflare_dns_record" "dns_record" {
  zone_id = var.cloudflare_zone_id
  name    = var.cloudflare_name
  ttl     = var.cloudflare_ttl
  type    = var.cloudflare_record_type
  comment = var.cloudflare_comment
  content = module.virtual_machine["vm1"].public_ip_address
  proxied = var.cloudflare_proxy
}

resource "github_actions_secret" "this" {
  for_each    = local.github_vm_secrets_map
  repository  = each.value.repository
  secret_name = each.value.secret_name
  value       = each.value.value
}
