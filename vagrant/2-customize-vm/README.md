# Customizing VM Resources

This guide will walk you through setting up an Ubuntu 22.04 LTS virtual machine using Vagrant with specific configurations for CPU, memory, and enabling I/O APIC for improved hardware compatibility and performance. 

## Objective

By following this tutorial, you will:
- Create a virtual machine running Ubuntu 22.04 LTS using Vagrant.
- Configure the VM with 2 virtual CPUs (vCPUs) and 4 GB of RAM.
- Enable I/O APIC in the VM for better compatibility with 64-bit operating systems and multi-CPU setups.

## Prerequisites

- Basic understanding of virtualization concepts.
- Vagrant and VirtualBox installed on your system.

## Step 1: Create a Project Directory

1. Open a terminal or command prompt.
2. Create a new directory for your Vagrant project and navigate into it:
   ```bash
   mkdir vagrant-customize
   cd vagrant-customize
   ```

## Step 2: Initialize a New Vagrantfile

1. Initialize a new Vagrant environment which creates a default `Vagrantfile`:
   ```bash
   vagrant init
   ```

## Step 3: Customize Your Vagrantfile

1. Open the `Vagrantfile` in a text editor.
2. Replace its content with the following configuration to define the VM, specifying the Ubuntu 22.04 box, hostname, number of vCPUs, amount of memory, and enabling I/O APIC:
   ```ruby
   # -*- mode: ruby -*-
   # vi: set ft=ruby :

   Vagrant.configure("2") do |config|
       config.vm.box = "bento/ubuntu-22.04"
     
       config.vm.define "ubuntu-vm" do |vm|
         vm.vm.hostname = "ubuntu-vm"
         vm.vm.provider "virtualbox" do |vb|
           vb.cpus = 2
           vb.memory = "4096"
           vb.customize ["modifyvm", :id, "--ioapic", "on"]
         end
       end
   end
   ```
3. Save and close the file.

## Step 4: Launch Your VM

1. In your terminal (make sure you're in the project directory), start the VM:
   ```bash
   vagrant up
   ```
2. Vagrant will download the `bento/ubuntu-22.04` box (if necessary) and provision a new VM based on the specifications in the `Vagrantfile`.

## Step 5: Verify the VM is Running

1. Check the status of your VMs:
   ```bash
   vagrant status
   ```
2. You should see `ubuntu-vm` running.

## Step 6: Access Your VM

1. Once the VM is up and running, connect to it using SSH:
   ```bash
   vagrant ssh
   ```

## Step 7: Confirm the Resources

1. Check the CPU information:
   ```bash
   lscpu
   ```

2. Check the amont of RAM allocated to your VM:
   ```bash
   free -mh
   ```

## Step 8: Destroy the VM
1. Ensure that you no longer need the allocated resources.

2. Force destroy the resources:
   ```bash
   vagrant destroy -f
   ```
2. Verify with `vagrant status`.

## Conclusion

You have now created an Ubuntu 22.04 LTS VM equipped with 2 vCPUs and 4 GB of RAM, and the I/O APIC setting  enabled.