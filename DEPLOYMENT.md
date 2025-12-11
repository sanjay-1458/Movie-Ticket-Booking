## Launching EC2 Instance

First we setup a virtual AWS EC2 server, from `Amazon Elastic Compute Cloud (EC2)` which exist in `console.aws.amazon`.

For this project we are using `EC2(t3.micro)` which is a free tier for 6 months, with ubuntu environment.

### Key Pair Login

It is a cryptographic lock and key which is used to access an EC2 instance.<br>
AWS does not allow password login to EC2 for security, we will use an `SSH` key pair.<br>

Here, public key is stored in EC2 instance, and private key `(.pem)` stay with us. So when we connect SSH verifies that our private key matches that of server's public key. After generating the `.pem` file gets downloaded in the machine.

## Install Jenkins

After creating instance you can select any instance and click on connect, this will open a command line interface.

APT (Advanced Package Tool), it is use to install, update, & remove software safely which our system uses to download and manage software packages.

Debian is an OS built from Linux kernel plus software packages. It uses the APT package manager and `.deb` package format.

### Steps:

1. Install dependencies

```js
sudo apt update
sudo apt install -y curl gnupg
```

2. Add the Jenkins GPG key

```js
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key \
  | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

```

3. Add the Jenkins APT repository

```js
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

4. Update package list

```js
sudo apt update
```

5. Install Jenkins

```
sudo apt install -y jenkins
```

6. Enable, Start & Check Status of Jenkins

```js
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins
```

After selecting the instance which we are working on and go to security groups, we can cofigure the transmission port of our Jenkins at port `8080` using TCP, and can select who can access the Jenkins.

If we put our IP than we can access Jenkins now at : `http://{Our IP}:8080/`.

Now we will get the main page where we can see that it is telling us to go to location `/var/lib/jenkins/secrets/initialAdminPassword` to get out admin password, and their is a field to put the same password on that page it self.

We can get the password using:

```js
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## Jenkin Pipeline Setup

Create a new Jenkin job sing simple GUI of Jenkins, where we provide project Github URL and option of `Pipeline script from SCM`.

<strong>Project structure:</strong><br>
```
Application/
│
├── Jenkinsfile
├── docker-compose.yml
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/...
│
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/...
```