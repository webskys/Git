# Git 使用方式与 安装 Git

## Git 使用方式

`Git` 有多种使用方式。 你可以使用原生的`命令行`模式，也可以使用 `GUI` 模式，这些 `GUI` 软件也能提供多种功能。 在本书中，我们将使用`命令行`模式。 这是因为首先，只有在`命令行`模式下你才能执行 `Git` 的 所有 命令，而大多数的 `GUI` 软件只实现了 `Git` 所有功能的一个子集以降低操作难度。 如果你学会了在命令行下如何操作，那么你在操作 GUI 软件时应该也不会遇到什么困难，但是，反之则不成立。 此外，由于每个人的想法与侧重点不同，不同的人常常会安装不同的 `GUI` 软件，但 所有 人一定会有命令行工具。

假如你是 `Mac` 用户，我们希望你懂得如何使用终端（`Terminal`）；假如你是 `Windows` 用户，我们希望你懂得如何使用命令窗口（`Command Prompt`）或 `PowerShell`。 如果你尚未掌握以上技能，我们建议你先停下来快速学习一下，本书中的讲述和举例将用到这些技能。

## 安装 Git

在你开始使用 `Git` 前，需要将它安装在你的计算机上。 即便已经安装，最好将它升级到最新的版本。 你可以通过软件包或者其它安装程序来安装，或者下载源码编译安装。

### 从源代码安装

有人觉得从源码安装 `Git` 更实用，因为你能得到`最新的版本`。 二进制安装程序倾向于有一些滞后，当然近几年 `Git` 已经成熟，这个差异不再显著。

`Git` 的工作需要调用 `curl，zlib，openssl，expat，libiconv` 等库的代码，所以需要先安装这些依赖工具。在有 `yum` 的系统上（比如 `Fedora`）或者有 `apt-get` 的系统上（比如 Debian 体系），可以用下面的命令安装:

```
$ yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel
$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev
```

之后，从下面的 `Git` 官方站点下载最新版本源代码:

[http://git-scm.com/download](http://git-scm.com/download)

然后编译并安装:

```
$ tar -zxf git-1.7.2.2.tar.gz
$ cd git-1.7.2.2
$ make prefix=/usr/local all
$ make prefix=/usr/local install
```

现在已经可以用 `git` 命令了，用 `git` 把 `Git` 项目仓库克隆到本地，以便日后随时更新:

```
$ git clone git://git.kernel.org/pub/scm/git/git.git
```

### 在 Linux 上安装

如果要在 `Linux` 上安装预编译好的 `Git` 二进制安装包，可以直接用系统提供的包管理工具。在 `Fedora` 上用 `yum` 安装:

```
$ yum install git-core
```

在 `Ubuntu` 这类 `Debian` 体系的系统上，可以用 `apt-get` 安装:

```
$ apt-get install git
```

### 在 Mac 上安装

在 `Mac` 上安装 `Git` 有两种方式。最容易的当属使用图形化的 `Git` 安装工具，界面如下图

![Git OS X 安装工具](images/18333fig0107-tn.png)

下载地址在: [http://code.google.com/p/git-osx-installer]http://code.google.com/p/git-osx-installer

另一种是通过 `MacPorts` (http://www.macports.org) 安装。如果已经装好了 `MacPorts`，用下面的命令安装 Git:

```
$ sudo port install git-core +svn +doc +bash_completion +gitweb
```

这种方式就不需要再自己安装依赖库了，`Macports` 会帮你搞定这些麻烦事。一般上面列出的安装选项已经够用，要是你想用 `Git` 连接 `Subversion` 的代码仓库，还可以加上 `+svn` 选项，具体将在后面介绍。

### 在 Windows 上安装

在 `Windows` 上安装 `Git` 同样轻松，可以直接到官网上下载 `exe` 安装文件并运行:

[https://git-scm.com/downloads](https://git-scm.com/downloads)

完成安装之后，就可以使用命令行的 `git` 工具（已经自带了 `ssh` 客户端）了，另外还有一个图形界面的 Git 项目管理工具。

![](images/20181013144533.jpg)

