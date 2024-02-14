# Ansible Roles

This Ansible playbook is composed of three plays, each targeting a specific set of hosts and performing distinct tasks or applying roles to them. Let's discuss what roles are in Ansible first.

## Understanding Ansible Roles

Roles in Ansible are a framework for fully independent, or interdependent collections of variables, tasks, files, templates, and modules. In essence, a role is a set of automation tasks bundled together to accomplish a specific goal (e.g., configure a web server, deploy a database). Roles are a way to organize complex playbooks by separating tasks into different files and directories. Roles are sotred in a `roles` directory, with each role having the stucture below: 

- `tasks/`: Contains the main list of tasks to be executed by the role.
- `handlers/`: Contains handlers, which are tasks that run in response to a notification triggered by other tasks.
- `defaults/`: Default variables for the role.
- `vars/`: Other variables for the role.
- `files/`: Contains files that can be deployed via this role.
- `templates/`: Contains templates which can be deployed via this role.
- `meta/`: Defines some metadata for the role, like dependencies.

> Note: Not all subdirectories are needed if you don't make use of all the features. 

For example, the `webserver` role might include tasks for installing Apache or Nginx, configuring those services, and ensuring they are running and enabled to start at boot. The `be_pretty` role might involve setting up a graphical environment or simply printing `"I am pretty!"`.

Roles can be reused across different projects and shared with the community, allowing you to leverage common patterns and practices.

To better understand the playbook in this project, let's break down each play.

## Play 1: Ping VMs

- **name**: Indicating that the purpose of the play is to check the connectivity of the VMs.
- **hosts**: `all` targets all the hosts specified in the Ansible inventory.
- **gather_facts**: Setting this to `yes` instructs Ansible to collect detailed information about each host it runs on before executing any further tasks. This information can be used in subsequent tasks for conditional execution based on host properties.
- **become**: When set to `yes`, this allows Ansible to gain higher privileges on the managed hosts, akin to using `sudo` or `su` commands.
- **tasks**: This section lists the operations to be performed, which in this case, includes:
  - **Ping**: A task using the `ansible.builtin.ping` module. This module tests if hosts are reachable. It does not send ICMP pings but rather tries to connect to the host using SSH (or another connection method as configured), which effectively checks if Ansible can communicate with the hosts.

## Play 2: Set Webserver

- **name**: Indicates that this play's focus is on setting up a web server.
- **hosts**: `web` limits execution to hosts within the `web` group / host.
- **gather_facts**, **become**: Same as the first play, these gather system facts and elevate privileges.
- **roles**:
  - **webserver**: Specifies a role named `webserver` to be applied to the hosts. The name must match what is available in the `roles` directory.

## Play 3: Set Plainserver

- **name**: This play is aimed at configuring a plain, vanilla, server.
- **hosts**: `plain` targets hosts in the `plain` group.
- **gather_facts**, **become**: As with the other plays, facts are gathered, and privilege escalation is enabled.
- **roles**:
  - **be_pretty**: This role is applied just for fun.
