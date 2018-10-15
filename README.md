# Git 导言


`Git`是目前最先进的版本控制系统，拥有最多的用户数量并管理着数量庞大的实际软件项目；风靡全球的`Github`更是让Git版本控制系统名声大震。本文以`版本控制系统`为切入点，以国内的`GitCafe`平台为例，介绍相关概念和简单的`Git`用法。

![Git](images/bg2012070501.png)

相比同类软件，`Git`有很多优点。其中很显著的一点，就是版本的分支（`branch`）和合并（`merge`）十分方便。

SVN是集中式版本控制系统，版本库是集中放在中央服务器的，而干活的时候，用的都是自己的电脑，所以首先要从中央服务器哪里得到最新的版本，然后干活，干完后，需要把自己做完的活推送到中央服务器。集中式版本控制系统是必须联网才能工作，如果在局域网还可以，带宽够大，速度够快，如果在互联网下，如果网速慢的话，就纳闷了。

　　Git是分布式版本控制系统，那么它就没有中央服务器的，每个人的电脑就是一个完整的版本库，这样，工作的时候就不需要联网了，因为版本都是在自己的电脑上。既然每个人的电脑都有一个完整的版本库，那多个人如何协作呢？比如说自己在电脑上改了文件A，其他人也在电脑上改了文件A，这时，你们两之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。

本文档来自于 [Git](https://git-scm.com/book/zh/v2/)


