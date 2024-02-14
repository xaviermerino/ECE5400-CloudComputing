# Explanation of `db.yml`

This Ansible playbook configures host `db` to serve as a Redis database server. It elevates its privileges to ensure it has the necessary permissions to install software and modify system files. Here's a breakdown of what each part of the playbook does:

### 1. Install Redis Server

- **hosts: db**: Specifies that the playbook will run on host `db`.
- **become: yes**: Escalates privileges, equivalent to using `sudo`, to ensure tasks have the necessary permissions.
- **tasks**: A list of tasks the playbook will execute.

The first task:

- **name: Install Redis Server**: Describes what the task does.
- **ansible.builtin.apt**: Uses the `apt` module, which is used for managing Debian or Ubuntu packages.
   - **name: redis-server**: Specifies the package to install, in this case, `redis-server`.
   - **state: present**: Ensures the package is installed. If it's already installed, it does nothing.
   - **update_cache: yes**: Updates the package cache before installing, similar to running `apt-get update`.

### 2. Update Redis Configuration to Accept Connections from Any IP

The second task modifies the Redis configuration file to allow connections from any IP address. This is necessary because our VMs have two NICs. The first is internal to VirtualBox for communication between the hypervisor and the VM, and the second one is the private IP address we have used.

- **name: Update Redis configuration to accept connections from any IP**: Describes what the task does.
- **lineinfile**: Uses the `lineinfile` module to ensure a specific line is present in a file.
   - **path: /etc/redis/redis.conf**: The file to modify, in this case, the Redis configuration file.
   - **regexp: '^bind '**: A regular expression that matches lines starting with `bind`. This tells Ansible where to apply the change.
   - **line: 'bind 0.0.0.0'**: Replaces the matched line with this, telling Redis to accept connections on any network interface.
   - **state: present**: Ensures the line is present in the file.

### 3. Ensure Redis is Running

The final task makes sure the Redis service is running and set to start on boot:

- **name: Ensure Redis is running**: Describes what the task does.
- **ansible.builtin.service**: Uses the `service` module to manage the service.
   - **name: redis-server**: The name of the service to manage.
   - **state: restarted**: Ensures the service is restarted. This is useful if the service needs to reload its configuration file after modifications, such as the one above.
   - **enabled: yes**: Ensures the service is enabled to start on boot.

Together, these tasks configure a Redis server ready to accept connections from any IP address, ensuring it's installed, configured correctly, and running. 