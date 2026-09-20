resource "cloudflare_dns_record" "dns_record" {
  zone_id = var.cloudflare_zone_id
  name    = var.cloudflare_name
  ttl     = var.cloudflare_ttl
  type    = var.cloudflare_record_type
  comment = var.cloudflare_comment
  content = module.virtual_machine["vm1"].public_ip_address
  proxied = var.cloudflare_proxy
}

