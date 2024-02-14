# Vagrantfile Provisioning with Ansible + Options

Consider the following section of the Vagrantfile:
```yml
plainserver.vm.provision "ansible" do |ansible|
    ansible.playbook = "setup.yml"
    ansible.limit = 'all'
    ansible.groups = {
        'web' => ['webserver'],
        'plain' => ['plainserver']
    }
end
```

This section configures Ansible provisioning only after the `plainserver` virtual machine (VM) has been created. Here's a breakdown of what each line does:

## Provisioning Block
- `plainserver.vm.provision "ansible" do |ansible|`: This line tells Vagrant to use Ansible for provisioning the `plainserver` VM. Everything inside this block (`do ... end`) defines how Ansible will be configured to run.

## Ansible Playbook
- `ansible.playbook = "setup.yml"`: Specifies the Ansible playbook file to be used for provisioning. The playbook `setup.yml` contains Ansible tasks that will be executed on the target VMs.

## Ansible Limit
- `ansible.limit = 'all'`: This line sets the `--limit` option for the Ansible command, which controls which hosts in the inventory to target. The value `'all'` means that the playbook will be applied to all hosts defined in the inventory. In the context of Vagrant provisioning, the inventory is dynamically generated by Vagrant to include the VMs being managed. Despite the limit being set to `'all'`, in this setup, it effectively targets only the VMs defined in the Vagrantfile due to how Vagrant constructs the Ansible inventory for provisioning.

## Ansible Groups
- `ansible.groups = { 'web' => ['webserver'], 'plain' => ['plainserver'] }`: This line defines custom groups in the Ansible inventory. It's a way to categorize or group your hosts for more targeted task execution within your Ansible playbooks.
    - `'web' => ['webserver']`: Creates a group named `web` with the `webserver` VM as a member. This allows you to target tasks specifically at the web server by referring to the `web` group in your playbook.
    - `'plain' => ['plainserver']`: Similarly, creates a group named `plain` with the `plainserver` VM as a member, allowing for targeted task execution on this VM.

## Summary
This provisioning block makes Ansible aware of the two VMs (`webserver` and `plainserver`) and allows you to write Ansible tasks that can be executed conditionally based on the group a host belongs to. For example, in the `setup.yml` playbook, you could have tasks that only run on the `web` group to set up web server-specific configurations, and other tasks that run on the `plain` group for configurations unique to the plain server.