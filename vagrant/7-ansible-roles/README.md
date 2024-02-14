# Vagrant Setup with Ansible Roles

This tutorial will guide you through creating a development environment with two Ubuntu 22.04 LTS virtual machines: one acting as a web server and the other as a vanilla server. We'll use Vagrant for virtual machine management and Ansible for automation provisioning using Ansible Roles.

## Objective

By completing this tutorial, you will have:
- Set up two VMs in a private network, named "webserver" and "plainserver".
- Automatically provisioned both VMs using Ansible, with specific roles for each.

## Prerequisites

- A basic understanding of virtualization, networking, and automation concepts.
- Vagrant installed on your machine. Download from [Vagrant's official website](https://www.vagrantup.com/downloads).
- VirtualBox as your hypervisor. Available at [VirtualBox's official website](https://www.virtualbox.org/wiki/Downloads).
- Ansible for provisioning. Installation instructions are on [Ansible's official documentation](https://docs.ansible.com/ansible/latest/installation_guide/index.html).
- Basic familiarity with terminal or command prompt commands.

## Step 1: Project Directory Setup

1. Open your terminal or command prompt.

2. Create a new directory for your project and navigate into it:
   ```bash
   mkdir vagrant-ansible-roles
   cd vagrant-ansible-roles
   ```
This directory will house your Vagrantfile and Ansible playbooks.

## Step 2: Initialize Vagrant Environment

1. In your project directory, initialize Vagrant to create a basic `Vagrantfile`:
   ```bash
   vagrant init
   ```
This command generates a default `Vagrantfile`. You'll modify this to suit our setup.

## Step 3: Customize the Vagrantfile

1. Edit the `Vagrantfile` in your preferred text editor.

2. Replace its content with the configuration provided, which sets up the "webserver" and "plainserver" VMs, and specifies Ansible for provisioning:
   ```ruby
   VAGRANTFILE_API_VERSION = "2"

   Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
       config.vm.define "webserver" do |webserver|
         webserver.vm.box = "bento/ubuntu-22.04"
         webserver.vm.hostname = "webserver"
         webserver.vm.network "forwarded_port", guest: 80, host: 8000
         webserver.vm.network "private_network", ip: "192.168.56.10"
       end

       config.vm.define "plainserver" do |plainserver|
         plainserver.vm.box = "bento/ubuntu-22.04"
         plainserver.vm.hostname = "plainserver"
         plainserver.vm.network "private_network", ip: "192.168.56.11"
         plainserver.vm.provision "ansible" do |ansible|
           ansible.playbook = "setup.yml"
           ansible.limit = 'all'
           ansible.groups = {
             'web' => ['webserver'],
             'plain' => ['plainserver']
           }
         end
       end
     end
   ```

   See a more detailed explanation for this Vagrantfile [here](provisioning.md).

3. Save your changes and close the editor.

## Step 4: Create an Ansible Playbook and Roles

1. Create a file named `setup.yml` in the project directory.

2. Write your Ansible playbook to define tasks for each server. We will name this playbook `setup.yml`:
   ```yml
   ---
   - name: Ping VMs
   hosts: all
   gather_facts: yes
   become: yes
   tasks:
      - name: Ping
         ansible.builtin.ping:

   - name: Set Webserver 
   hosts: web
   gather_facts: yes
   become: yes
   roles:
      - webserver

   - name: Set Plainserver 
   hosts: plain
   gather_facts: yes
   become: yes
   roles:
      - be_pretty
      
   ```
   See a more detailed explanation for this playbook [here](roles.md).

3. We will now create a `roles` directory inside your project's directory. As seen in the file above, we need two roles (i.e., `webserver`, `be_pretty`). We will create a subdirectory (within `roles`) for each of these. Within each subdirectory we will include a `task` folder with a `main.yml` and another YAML file containing the tasks associated with the role. Your directory structure should look like this:
   ```bash
   .
   ├── roles
   │   ├── be_pretty
   │   │   └── tasks
   │   │       ├── be_pretty.yml
   │   │       └── main.yml
   │   └── webserver
   │       └── tasks
   │           ├── apache.yml
   │           └── main.yml
   ├── setup.yml
   └── Vagrantfile
   ```

4. We will focus on the `be_pretty` role next.

   - The `be_pretty.yml` should contain the following task:
   ```yml
   - name: Print Pretty Message
     ansible.builtin.debug:
       msg: "I am already pretty!"
   ```

   - The `main.yml` should contain a directive to import the task file we defined above:
   ```yml
   ---
   - import_tasks: be_pretty.yml
   ```

5. We will focus on the `webserver` role next.

   - The `apache.yml` should contain the following task:
   ```yml
   - name: Install Apache
     ansible.builtin.apt:
       name: apache2
       state: present
       update_cache: yes

   - name: Ensure Apache is running
     ansible.builtin.service:
       name: apache2
       state: started
       enabled: yes
   ```

   - The `main.yml` should contain a directive to import the task file we defined above:
   ```yml
   ---
   - import_tasks: apache.yml
   ```

## Step 5: Launch and Provision VMs

1. Start and provision your VMs by running:
   ```bash
   vagrant up
   ```
Vagrant will process the `Vagrantfile`, creating each VM according to the specifications and running Ansible to provision them as defined in `setup.yml`.

## Step 6: Verify and Connect

1. Check the status of the VMs:
   ```bash
   vagrant status
   ```

2. SSH into either VM for inspection or adjustments:
   ```bash
   vagrant ssh webserver
   ```
   or
   ```bash
   vagrant ssh plainserver
   ```

3. Exit the SSH session by typing `exit`.

4. Use your browser to navigate to `localhost:8000` to verify that the Apache Web Server is running.

## Step 7: Cleanup

1. When finished, destroy the VMs to free up resources:
   ```bash
   vagrant destroy -f
   ```

2. Verify removal with `vagrant status`.

## Conclusion

By now, you should have created a Vagrant environment with a web server and a plain, vanilla, server, both running Ubuntu 22.04 LTS and provisioned using Ansible roles.