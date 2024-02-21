## Setting Up Ansible + Vagrant for WSL

This guide assumes that you have VirtualBox already installed in your Windows computer. 

Steps:
1. Install Ubuntu from the Windows Store. For more information about Ubuntu on WSL visit [this](https://ubuntu.com/desktop/wsl).
2. In WSL:
  - Install `python3` and `python3-pip`:
    ```bash
    sudo apt update
    sudo apt install -y python3-pip
    ```
  - Install Ansible using `pip`:
    ```bash
    pip install ansible --user
    ```
  - Download Vagrant, the instructions can be found [here](https://developer.hashicorp.com/vagrant/install#linux). See below for reference, but consult the documentation as changes may have been introduced. Make sure that the Vagrant version you download matches the version you installed in Windows.
    ```bash
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update && sudo apt install vagrant
    ```
  - Install the Vagrant VirtualBox WSL plugin:
    ```bash
    vagrant plugin install virtualbox_WSL2
    ```
  - Setup Vagrant to use VirtualBox on Windows:
    ```bash
    echo 'export VAGRANT_WSL_ENABLE_WINDOWS_ACCESS="1"' >> ~/.bashrc
    echo 'export PATH="${PATH}:/mnt/c/Program Files/Oracle/VirtualBox"' >> ~/.bashrc
    source ~/.bashrc
    ```
  - Uninstall VirtualBox from WSL if installed:
    ```bash
    sudo apt remove virtualbox
    ```
  - An SSH connection from WSL to your Vagrant VM will fail during public key authentication with an error like `WARNING: UNPROTECTED PRIVATE KEY FILE!`. To fix this, let's add the following to `/etc/wsl.conf`:
    ```bash
    # Enable extra metadata options by default
    [automount]
    enabled = true
    root = /mnt/
    options = "metadata,umask=77,fmask=11"
    mountFsTab = false
    ```
  - Exit WSL
     
3. In Windows:
  - From a priviledged Powershell:
    ```
    Restart-Service -Name "LxssManager"
    ```
  - Restart WSL and you should be ready to go! Note that, the directory `/vagrant` can only be mapped if it exists in your `C:/` drive. It will fail if you try to map from within WSL.
