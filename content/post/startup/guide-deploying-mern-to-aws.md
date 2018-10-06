---
title: "How To Deploy Your Node-React-Mongo App To Amazon Web Service"
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
thumbnailImagePosition: top
thumbnailImage: /post/images/deployapp/docker-on-aws.png

---

In this tutorial, I will provide a step-by-step guide for how to containerize your Mongo/Express/React/Node (MERN) app with Docker and deploy it to Amazon Web Service (AWS) Elastic Container Service (ECS). I will share my research and lessons learned deploying a MERN app, including what worked, what didn't work, how I prepared the app for deployment and accomplished the deployment.

<!--more-->

<!--toc-->
![https://cloudonaut.io/aws-velocity-containerized-ecs-based-app-ci-cd-pipeline/](/post/images/deployapp/docker-on-aws.png)


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

I find AWS's docs overwhelming because it always contains more information than necessary and not enough examples. I suggest following [this tutorial from Node University](https://node.university/blog/978472/aws-ecs-containers) which walks you through (with screenshot) an actual example deploying a node app containerized with mongo to ECS.

In short, we need to take the following steps:

1. Create EC2 Container Registry.
2. Create a repository under Amazon ECS. This is where you push your docker images using the aws cli.
3. Create new task definition, which includes port mapping and your two containers (node app and mongodb).
4. Create a Cluster. A Cluster is where AWS runs containers. I use EC2 instance type m4.large.
5. Create a Service.

For all these steps, you can use Amazon's console and AWS CLI.

-  Note: There's an open source cli called [coldbrew](https://github.com/coldbrewcloud/coldbrew-cli) that you can download from Github which automates your Docker container deployment process. I couldn't figure out how the configuration file suppose to look if I wanted to fire up the app container with mongo. Also, Coldbrew seem to have a lot of "magic" that when my deployed app failed to launch, I couldn't figure out how to troubleshoot.

As step 0, we need to [install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) and configure it.

Next, we use the Docker CLI to build our image:

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


# Following Deployment

## Add SSL

The [AWS Tutorial](https://aws.amazon.com/blogs/aws/new-aws-certificate-manager-deploy-ssltls-based-apps-on-aws/) guides you through setting up your [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/).

> SSL/TLS certificates are used to secure network communications and establish the identity of websites over the Internet as well as resources on private networks.

SL/TLS certificates provisioned through AWS Certificate Manager are free.

The AWS Tutorial linked above is a little out-dated.

Steps:

1. Login to your AWS Console and click to Services > Certificate Manager.
2. Get started on Provision Certificates.
3. Request a Public Certificate.
4. On the domain names, add your domain name (e.g., `looseleafapp.com` and `*.looseleafapp.com`). Click next.
5. Validation method: DNS.
6. On the review page, click "Confirm and request" once you are satisfied.
7. On the Validation page, use Amazon Route 53 to validate CNAME for you. If everything goes well, you'll get this message:

> The DNS record was written to your Route 53 hosted zone. It can take 30 minutes or longer for the changes to propagate and for AWS to validate the domain and issue the certificate.

It doesn't take 30 minutes. I refreshed the page and Validation status changed to Success.

## Create Load Balancer

If you haven't set up your service with elastic load balancer, do that. Go to ECS console > Clusters > click on the name of your cluster > under services tab, click "Create".

- Launch type: EC2
- Choose Task definition and Revision from the dropdown.
- Choose Cluster from the Dropdown.
- Service type: REPLICA
- Number of tasks: 1
- Load balancer type: choose Classic. You get a warning that No load balancer is found. Click the link to create a load balancer in the EC2 Console. Check out [AWS official tutorial](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-create-https-ssl-load-balancer.html) for how to create a classic Load Balancer with an HTTPS Listener.  
[This video](https://www.youtube.com/watch?v=E5MYky95atE) is helpful.


> The Network Load Balancer is the best option for managing secure traffic as it provides support for TCP traffic pass through, without decrypting and then re-encrypting the traffic. ~[AWS Compute Blog](https://aws.amazon.com/blogs/compute/maintaining-transport-layer-security-all-the-way-to-your-container-using-the-network-load-balancer-with-amazon-ecs/)

![https://aws.amazon.com/blogs/compute/maintaining-transport-layer-security-all-the-way-to-your-container-using-the-network-load-balancer-with-amazon-ecs/](/post/images/deployapp/ecs-diagram-1.png)


## Link to Domain Name

Use AWS Route 53 to associate your ECS instance with a domain name.

I purchased my domain name from Google Domains. I got on chat with the customer service representative from Google Domains who walked me through how to set up route for AWS Route 53.


# Gotchas

## Image Proliferation

- Everytime you run `docker-compose up`, you are building a new image. These images could be more than a gigabite in size. I wasn't aware that these images are being built and retained after I `ctrl+c` from the docker process. Quickly my hard drive was running low on memory. Make sure you delete outdated images with the following lines of commands:

List containers

```
$ docker ps -a
```
Remove containers by id

```
$ docker rm <CONTAINER ID>
```

List images

```
$ docker images
```

Remove images
```
$ docker rmi <IMAGE ID>
```

Make sure to run `docker rm` to delete the containers before removing the images. Otherwise, you'll get this error:

> Error response from daemon: conflict: unable to delete 3d2765b2fe31 (must be forced) - image is being used by stopped container 5ee892b7f037

## AWS Elastic Beanstalk


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
