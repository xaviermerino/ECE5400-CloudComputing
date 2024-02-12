# Vagrant Quickstart

This tutorial demonstrates setting up an Ubuntu 22.04 LTS virtual machine with Vagrant. You'll customize a Vagrantfile, initiate the VM, use `ssh` to login and destroy the allocated resources.

## Objective

By the end of this tutorial, you will have:
- Tested your environment.
- Set up a VM using Vagrant with Ubuntu 22.04 LTS as the guest operating system.

## Prerequisites
- Basic understanding of virtualization concepts.
- Vagrant installed on your system. You can download it from [Vagrant's official website](https://www.vagrantup.com/downloads).
- VirtualBox installed on your system. You can download it from [VirtualBox's official website](https://www.virtualbox.org/wiki/Downloads).
- Basic familiarity with terminal or command prompt commands.

## Step 1: Create a New Directory for Your Vagrant Project

1. Open a terminal or command prompt.
2. Create a new directory for your Vagrant project and navigate into it:
   ```bash
   mkdir vagrant-quickstart
   cd vagrant-quickstart
   ```
3. Vagrant keeps the state of the VMs in this directory by adding a `.vagrant` folder. 
## Step 2: Initialize a New Vagrantfile

1. Initialize a new Vagrant environment by creating a `Vagrantfile`:
   ```bash
   vagrant init
   ```
2. This command creates a `Vagrantfile` with default content. You'll modify this file to define your VMs.

## Step 3: Configure the Vagrantfile

1. Open the `Vagrantfile` in your favorite text editor.
2. Replace the content of the `Vagrantfile` with the provided configuration:
   ```ruby
   # -*- mode: ruby -*-
   # vi: set ft=ruby :

   Vagrant.configure("2") do |config|
      config.vm.box = "bento/ubuntu-22.04"

      config.vm.define "ubuntu-vm" do |vm|
         vm.vm.hostname = "ubuntu-vm"
      end   
   end
   ```

3. Save and close the `Vagrantfile`.

## Step 4: Start the VM

1. In your terminal or command prompt, ensure you are in the directory containing your `Vagrantfile`.
2. Start the VMs by running:
   ```bash
   vagrant up
   ```
3. Vagrant will read the `Vagrantfile`, download the `bento/ubuntu-22.04` box (if not already downloaded), and configure both VMs as specified.

## Step 5: Verify the VM is Running

1. Check the status of your VMs:
   ```bash
   vagrant status
   ```
2. You should see `ubuntu-vm` running.

## Step 6: Access Your VM

1. Connect to `ubuntu-vm`:
   ```bash
   vagrant ssh
   ```

2. Exit th SSH session:
   ```bash
   exit
   ```

## Step 7: Destroy the VM
1. Ensure that you no longer need the allocated resources.

2. Force destroy the resources:
   ```bash
   vagrant destroy -f
   ```
2. Verify with `vagrant status`.


## Conclusion

If you reached this far, you've successfully created and configured an Ubuntu 22.04 LTS VM. 