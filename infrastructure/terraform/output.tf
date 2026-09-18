output "vm-admin-username" {
  value = module.virtual_machine["vm1"].admin_username
}

output "vm-public-ip" {
  value = module.virtual_machine["vm1"].public_ip_address
}

output "vm-ssh-private-key" {
  value     = module.virtual_machine["vm1"].ssh_private_key
  sensitive = true
}