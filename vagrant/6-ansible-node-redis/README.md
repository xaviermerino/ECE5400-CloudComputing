# Vagrant and Ansible for a Web and Database Server Setup
This tutorial walks you through setting up a development environment with two Ubuntu 22.04 LTS virtual machines using Vagrant: one serving as a web server and the other as a database server. We'll automate their provisioning using Ansible to install and configure Redis on the database server and Node.js on the web server.

## Objective

By the end of this tutorial, you will have:
- Configured multiple VMs in a private network.
- Configured a web server and database server.
- Automated the environment setup using Ansible.

## Prerequisites

- A basic understanding of virtualization, networking, and automation concepts.
- Vagrant installed on your system. Download it from [Vagrant's official website](https://www.vagrantup.com/downloads).
- VirtualBox installed as your hypervisor. Download it from [VirtualBox's official website](https://www.virtualbox.org/wiki/Downloads).
- Ansible installed on your system for provisioning. Installation guides are available on [Ansible's official documentation](https://docs.ansible.com/ansible/latest/installation_guide/index.html).
- Familiarity with terminal or command prompt commands.

## Step 1: Prepare Your Project Directory

1. Open a terminal or command prompt.

2. Create a new directory for your Vagrant project and change into it:
   ```bash
   mkdir vagrant-ansible-web-db
   cd vagrant-ansible-web-db
   ```

3. This directory will contain your Vagrantfile and Ansible playbooks.

## Step 2: Initialize Your Vagrant Environment

1. While in your project directory, initialize a new Vagrant environment by generating a `Vagrantfile`:
   ```bash
   vagrant init
   ```

2. This command creates a `Vagrantfile` with default content. You'll replace this with your custom configuration.

## Step 3: Customize the Vagrantfile

1. Open the `Vagrantfile` in a text editor of your choice.

2. Replace the content with the provided configuration to define a web and a database server:
   ```ruby
   # -*- mode: ruby -*-
   # vi: set ft=ruby :

   VAGRANTFILE_API_VERSION = "2"

   Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
      config.vm.define "db" do |db|
         db.vm.box = "bento/ubuntu-22.04"
         db.vm.network "private_network", ip: "192.168.56.72"
         db.vm.hostname = "db-server"
         db.vm.provision "ansible" do |ansible|
            ansible.playbook = "provisioning/db.yml"
         end
      end

      config.vm.define "web" do |web|
         web.vm.box = "bento/ubuntu-22.04"
         web.vm.network "private_network", ip: "192.168.56.71"
         web.vm.hostname = "web-server"
         web.vm.network "forwarded_port", guest: 3000, host: 3000
         web.vm.provision "ansible" do |ansible|
            ansible.playbook = "provisioning/web.yml"
         end
      end
   end
   ```
3. Save and close the `Vagrantfile`.

## Step 4: Create an Ansible Playbook

1. Copy the `files` directory from the repository to your project directory. It contains the application we are going to deploy.

2. Create a directory named `provisioning` within your project directory:
   ```bash
   mkdir provisioning
   ```

3. Inside `provisioning`, create two files: `db.yml` and `web.yml`.

4. Modify the contents of `db.yml` as shown below:
   ```yml
   ---
   - hosts: db
   become: yes
   tasks:
      - name: Install Redis Server
         ansible.builtin.apt:
         name: redis-server
         state: present
         update_cache: yes
      
      - name: Update Redis configuration to accept connections from any IP
         lineinfile:
         path: /etc/redis/redis.conf
         regexp: '^bind '
         line: 'bind 0.0.0.0'
         state: present

      - name: Ensure Redis is running
         ansible.builtin.service:
         name: redis-server
         state: restarted
         enabled: yes
   ```

   For a description of what this playbook does see [here](dm.md).

4. Modify the contents of `web.yml` as shown below:
   ```yml
   ---
   - hosts: web
     become: yes
     tasks:
      - name: Install Node.js
         ansible.builtin.apt:
         name: nodejs
         state: present
         update_cache: yes

      - name: Install npm
         ansible.builtin.apt:
         name: npm
         state: present
         update_cache: yes

      - name: Copy application files
         ansible.builtin.copy:
         src: ../files/
         dest: /home/vagrant/
      
      - name: Install app dependencies
         ansible.builtin.shell: cd /home/vagrant && npm install
      
      - name: Start the Node.js app
         ansible.builtin.shell: cd /home/vagrant && node app.js &

   ```

   For a description of what this playbook does see [here](web.md).
   
## Step 5: Launch and Provision the VMs

1. Start the VMs and provision them using Ansible by running:
   ```bash
   vagrant up
   ```

2. Vagrant will start and provision both VMs according to the Ansible playbooks, installing Redis on the database server and Node.js on the web server.

3. If everything went right, during the provisioning process you will see the steps being executed. 

4. If you update the playbooks and want to re-provision the VMs, you can run:
    ```bash
    vagrant provision
    ```

## Step 6: Verify and Connect

1. Ensure the VMs are running and reachable:
   ```bash
   vagrant status
   ```

2. SSH into either VM to inspect or modify its configuration:
   ```bash
   vagrant ssh web
   ```

3. To exit the SSH session, type:
   ```bash
   exit
   ```

4. Using your browser, navigate to `localhost:3000`, you should now see a website that counts the number of times it has been accessed. 

## Step 7: Clean Up Resources

1. When you're finished, you can stop and delete the VMs to free up resources:
   ```bash
   vagrant destroy -f
   ```

2. Confirm that the VMs have been removed with `vagrant status`.

## Conclusion

You have created a Vagrant environment with a web server and a database server, both provisioned using Ansible. 

