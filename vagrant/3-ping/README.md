# VMs Ping-Pong

This tutorial outlines the process of using Vagrant to set up two Ubuntu 22.04 LTS virtual machines on a private network, enabling them to communicate via specific IP addresses. You will configure a Vagrantfile for the VM specifications, launch the VMs, and test their connectivity with `ping` commands. 

## Objective

By the end of this tutorial, you will have:
- Set up two VMs using Vagrant, both running Ubuntu 22.04 LTS.
- Configured a private network that allows the VMs to communicate with each other.
- Tested connectivity between the VMs using ping.

## Prerequisites
- Basic understanding of virtualization concepts.
- Vagrant installed on your system. You can download it from [Vagrant's official website](https://www.vagrantup.com/downloads).
- VirtualBox installed on your system. You can download it from [VirtualBox's official website](https://www.virtualbox.org/wiki/Downloads).
- Basic familiarity with terminal or command prompt commands.

## Step 1: Create a New Directory for Your Vagrant Project

1. Open a terminal or command prompt.
2. Create a new directory for your Vagrant project and navigate into it:
   ```bash
   mkdir vagrant-ping
   cd vagrant-ping
   ```

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

   VAGRANTFILE_API_VERSION = "2"

   Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
     # Define the Ubuntu 22.04 LTS box
     config.vm.box = "bento/ubuntu-22.04"

     # VM configuration for the first VM
     config.vm.define "vm1" do |vm1|
       vm1.vm.hostname = "vm1"
       # Network configuration for the first VM
       vm1.vm.network "private_network", ip: "192.168.56.10"
     end

     # VM configuration for the second VM
     config.vm.define "vm2" do |vm2|
       vm2.vm.hostname = "vm2"
       # Network configuration for the second VM
       vm2.vm.network "private_network", ip: "192.168.56.11"
     end
   end
   ```
3. Save and close the `Vagrantfile`.

## Step 4: Start the VMs

1. In your terminal or command prompt, ensure you are in the directory containing your `Vagrantfile`.
2. Start the VMs by running:
   ```bash
   vagrant up
   ```
3. Vagrant will read the `Vagrantfile`, download the `bento/ubuntu-22.04` box (if not already downloaded), and configure both VMs as specified.

## Step 5: Verify the VMs are Running

1. Check the status of your VMs:
   ```bash
   vagrant status
   ```
2. You should see `vm1` and `vm2` listed as running.

## Step 6: Test Connectivity Between the VMs

1. Connect to `vm1`:
   ```bash
   vagrant ssh vm1
   ```
2. From `vm1`, ping `vm2`:
   ```bash
   ping -c 4 192.168.56.11
   ```
3. You should see successful ping responses, indicating that `vm1` can communicate with `vm2`.

4. Exit `vm1` SSH session:
   ```bash
   exit
   ```

5. Repeat the steps to connect to `vm2` and ping `vm1` to verify connectivity in the opposite direction.

## Step 7: Destroy the VMs
1. Ensure that you no longer need the allocated resources.

2. Force destroy the resources:
   ```bash
   vagrant destroy -f
   ```
2. Verify with `vagrant status`.

## Conclusion

If you reached this far, you've successfully created and configured two Ubuntu 22.04 LTS VMs in a private network using Vagrant. You've also tested that these VMs can communicate with each other using their private IP addresses. 