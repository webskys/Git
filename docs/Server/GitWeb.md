#

## GitWeb

如果你对项目有读写权限或只读权限，你可能需要建立起一个基于网页的简易查看器。 `Git` 提供了一个叫做 `GitWeb` 的 `CGI` 脚本来做这项工作。

![GitWeb 的网页用户界面](images/git-instaweb.png)

如果你想要查看 `GitWeb` 如何展示你的项目，并且在服务器上安装了轻量级网络服务器比如 `lighttpd` 或 `webrick`， `Git` 提供了一个命令来让你启动一个临时的服务器。 在 `Linux` 系统的电脑上，`lighttpd` 通常已经安装了，所以你只需要在项目目录里执行 `git instaweb` 命令即可。 如果你使用 `Mac` 系统， `Mac OS X Leopard` 系统已经预安装了 `Ruby`，所以 `webrick` 或许是你最好的选择。 如果不想使用 `lighttpd` 启动 `instaweb` 命令，你需要在执行时加入 ``--httpd `参数。

```
$ git instaweb --httpd=webrick
[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]
```

这个命令启动了一个监听 1234 端口的 HTTP 服务器，并且自动打开了浏览器。 这对你来说十分方便。 当你已经完成了工作并想关闭这个服务器，你可以执行同一个命令，并加上 `--stop` 选项：

```
$ git instaweb --httpd=webrick --stop
```

如果你现在想为你的团队或你托管的开源项目持续的运行这个页面，你需要通过普通的 Web 服务器来设置 CGI 脚本。 一些 Linux 发行版的软件库有 gitweb 包，可以通过 apt 或 yum 来安装，你可以先试试。 接下来我们来快速的了解一下如何手动安装 GitWeb。 首先，你需要获得 Git 的源代码，它包含了 GitWeb ，并可以生成自定义的 CGI 脚本：

```
$ git clone git://git.kernel.org/pub/scm/git/git.git
$ cd git/
$ make GITWEB_PROJECTROOT="/opt/git" prefix=/usr gitweb
    SUBDIR gitweb
    SUBDIR ../
make[2]: `GIT-VERSION-FILE' is up to date.
    GEN gitweb.cgi
    GEN static/gitweb.js
$ sudo cp -Rf gitweb /var/www/
```
需要注意的是，你需要在命令中指定 GITWEB_PROJECTROOT 变量来让程序知道你的 Git 版本库的位置。 现在，你需要在 Apache 中使用这个 CGI 脚本，你需要为此添加一个虚拟主机：

```
<VirtualHost *:80>
    ServerName gitserver
    DocumentRoot /var/www/gitweb
    <Directory /var/www/gitweb>
        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
        AllowOverride All
        order allow,deny
        Allow from all
        AddHandler cgi-script cgi
        DirectoryIndex gitweb.cgi
    </Directory>
</VirtualHost>
```

再次提醒，GitWeb 可以通过任何一个支持 CGI 或 Perl 的网络服务器架设；如果你需要的话，架设起来应该不会很困难。 现在，你可以访问 http://gitserver/ 在线查看你的版本库。

## Smart HTTP

我们一般通过 SSH 进行授权访问，通过 git:// 进行无授权访问，但是还有一种协议可以同时实现以上两种方式的访问。 设置 Smart HTTP 一般只需要在服务器上启用一个 Git 自带的名为 git-http-backend 的 CGI 脚本。 该 CGI 脚本将会读取由 git fetch 或 git push 命令向 HTTP URL 发送的请求路径和头部信息，来判断该客户端是否支持 HTTP 通信（不低于 1.6.6 版本的客户端支持此特性）。 如果 CGI 发现该客户端支持智能（Smart）模式，它将会以智能模式与它进行通信，否则它将会回落到哑（Dumb）模式下（因此它可以对某些老的客户端实现向下兼容）。

在完成以上简单的安装步骤后， 我们将用 Apache 来作为 CGI 服务器。 如果你没有安装 Apache，你可以在 Linux 环境下执行如下或类似的命令来安装：

```
$ sudo apt-get install apache2 apache2-utils
$ a2enmod cgi alias env
```

该操作将会启用 mod_cgi， mod_alias， 和 mod_env 等 Apache 模块， 这些模块都是使该功能正常工作所必须的。

接下来我们要向 Apache 配置文件添加一些内容，来让 git-http-backend 作为 Web 服务器对 /git 路径请求的处理器。

```
SetEnv GIT_PROJECT_ROOT /opt/git
SetEnv GIT_HTTP_EXPORT_ALL
ScriptAlias /git/ /usr/lib/git-core/git-http-backend/
```

如果留空 GIT_HTTP_EXPORT_ALL 这个环境变量，Git 将只对无授权客户端提供带 git-daemon-export-ok 文件的版本库，就像 Git 守护进程一样。

接着你需要让 Apache 接受通过该路径的请求，添加如下的内容至 Apache 配置文件：

```
<Directory "/usr/lib/git-core*">
   Options ExecCGI Indexes
   Order allow,deny
   Allow from all
   Require all granted
</Directory>
```

最后，如果想实现写操作授权验证，使用如下的未授权屏蔽配置即可：

```
<LocationMatch "^/git/.*/git-receive-pack$">
    AuthType Basic
    AuthName "Git Access"
    AuthUserFile /opt/git/.htpasswd
    Require valid-user
</LocationMatch>
```

这需要你创建一个包含所有合法用户密码的 .htaccess 文件。 以下是一个添加 “schacon” 用户到此文件的例子：

```
$ htdigest -c /opt/git/.htpasswd "Git Access" schacon
```

你可以通过许多方式添加 Apache 授权用户，选择使用其中一种方式即可。 以上仅仅只是我们可以找到的最简单的一个例子。 如果愿意的话，你也可以通过 SSL 运行它，以保证所有数据是在加密状态下进行传输的。

我们不想深入去讲解 Apache 配置文件，因为你可能会使用不同的 Web 服务器，或者可能有不同的授权需求。 它的主要原理是使用一个 Git 附带的，名为 git-http-backend 的 CGI。它被引用来处理协商通过 HTTP 发送和接收的数据。 它本身并不包含任何授权功能，但是授权功能可以在 Web 服务器层引用它时被轻松实现。 你可以在任何所有可以处理 CGI 的 Web 服务器上办到这点，所以随便挑一个你最熟悉的 Web 服务器试手吧。