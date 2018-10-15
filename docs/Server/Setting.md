# 架设服务器与公共访问

## 架设服务器

现在我们过一边服务器端架设 `SSH` 访问的流程。本例将使用 `authorized_keys` 方法来给用户授权。我们还将假定使用类似 `Ubuntu` 这样的标准 `Linux` 发行版。首先，创建一个名为 ‘`git`’ 的用户，并为其创建一个 `.ssh` 目录:


```
$ sudo adduser git
$ su git
$ cd
$ mkdir .ssh
```


接下来，把开发者的 `SSH` 公钥添加到这个用户的 `authorized_keys` 文件中。假设你通过电邮收到了几个公钥并存到了临时文件里。重复一下，公钥大致看起来是这个样子:

```
$ cat /tmp/id_rsa.john.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
dAv8JggJICUvax2T9va5 gsg-keypair
```

只要把它们逐个追加到 `authorized_keys` 文件尾部即可:

```
$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys
```

现在可以用 `-bare` 选项运行 `git init` 来建立一个裸仓库，这会初始化一个不包含工作目录的仓库:

```
$ cd /opt/git
$ mkdir project.git
$ cd project.git
$ git --bare init
```

这时，Join，Josie 或者 Jessica 就可以把它加为远程仓库，推送一个分支，从而把第一个版本的项目文件上传到仓库里了。值得注意的是，每次添加一个新项目都需要通过 `shell` 登入主机并创建一个裸仓库目录。我们不妨以 `gitserver` 作为 `git` 用户及项目仓库所在的主机名。如果在网络内部运行该主机，并在 DNS 中设定 `gitserver` 指向该主机，那么以下这些命令都是可用的:

```
# 在 John 的电脑上
$ cd myproject
$ git init
$ git add .
$ git commit -m 'initial commit'
$ git remote add origin git@gitserver:/opt/git/project.git
$ git push origin master
```

这样，其他人的克隆和推送也一样变得很简单:

```
$ git clone git@gitserver:/opt/git/project.git
$ vim README
$ git commit -am 'fix for the README file'
$ git push origin master
```

用这个方法可以很快捷地为少数几个开发者架设一个可读写的 `Git` 服务。

作为一个额外的防范措施，你可以用 `Git` 自带的 `git-shell` 工具限制 `git` 用户的活动范围。只要把它设为 `git` 用户登入的 `shell`，那么该用户就无法使用普通的 `bash` 或者 `csh` 什么的 `shell` 程序。编辑 `/etc/passwd` 文件:

```
$ sudo vim /etc/passwd
```

在文件末尾，你应该能找到类似这样的行:

```
git:x:1000:1000::/home/git:/bin/sh
```

把 `bin/sh` 改为 ``/usr/bin/git-shell` （或者用 `which git-shell` 查看它的实际安装路径）。该行修改后的样子如下:

```
git:x:1000:1000::/home/git:/usr/bin/git-shell
```

现在 `git` 用户只能用 `SSH` 连接来推送和获取 `Git` 仓库，而不能直接使用主机 `shell`。尝试普通 `SSH` 登录的话，会看到下面这样的拒绝信息:

```
$ ssh git@gitserver
fatal: What do you think I am? A shell?
Connection to gitserver closed.
```

## 公共访问

匿名的读取权限该怎么实现呢？也许除了内部私有的项目之外，你还需要托管一些开源项目。或者因为要用一些自动化的服务器来进行编译，或者有一些经常变化的服务器群组，而又不想整天生成新的 SSH 密钥 — 总之，你需要简单的匿名读取权限。

或许对小型的配置来说最简单的办法就是运行一个静态 `web` 服务，把它的根目录设定为 `Git` 仓库所在的位置，然后开启本章第一节提到的 `post-update` 挂钩。这里继续使用之前的例子。假设仓库处于 ``/opt/git` 目录，主机上运行着 `Apache` 服务。重申一下，任何 `web` 服务程序都可以达到相同效果；作为范例，我们将用一些基本的 `Apache` 设定来展示大体需要的步骤。

首先，开启挂钩:

```
$ cd project.git
$ mv hooks/post-update.sample hooks/post-update
$ chmod a+x hooks/post-update
```

如果用的是 Git 1.6 之前的版本，则可以省略 `mv` 命令 — `Git` 是从较晚的版本才开始在挂钩实例的结尾添加 `.sample` 后缀名的。

`post-update` 挂钩是做什么的呢？其内容大致如下:

```
$ cat .git/hooks/post-update
#!/bin/sh
exec git-update-server-info
```

意思是当通过 SSH 向服务器推送时，`Git` 将运行这个 `git-update-server-info` 命令来更新匿名 `HTTP` 访问获取数据时所需要的文件。

接下来，在 `Apache` 配置文件中添加一个 `VirtualHost` 条目，把文档根目录设为 `Git` 项目所在的根目录。这里我们假定 DNS 服务已经配置好，会把对 `.gitserver` 的请求发送到这台主机:

```
<VirtualHost *:80>
    ServerName git.gitserver
    DocumentRoot /opt/git
    <Directory /opt/git/>
        Order allow, deny
        allow from all
    </Directory>
</VirtualHost>
```

另外，需要把 `/opt/git` 目录的 `Unix` 用户组设定为 `www-data` ，这样 `web` 服务才可以读取仓库内容，因为运行 `CGI` 脚本的 `Apache` 实例进程默认就是以该用户的身份起来的:

```
$ chgrp -R www-data /opt/git
```

重启 `Apache` 之后，就可以通过项目的 `URL` 来克隆该目录下的仓库了:

```
$ git clone http://git.gitserver/project.git
```

这一招可以让你在几分钟内为相当数量的用户架设好基于 `HTTP` 的读取权限。另一个提供非授权访问的简单方法是开启一个 `Git` 守护进程，不过这将要求该进程作为后台进程常驻 — 接下来的这一节就要讨论这方面的细节。
