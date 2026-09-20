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

output "vm-names" {
  value = {
    for key, vm in module.virtual_machine :
    key => vm.admin_username
  }
}

output "vm-hosts" {
  value = {
    for key, vm in module.virtual_machine :
    key => vm.public_ip_address
  }
}

output "vm-ssh-private-keys" {
  value = {
    for key, vm in module.virtual_machine :
    key => vm.ssh_private_key
  }

  sensitive = true
}