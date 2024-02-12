# Web Server

This tutorial will guide you through setting up two virtual machines (VMs) using Vagrant: one configured as a web server with Apache installed and port forwarding enabled, and another basic VM without Apache. Both VMs will use Ubuntu 22.04 LTS as their base box and will be part of a private network.

## Objective

By the end of this tutorial, you will have:
- Set up two VMs using Vagrant, both running Ubuntu 22.04 LTS.
- Configured a private network that allows the VMs to communicate with each other.
- Set up the first VM to be accessible via port forwarding.

## Prerequisites
- Basic understanding of virtualization and networking concepts.
- Vagrant installed on your system. You can download it from [Vagrant's official website](https://www.vagrantup.com/downloads).
- VirtualBox installed on your system. You can download it from [VirtualBox's official website](https://www.virtualbox.org/wiki/Downloads).
- Basic familiarity with terminal or command prompt commands.

## Step 1: Create a New Directory for Your Vagrant Project

1. Open a terminal or command prompt.
2. Create a new directory for your Vagrant project and navigate into it:
   ```bash
   mkdir vagrant-webserver
   cd vagrant-webserver
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
      # Configure the first VM, named "webserver"
      config.vm.define "webserver" do |webserver|
         # Specify the base box to use, which is Ubuntu 22.04 LTS
         webserver.vm.box = "bento/ubuntu-22.04"
         # Set the hostname of the VM for easy identification
         webserver.vm.hostname = "webserver"
         # Forward port 80 from the guest (VM) to port 8000 on the host
         webserver.vm.network "forwarded_port", guest: 80, host: 8000
         # Configure a private network with a specific IP
         webserver.vm.network "private_network", ip: "192.168.56.10"
   
         # Use a shell provisioner to install and start Apache Web Server
         webserver.vm.provision "shell", inline: <<-SHELL
         # Update and upgrade the package list on the VM
         sudo apt-get update && sudo apt-get upgrade -y
         # Install Apache2 package
         sudo apt-get install -y apache2
         # Enable Apache2 to start at boot and then start the service immediately
         sudo systemctl enable apache2
         sudo systemctl start apache2
         SHELL
      end
   
      # Configure the second VM, named "plainserver", without Apache
      config.vm.define "plainserver" do |plainserver|
         # Specify the same base box, Ubuntu 22.04 LTS
         plainserver.vm.box = "bento/ubuntu-22.04"
         # Set a different hostname for this VM
         plainserver.vm.hostname = "plainserver"
         # Configure a private network for this VM too, with a different IP
         plainserver.vm.network "private_network", ip: "192.168.56.11"
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
2. You should see `webserver` and `plainserver` listed as running.

## Step 6: Verify Apache Installation

1. Connect to `plainserver`:
   ```bash
   vagrant ssh plainserver
   ```
2. Once logged in, you can check that Apache is running on `webserver` by requesting the web page:
   ```bash
   curl 192.168.56.10
   ```
3. You should see successful response.
   ```html
   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   <html xmlns="http://www.w3.org/1999/xhtml">
   <!--
      Modified from the Debian original for Ubuntu
      Last updated: 2022-03-22
      See: https://launchpad.net/bugs/1966004
   -->
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Apache2 Ubuntu Default Page: It works</title>
      <style type="text/css" media="screen">
   * {
      margin: 0px 0px 0px 0px;
      padding: 0px 0px 0px 0px;
   }
   ...
   ...
   ```

4. Exit the `plainserver` SSH session:
   ```bash
   exit
   ```

## Step 7: Access the Apache Web Server from Your Host Machine

1. Open a web browser on your host machine and navigate to `http://localhost:8000`.

2. You should see the Apache2 Ubuntu default page, indicating that port forwarding is working correctly.

## Step 8: Place a Custom HTML File

1. The `/vagrant` directory in the Guest VM is mapped to the Host's Vagrant project directory. Make sure to place a copy of `custom_index.html` in your project's directory. 
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Custom Page</title>
      <style>
         body {
               font-family: Arial, sans-serif;
               margin: 40px;
               background-color: #f0f0f0;
               color: #333;
         }
         h1 {
               color: #0066cc;
         }
         p {
               margin: 20px 0;
         }
         .container {
               max-width: 600px;
               margin: auto;
               background: #fff;
               padding: 20px;
               border-radius: 8px;
               box-shadow: 0 2px 4px rgba(0,0,0,0.1);
         }
      </style>
   </head>
   <body>
      <div class="container">
         <h1>Welcome ECE 5400 to Your Custom Apache Server</h1>
         <p>This is a custom page served by Apache on a Vagrant-provisioned virtual machine.</p>
         <p>Edit this file to update the content and re-provision the VM to see changes.</p>
      </div>
   </body>
   </html>
   ```
2. Open your Vagrantfile and locate the shell provisioner section for the webserver VM. 
3. Modify it to copy `custom_index.html` from `/vagrant` to the Apache default document root `/var/www/html`, replacing the default `index.html` file:

   ```ruby
   webserver.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update && sudo apt-get upgrade -y
      sudo apt-get install -y apache2
      sudo systemctl enable apache2
      sudo systemctl start apache2
      # Copy the custom HTML file from the /vagrant directory to Apache's document root
      sudo cp /vagrant/custom_index.html /var/www/html/index.html
   SHELL
   ```
4. Let's re-provision the VM:
   ```bash
   vagrant provision webserver
   ```
5. Retest Steps 6 and 7.

## Step 9: Destroy the VMs
1. Ensure that you no longer need the allocated resources.

2. Force destroy the resources:
   ```bash
   vagrant destroy -f
   ```
2. Verify with `vagrant status`.

## Conclusion
You've configured two Ubuntu 22.04 LTS VMs with Vagrant: a webserver with Apache installed and accessible via port forwarding, and a plainserver in a private network. 