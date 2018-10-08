---
title: "How To Deploy Your MERN App To Amazon Web Service"
date: 2018-10-03
categories:
  - blog
tags:
  - DevOps
  - Web App
keywords:
  - AWS
  - Docker
  - DevOps
  - MERN

---

![](/post/images/deployapp/ecs-docker.png)

In this tutorial, I will provide a step-by-step guide for how to containerize your Mongo/Express/React/Node (MERN) app with Docker and deploy it to Amazon Web Service (AWS) Elastic Container Service (ECS). I will share my research and lessons learned deploying a MERN app, including what worked, what didn't work, how I prepared the app for deployment and accomplished the deployment.

<!--more-->

<!--toc-->

# Prep App for Deployment

## Step 1: Optimize Build

I have an isomorphic app which leverages webpack with code splitting.  

The motivation for optimizing production build is twofold: increase performance and decrease build time and size.

When running the webpack build script in production mode, the following warning messages are provided:

> WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.

and

> WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:

[Google Web Fundamentals](https://developers.google.com/web/fundamentals/performance/webpack/decrease-frontend-size) for decreasing frontend size provides a few strategies for decreasing the size and build time of your production app bundles, including using url-loader, utilizing css-loader with the minimize option, making sure you use the --production flag when building your production bundles, and a few optimizations your can include in your webpack configuration file. These optimizations provide marginal improvements. But through my other research, it became apparent that the splitChunks plugin is a necessary optimization, especially if you use a lot of big node modules like react and your app is set up with code splitting.

According to the [Webpack docs](https://webpack.js.org/guides/code-splitting/), Code splitting has a pitfall in which common vendor code used in all your bundles are duplicated in your bundles. This makes all your bundles big and increases overall build time. We can remove the duplicated modules with the [splitChunksPlugin](https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312). To use this optimization, add the following to your webpack.config.js:

```javascript
// webpack.config.js
module.exports = {
  mode: // ...
  entry: // ...
  output: // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/
        }
      }
    }
  }
}
```

{{< image classes="fancybox fig-50" src="/post/images/deployapp/webpack-no-optimization.png"
thumbnail="/post/images/deployapp/webpack-no-optimization.png" title="Webpack Build without optimization">}}
{{< image classes="fancybox fig-50 clear" src="/post/images/deployapp/webpack-with-optimization.png"
thumbnail="/post/images/deployapp/webpack-with-optimization.png" title="Webpack Build with optimization">}}

## Step 2: Automate scripts

I added a few npm run scripts in order to allow different ways of spinning up the servers.

```javascript
// package.json
{
  "name": "looseleaf-node",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "build:prod": "./node_modules/.bin/webpack --mode production",
    "build:dev": "./node_modules/.bin/webpack --mode development",
    "prestart": "npm run build:prod",
    "start": "node server/run-prod.js",
    "start-server": "node server/run-prod.js",
    "start-server-dev": "nodemon server/run-dev.js --watch server --watch client/iso-middleware --watch client/src",
    "start-client": "node server/start-client.js",
    "start-dev": "concurrently \"npm run start-server-dev\" \"npm run start-client\"",
  },
  "dependencies": {
    // ...
  }
}
```

Since `npm prestart` is always executed with `npm start`, we want to create a separate run script for when we just want to fire up our server without rebuilding bundles. Thus, `start-server` was added.

Additionally, we want a version which can be used to spin up servers with `nodemon` and concurrently run our isomorphic app on one server (`npm run start-server`) and create-react-app with hot module reload and react hot loader on another server.

Note, start-client is defined in another file:

```javascript
// start-client.js
const args = ['start'];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('npm', args, opts);
```

## Step 3: Dockerize Your App

[Gokce Yalcin](https://www.codementor.io/collections/aws-ecs-lbxm7zj38) provides a great primer for Docker and ECS.

> Docker is a way to manage and run containers - it is an abstraction that lets you share host resources with your application by process isolation.

The motivation for Docker is portability. Apps come with a lot of environmental configurations that would run on one computer but break on another computer which does not have the right configuration.

As [this article puts it](https://cloudacademy.com/blog/amazon-ec2-container-service-docker-aws/):

> modern DevOps practices demand the ability to quickly build servers and ship code to be run in different environments. Welcome to the world of containers: extremely lightweight, abstracted user space instances that can be easily launched on any compatible server and reliably provide a predictable experience.

For our MERN app, the environmental configuration is our mongo database.

A lot of tutorials I found show you how to create container for simple apps which do not depend on other images like mongo. The build definition provided by `Dockerfile` was not adequate in associating the app build with mongo. The app ends up failing upon initial launch due to failing to .

To dockerize our MERN app for running locally, we need to create two files: **Dockerfile** and **docker-compose.yml**.

Dockerfile is required if you want to use Docker to containerize your app but docker-compose is optional but useful if you want to fire up a Docker container locally to use Mongodb.

Before when I run the server locally, I'd have to make sure to run `mongod` and `mongo` in the command line to fire up the  mongo daemon and mongo shell.

But with containerization, I can create an image that includes the app and the mongodb image and driver mapping that the app depends on.


**Dockerfile**:

```
FROM node:8.11.1

# Set image metadata
LABEL version="1.0"
LABEL description="LooseLeaf Node"

# Create app directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm cache clean --force && npm install


# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . .

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
EXPOSE 3001

CMD [ "npm", "run", "start" ]
```

**docker-compose.yml**

```
version: "2"
services:
  web:
    container_name: looseleaf-node-app
    build: .
    ports:
      - "3001:3001"
    depends_on:
      - mongo
  mongo:
    container_name: mongo
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - data-volume:/data/db
volumes:
  data-volume:
```

To run both our app and mongo in the container, we run this command:

```
$ docker-compose up
```

# Deploy Docker Image to AWS ECS

[The official docs from Amazon](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html) provides  detailed information on how AWS ECS leverages Docker.

> Amazon ECS uses Docker images in task definitions to launch containers on EC2 instances in your clusters.

## Quick Primer on ECS

> Amazon EC2 Container Service (Amazon ECS) is a highly-scalable, high performance container management service that supports Docker containers and allows you to run applications easily on a managed cluster of EC2 instances. The ECS service scheduler places tasks—groups of containers used for your application—onto container instances in the cluster, monitors their performance and health, and restarts failed tasks as needed. ~[AWS Blog](https://aws.amazon.com/blogs/compute/using-amazon-efs-to-persist-data-from-amazon-ecs-containers/)

I find AWS's docs overwhelming because it always contains more information than necessary and not enough examples. I suggest following [this tutorial from Node University](https://node.university/blog/978472/aws-ecs-containers) which walks you through (with screenshot) an actual example deploying a node app containerized with mongo to ECS. [This Gist](https://gist.github.com/duluca/ebcf98923f733a1fdb6682f111b1a832#file-step-by-step-how-to-for-aws-ecs-md) provides step-by-step procedure for creating a ECS cluster, task definition and containers, as well as load balancer.

![https://cloudonaut.io/aws-velocity-containerized-ecs-based-app-ci-cd-pipeline/](/post/images/deployapp/docker-on-aws.png)

## SSH

It's a good idea to be able to ssh into your EC2 instance for troubleshooting. Use the AWS CLI to create a new ssh keypair (See docs [for ssh](https://docs.aws.amazon.com/cli/latest/userguide/cli-ec2-keypairs.html) and [connecting to your container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance-connect.html)).

Your private key is not stored in AWS and can only be retrieved when it is created. Therefore, we are creating the `MyKeyPair.pem` to be stored locally.

Generally, the correct place to put your .pem file is in your .ssh folder, in your user directory. The .ssh folder is a hidden folder, to open it in finder open terminal and execute the open command.

First we need to [install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) and configure it.

Then we use the AWS CLI to create keypair in the .ssh folder.

```
$ mkdir .ssh
$ cd .ssh
$ aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text | out-file -encoding ascii -filepath MyKeyPair.pem
$ chmod 400 MyKeyPair.pem
```

To SSH into your ECS instance, go to the ECS console > select your instance > click connect. You'll see a command like this:

```
ssh -i "MyKeyPair.pem" ec2-user@ec2-18-386-245-264.compute-1.amazonaws.com
```

If you try to run the above command, you'll get an error:

> Please login as the user "ec2-user" rather than the user "root".

So we try this instead:

```
$ ssh -i "MyKeyPair.pem" ec2-user@ec2-18-386-245-264.compute-1.amazonaws.com
```

And it should work! You can use this to connect to the EC2 instance, which we will create in the next step.

## Create ECS Cluster, Task, and Service

In short, we need to take the following steps:

1. Create ECS Container Registry.
2. Create a repository under Amazon ECS. This is where you push your docker images using the aws cli.
3. Create new task definition, which includes port mapping and your two containers (node app and mongodb).
4. Create a Cluster. A Cluster is where AWS runs containers. I use EC2 instance type m4.large.
5. Create a Service.

For all these steps, you can use Amazon's console and AWS CLI.

-  Note: There's an open source cli called [coldbrew](https://github.com/coldbrewcloud/coldbrew-cli) that you can download from Github which automates your Docker container deployment process. I couldn't figure out how the configuration file suppose to look if I wanted to fire up the app container with mongo. Also, Coldbrew seem to have a lot of "magic" that when my deployed app failed to launch, I couldn't figure out how to troubleshoot.

We use the Docker CLI to build our image:

```
$ docker build -t <image-name> .
```

Don't forget the "dot" at the end of the command.

Then tag our built image and use the Docker CLI to push the image to our AWS ECS repository. You use two commands which you can copy-paste into your Terminal from the AWS ECS console.

For example:

![AWS ECS Repo](/post/images/deployapp/aws-ecs-repo.png)

![AWS ECS Repo](/post/images/deployapp/aws-ecs-commands.png)


Before you push, make sure to to authenticate Docker to an Amazon ECR registry with get-login.

```
$ aws ecr get-login
```

For our example, the complete sequence of commands for first and subsequent deploys is:

```
$ docker build -t looseleaf-node .
$ aws ecr get-login
$ docker tag looseleaf-node:latest 767822753727.dkr.ecr.us-east-1.amazonaws.com/looseleaf-node:latest
$ docker push 767822753727.dkr.ecr.us-east-1.amazonaws.com/looseleaf-node:latest
```

## Update Your App

To update your application, you may have to update the task definition and then update the service.

http://docs.aws.amazon.com/AmazonECS/latest/developerguide/update-service.html

> If your updated Docker image uses the same tag as what is in the existing task definition for your service (for example, my_image:latest), you do not need to create a new revision of your task definition. You can update the service using the procedure below, keep the current settings for your service, and select Force new deployment. The new tasks launched by the deployment pull the current image/tag combination from your repository when they start. The Force new deployment option is also used when updating a Fargate task to use a more current platform version when you specify LATEST. For example, if you specified LATEST and your running tasks are using the 1.0.0 platform version and you want them to relaunch using a newer platform version.


# Following Deployment

## Step 1: Add SSL

The [AWS Tutorial](https://aws.amazon.com/blogs/aws/new-aws-certificate-manager-deploy-ssltls-based-apps-on-aws/) guides you through setting up your [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/).

> SSL/TLS certificates are used to secure network communications and establish the identity of websites over the Internet as well as resources on private networks.

SL/TLS certificates provisioned through AWS Certificate Manager are free.

The AWS Tutorial linked above is actually a little out-dated.

Here are the steps I took:

1. Login to your AWS Console and click to Services > Certificate Manager.
2. Get started on Provision Certificates.
3. Request a Public Certificate.
4. On the domain names, add your domain name (e.g., `looseleafapp.com` and `*.looseleafapp.com`). Click next.
5. Validation method: DNS.
6. On the review page, click "Confirm and request" once you are satisfied.
7. On the Validation page, use Amazon Route 53 to validate CNAME for you. If everything goes well, you'll get this message:

> The DNS record was written to your Route 53 hosted zone. It can take 30 minutes or longer for the changes to propagate and for AWS to validate the domain and issue the certificate.

It doesn't take 30 minutes. I refreshed the page and Validation status changed to Success.

## Step 2: Update Your EC2 Instance

A EC2 instance is automatically created by ECS and associated with the VPC. Go to the EC2 dashboard. For the ECS instance, click on the Security Group. Add an inbound rule with Type HTTPS and port 443.

## Step 3: Create Load Balancer

> The Network Load Balancer is the best option for managing secure traffic as it provides support for TCP traffic pass through, without decrypting and then re-encrypting the traffic. ~[AWS Compute Blog](https://aws.amazon.com/blogs/compute/maintaining-transport-layer-security-all-the-way-to-your-container-using-the-network-load-balancer-with-amazon-ecs/)

![https://aws.amazon.com/blogs/compute/maintaining-transport-layer-security-all-the-way-to-your-container-using-the-network-load-balancer-with-amazon-ecs/](/post/images/deployapp/ecs-diagram-1.png)

I followed this [video tutorial](https://www.youtube.com/watch?v=E5MYky95atE) to create a classic load balancer.

You can also Check out [AWS official tutorial](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-create-https-ssl-load-balancer.html) for how to create a classic Load Balancer with an HTTPS Listener.

Make sure your load balancer settings are:

- VPC ID: the VPC ID for your ECS container
- Scheme: internet-facing
- Listeners: (1) load balancer port HTTPS 443 --> instance port HTTP 80 and (2) load balancer port HTTP 80 --> instance port HTTP --> 80
- Health Check: Ping Target HTTP:80/<filename> where <filename> is a file that your website serves from the root. For my site, it's index.css.

## Step 4: Link to Domain Name

Use AWS Route 53 to associate your ECS instance with a domain name.

I purchased my domain name from Google Domains. I got on chat with the customer service representative from Google Domains who walked me through how to set up route for AWS Route 53 with:

- CNAME (canonical name)
- MX (mail exchange if you use G Suite)
- NS (Name server)
- SOA (Start of authority)

After you've done all that, Create Record, select "Type A-IPv4 address", select Yes for Alias, and select the load balancer from Alias Target. This gives you https://yourdomain.com and forwards http://yourdomain.com to https://yourdomain.com.

**Optional:** You may be able to create another Alias for www.yourdomain.com to forward to https://yourdomain.com. I don't know how to do that yet.

# Gotchas

## ECS Container DB Not Persisting

Following [the tutorial from Node University](https://node.university/blog/978472/aws-ecs-containers) helped me get the app up and running but there was a big problem with the setup: whenever the server goes down for whatever reason, all the data is lost. Per the [AWS Blog](https://aws.amazon.com/blogs/compute/using-amazon-efs-to-persist-data-from-amazon-ecs-containers/)

> Using task definitions, you can define the properties of the containers you want to run together and configure containers to store data on the underlying ECS container instance that your task is running on. Because tasks can be restarted on any ECS container instance in the cluster, you need to consider whether the data is temporary or needs to persist. If your container needs access to the original data each time it starts, you require a file system that your containers can connect to regardless of which instance they’re running on. That’s where EFS comes in.

So if you run your MongoDB in a container, the data is hosted in the instance's ephemeral disk. This means the data is going to disappear when your ECS2 instance that hosts your container is restarted.

AWS Elastic File System (EFS) is a storage service that can be used to persist data to disk or share it among multiple containers; for example, when you are running Mongo in a Docker container, capturing application logs, or simply using it as temporary scratch space to process data.

> EFS allows you to persist data onto a durable shared file system that all of the ECS container instances in the ECS cluster can use.


[This Gist](https://gist.github.com/duluca/ebcf98923f733a1fdb6682f111b1a832) provides step-by-step tutorial to set up AWS ECS Cluster. It'll get you 80% way there.

Based on AWS's Docs on [using Amazon EFS File Systems with Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_efs.html#efs-run-task), we need to configure a running container instance to use an Amazon EFS file system:

- Log in to the container instance via SSH.
- Go to AWS console > EFS. Click on the file system. There's a link on the page that reads "Amazon EC2 mount instructions". Click on that link
and execute the commands listed.


Validate that the file system is mounted correctly with the following command.

```
$ mount | grep efs
```

Make a backup of the /etc/fstab file.

```
$ sudo cp /etc/fstab /etc/fstab.bak

```

Update the /etc/fstab file to automatically mount the file system at boot. Replace `fs-613c8628.efs.us-east-1.amazonaws.com` with your actual file system DNS name.

```
$ echo 'fs-613c8628.efs.us-east-1.amazonaws.com:/ /efs nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 0 0' | sudo tee -a /etc/fstab
```

Reload the file system table to verify that your mounts are working properly.

```
$ sudo mount -a
```

**Gotcha: Unable to mount EFS on ECS instance**

According to [this thread on AWS forum](https://forums.aws.amazon.com/thread.jspa?threadID=235344), the problem may lie with the configuration of the mount target’s security group. Use [this guide](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs-create-security-groups.html) for more on how to create security groups so you can use Secure Shell (SSH) to connect to any instances that have mounted Amazon EFS file systems. [This tutorial](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_efs.html#efs-security-group) walks you through how to create a security group for your EFS File System.

## Image Proliferation

- Every time you run `docker-compose up`, you are building a new image. These images could be more than a gigabyte in size. I wasn't aware that these images are being built and retained after I `ctrl+c` from the docker process. Quickly my hard drive was running low on memory. Make sure you delete outdated images with the following lines of commands:

List containers:

```
$ docker ps -a
```
Remove containers by id:

```
$ docker rm <CONTAINER ID>
```

List images:

```
$ docker images
```

Remove images:

```
$ docker rmi <IMAGE ID>
```

Make sure to run `docker rm` to delete the containers before removing the images. Otherwise, you'll get this error:

> Error response from daemon: conflict: unable to delete 3d2765b2fe31 (must be forced) - image is being used by stopped container 5ee892b7f037

## AWS Elastic Beanstalk

Don't use it. Use AWS ECS instead.

## Using Mongo Shell Via Container

```
$ docker run -it -d mongo
592a2dfdcffd8a2c59615800eace1e922ba5e88bb836eaf11c06e06278112ed9

$ docker ps

CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                            NAMES
592a2dfdcffd        mongo                        "docker-entrypoint.s…"   8 seconds ago       Up 7 seconds        27017/tcp                        cranky_chebyshev

$ docker exec -it cranky_chebyshev bash
root@592a2dfdcffd:/#
# docker stop cranky_chebyshev
# docker rm cranky_chebyshev
```

## Useful Commands

See which process is running in port 3000, then kill that process.

```
$ lsof -i tcp:3000
$ kill <PID>
```

Kill all mongo servers

```
$ lsof -i | grep mongo
~$ lsof -i | grep mongo
mongod    19557 xiaoyun   10u  IPv4 0x6b9c9aebc1dd3e63      0t0  TCP localhost:27017 (LISTEN)
mongod    19557 xiaoyun   32u  IPv4 0x6b9c9aebdea763e3      0t0  TCP localhost:27017->localhost:56383 (ESTABLISHED)
mongod    19557 xiaoyun   34u  IPv4 0x6b9c9aebe1fafe63      0t0  TCP localhost:27017->localhost:56370 (ESTABLISHED)
mongod    19557 xiaoyun   35u  IPv4 0x6b9c9aebadd5c3e3      0t0  TCP localhost:27017->localhost:56385 (ESTABLISHED)
mongod    19557 xiaoyun   37u  IPv4 0x6b9c9aebe97b1123      0t0  TCP localhost:27017->localhost:56389 (ESTABLISHED)
mongo     19569 xiaoyun    7u  IPv4 0x6b9c9aebdde83e63      0t0  TCP localhost:56370->localhost:27017 (ESTABLISHED)
$ kill 19557
```
