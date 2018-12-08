---
title: "Security Considerations for Web Applications and Best Practices"
date: 2018-12-06
categories:
  - blog
tags:
  - Node
  - Web Dev
  - Best Practice
keywords:
  - JavaScript
  - Best Practice
  - Web Development
  - Web Security
  - XSS
  - CSRF
thumbnailImagePosition: left
thumbnailImage: /post/images/webdev/web-security.png

---

This article discusses some pitfalls and techniques for securiing your JavaScript application against attacks such as XSS, CSRF, reverse tabnabbing, and security considerations working with open source.

<!--more-->

<!--toc-->

# Cross Site Scripting (XSS)

**Symptom**

Browser executes malicious JavaScript code upon loading a web page which displays user-generated content.

XSS could be very harmful to your site's users because malicious code is executed in their browsers when they load your site. The malicious code not only could modify your page's DOM or window location (e.g., via executing `window.location = "www.evil.com`), but can also could steal your users' information or perform actions on their behalf.

**Cause**

Malicious user of your website put some malicious code into a form. The client/server does not sanitize user input and processes the malicious code (e.g., an inline script like `<script>alert('you're hacked')</script>`) as if it were data. The malicious code is then stored in your web app's server and served to other users of your site as data.

Upon page load, the malicious code is executed, which could make your web app inoperable and harm your users when the malicious code is run in their browsers. There are three types of XSS attacks: [stored, reflected](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)#Stored_and_Reflected_XSS_Attacks), and [DOM based](https://www.owasp.org/index.php/DOM_Based_XSS).

**Defense**

There are some simple things we can do to protect our web app against XSS:

*1. Enable web browser's XSS protection.*

You also want this to your app's response header:

```
X-XSS-Protection 1; mode=block
```

