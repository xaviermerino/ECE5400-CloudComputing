# Explanation of `web.yml`

This Ansible playbook configures the host named `web` to serve as a web server, specifically for hosting a Node.js application. Below is an explanation of what each part of the playbook accomplishes:

### 1. Install Node.js

- **hosts: web**: Specifies that the playbook will execute on the `web` host.
- **become: yes**: Elevates privileges, equivalent to using `sudo`, for tasks requiring permissions.

The first task:

- **name: Install Node.js**: Describes what the task does.
- **ansible.builtin.apt**: Uses the `apt` module for managing packages on Debian or Ubuntu systems.
   - **name: nodejs**: Specifies the Node.js package to be installed.
   - **state: present**: Ensures that the Node.js package is installed. If it's already installed, no action is taken.
   - **update_cache: yes**: Updates the package cache before installation, akin to running `apt-get update`.

### 2. Install npm

The second task installs `npm`, the Node.js package manager:

- **name: Install npm**: Describes what the task does.
- **ansible.builtin.apt**: Again, this uses the `apt` module for package management.
   - **name: npm**: Specifies the `npm` package for installation.
   - **state: present**: Ensures `npm` is installed.
   - **update_cache: yes**: Updates the package cache before installation.

### 3. Copy Application Files

The third task copies application files to the target host:

- **name: Copy application files**: Describes what the task does.
- **ansible.builtin.copy**: Uses the `copy` module to transfer files.
   - **src: ../files/**: The source directory of your application files, relative to the playbook's location.
   - **dest: /home/vagrant/**: The destination directory on the target host where files will be copied.

### 4. Install App Dependencies

This task installs dependencies defined in the application's `package.json` file:

- **name: Install app dependencies**: Describes what the task does.
- **ansible.builtin.shell**: Executes shell commands.
   - **cd /home/vagrant && npm install**: Changes to the directory where the application files are located and runs `npm install` to install the necessary dependencies.

### 5. Start the Node.js App

The final task starts the Node.js application:

- **name: Start the Node.js app**: Describes what the task does.
- **ansible.builtin.shell**: Uses shell commands for execution.
   - **cd /home/vagrant && node app.js &**: Changes to the application's directory and starts the app by running `node app.js &`. The ampersand (`&`) at the end runs the application in the background, allowing the playbook to proceed without waiting for the application to terminate.

Through these tasks, the playbook automates the setup of a Node.js environment on a web server, including installing Node.js and npm, copying application files, installing dependencies, and starting the Node.js application. 