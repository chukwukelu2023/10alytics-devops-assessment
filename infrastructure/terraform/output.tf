output "vm-admin-username" {
  value = module.virtual_machine["vm1"].admin_username
}

output "vm-public-ip" {
  value = module.virtual_machine["vm1"].public_ip_address
}