We can use a npm package called [`helmet`](https://github.com/helmetjs/helmet) to add the xssFilter to request.

```javascript
import helmet from ‘helmet’;
app.use(helmet.xssFilter());
```

But Firefox does not protect you from xss with this in the header.
So make sure you sanitize your input!

*2. Set Content Security Policy (CSP) Header.*

CSP is a security feature that web browsers offer which allows the web app to tell web browsers what should and should not be executed when rendering the website. For example, this is a basic CSP that forbids execution of inline script

```
Content-Security-Policy: default-src 'self';
```

*3. Sanitize user inputs.*

We can validate user input on the client side or server side. On the client side, we can display a warning message to the user that special characters such as angle brackets are not allowed and prevent the user from submitting the form to the server when there are invalid characters. On the server side, we can sanitizing user inputs ensures we don't allow malicious user generated content to be stored in persistent storage on your server. Sanitization means replacing angle brackets, slashes, and other characters with their [html entities](https://www.freeformatter.com/html-entities.html) equivalent. For example, `<` becomes `&lt;`,  `/` becomes `&#47;`, and `>` becomes `&gt;`. This is generally achieved using regular expressions but there are open source libraries to use for input validation and sanitization.

I use [`validator`](https://github.com/chriso/validator.js/).

```javascript
import validator from ‘validator’;

app.get('/test/search', (req, res) => {
  const userAgent = validator.escape(req.query.q) || '';
  res.render('test', { userAgent });
});
```

which makes `<script>alert("you are hacked")` into: 

>&amp;lt;script&amp;gt;alert(&amp;quot;you are hacked&amp;quot;)&amp;lt;&amp;#x2F;script&amp;gt

# SQL Injection

**Symptom**

There's a famous XKCD that illustrates the danger of XSS that illustrates the first case.

![https://xkcd.com/327/](/post/images/webdev/xkcd-xss.png)

**Cause**

SQL injection is like XSS except the malicious is code is SQL commands vice JavaScript wrapped in `<script>` tags and executed by the server on the SQL database vice the browser.

**Defense**

Sanize all user input!

# Reverse Tabnabbing

**Symptom**

After clicking an embedded link on a web page to open a new web page in a different tab, the originating web page changes (e.g., redirects to a different page).

This hack is called *Reverse Tabnabbing*.

Mathias Bynens provides a [really great example](https://mathiasbynens.github.io/rel-noopener/#hax) of reverse tabnabbing.

**Cause**

Web pages have a ton of links which open to another webpage from a different origin. Sometimes, these result in opening the page in another tab. This behavior is implemented in HTML using the anchor tag.

Suppose our *index.html* has the following line:

```html
<a target="_blank" href="http://example.com/malicious.html">
  Example site
</a>
```

When that link is clicked, `malicious.html` opens in a new tab and has access to the `window` object of `index.html` through the `window.opener`.

Even if `malicious.html` is from a different origin than `index.html`, `malicious.html` has access to `window.opener.location`, which can be used to automatically redirect originating webpage to a malicious website.

**Defense**

You should always use `rel=noopener noreferrer` whenever you use `target="_blank"`, especially if you want to open a link from a different origin in a separate tab.

```html
<a target="_blank" href="http://example.com/malicious.html" rel='noopener noreferrer'>
  Example site
</a>
```

From  [the W3 Spec for `<a>` tag](https://www.w3schools.com/tags/att_a_rel.asp):

- The `rel` attribute specifies the relationship between the current document and the linked document.
- `noopener` tells the browser not to not send `window.opener` context from the originator of the link click.
- `noreferrer` tells the browser to not send an HTTP referer header if the user follows the hyperlink.

*Pro-tip* Use lint. In fact, I first learned about reverse tabnabbing from [a lint error](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md) about the danger of using `target="_blank"` in anchor without adding the `rel="noopener noreferrer"` attribute. It's always a good idea to use lint to support your development which does a lot to help you write secure, clean, and maintainable code. Popular editors like VSCode and Atom have lint support.

# Cross-site Request Forgery (CSRF)

**Symptom**

A user of your site is tricked into making a post request and your app accepts that request and performs some actions which the user does not want such as transferring money from their bank account to a hacker's account, deleting their user account, or changing their username.

**Cause**

Many web apps are designed to accept post requests from authenticated users to perform some important actions such as transferring money.

To verify that the request is coming from the actual user, your app would need to check for a session id that is transmitted in the request header. Session id is stored in a cookie, which is essentially a small piece of text stored on a user's computer by their browser.

Checking the user's session id is a good start but not enough.

Suppose I'm a user of your web app. A hacker doesn't know my cookie and can't guess it but she can trick me into sending a post request to your app by making me fill out a fake form or the real form embedded in an iframe (with some CSS tricks) that submits a post request to your app without my knowledge. The second technique is known as *clickjacking and iframe* attack.

Because I'm the one making the request, I have the correct session id stored in my cookie. Thus, if your app only checks for session id to authenticate the origin of the request, it's going to accept the post request.

**Defense**

There are few things your web app to protect your users from being tricked into sending post requests.

*1. Expiring Sessions*

Your app can log its users out automatically after a period of inactivity. This technique is employed by many online banking web apps.

The hacker cannot perform a CSRF attack without getting me to do something while I'm an authenticated user. If I'm not logged in to your site, then your app will not accept my post requests.

*2. Token validation*

The idea is we want to embed a randomly generated, un-guessable token in the form which the user uses to make the post request. When the user makes a post request using the form, the token is transmitted with the data as `X-CSRF-Token` in the request header.

Each time the server sends the form form to the user's browser, a different token is sent with the form to the browser. The server remembers what that token is and when it receives a post request, it checks to make sure the token in the request matches what it has on record.

A real life example of a CSRF token is the form from AngelList's profile edit form:

![](/post/images/webdev/csrf-token-alist.png)

*3. CSP Header*

To guard against a CSRF attack resulting from clickjacking and iframe, we can use the CSP to set a policy for `child-src ‘self’`, indicating that the site must only be iframed by a page that shares the same origin, and no other.

Setting the HTTP header `X-FRAME-OPTIONS` has the same effect as the CSP policy in its protection against clickhacking.

# Working With Open Source Software

If you use a lot of open source software in your application, these dependencies do come with vulnerabilities you may not be aware of. Fortunately, the open source community of popular npm modules are active in identifying security vulnerabilities.

**Defense in depth**

*1. Subscribe to security vulnerability warnings*

If you keep your code on Github, Github will show a warning about a repo that contains a dependency that has a security vulnerability.

*2. Keeping your dependencies up to date*

If you use NPM, you can also use the following commands to find out which npm modules are outdated.

```
$ npm outdated
```

If you choose, you may update all the outdated modules with:

```
$ npm update
```

or selectively update using either one of the lines below:

```
$ npm install --save <package-name>@latest
$ npm update <package-name>
```

or to a specific version:

```
$ npm install --save <package-name>@<version-number>
```

If you want to find out which packages are introducing security vulnerabilities, use the following line:

```
$ npm audit
```

Running the above command will show you some packages which you may not recognize. These are usually dependencies to the packages which you have listed in `package.json`.

The CLI will urge you to use `npm audit fix` to fix the vulnerabilities but if you want to dig a bit deeper as to why you have these packages in the first place, and where they are used, use the following command:

```
$ yarn why <package-name>
```

# More Reading
- [Security of JavaScript Applications](https://medium.com/@dhtmlx/security-of-javascript-applications-1c95cd2ce533)
- [Securing DevOps](https://www.manning.com/books/securing-devops)