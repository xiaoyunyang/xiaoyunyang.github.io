# Personal Website

## Quick Start

### How to set up the project

- Clone this repo and switch to `sourcecode` branch.
- `cd` into the root directory and clone this repo again (remain on `master` branch), then rename this directory `public`.

### Development

```bash
hugo server -D
```

To test out what it looks like in production, run the following script to build the static website in the `public/` directory.

```bash
hugo
```

### Deploying

Run the [deploy.sh](/deploy.sh) script to build the static website in `public/` directory and commit/push the contents of the `public/` directory to master.

```bash
./deploy.sh 'optional commit message'
```

## Static Site Generator:

- [Hugo](https://gohugo.io/getting-started/quick-start/)

### Theme used: hugo-tranquilpeak-theme

- [See Demo](https://themes.gohugo.io/theme/hugo-tranquilpeak-theme/)
- [Repo](https://github.com/kakawait/hugo-tranquilpeak-theme)
- [Developer Documentation](https://github.com/kakawait/hugo-tranquilpeak-theme/blob/31c71da9f5b37972ea649d7ae1b54c82e0d353e4/docs/developer.md#requirements)
- [User Documentation](https://github.com/kakawait/hugo-tranquilpeak-theme/blob/develop/docs/user.md#add-custom-js-or-css-using-configuration)
- Showcase: [https://philippgaertner.github.io/](https://philippgaertner.github.io/) and [repo](https://github.com/philippgaertner/philippgaertner.github.io)
- Showcase: [http://robinforest.net](http://robinforest.net) and [repo](https://github.com/robinfhu/personal-site)


### Docs Shortcut
* [Customizing Themes](https://gohugo.io/themes/customizing/)
* [Permalink](https://gohugo.io/content-management/urls/#permalinks) - configures how your url appears

### Tips

- [Robin's Tips](http://robinforest.net/post/hugo-questions/)

### TODO

- [X] Find [character Face Icon](https://www.freepik.com/index.php?goto=74&idfoto=777192&term=user%20avatar) for my favicon
- [X] Deployment: [host from github](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
- [X] Add Disqus to end of each post
